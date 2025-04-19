"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { createCheckoutSession } from "@/lib/stripe-client"

interface ProjectData {
  id: string
  websiteType: string
  budget: string
  status: string
  paymentStatus: string
  userId: string
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const { user } = useAuth()
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
        if (projectData.userId !== user?.uid) {
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
  }, [params.id, user, router, toast])

  const handlePayment = async () => {
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
          <CardTitle className="text-2xl">Project Payment</CardTitle>
          <CardDescription>
            Complete your payment to start the development of your {project.websiteType} website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Project Type:</span>
                <span className="font-medium">{project.websiteType} Website</span>
              </div>
              <div className="flex justify-between">
                <span>Total Budget:</span>
                <span className="font-medium">{project.budget}</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Payment (50%):</span>
                <span className="font-medium">
                  ${(Number.parseFloat(project.budget.replace(/[^0-9.]/g, "")) / 2).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-medium">Amount Due Now:</span>
                <span className="font-bold text-lg">
                  ${(Number.parseFloat(project.budget.replace(/[^0-9.]/g, "")) / 2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">Payment Information</h3>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Your payment will be securely processed by Stripe. The initial payment (50% of the total budget) will
                  be held in escrow until the project is completed. The remaining 50% will be due upon project
                  completion and your approval.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handlePayment}
            disabled={paymentLoading || project.paymentStatus === "paid"}
          >
            {paymentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : project.paymentStatus === "paid" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Payment Complete
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
