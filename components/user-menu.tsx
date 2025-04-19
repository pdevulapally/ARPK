"use client"

import { useState } from "react"
import Link from "next/link"
import type { User } from "firebase/auth"
import { LogOut, UserIcon, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"

interface UserMenuProps {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
        <Avatar className="h-8 w-8 border border-purple-200 dark:border-purple-800">
          <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
          <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.displayName && <p className="font-medium">{user.displayName}</p>}
            {user.email && <p className="text-xs text-muted-foreground truncate w-40">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer flex w-full items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
