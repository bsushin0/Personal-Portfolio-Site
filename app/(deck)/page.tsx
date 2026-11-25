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
import { about, interests, roles } from "@/lib/profile"
import { atcAirports, HOME_AIRPORT } from "@/lib/atc-feeds"
import { slugForProject } from "@/lib/case-studies"
import { jsonLd, personJsonLd, resumeUrl } from "@/lib/site-metadata"

// v4.1 "Flight Deck": the page is a climb from runway 28 at KLAF to FL410. The static
// markup lives in deck-markup.html; public/flight-deck.js renders every section from the
// JSON below (all content comes from lib/*.ts) and drives the sky, world and instruments.
// v4.4: the About text, logbook rows and a plain project list are also rendered here on the
// server, so crawlers and link previews see them before any JavaScript runs. The deck script
// replaces them with the interactive versions.

export const dynamic = "force-static"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](\s|$)/)
  return (m ? m[0] : s).trim()
}

const projectList = projects.map((p) => ({ ...p, slug: slugForProject(p.id) }))

const aboutHtml =
  `<span class="eyebrow">Captain's notes</span>` + about.map((p) => `<p>${esc(p)}</p>`).join("")

const logbookHtml = experiences
  .map(
    (e) =>
      `<button type="button" class="lb-row ${e.type === "Clinical" || /EMT/.test(e.title) ? "ems" : "air"}"><span class="d">${esc(e.period)}</span><span class="o">${esc(e.company)}</span><span>${esc(e.title)}</span><span class="cls">${esc(e.type)}</span><span class="rm">${esc(e.summary)}</span><span class="go">›</span></button>`,
  )
  .join("")

const projectsHtml =
  `<ul class="ssr-list" data-ssr>` +
  projectList
    .map(
      (p) =>
        `<li>${p.slug ? `<a href="/work/${p.slug}"><b>${esc(p.title)}</b></a>` : `<b>${esc(p.title)}</b>`} <span>${esc(firstSentence(p.description))}</span></li>`,
    )
    .join("") +
  `</ul>`

const markup = readFileSync(path.join(process.cwd(), "app/(deck)/deck-markup.html"), "utf8")
  .replaceAll("__VERSION__", pkg.version)
  .replaceAll("__RESUME__", resumeUrl)
  .replace("__ABOUT__", () => aboutHtml)
  .replace("__LOGBOOK__", () => logbookHtml)
  .replace("__PROJECTS__", () => projectsHtml)

const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c")

export default function Home() {
  const data = {
    about,
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
    projects: projectList,
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
