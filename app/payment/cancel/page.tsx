"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentCancelPage() {
  const [projectId, setProjectId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const projectId = searchParams.get("project_id")
    if (projectId) {
      setProjectId(projectId)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-red-100 dark:bg-red-900 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>Your payment was not completed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg">
            You've cancelled the payment process. Your project is still saved, and you can complete the payment whenever
            you're ready.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Need Help?</h3>
            <p>
              If you encountered any issues during the payment process or have questions about your project, please
              don't hesitate to contact us. We're here to help!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
          {projectId && (
            <Button
              onClick={() => router.push(`/payment/${projectId}`)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Try Payment Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
