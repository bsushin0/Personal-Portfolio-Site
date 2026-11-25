import Link from "next/link"
import { caseStudies, projectFor } from "@/lib/case-studies"
import { pageMetadata } from "@/lib/site-metadata"

export const dynamic = "force-static"

export const metadata = pageMetadata(
  "/work",
  "Case studies | Sushin Bandha",
  "What each project set out to solve, how I built it, how it turned out, and what broke along the way.",
)

export default function WorkIndex() {
  return (
    <main className="page">
      <nav className="top" aria-label="Site">
        <Link href="/quick">← Quick view</Link>
        <Link href="/">Full site</Link>
      </nav>
      <p className="eyebrow">Case studies</p>
      <h1>Projects, written up</h1>
      <p className="lead">The problem, how I built it, how it turned out, and what broke along the way.</p>
      <ul className="list">
        {caseStudies.map((c) => {
          const p = projectFor(c)
          if (!p) return null
          return (
            <li key={c.slug} className="card">
              <h3><Link href={`/work/${c.slug}`}>{p.title}</Link></h3>
              <p>{c.problem}</p>
              <p className="meta">{c.role}</p>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
