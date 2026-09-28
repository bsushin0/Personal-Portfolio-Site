import type { Metadata } from "next"
import { PreflightBrieferClient } from "./client"

export const metadata: Metadata = {
  title: "Pre-Flight AI Briefer | Sushin Bandha",
  description:
    "AI-powered aviation weather briefing tool — live FAA METAR/TAF/SIGMET/AIRMET data streamed through Claude AI for plain-English pre-flight briefings.",
}

export default function PreflightBrieferPage() {
  return <PreflightBrieferClient />
}
