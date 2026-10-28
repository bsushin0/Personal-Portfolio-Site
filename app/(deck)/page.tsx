import { readFileSync } from "node:fs"
import path from "node:path"
import Script from "next/script"
import pkg from "@/package.json"
import { experiences } from "@/lib/experience"
import { courseDetails, coreCourses, anthropicCourses, otherCoursework, degree, educationHighlights } from "@/lib/education"
import { skillDetails, skillCategories } from "@/lib/skills"
import { certifications } from "@/lib/certifications"
import { projects } from "@/lib/projects"
import { interests, roles } from "@/lib/profile"
import { atcAirports, HOME_AIRPORT } from "@/lib/atc-feeds"

// v4.1 "Flight Deck": the page is a climb from runway 28 at KLAF to FL410. The static
// markup lives in deck-markup.html; public/flight-deck.js renders every section from the
// JSON below (all content comes from lib/*.ts) and drives the sky, world and instruments.

export const dynamic = "force-static"

const RESUME_URL = "/sushin-bandha-resume.pdf"

const markup = readFileSync(path.join(process.cwd(), "app/(deck)/deck-markup.html"), "utf8")
  .replaceAll("__VERSION__", pkg.version)
  .replaceAll("__RESUME__", RESUME_URL)

const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c")

export default function Home() {
  const data = {
    experiences,
    interests,
    skillDetails,
    skillCategories: skillCategories.map((c) => ({ title: c.title, skills: c.skills })),
    courseDetails,
    coreCourses,
    anthropicCourses,
    otherCoursework,
    degree,
    eduHighlights: educationHighlights,
    certs: certifications,
    projects,
    roles,
    atc: atcAirports,
    atcHome: HOME_AIRPORT,
  }
  const banners = Object.fromEntries(projects.map((p) => [p.image, p.image]))

  return (
    <>
      <div id="deck" dangerouslySetInnerHTML={{ __html: markup }} />
      <script type="application/json" id="data" dangerouslySetInnerHTML={{ __html: json(data) }} />
      <script type="application/json" id="banners" dangerouslySetInnerHTML={{ __html: json(banners) }} />
      <Script src={`/flight-deck.js?v=${pkg.version}`} strategy="afterInteractive" />
    </>
  )
}
