"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Plus,
  Download,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type Project = {
  id: string
  name: string
  client: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  deadline: Timestamp
  budget: number
  description: string
  userId: string
  createdAt: Timestamp
}

export default function AdminProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        const projectsRef = collection(db, "projects")
        const projectsQuery = query(projectsRef, orderBy("createdAt", "desc"))

        const querySnapshot = await getDocs(projectsQuery)
        const projectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]

        setProjects(projectsList)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const projectRef = doc(db, "projects", projectId)
      await updateDoc(projectRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      })

      setProjects(
        projects.map((project) =>
          project.id === projectId ? { ...project, status: newStatus as Project["status"] } : project,
        ),
      )

      toast({
        title: "Status updated",
        description: "Project status has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating project status:", error)
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDeleteProject = (projectId: string) => {
    setDeleteProjectId(projectId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return

    try {
      await deleteDoc(doc(db, "projects", deleteProjectId))
      setProjects(projects.filter((project) => project.id !== deleteProjectId))

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteProjectId(null)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (project.client?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? project.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage all client projects</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 bg-gray-900 border-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-gray-800">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500" />
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="border-gray-800">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter
              ? "Try adjusting your search or filter criteria."
              : "There are no projects in the system yet."}
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-900">
                <TableHead className="text-gray-400">Project Name</TableHead>
                <TableHead className="text-gray-400">Client</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Deadline</TableHead>
                <TableHead className="text-gray-400 text-right">Budget</TableHead>
                <TableHead className="text-gray-400 w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      {getStatusBadge(project.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.deadline ? new Date(project.deadline.seconds * 1000).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">${project.budget?.toLocaleString() || "N/A"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer focus:text-red-500"
                          onClick={() => confirmDeleteProject(project.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteProject}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
