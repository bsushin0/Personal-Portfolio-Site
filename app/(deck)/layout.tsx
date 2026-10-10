import type React from "react"
import type { Viewport } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { VisitTracker } from "@/components/visit-tracker"
import { siteMetadata } from "@/lib/site-metadata"
import "./deck.css"

// Root layout for the Flight Deck home page. It deliberately skips globals.css (Tailwind):
// the deck ships its own tokens, type scale and day/night panels in deck.css.

const FONTS =
  "https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Kalam:wght@400&display=swap"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050912" },
    { media: "(prefers-color-scheme: light)", color: "#dfe9f4" },
  ],
}

export const metadata = siteMetadata

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <VisitTracker />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
