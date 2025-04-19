"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    icon: FileText,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <Link href="/admin" className="text-xl font-bold text-purple-400">
            ARPK Admin
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="text-xl font-bold text-purple-400 mx-auto">
            A
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-3 rounded-md transition-colors ${
                  isActive ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-purple-400" : ""}`} />
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        {!collapsed ? (
          <div className="flex flex-col space-y-4">
            <Link
              href="/admin/help"
              className="flex items-center text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="ml-3">Help & Support</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="flex items-center text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Log Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="/admin/help"
              className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
            </Link>

            <button
              onClick={() => signOut()}
              className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
