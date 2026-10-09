import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"
import "./flight.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Chatbot } from "@/components/chatbot"
import { VisitTracker } from "@/components/visit-tracker"
import { ChatProvider } from "@/context/chat-context"
import { LayoutGroup } from "framer-motion"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"], display: "swap" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "600", "700"], display: "swap" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#060a13",
}

const siteUrl = "https://www.sushinbandha.com"
const siteTitle = "Sushin Bandha — Artificial Intelligence, Product & Project Management"
const siteDescription =
  "Purdue AI student, student pilot, and licensed EMT building secure, production-grade AI products. Climb through my logbook, departures board of projects, skills radar, and certifications."

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
      <body className={`${inter.className} ${inter.variable} ${display.variable} ${mono.variable} flight-deck`}>
        <ThemeProvider attribute="class" forcedTheme="dark" defaultTheme="dark" disableTransitionOnChange>
          <ChatProvider>
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
