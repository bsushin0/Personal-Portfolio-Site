import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { caseStudies, getCaseStudy, projectFor, showDrafts } from "@/lib/case-studies"
import { pageMetadata } from "@/lib/site-metadata"

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getCaseStudy(slug)
  const p = c && projectFor(c)
  if (!c || !p) return {}
  return pageMetadata(`/work/${c.slug}`, `${p.title} | Case study | Sushin Bandha`, c.problem)
}

function Draft({ label, text }: { label: string; text?: string }) {
  if (!showDrafts || !text) return null
  return (
    <div className="draft" role="note">
      <b>To fill in · {label}</b>
      {text}
    </div>
  )
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const c = getCaseStudy(slug)
  const p = c && projectFor(c)
  if (!c || !p) return notFound()

  const i = caseStudies.indexOf(c)
  const next = caseStudies[(i + 1) % caseStudies.length]
  const nextProject = projectFor(next)

  return (
    <main className="page">
      <nav className="top" aria-label="Site">
        <Link href="/work">← All case studies</Link>
        <Link href="/quick">Quick view</Link>
      </nav>

      <p className="eyebrow">Case study</p>
      <h1>{p.title}</h1>
      <p className="meta">{c.role}</p>
      <ul className="tags">
        {p.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <img className="banner" src={p.image} alt="" width={800} height={420} />

      <h2>Problem</h2>
      <p>{c.problem}</p>

      <h2>Approach</h2>
      <ul className="steps">
        {c.approach.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>

      {(c.result || (showDrafts && c.resultTodo)) && <h2>Result</h2>}
      {c.result && <p>{c.result}</p>}
      <Draft label="result" text={c.resultTodo} />

      {(c.whatBroke || (showDrafts && c.whatBrokeTodo)) && <h2>What broke</h2>}
      {c.whatBroke && <p>{c.whatBroke}</p>}
      <Draft label="what broke" text={c.whatBrokeTodo} />

      {(c.demo || p.githubUrl || (showDrafts && c.demoTodo)) && <h2>Links</h2>}
      {(c.demo || p.githubUrl) && (
        <ul className="links">
          {c.demo && (
            <li>
              <a className="primary" href={c.demo.href}>{c.demo.label}</a>
            </li>
          )}
          {p.githubUrl && (
            <li>
              <a href={p.githubUrl} target="_blank" rel="noopener">Code on GitHub</a>
            </li>
          )}
        </ul>
      )}
      {!c.demo && <Draft label="demo" text={c.demoTodo} />}

      {nextProject && (
        <p className="foot">
          Next: <Link href={`/work/${next.slug}`}>{nextProject.title}</Link>
        </p>
      )}
    </main>
  )
}
