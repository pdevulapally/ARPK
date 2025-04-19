"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Shield, AlertTriangle } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?callbackUrl=/admin")
      } else {
        // Use the isAdmin flag from the auth context
        const checkAdminStatus = async () => {
          try {
            // Get the user's admin status from Firestore
            const userRef = doc(db, "users", user.uid)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
              const userData = userSnap.data()
              setIsAdmin(userData.isAdmin === true)

              if (!userData.isAdmin) {
                router.push("/dashboard")
              }
            } else {
              setIsAdmin(false)
              router.push("/dashboard")
            }
          } catch (error) {
            console.error("Error checking admin status:", error)
            router.push("/dashboard")
          }
        }

        checkAdminStatus()
      }
    }
  }, [user, loading, router])

  if (loading || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Shield className="h-16 w-16 text-purple-500 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Checking permissions...</h1>
          <p className="text-gray-400">Please wait while we verify your admin access.</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center space-y-4 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access the admin area. If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
