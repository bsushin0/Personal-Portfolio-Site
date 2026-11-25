import type { MetadataRoute } from "next"
import { caseStudies } from "@/lib/case-studies"
import { siteUrl } from "@/lib/site-metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/quick`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((c) => ({
      url: `${siteUrl}/work/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/projects/preflight-briefer`, changeFrequency: "monthly", priority: 0.6 },
  ]
}
