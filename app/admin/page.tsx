"use client"

import { useState, useEffect } from "react"
import { Users, FolderKanban, FileText, CreditCard, TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    recentProjects: [],
    loading: true,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users count
        const usersRef = collection(db, "users")
        const usersSnapshot = await getDocs(usersRef)
        const usersCount = usersSnapshot.size

        // Fetch projects count
        const projectsRef = collection(db, "projects")
        const projectsSnapshot = await getDocs(projectsRef)
        const projectsCount = projectsSnapshot.size

        // Fetch recent projects
        const recentProjectsQuery = query(projectsRef, orderBy("createdAt", "desc"), limit(5))
        const recentProjectsSnapshot = await getDocs(recentProjectsQuery)
        const recentProjects = recentProjectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Fetch invoices and calculate revenue
        const invoicesRef = collection(db, "invoices")
        const invoicesSnapshot = await getDocs(invoicesRef)
        const invoicesCount = invoicesSnapshot.size

        let totalRevenue = 0
        invoicesSnapshot.forEach((doc) => {
          const invoice = doc.data()
          if (invoice.status === "paid" && invoice.amount) {
            totalRevenue += invoice.amount
          }
        })

        setStats({
          totalUsers: usersCount,
          totalProjects: projectsCount,
          totalInvoices: invoicesCount,
          totalRevenue,
          recentProjects,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchDashboardData()
  }, [])

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Users</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center justify-between">
              {stats.totalUsers}
              <div className="bg-blue-500/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex items-center text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>12% increase</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Projects</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center justify-between">
              {stats.totalProjects}
              <div className="bg-purple-500/20 p-2 rounded-full">
                <FolderKanban className="h-5 w-5 text-purple-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex items-center text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>8% increase</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Invoices</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center justify-between">
              {stats.totalInvoices}
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <FileText className="h-5 w-5 text-yellow-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex items-center text-red-500">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>3% decrease</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Revenue</CardDescription>
            <CardTitle className="text-2xl text-white flex items-center justify-between">
              ${stats.totalRevenue.toLocaleString()}
              <div className="bg-green-500/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex items-center text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>15% increase</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Projects</CardTitle>
            <CardDescription className="text-gray-400">Latest projects created in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProjects.length === 0 ? (
                <p className="text-gray-400">No projects found</p>
              ) : (
                stats.recentProjects.map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-white">{project.name}</p>
                      <p className="text-sm text-gray-400">{project.client}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-400">
                        {project.createdAt ? new Date(project.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b border-gray-800 pb-4">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-white">New user registered</p>
                  <p className="text-sm text-gray-400">John Smith created an account</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-gray-800 pb-4">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <FolderKanban className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-white">New project created</p>
                  <p className="text-sm text-gray-400">E-commerce website for Client XYZ</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-gray-800 pb-4">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-white">Payment received</p>
                  <p className="text-sm text-gray-400">$1,200 from Client ABC</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-yellow-500/20 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium text-white">Invoice sent</p>
                  <p className="text-sm text-gray-400">Invoice #1234 to Client DEF</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
