import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Chatbot } from "@/components/chatbot"
import { VisitTracker } from "@/components/visit-tracker"
import AmbientBackground from "@/components/ambient-background"
import CursorSystem from "@/components/cursor-system"
import FloatingOrbs from "@/components/floating-orbs"
import { ChatProvider } from "@/context/chat-context"
import { LayoutGroup } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

const siteUrl = "https://www.sushinbandha.com"
const siteTitle = "Sushin Bandha - AI Engineer & Product Manager"
const siteDescription =
  "Purdue AI student specializing in user-centric products at the intersection of machine learning and business strategy. Explore projects in AI/ML, RAG systems, and software engineering."

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "Sushin Bandha Portfolio",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    creator: "@sushinbandha",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sushin Bandha",
  },
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
          <ChatProvider>
            <AmbientBackground />
            <FloatingOrbs />
            <CursorSystem />
            <VisitTracker />
            <LayoutGroup id="aira-shared">
              {children}
              <Chatbot />
            </LayoutGroup>
          </ChatProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
