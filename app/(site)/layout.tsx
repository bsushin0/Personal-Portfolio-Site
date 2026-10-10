import type React from "react"
import type { Viewport } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Chatbot } from "@/components/chatbot"
import { VisitTracker } from "@/components/visit-tracker"
import { ChatProvider } from "@/context/chat-context"
import { LayoutGroup } from "framer-motion"
import { siteMetadata } from "@/lib/site-metadata"

// Root layout for the inner pages (e.g. /projects/preflight-briefer). The home page has its
// own root layout in app/(deck) so the Flight Deck styles stay isolated from Tailwind.

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

export const metadata = siteMetadata

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} ${display.variable} ${mono.variable}`}>
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
