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
  Eye,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Mail,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Invoice = {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currency: string
  status: string
  dueDate: any
  issueDate: any
  paidDate: any
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    amount: number
  }>
  notes: string
  projectId: string
  projectName: string
  invoiceNumber: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isMarkPaidDialogOpen, setIsMarkPaidDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [sortField, setSortField] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    totalPaid: 0,
    overdueInvoices: 0,
    draftInvoices: 0,
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [invoices, searchQuery, statusFilter, sortField, sortDirection])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const invoicesQuery = query(collection(db, "invoices"), orderBy("dueDate", "asc"))

      const querySnapshot = await getDocs(invoicesQuery)
      const invoicesData: Invoice[] = []

      let totalOutstanding = 0
      let totalPaid = 0
      let overdueInvoices = 0
      let draftInvoices = 0
      const now = new Date()

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const dueDate = data.dueDate?.toDate() || new Date()

        const invoice: Invoice = {
          id: doc.id,
          userId: data.userId || "",
          userName: data.userName || "Unknown User",
          userEmail: data.userEmail || "",
          amount: data.amount || 0,
          currency: data.currency || "USD",
          status: data.status || "draft",
          dueDate: dueDate,
          issueDate: data.issueDate?.toDate() || new Date(),
          paidDate: data.paidDate?.toDate() || null,
          items: data.items || [],
          notes: data.notes || "",
          projectId: data.projectId || "",
          projectName: data.projectName || "",
          invoiceNumber: data.invoiceNumber || `INV-${Math.floor(Math.random() * 10000)}`,
        }

        invoicesData.push(invoice)

        // Calculate stats
        if (invoice.status === "paid") {
          totalPaid += invoice.amount
        } else {
          totalOutstanding += invoice.amount

          if (invoice.status === "draft") {
            draftInvoices++
          } else if (invoice.status === "sent" && dueDate < now) {
            overdueInvoices++
          }
        }
      })

      setInvoices(invoicesData)
      setFilteredInvoices(invoicesData)
      setStats({
        totalOutstanding,
        totalPaid,
        overdueInvoices,
        draftInvoices,
      })
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast({
        title: "Error",
        description: "Failed to load invoices. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterInvoices = () => {
    let filtered = [...invoices]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortField === "dueDate") {
        return sortDirection === "asc"
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime()
      } else if (sortField === "issueDate") {
        return sortDirection === "asc"
          ? a.issueDate.getTime() - b.issueDate.getTime()
          : b.issueDate.getTime() - a.issueDate.getTime()
      }
      return 0
    })

    setFilteredInvoices(filtered)
  }

  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return

    try {
      const invoiceRef = doc(db, "invoices", selectedInvoice.id)
      await updateDoc(invoiceRef, {
        status: "paid",
        paidDate: new Date(),
      })

      // Update local state
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === selectedInvoice.id ? { ...invoice, status: "paid", paidDate: new Date() } : invoice,
        ),
      )

      toast({
        title: "Invoice marked as paid",
        description: `Invoice ${selectedInvoice.invoiceNumber} has been marked as paid.`,
      })

      setIsMarkPaidDialogOpen(false)
    } catch (error) {
      console.error("Error marking invoice as paid:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendInvoice = async () => {
    if (!selectedInvoice) return

    try {
      const invoiceRef = doc(db, "invoices", selectedInvoice.id)
      await updateDoc(invoiceRef, {
        status: "sent",
      })

      // Update local state
      setInvoices(
        invoices.map((invoice) => (invoice.id === selectedInvoice.id ? { ...invoice, status: "sent" } : invoice)),
      )

      toast({
        title: "Invoice sent",
        description: `Invoice ${selectedInvoice.invoiceNumber} has been sent to ${selectedInvoice.userEmail}.`,
      })

      setIsSendDialogOpen(false)
    } catch (error) {
      console.error("Error sending invoice:", error)
      toast({
        title: "Error",
        description: "Failed to send invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportInvoices = () => {
    const csvContent = [
      ["Invoice #", "Client", "Email", "Amount", "Currency", "Status", "Issue Date", "Due Date", "Project"],
      ...filteredInvoices.map((invoice) => [
        invoice.invoiceNumber,
        invoice.userName,
        invoice.userEmail,
        invoice.amount.toString(),
        invoice.currency,
        invoice.status,
        invoice.issueDate ? format(invoice.issueDate, "yyyy-MM-dd") : "",
        invoice.dueDate ? format(invoice.dueDate, "yyyy-MM-dd") : "",
        invoice.projectName,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `invoices_export_${format(new Date(), "yyyy-MM-dd")}.csv`)
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

  const getStatusBadge = (status: string, dueDate: Date) => {
    const now = new Date()
    const isOverdue = status === "sent" && dueDate < now

    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Paid
          </Badge>
        )
      case "sent":
        return isOverdue ? (
          <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        ) : (
          <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Sent
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Draft
          </Badge>
        )
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">{status}</Badge>
    }
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <Button onClick={() => {}} className="bg-purple-600 hover:bg-purple-700">
          <FileText className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Outstanding</CardDescription>
            <CardTitle className="text-2xl text-white">{formatCurrency(stats.totalOutstanding, "USD")}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Paid</CardDescription>
            <CardTitle className="text-2xl text-green-500">{formatCurrency(stats.totalPaid, "USD")}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Overdue</CardDescription>
            <CardTitle className="text-2xl text-red-500">{stats.overdueInvoices}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Drafts</CardDescription>
            <CardTitle className="text-2xl text-gray-400">{stats.draftInvoices}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-900 p-4 rounded-lg">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search invoices..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportInvoices} className="border-gray-700 text-white hover:bg-gray-800">
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
                <button className="flex items-center" onClick={() => toggleSort("issueDate")}>
                  Invoice #
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400">Client</TableHead>
              <TableHead className="text-gray-400">
                <button className="flex items-center" onClick={() => toggleSort("amount")}>
                  Amount
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">
                <button className="flex items-center" onClick={() => toggleSort("issueDate")}>
                  Issue Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400">
                <button className="flex items-center" onClick={() => toggleSort("dueDate")}>
                  Due Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400">Project</TableHead>
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
            ) : filteredInvoices.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No invoices found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium text-white">{invoice.userName}</div>
                    <div className="text-sm text-gray-400">{invoice.userEmail}</div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status, invoice.dueDate)}</TableCell>
                  <TableCell className="text-gray-300">{format(invoice.issueDate, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-gray-300">{format(invoice.dueDate, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-gray-300 truncate max-w-[150px]">{invoice.projectName || "—"}</TableCell>
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
                            setSelectedInvoice(invoice)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {invoice.status === "draft" && (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-gray-800"
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setIsSendDialogOpen(true)
                            }}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Invoice
                          </DropdownMenuItem>
                        )}
                        {invoice.status === "sent" && (
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-gray-800"
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setIsMarkPaidDialogOpen(true)
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
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

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Invoice #{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-gray-400">{selectedInvoice.projectName}</p>
                </div>
                <div>{getStatusBadge(selectedInvoice.status, selectedInvoice.dueDate)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Bill To</p>
                  <p className="font-medium">{selectedInvoice.userName}</p>
                  <p className="text-gray-300">{selectedInvoice.userEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Issue Date</p>
                  <p className="text-gray-300">{format(selectedInvoice.issueDate, "MMMM d, yyyy")}</p>
                  <p className="text-sm text-gray-400 mt-2">Due Date</p>
                  <p className="text-gray-300">{format(selectedInvoice.dueDate, "MMMM d, yyyy")}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Invoice Items</h4>
                <div className="bg-gray-800 rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Description</TableHead>
                        <TableHead className="text-gray-400 text-right">Qty</TableHead>
                        <TableHead className="text-gray-400 text-right">Unit Price</TableHead>
                        <TableHead className="text-gray-400 text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item, index) => (
                        <TableRow key={index} className="border-gray-700">
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice, selectedInvoice.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.amount, selectedInvoice.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-gray-700 bg-gray-800/50">
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-gray-300 bg-gray-800 p-3 rounded-md">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Dialog */}
      <Dialog open={isMarkPaidDialogOpen} onOpenChange={setIsMarkPaidDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to mark invoice #{selectedInvoice?.invoiceNumber} as paid?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMarkPaidDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleMarkAsPaid} className="bg-green-600 hover:bg-green-700">
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invoice Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send invoice #{selectedInvoice?.invoiceNumber} to {selectedInvoice?.userEmail}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSendDialogOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleSendInvoice} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4 mr-2" />
              Send Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
