"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { useToast } from "@/components/ui/use-toast"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check if user is admin
  // In a real app, you would check this against a database
  useEffect(() => {
    if (user) {
      // For demo purposes, we'll consider specific emails as admins
      const adminEmails = ["arjun@arpk.dev", "preetham@arpk.dev"]
      setIsAdmin(adminEmails.includes(user.email || ""))
    } else {
      setIsAdmin(false)
    }
  }, [user])

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Protected routes check
  useEffect(() => {
    if (!loading) {
      const protectedRoutes = ["/dashboard", "/request", "/profile"]
      const adminRoutes = ["/admin"]

      // Check if current path is protected and user is not logged in
      if (protectedRoutes.some((route) => pathname.startsWith(route)) && !user) {
        toast({
          title: "Authentication Required",
          description: "🚫 Please sign in to continue. This action requires authentication.",
          variant: "destructive",
        })
        router.push("/login")
      }

      // Check if current path is admin-only and user is not admin
      if (adminRoutes.some((route) => pathname.startsWith(route)) && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        router.push("/")
      }
    }
  }, [pathname, user, loading, isAdmin, router, toast])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
