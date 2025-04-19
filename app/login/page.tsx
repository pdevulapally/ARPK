"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FcGoogle } from "react-icons/fc"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    try {
      if (mode === "login") {
        await signIn(values.email, values.password)
      } else {
        await signUp(values.email, values.password)
      }
      router.push("/dashboard")
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Sign up to get started with ARPK Web Development"}
          </p>
        </div>

        <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleGoogleSignIn}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FcGoogle className="mr-2 h-5 w-5" />}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mode === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          {mode === "login" ? (
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
                onClick={() => setMode("register")}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
