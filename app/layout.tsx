import type React from "react"
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth"  // Updated import path
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ARPK Web Development",
  description: "Premium web development services by ARPK",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} ARPK Web Development. All rights reserved.
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
