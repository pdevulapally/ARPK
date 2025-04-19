"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"

export default function PaymentSuccessPage() {
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectType, setProjectType] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    const projectId = searchParams.get("project_id")

    if (projectId) {
      setProjectId(projectId)

      // Fetch project details
      const fetchProject = async () => {
        try {
          const projectDoc = await getDoc(doc(db, "projects", projectId))
          if (projectDoc.exists()) {
            setProjectType(projectDoc.data().websiteType)
          }
        } catch (error) {
          console.error("Error fetching project:", error)
        }
      }

      fetchProject()
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your payment. Your project is now in progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg">
            We've received your initial payment for your {projectType || "website"} project. Our team will begin working
            on your project right away.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">What's Next?</h3>
            <ol className="text-left space-y-3 list-decimal list-inside">
              <li>Our team will review your project requirements in detail</li>
              <li>We'll create a project timeline and share it with you</li>
              <li>You'll receive regular updates on the progress of your project</li>
              <li>Once completed, you'll be able to review the final product</li>
              <li>After your approval, the website will be deployed and the final payment will be processed</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/dashboard")} className="bg-purple-600 hover:bg-purple-700 text-white">
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
