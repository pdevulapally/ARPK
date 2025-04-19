import { ReactNode } from "react"
import { Suspense } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminAuthCheck } from "@/components/admin-auth-check"
import Loading from "./loading"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthCheck>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
