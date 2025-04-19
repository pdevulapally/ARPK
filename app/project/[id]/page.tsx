"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { Loader2, CheckCircle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { createCheckoutSession } from "@/lib/stripe-client"

interface ProjectData {
  id: string
  requestId: string
  websiteType: string
  features: string[]
  budget: string
  deadline: string
  status: string
  paymentStatus: string
  clientApproved: boolean
  createdAt: any
  userId: string
  userEmail: string
  userName?: string
  designPreferences?: string
  additionalNotes?: string
}

const statusColors: Record<string, string> = {
  "awaiting payment": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "in progress": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "client review": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "final review": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)

  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", params.id))

        if (!projectDoc.exists()) {
          toast({
            title: "Project Not Found",
            description: "The requested project could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        const projectData = projectDoc.data() as ProjectData
        projectData.id = projectDoc.id

        // Check if user has permission to view this project
        if (!isAdmin && projectData.userId !== user?.uid) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this project.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setProject(projectData)
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "There was an error loading the project details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProject()
    }
  }, [params.id, user, isAdmin, router, toast])

  const handleApproveProject = async () => {
    if (!project) return

    setApprovalLoading(true)
    try {
      await updateDoc(doc(db, "projects", project.id), {
        clientApproved: true,
        clientFeedback: feedback,
        approvedAt: serverTimestamp(),
      })

      toast({
        title: "Project Approved",
        description: "You have approved the project. Final payment can now be processed.",
      })

      // Refresh project data
      const updatedProjectDoc = await getDoc(doc(db, "projects", project.id))
      if (updatedProjectDoc.exists()) {
        const updatedProjectData = updatedProjectDoc.data() as ProjectData
        updatedProjectData.id = updatedProjectDoc.id
        setProject(updatedProjectData)
      }

      setShowApprovalDialog(false)
    } catch (error) {
      console.error("Error approving project:", error)
      toast({
        title: "Approval Failed",
        description: "There was an error approving the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApprovalLoading(false)
    }
  }

  const handleFinalPayment = async () => {
    if (!project) return

    setPaymentLoading(true)
    try {
      await createCheckoutSession(project.id)
    } catch (error) {
      console.error("Error creating payment session:", error)
      toast({
        title: "Payment Error",
        description: "There was an error initiating the payment. Please try again.",
        variant: "destructive",
      })
      setPaymentLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!project || !isAdmin) return

    try {
      await updateDoc(doc(db, "projects", project.id), {
        status: newStatus,
        [`${newStatus.replace(/\s+/g, "")}At`]: serverTimestamp(),
      })

      toast({
        title: "Status Updated",
        description: `Project status updated to ${newStatus}.`,
      })

      // Refresh project data
      const updatedProjectDoc = await getDoc(doc(db, "projects", project.id))
      if (updatedProjectDoc.exists()) {
        const updatedProjectData = updatedProjectDoc.data() as ProjectData
        updatedProjectData.id = updatedProjectDoc.id
        setProject(updatedProjectData)
      }
    } catch (error) {
      console.error("Error updating project status:", error)
      toast({
        title: "Update Failed",
        description: "There was an error updating the project status. Please try again.",
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

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
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
              <CardTitle className="text-2xl">{project.websiteType} Website Project</CardTitle>
              <CardDescription>
                Started on {project.createdAt?.toDate().toLocaleDateString() || "Loading..."}
              </CardDescription>
            </div>
            <Badge className={statusColors[project.status.toLowerCase()]}>{project.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget:</span>
                  <span className="ml-2">{project.budget}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline:</span>
                  <span className="ml-2">{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status:</span>
                  <span className="ml-2">{project.paymentStatus}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Project Timeline</h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
                  <div className="space-y-6 relative">
                    <div className="flex items-center">
                      <div
                        className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                          project.status !== "awaiting payment" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      >
                        {project.status !== "awaiting payment" && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">Initial Payment</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.paymentStatus === "paid" ? "Completed" : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                          project.status === "in progress" ||
                          project.status === "client review" ||
                          project.status === "final review" ||
                          project.status === "completed"
                            ? "bg-green-600"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      >
                        {(project.status === "in progress" ||
                          project.status === "client review" ||
                          project.status === "final review" ||
                          project.status === "completed") && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">Development</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.status === "in progress"
                            ? "In Progress"
                            : project.status === "client review" ||
                                project.status === "final review" ||
                                project.status === "completed"
                              ? "Completed"
                              : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                          project.status === "client review" ||
                          project.status === "final review" ||
                          project.status === "completed"
                            ? "bg-green-600"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      >
                        {(project.status === "client review" ||
                          project.status === "final review" ||
                          project.status === "completed") && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">Client Review</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.status === "client review"
                            ? "In Progress"
                            : project.status === "final review" || project.status === "completed"
                              ? "Completed"
                              : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                          project.clientApproved ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      >
                        {project.clientApproved && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">Client Approval</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.clientApproved ? "Approved" : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
                          project.status === "completed" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      >
                        {project.status === "completed" && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">Project Completion</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.status === "completed" ? "Completed" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>

          <div className="flex flex-wrap gap-3">
            {/* Client actions */}
            {!isAdmin && project.status === "client review" && !project.clientApproved && (
              <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Approve Project</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Project</DialogTitle>
                    <DialogDescription>
                      Please provide any feedback before approving the project. Once approved, the final payment will be
                      processed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      placeholder="Your feedback (optional)"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleApproveProject}
                      disabled={approvalLoading}
                    >
                      {approvalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirm Approval
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {!isAdmin && project.clientApproved && project.status !== "completed" && (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleFinalPayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Make Final Payment"
                )}
              </Button>
            )}

            {/* Admin actions */}
            {isAdmin && (
              <>
                {project.status === "awaiting payment" && project.paymentStatus === "paid" && (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleUpdateStatus("in progress")}
                  >
                    Start Development
                  </Button>
                )}

                {project.status === "in progress" && (
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => handleUpdateStatus("client review")}
                  >
                    Send for Client Review
                  </Button>
                )}

                {project.status === "client review" && project.clientApproved && (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleUpdateStatus("final review")}
                  >
                    Move to Final Review
                  </Button>
                )}

                {project.status === "final review" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleUpdateStatus("completed")}
                  >
                    Mark as Completed
                  </Button>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
