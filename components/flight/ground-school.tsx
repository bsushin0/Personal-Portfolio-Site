"use client"

import { useState } from "react"
import { GraduationCap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Container, WaypointHeader } from "@/components/flight/primitives"
import { anthropicCourses, coreCourses, courseDetails, degree, educationHighlights, otherCoursework } from "@/lib/education"

function Checklist({ title, items, onOpen, accent, wide }: { title: string; items: string[]; onOpen: (c: string) => void; accent: string; wide?: boolean }) {
  return (
    <div className="fd-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-[color:var(--fd-line)] px-4 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>
        <span className="fd-label" style={{ color: accent }}>{title}</span>
        <span className="font-mono-fd text-[10.5px] text-[color:var(--fd-dim)]">{items.length} ITEMS</span>
      </div>
      <ol className={wide ? "py-1 md:columns-2 md:gap-0" : "py-1"}>
        {items.map((c, i) => (
          <li key={c} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => onOpen(c)}
              className="group flex w-full items-baseline gap-3 px-4 py-2 text-left hover:bg-white/[0.03] focus-visible:bg-white/[0.04]"
            >
              <span className="font-mono-fd text-[10.5px] text-[color:var(--fd-dim)] w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[14px] text-[color:var(--fd-text)] group-hover:text-[color:var(--fd-cyan)]">{c}</span>
              <span aria-hidden="true" className="mx-1 flex-1 translate-y-[-3px] border-b border-dotted border-[color:var(--fd-line-strong)]" />
              <span className="font-mono-fd text-[10.5px] tracking-[0.12em] text-[color:var(--fd-green)]">CHECK</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function GroundSchool() {
  const [course, setCourse] = useState<string | null>(null)
  const detail = course ? courseDetails[course] : null

  return (
    <section id="education" className="fd-section">
      <Container>
        <WaypointHeader id="education" title="Ground School" kicker="Education">
          Computer Science degree with an AI specialization, grounded in mathematics, data science, and ethics. Pick any checklist item to see what I took away from it.
        </WaypointHeader>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Training record */}
          <div className="fd-bezel p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--fd-line-strong)] text-[color:var(--fd-cyan)]">
                <GraduationCap size={22} />
              </span>
              <div className="min-w-0">
                <p className="fd-label text-[10px]">Training record</p>
                <h3 className="mt-1 font-display-fd text-2xl font-semibold text-[color:var(--fd-text)]">{degree.title}</h3>
                <p className="mt-1 text-[14px] text-[color:var(--fd-muted)]">{degree.minor}</p>
                <p className="mt-2 text-[15px] text-[color:var(--fd-text)]">{degree.school}</p>
                <p className="mt-1 font-mono-fd text-[12px] text-[color:var(--fd-dim)]">{degree.period}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="fd-chip" style={{ color: "var(--fd-cyan)", borderColor: "rgba(63,224,208,0.35)" }}>{degree.gpa}</span>
              <span className="fd-chip">{degree.standing}</span>
            </div>

            <p className="fd-label mt-7 mb-3">Programs &amp; highlights</p>
            <ul className="space-y-3.5">
              {educationHighlights.map((h) => (
                <li key={h.label} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 rotate-45 border border-[color:var(--fd-magenta)]" />
                  <div>
                    <p className="text-[14.5px] font-semibold text-[color:var(--fd-text)]">{h.label}</p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--fd-muted)]">{h.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <Checklist title="Purdue University" items={coreCourses} onOpen={setCourse} accent="var(--fd-amber)" />
            <p className="px-1 text-[13px] leading-relaxed text-[color:var(--fd-dim)]">{otherCoursework}</p>
          </div>
        </div>

        <div className="mt-6">
          <Checklist title="Anthropic Academy" items={anthropicCourses} onOpen={setCourse} accent="var(--fd-cyan)" wide />
        </div>
      </Container>

      <Dialog open={!!course} onOpenChange={(v) => !v && setCourse(null)}>
        <DialogContent className="fd-dialog max-w-lg w-[95vw]">
          <DialogHeader className="text-left">
            <p className="fd-label text-[10px]">{detail?.institution ?? "Coursework"}</p>
            <DialogTitle className="font-display-fd text-xl font-semibold text-[color:var(--fd-text)] pr-6">{course}</DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed text-[color:var(--fd-muted)]">
              {detail?.narrative ?? `${course} is part of my coursework at Purdue or Anthropic Academy. Ask AiRa, my first officer, for more context.`}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
