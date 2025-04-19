"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, doc, updateDoc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Download, Shield, ShieldAlert, ShieldCheck, UserX } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: any
  lastLogin: any
  projects: number
  subscription: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, statusFilter, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(usersQuery)
      const usersData: User[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        usersData.push({
          id: doc.id,
          name: data.name || "Unknown User",
          email: data.email || "",
          role: data.role || "user",
          status: data.status || "active",
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || null,
          projects: data.projects || 0,
          subscription: data.subscription || "free",
        })
      })

      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return

    try {
      const userRef = doc(db, "users", selectedUser.id)
      await updateDoc(userRef, {
        role: newRole,
      })

      // Update local state
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user)))

      toast({
        title: "Role updated",
        description: `${selectedUser.name}'s role has been updated to ${newRole}.`,
      })

      setIsRoleDialogOpen(false)
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const userRef = doc(db, "users", selectedUser.id)
      await updateDoc(userRef, {
        status: "deleted",
      })

      // Update local state
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, status: "deleted" } : user)))

      toast({
        title: "User deactivated",
        description: `${selectedUser.name}'s account has been deactivated.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deactivating user:", error)
      toast({
        title: "Error",
        description: "Failed to deactivate user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Role", "Status", "Created At", "Last Login", "Projects", "Subscription"],
      ...filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.role,
        user.status,
        user.createdAt ? format(user.createdAt, "yyyy-MM-dd") : "",
        user.lastLogin ? format(user.lastLogin, "yyyy-MM-dd") : "",
        user.projects.toString(),
        user.subscription,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `users_export_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "moderator":
        return (
          <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Moderator
          </Badge>
        )
      default:
        return (
          <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            User
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Active</Badge>
      case "suspended":
        return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Suspended</Badge>
      case "deleted":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Deleted</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">Unknown</Badge>
    }
  }

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "premium":
        return <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30">Premium</Badge>
      case "business":
        return <Badge className="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30">Business</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">Free</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <Button onClick={() => {}} className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-900 p-4 rounded-lg">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportUsers} className="border-gray-700 text-white hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Subscription</TableHead>
              <TableHead className="text-gray-400">Joined</TableHead>
              <TableHead className="text-gray-400">Projects</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-gray-800 hover:bg-gray-800/50">
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-5 bg-gray-800 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No users found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">{user.name}</TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell className="text-gray-300">{format(user.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-gray-300">{user.projects}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-800"
                          onClick={() => {
                            setSelectedUser(user)
                            setNewRole(user.role)
                            setIsRoleDialogOpen(true)
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-800" onClick={() => {}}>
                          <Shield className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription className="text-gray-400">Update the role for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to deactivate {selectedUser?.name}? This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
