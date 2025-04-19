"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, deleteDoc, collection } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"

import { useParams } from "next/navigation"  // Add this import

interface RequestData {
  id: string
  websiteType: string
  features: string[]
  deadline: string
  budget: string
  status: string
  createdAt: any
  userId: string
  userEmail: string
  userName?: string
  designPreferences?: string
  additionalNotes?: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "on hold": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
}

export default function RequestDetailPage() {
  const params = useParams()
  const requestId = params?.id as string
  
  const [request, setRequest] = useState<RequestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [rejectionLoading, setRejectionLoading] = useState(false)
  const [holdLoading, setHoldLoading] = useState(false)
  const [quotedBudget, setQuotedBudget] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [holdReason, setHoldReason] = useState("")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [showHoldDialog, setShowHoldDialog] = useState(false)

  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestDoc = await getDoc(doc(db, "requests", requestId))

        if (!requestDoc.exists()) {
          toast({
            title: "Request Not Found",
            description: "The requested project could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        const requestData = requestDoc.data() as RequestData
        requestData.id = requestDoc.id

        // Check if user has permission to view this request
        if (!isAdmin && requestData.userId !== user?.uid) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this request.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setRequest(requestData)
        setQuotedBudget(requestData.budget)
      } catch (error) {
        console.error("Error fetching request:", error)
        toast({
          title: "Error",
          description: "There was an error loading the request details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchRequest()
    }
  }, [requestId, user, isAdmin, router, toast])

  const handleApprove = async () => {
    if (!request) return

    setApprovalLoading(true)
    try {
      // Update the request status
      await updateDoc(doc(db, "requests", request.id), {
        status: "approved",
        quotedBudget,
        approvedAt: serverTimestamp(),
        approvedBy: user?.uid,
      })

      // Create a new project
      const projectRef = doc(collection(db, "projects"))
      await setDoc(projectRef, {
        requestId: request.id,
        userId: request.userId,
        userEmail: request.userEmail,
        userName: request.userName,
        websiteType: request.websiteType,
        features: request.features,
        budget: quotedBudget,
        deadline: request.deadline,
        designPreferences: request.designPreferences,
        additionalNotes: request.additionalNotes,
        status: "awaiting payment",
        paymentStatus: "pending",
        clientApproved: false,
        createdAt: serverTimestamp(),
      })

      toast({
        title: "Request Approved",
        description: "The request has been approved and converted to a project.",
      })

      // Redirect to the payment page
      router.push(`/payment/${projectRef.id}`)
    } catch (error) {
      console.error("Error approving request:", error)
      toast({
        title: "Approval Failed",
        description: "There was an error approving the request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApprovalLoading(false)
      setShowApprovalDialog(false)
    }
  }

  const handleReject = async () => {
    if (!request) return

    setRejectionLoading(true)
    try {
      await updateDoc(doc(db, "requests", request.id), {
        status: "rejected",
        rejectionReason,
        rejectedAt: serverTimestamp(),
        rejectedBy: user?.uid,
      })

      toast({
        title: "Request Rejected",
        description: "The request has been rejected.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting the request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRejectionLoading(false)
      setShowRejectionDialog(false)
    }
  }

  const handleHold = async () => {
    if (!request) return

    setHoldLoading(true)
    try {
      await updateDoc(doc(db, "requests", request.id), {
        status: "on hold",
        holdReason,
        heldAt: serverTimestamp(),
        heldBy: user?.uid,
      })

      toast({
        title: "Request On Hold",
        description: "The request has been put on hold.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error putting request on hold:", error)
      toast({
        title: "Hold Failed",
        description: "There was an error putting the request on hold. Please try again.",
        variant: "destructive",
      })
    } finally {
      setHoldLoading(false)
      setShowHoldDialog(false)
    }
  }

  const handleDelete = async () => {
    if (!request) return

    try {
      await deleteDoc(doc(db, "requests", request.id))

      toast({
        title: "Request Deleted",
        description: "The request has been deleted.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting request:", error)
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Request Not Found</CardTitle>
            <CardDescription>The requested project could not be found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">{request.websiteType} Website Request</CardTitle>
              <CardDescription>
                Submitted by {request.userName || request.userEmail} on{" "}
                {request.createdAt?.toDate().toLocaleDateString() || "Loading..."}
              </CardDescription>
            </div>
            <Badge className={statusColors[request.status.toLowerCase()]}>{request.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Request Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget:</span>
                  <span className="ml-2">{request.budget}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline:</span>
                  <span className="ml-2">{new Date(request.deadline).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {request.features?.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Additional Information</h3>
              <div className="space-y-3">
                {request.designPreferences && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Design Preferences:</span>
                    <p className="mt-1 text-sm">{request.designPreferences}</p>
                  </div>
                )}
                {request.additionalNotes && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Notes:</span>
                    <p className="mt-1 text-sm">{request.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>

          {isAdmin && request.status === "pending" && (
            <div className="flex flex-wrap gap-3">
              <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Request</DialogTitle>
                    <DialogDescription>
                      Please confirm the budget for this project. The client will be asked to make an initial payment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="budget" className="text-right">
                        Budget
                      </Label>
                      <Input
                        id="budget"
                        value={quotedBudget}
                        onChange={(e) => setQuotedBudget(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={approvalLoading}>
                      {approvalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirm Approval
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showHoldDialog} onOpenChange={setShowHoldDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-blue-600 border-blue-600">
                    Hold
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Put Request On Hold</DialogTitle>
                    <DialogDescription>Please provide a reason for putting this request on hold.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Input
                        id="reason"
                        value={holdReason}
                        onChange={(e) => setHoldReason(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowHoldDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleHold} disabled={holdLoading}>
                      {holdLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirm Hold
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 border-red-600">
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Request</DialogTitle>
                    <DialogDescription>Please provide a reason for rejecting this request.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Input
                        id="reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={rejectionLoading}>
                      {rejectionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirm Rejection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {!isAdmin && request.status === "pending" && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Request
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
