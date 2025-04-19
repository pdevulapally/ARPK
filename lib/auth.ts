"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { auth, db } from "@/lib/firebase"

const googleProvider = new GoogleAuthProvider()

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAdmin: boolean
  createdAt: string
  stripeCustomerId?: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
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
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Get user data from Firestore
        const userDocRef = doc(db, "users", user.uid)
        const unsubscribeUserData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserData
            setUserData(userData)
            setIsAdmin(userData.isAdmin || false)
          } else {
            // Create new user document if it doesn't exist
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isAdmin: false, // Default to non-admin
              createdAt: new Date().toISOString(),
            }
            setDoc(userDocRef, newUserData)
            setUserData(newUserData)
            setIsAdmin(false)
          }
          setLoading(false)
        })

        return () => {
          unsubscribeUserData()
        }
      } else {
        setUserData(null)
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Protected routes check
  useEffect(() => {
    if (!loading) {
      const protectedRoutes = ["/dashboard", "/request", "/profile", "/project"]
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user document in Firestore
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: false, // Default to non-admin
        createdAt: new Date().toISOString(),
      })

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
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check if user document exists
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin: false, // Default to non-admin
          createdAt: new Date().toISOString(),
        })
      }

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
    React.createElement(AuthContext.Provider, {
      value: {
        user,
        userData,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAdmin,
      }
    }, children)
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
