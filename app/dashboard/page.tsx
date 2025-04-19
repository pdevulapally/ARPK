"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, onSnapshot, type Timestamp } from "firebase/firestore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"

interface Request {
  id: string
  websiteType: string
  features: string[]
  deadline: string
  budget: string
  status: string
  createdAt: Timestamp
  designPreferences?: string
  additionalNotes?: string
}

interface Project {
  id: string
  requestId: string
  websiteType: string
  status: string
  createdAt: Timestamp
  budget: string
  paymentStatus: string
  clientApproved: boolean
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "on hold": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in progress": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "client review": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "final review": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    // Set up real-time listeners
    const unsubscribers: (() => void)[] = []

    // Requests listener
    const requestsQuery = isAdmin
      ? query(collection(db, "requests"), orderBy("createdAt", "desc"))
      : query(collection(db, "requests"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))

    const unsubscribeRequests = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requestsList: Request[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          requestsList.push({
            id: doc.id,
            ...data,
          } as Request)
        })
        setRequests(requestsList)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching requests:", error)
        setLoading(false)
      },
    )

    unsubscribers.push(unsubscribeRequests)

    // Projects listener
    const projectsQuery = isAdmin
      ? query(collection(db, "projects"), orderBy("createdAt", "desc"))
      : query(collection(db, "projects"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))

    const unsubscribeProjects = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectsList: Project[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          projectsList.push({
            id: doc.id,
            ...data,
          } as Project)
        })
        setProjects(projectsList)
      },
      (error) => {
        console.error("Error fetching projects:", error)
      },
    )

    unsubscribers.push(unsubscribeProjects)

    // Cleanup function
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [user, isAdmin])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    // Update the main container padding
    <div className="container mx-auto px-4 py-12 sm:py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isAdmin ? "Admin Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isAdmin ? "Manage website requests and projects" : "Track your website requests and projects"}
          </p>
        </div>
        <Link href="/request">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-6 sm:mb-8 w-full flex">
          <TabsTrigger value="requests" className="flex-1">Requests</TabsTrigger>
          <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin" className="flex-1">Admin Tools</TabsTrigger>}
        </TabsList>

        <TabsContent value="requests" className="space-y-4 sm:space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No requests yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Submit a new website request to get started.</p>
              <Link href="/request" className="mt-4 inline-block">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{request.websiteType}</CardTitle>
                      <Badge className={statusColors[request.status.toLowerCase()]}>{request.status}</Badge>
                    </div>
                    <CardDescription>
                      Requested on {request.createdAt?.toDate().toLocaleDateString() || "Loading..."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 sm:pb-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget:</span>
                        <span className="ml-2 text-sm">{request.budget}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline:</span>
                        <span className="ml-2 text-sm">{new Date(request.deadline).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Features:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.features?.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))} 
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/request/${request.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4 sm:space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active projects</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Your approved requests will appear here as projects.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.websiteType}</CardTitle>
                      <Badge className={statusColors[project.status.toLowerCase()]}>{project.status}</Badge>
                    </div>
                    <CardDescription>
                      Started on {project.createdAt?.toDate().toLocaleDateString() || "Loading..."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget:</span>
                        <span className="ml-2 text-sm">{project.budget}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status:</span>
                        <span className="ml-2 text-sm">{project.paymentStatus}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600"
                          style={{
                            width:
                              project.status === "completed"
                                ? "100%"
                                : project.status === "final review"
                                  ? "90%"
                                  : project.status === "client review"
                                    ? "75%"
                                    : project.status === "in progress"
                                      ? "50%"
                                      : "25%",
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/project/${project.id}`)}
                    >
                      View Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle>Admin Tools</CardTitle>
                <CardDescription>Manage website requests, projects, and payments</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => router.push("/admin/requests")}
                  >
                    <span className="text-lg font-medium">Pending Requests</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {requests.filter((r) => r.status.toLowerCase() === "pending").length} requests
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => router.push("/admin/projects")}
                  >
                    <span className="text-lg font-medium">Active Projects</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {projects.filter((p) => p.status.toLowerCase() !== "completed").length} projects
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => router.push("/admin/payments")}
                  >
                    <span className="text-lg font-medium">Payment Management</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Manage client payments</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => router.push("/admin/settings")}
                  >
                    <span className="text-lg font-medium">Platform Settings</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Configure platform settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
