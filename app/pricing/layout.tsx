import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - ARPK Web Development",
  description: "Transparent pricing for web development services by ARPK",
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
