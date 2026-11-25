import Link from "next/link"
import { projects } from "@/lib/projects"
import { experiences } from "@/lib/experience"
import { slugForProject } from "@/lib/case-studies"
import { githubUrl, jsonLd, linkedinUrl, pageMetadata, personJsonLd, resumeUrl } from "@/lib/site-metadata"

// One-screen summary for people who don't have time for the Flight Deck: who I am, what I'm
// doing now, links to the resume and demos. Server-rendered, no client JavaScript of its own.

export const dynamic = "force-static"

export const metadata = pageMetadata(
  "/quick",
  "Sushin Bandha | Quick view",
  "Purdue AI student, student pilot and licensed EMT. Resume, current roles, projects and demos on one page.",
)

const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](\s|$)/)
  return (m ? m[0] : s).trim()
}

const current = experiences.filter((e) => /present$/i.test(e.period.trim()))

export default function QuickView() {
  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }} />
      <nav className="top" aria-label="Site">
        <Link href="/">← Full site (Flight Deck)</Link>
        <Link href="/work">Case studies</Link>
      </nav>

      <p className="eyebrow">Quick view</p>
      <h1>Sushin Bandha</h1>
      <p className="lead">
        AI student at Purdue (B.S. Artificial Intelligence, May 2027). Student pilot. Licensed EMT.
      </p>
      <p>
        I care about shipping things that work in production, not just demos. A lot of what I build comes out of
        things I&apos;ve seen working as an EMT, supervising large events, and learning to fly.
      </p>

      <ul className="links">
        <li><a className="primary" href={resumeUrl} target="_blank" rel="noopener">Resume (PDF)</a></li>
        <li><a href={linkedinUrl} target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href={githubUrl} target="_blank" rel="noopener">GitHub</a></li>
        <li><Link href="/#centr">Contact</Link></li>
      </ul>

      <h2>Right now</h2>
      <ul className="list now">
        {current.map((e) => (
          <li key={e.id}>
            {e.title} <span>· {e.company}</span>
          </li>
        ))}
      </ul>

      <h2>Projects</h2>
      <ul className="list">
        {projects.map((p) => {
          const slug = slugForProject(p.id)
          return (
            <li key={p.id} className="card">
              <h3>{p.title}</h3>
              <p>{firstSentence(p.description)}</p>
              <div className="acts">
                {slug && <Link href={`/work/${slug}`}>Case study</Link>}
                {p.liveUrl && p.liveUrl !== "https://www.sushinbandha.com" && <a href={p.liveUrl}>Demo</a>}
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener">Code</a>}
              </div>
            </li>
          )
        })}
      </ul>

      <p className="foot">
        The <Link href="/">full site</Link> has the rest: every role, coursework, skills and certifications, plus a
        chatbot you can ask about my work. It&apos;s heavier and plays live ATC audio if you turn it on.
      </p>
    </main>
  )
}
