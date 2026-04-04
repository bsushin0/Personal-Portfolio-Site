import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sushinbandha.com"

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
