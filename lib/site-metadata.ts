import type { Metadata } from "next"

export const siteUrl = "https://www.sushinbandha.com"
const siteTitle = "Sushin Bandha — Artificial Intelligence, Product & Project Management"
const siteDescription =
  "Purdue AI student, student pilot, and licensed EMT building secure, production-grade AI products. Climb from the runway to FL410 through my logbook, departures board of projects, skills radar, and certifications."

export const siteMetadata: Metadata = {
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
