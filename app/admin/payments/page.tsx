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
import {
  Search,
  MoreHorizontal,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  ArrowUpDown,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Payment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  paymentType: string
  createdAt: any
  updatedAt: any
  description: string
  invoiceId: string
  projectId: string
  projectName: string
  stripeId: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchQuery, statusFilter, typeFilter, sortField, sortDirection])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const paymentsQuery = query(collection(db, "payments"), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(paymentsQuery)
      const paymentsData: Payment[] = []

      let totalRevenue = 0
      let successfulPayments = 0
      let failedPayments = 0
      let pendingPayments = 0

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        paymentsData.push({
          id: doc.id,
          userId: data.userId || "",
          userName: data.userName || "Unknown User",
          userEmail: data.userEmail || "",
          amount: data.amount || 0,
          currency: data.currency || "USD",
          status: data.status || "pending",
          paymentMethod: data.paymentMethod || "card",
          paymentType: data.paymentType || "subscription",
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          description: data.description || "",
          invoiceId: data.invoiceId || "",
          projectId: data.projectId || "",
          projectName: data.projectName || "",
          stripeId: data.stripeId || "",
        })

        // Calculate stats
        if (data.status === "succeeded") {
          totalRevenue += data.amount || 0
          successfulPayments++
        } else if (data.status === "failed") {
          failedPayments++
        } else if (data.status === "pending") {
          pendingPayments++
        }
      })

      setPayments(paymentsData)
      setFilteredPayments(paymentsData)
      setStats({
        totalRevenue,
        successfulPayments,
        failedPayments,
        pendingPayments,
      })
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast({
        title: "Error",
        description: "Failed to load payments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterPayments = () => {
    let filtered = [...payments]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((payment) => payment.paymentType === typeFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime()
      }
      return 0
    })

    setFilteredPayments(filtered)
  }

  const handleRefundPayment = async () => {
    if (!selectedPayment) return

    try {
      const paymentRef = doc(db, "payments", selectedPayment.id)
      await updateDoc(paymentRef, {
        status: "refunded",
        updatedAt: new Date(),
      })

      // Update local state
      setPayments(
        payments.map((payment) =>
          payment.id === selectedPayment.id ? { ...payment, status: "refunded", updatedAt: new Date() } : payment,
        ),
      )

      toast({
        title: "Payment refunded",
        description: `Payment of ${formatCurrency(selectedPayment.amount, selectedPayment.currency)} has been marked as refunded.`,
      })

      setIsRefundDialogOpen(false)
    } catch (error) {
      console.error("Error refunding payment:", error)
      toast({
        title: "Error",
        description: "Failed to refund payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportPayments = () => {
    const csvContent = [
      [
        "ID",
        "User",
        "Email",
        "Amount",
        "Currency",
        "Status",
        "Method",
        "Type",
        "Date",
        "Description",
        "Invoice ID",
        "Project",
      ],
      ...filteredPayments.map((payment) => [
        payment.id,
        payment.userName,
        payment.userEmail,
        payment.amount.toString(),
        payment.currency,
        payment.status,
        payment.paymentMethod,
        payment.paymentType,
        payment.createdAt ? format(payment.createdAt, "yyyy-MM-dd") : "",
        payment.description,
        payment.invoiceId,
        payment.projectName,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `payments_export_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Succeeded
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        )
      case "refunded":
        return (
          <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Refunded
          </Badge>
        )
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "card":
        return (
          <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Card
          </Badge>
        )
      case "bank_transfer":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Bank Transfer</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">{method}</Badge>
    }
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <Button onClick={fetchPayments} className="bg-purple-600 hover:bg-purple-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Revenue</CardDescription>
            <CardTitle className="text-2xl text-white">{formatCurrency(stats.totalRevenue, "USD")}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Successful Payments</CardDescription>
            <CardTitle className="text-2xl text-green-500">{stats.successfulPayments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Failed Payments</CardDescription>
            <CardTitle className="text-2xl text-red-500">{stats.failedPayments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Pending Payments</CardDescription>
            <CardTitle className="text-2xl text-amber-500">{stats.pendingPayments}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-900 p-4 rounded-lg">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search payments..."
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
              <SelectItem value="succeeded">Succeeded</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportPayments} className="border-gray-700 text-white hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">
                <button className="flex items-center" onClick={() => toggleSort("createdAt")}>
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">
                <button className="flex items-center" onClick={() => toggleSort("amount")}>
                  Amount
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Method</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Description</TableHead>
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
            ) : filteredPayments.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No payments found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="text-gray-300">{format(payment.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="font-medium text-white">{payment.userName}</div>
                    <div className="text-sm text-gray-400">{payment.userEmail}</div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell className="text-gray-300 capitalize">{payment.paymentType}</TableCell>
                  <TableCell className="text-gray-300 truncate max-w-[200px]">{payment.description}</TableCell>
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
                            setSelectedPayment(payment)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {payment.status === "succeeded" && (
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setIsRefundDialogOpen(true)
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refund Payment
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Refund Payment</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to refund this payment of{" "}
              {selectedPayment && formatCurrency(selectedPayment.amount, selectedPayment.currency)}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRefundDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRefundPayment}>
              Refund Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-base">{format(selectedPayment.createdAt, "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payment Method</p>
                  <div className="mt-1">{getPaymentMethodBadge(selectedPayment.paymentMethod)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-base">{selectedPayment.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-base">{selectedPayment.userEmail}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-base">{selectedPayment.description}</p>
                </div>
                {selectedPayment.projectName && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400">Project</p>
                    <p className="text-base">{selectedPayment.projectName}</p>
                  </div>
                )}
                {selectedPayment.invoiceId && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400">Invoice ID</p>
                    <p className="text-base">{selectedPayment.invoiceId}</p>
                  </div>
                )}
                {selectedPayment.stripeId && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400">Stripe ID</p>
                    <p className="text-base font-mono text-sm">{selectedPayment.stripeId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
