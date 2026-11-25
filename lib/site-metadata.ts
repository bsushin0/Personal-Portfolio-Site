import type { Metadata } from "next"

export const siteUrl = "https://www.sushinbandha.com"
export const siteName = "Sushin Bandha"
export const resumeUrl = "/sushin-bandha-resume.pdf"
export const githubUrl = "https://github.com/bsushin0"
export const linkedinUrl = "https://linkedin.com/in/sushin-bandha"

// Link preview image, drawn at build time by app/og.png/route.tsx.
export const ogImage = { url: "/og.png", width: 1200, height: 630, alt: "Sushin Bandha, AI student at Purdue" }

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
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@sushinbandha",
    images: [ogImage.url],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sushin Bandha",
  },
}

// Page-level metadata for the lean pages (quick view, case studies). Each one gets its own
// canonical URL and keeps the shared preview image.
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      siteName: "Sushin Bandha Portfolio",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  }
}

// schema.org Person, used as JSON-LD on the home page and the quick view.
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sushin Bandha",
  url: siteUrl,
  jobTitle: "Artificial Intelligence student",
  affiliation: { "@type": "CollegeOrUniversity", name: "Purdue University" },
  knowsAbout: ["Artificial intelligence", "Machine learning", "Product management", "Project management", "Emergency medical services", "Aviation"],
  sameAs: [githubUrl, linkedinUrl],
}

export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c")
