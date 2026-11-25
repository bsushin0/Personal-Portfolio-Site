import type React from "react"
import type { Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { VisitTracker } from "@/components/visit-tracker"
import { siteMetadata } from "@/lib/site-metadata"
import "./lite.css"

// Root layout for the lean pages: the quick view and the case studies. No Tailwind, no web
// fonts, no chatbot, so these load fast on a phone and read cleanly for crawlers.

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050912" },
    { media: "(prefers-color-scheme: light)", color: "#f5f8fc" },
  ],
}

export const metadata = siteMetadata

export default function LiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VisitTracker />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
