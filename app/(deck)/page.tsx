import { readFileSync } from "node:fs"
import path from "node:path"
import Script from "next/script"
import type { Metadata } from "next"
import pkg from "@/package.json"
import { experiences } from "@/lib/experience"
import { courseDetails, coreCourses, anthropicCourses, otherCoursework, degree, educationHighlights } from "@/lib/education"
import { skillDetails, skillCategories } from "@/lib/skills"
import { certifications } from "@/lib/certifications"
import { projects } from "@/lib/projects"
import { interests, roles } from "@/lib/profile"
import { atcAirports, HOME_AIRPORT } from "@/lib/atc-feeds"
import { caseStudies, projectFor } from "@/lib/case-studies"
import { jsonLd, personJsonLd, resumeUrl } from "@/lib/site-metadata"

// v4.1 "Flight Deck": the page is a climb from runway 28 at KLAF to FL410. The static
// markup lives in deck-markup.html; public/flight-deck.js renders every section from the
// JSON below (all content comes from lib/*.ts) and drives the sky, world and instruments.
//
// v4.4: some content is also written into the markup here on the server, so crawlers and
// link previews see it before any JavaScript runs:
//   - the hero h1 reads "Sushin Bandha" (a space between the two styled spans)
//   - the logbook rows (flight-deck.js replaces them with its own rows, same data)
//   - a line of case study links under Featured Projects, and a Quick view button in the hero
// Each edit looks for an exact anchor in deck-markup.html and fails the build if it's gone,
// so a markup change can't silently drop it.

export const dynamic = "force-static"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const logbookHtml = experiences
  .map(
    (e) =>
      `<button type="button" class="lb-row ${e.type === "Clinical" || /EMT/.test(e.title) ? "ems" : "air"}"><span class="d">${esc(e.period)}</span><span class="o">${esc(e.company)}</span><span>${esc(e.title)}</span><span class="cls">${esc(e.type)}</span><span class="rm">${esc(e.summary)}</span><span class="go">›</span></button>`,
  )
  .join("")

const caseStudyLinks = caseStudies
  .map((c) => {
    const p = projectFor(c)
    return p ? `<a href="/work/${c.slug}" style="color:inherit">${esc(p.title)}</a>` : ""
  })
  .filter(Boolean)
  .join(" · ")

const EDITS: [string, string][] = [
  [
    `<h1 id="heroName"><span class="n1">Sushin</span><span class="n2">Bandha</span></h1>`,
    `<h1 id="heroName"><span class="n1">Sushin</span> <span class="n2">Bandha</span></h1>`,
  ],
  [
    `<a class="btn pri" href="#gates">View Projects <small>GATES</small></a>`,
    `<a class="btn pri" href="#gates">View Projects <small>GATES</small></a>\n        <a class="btn" href="/quick">Quick view</a>`,
  ],
  [`<div id="lbRows"></div>`, `<div id="lbRows">${logbookHtml}</div>`],
  [
    `<p>Every project is a departure. Hover a flight to refresh it, select it to print the boarding pass.</p>`,
    `<p>Every project is a departure. Hover a flight to refresh it, select it to print the boarding pass.</p><p style="font-size:.85em">Case studies: ${caseStudyLinks}</p>`,
  ],
]

const rawMarkup = readFileSync(path.join(process.cwd(), "app/(deck)/deck-markup.html"), "utf8")
const markup = EDITS.reduce((html, [anchor, replacement]) => {
  if (!html.includes(anchor)) throw new Error(`deck-markup.html no longer contains: ${anchor.slice(0, 60)}`)
  return html.replace(anchor, () => replacement)
}, rawMarkup)
  .replaceAll("__VERSION__", pkg.version)
  .replaceAll("__RESUME__", resumeUrl)

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }} />
      <div id="deck" dangerouslySetInnerHTML={{ __html: markup }} />
      <script type="application/json" id="data" dangerouslySetInnerHTML={{ __html: json(data) }} />
      <script type="application/json" id="banners" dangerouslySetInnerHTML={{ __html: json(banners) }} />
      <Script src={`/flight-deck.js?v=${pkg.version}`} strategy="afterInteractive" />
    </>
  )
}
