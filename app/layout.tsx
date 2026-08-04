import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#22308a",
}

const siteTitle = "Kernal Behaviour Thermal Test (KBT) — Dawn Org"
const siteDescription =
  "A guided self-assessment from Dawn Org. Twenty-one dimensions of mind, rated in about ten minutes, with a clear reading of where your stress is coming from."

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s — Dawn Org",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    siteName: "Dawn Org",
  },
  robots: {
    // Trial site — keep it out of search results until the client signs off.
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  )
}
