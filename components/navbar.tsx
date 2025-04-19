"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import UserMenu from "@/components/user-menu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Request Website", href: "/request", protected: true },
    { name: "Dashboard", href: "/dashboard", protected: true },
    { name: "Contact", href: "/contact" },
  ]

  const filteredLinks = navLinks.filter((link) => !link.protected || user)

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">ARPK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 bg-white/5 backdrop-blur-[2px] px-6 py-2 rounded-full border border-white/10">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 
                  ${pathname === link.href 
                    ? "text-purple-500 dark:text-purple-400" 
                    : "text-white/80 dark:text-white/80 hover:text-purple-500 dark:hover:text-purple-400"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <Link href="/login">
                    <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Login / Register
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle with User Menu */}
          <div className="md:hidden flex items-center gap-2">
            {!loading && user && <UserMenu user={user} />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 ${
                  pathname === link.href ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!loading && !user && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/login"
                  className="block text-sm font-medium text-purple-600 dark:text-purple-400"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
