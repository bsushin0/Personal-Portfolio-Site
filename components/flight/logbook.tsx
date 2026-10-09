"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Container, WaypointHeader } from "@/components/flight/primitives"
import { experiences, type ExperienceEntry } from "@/lib/experience"

const MONTHS: Record<string, string> = {
  january: "JAN", february: "FEB", march: "MAR", april: "APR", may: "MAY", june: "JUN",
  july: "JUL", august: "AUG", september: "SEP", october: "OCT", november: "NOV", december: "DEC",
}

function shortPeriod(period: string) {
  return period
    .split(" - ")
    .map((p) => {
      const [m, y] = p.trim().split(/\s+/)
      if (!y) return p.toUpperCase()
      return `${MONTHS[m.toLowerCase()] ?? m.slice(0, 3).toUpperCase()} ’${y.slice(2)}`
    })
    .join(" – ")
}

const isActive = (e: ExperienceEntry) => /present/i.test(e.period)

function EntryDialog({ entry, index, onClose }: { entry: ExperienceEntry | null; index: number; onClose: () => void }) {
  return (
    <Dialog open={!!entry} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="fd-dialog max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
        {entry && (
          <div>
            <div className="border-b border-[color:var(--fd-line)] p-6 pb-5">
              <DialogHeader className="space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <span className="fd-chip">ENTRY {String(index + 1).padStart(2, "0")}</span>
                  <span className="fd-chip">{entry.type.toUpperCase()}</span>
                  <span className="fd-chip" style={isActive(entry) ? { color: "var(--fd-green)", borderColor: "rgba(70,224,138,0.4)" } : undefined}>
                    {entry.period}
                  </span>
                </div>
                <DialogTitle className="font-display-fd text-xl sm:text-2xl font-semibold leading-snug text-[color:var(--fd-text)]">
                  {entry.title}
                </DialogTitle>
                <DialogDescription className="text-[15px] text-[color:var(--fd-cyan)]">{entry.company}</DialogDescription>
              </DialogHeader>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <p className="fd-label mb-2">Pilot&apos;s remarks</p>
                <p className="text-[15px] leading-relaxed text-[color:var(--fd-text)]/90">{entry.narrative}</p>
              </div>
              <div>
                <p className="fd-label mb-2">Duties logged</p>
                <ul className="space-y-2.5">
                  {entry.description.map((d) => (
                    <li key={d} className="flex gap-3 text-[14.5px] leading-relaxed text-[color:var(--fd-muted)]">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--fd-magenta)]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="fd-label mb-2">Endorsements</p>
                <div className="flex flex-wrap gap-2">
                  {entry.skills.map((s) => (
                    <span key={s} className="fd-chip">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function Logbook() {
  const [open, setOpen] = useState<number | null>(null)
  const rowRefs = useRef<(HTMLElement | null)[]>([])
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  const active = experiences.filter(isActive).length
  const byType = experiences.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1
    return acc
  }, {})

  const onRowKey = (e: KeyboardEvent<HTMLElement>, i: number, refs = rowRefs.current) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const n = e.key === "ArrowDown" ? Math.min(i + 1, experiences.length - 1) : Math.max(i - 1, 0)
      refs[n]?.focus()
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(i)
    }
  }

  return (
    <section id="experience" className="fd-section">
      <Container>
        <WaypointHeader id="experience" title="Logbook" kicker="Experience">
          Every role, logged like flight time. Open an entry for the full write-up — what I did, and what it taught me.
        </WaypointHeader>

        <div className="fd-logbook p-3 sm:p-6">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 px-1 sm:px-2">
            <p className="font-mono-fd text-[11px] font-semibold tracking-[0.16em] text-[color:var(--fd-ink-green)]">
              PILOT LOGBOOK · S. BANDHA
            </p>
            <p className="font-mono-fd text-[11px] tracking-[0.12em] text-[color:var(--fd-ink-green)]/80">PAGE 01</p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-3 py-2 w-[150px]">Date</th>
                  <th className="px-3 py-2 w-[220px]">Aircraft / Org</th>
                  <th className="px-3 py-2">Role · Remarks</th>
                  <th className="px-3 py-2 w-[110px]">Type</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((e, i) => (
                  <tr
                    key={e.id}
                    ref={(el) => { rowRefs.current[i] = el }}
                    tabIndex={0}
                    onClick={() => setOpen(i)}
                    onKeyDown={(ev) => onRowKey(ev, i)}
                    aria-label={`${e.title} at ${e.company}, ${e.period}. Press Enter for details.`}
                  >
                    <td className="px-3 py-3.5 font-mono-fd text-[12px] tracking-[0.04em] whitespace-nowrap">
                      {shortPeriod(e.period)}
                      {isActive(e) && <span className="mt-1 block text-[10px] font-semibold tracking-[0.14em] text-[#b0306f]">● ACTIVE</span>}
                    </td>
                    <td className="px-3 py-3.5 text-[14px] font-semibold leading-snug">{e.company}</td>
                    <td className="px-3 py-3.5">
                      <p className="text-[14.5px] font-semibold leading-snug">{e.title}</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--fd-ink)]/75">{e.summary}</p>
                    </td>
                    <td className="px-3 py-3.5 font-mono-fd text-[11.5px] uppercase tracking-[0.08em]">{e.type}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-3 pt-4 font-mono-fd text-[11px] tracking-[0.1em] text-[color:var(--fd-ink-green)] border-t-2 border-[color:var(--fd-ink-green)]">
                    TOTALS — ENTRIES {experiences.length} · ACTIVE {active} ·{" "}
                    {Object.entries(byType).map(([t, n]) => `${t.toUpperCase()} ${n}`).join(" · ")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile entries */}
          <ol className="md:hidden divide-y divide-[rgba(47,107,79,0.25)]">
            {experiences.map((e, i) => (
              <li key={e.id}>
                <button
                  type="button"
                  ref={(el) => { cardRefs.current[i] = el }}
                  onClick={() => setOpen(i)}
                  onKeyDown={(ev) => onRowKey(ev, i, cardRefs.current)}
                  className="w-full px-2 py-4 text-left"
                >
                  <div className="flex items-center justify-between gap-2 font-mono-fd text-[11px] tracking-[0.06em]">
                    <span>{shortPeriod(e.period)}</span>
                    <span className="uppercase text-[color:var(--fd-ink-green)]">{isActive(e) ? "● Active" : e.type}</span>
                  </div>
                  <p className="mt-1.5 text-[15px] font-semibold leading-snug">{e.title}</p>
                  <p className="text-[13.5px] font-medium text-[color:var(--fd-ink-green)]">{e.company}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--fd-ink)]/75">{e.summary}</p>
                </button>
              </li>
            ))}
          </ol>
          <p className="md:hidden px-2 pt-3 font-mono-fd text-[10.5px] tracking-[0.08em] text-[color:var(--fd-ink-green)] border-t-2 border-[color:var(--fd-ink-green)]">
            TOTALS — ENTRIES {experiences.length} · ACTIVE {active}
          </p>
        </div>
      </Container>
      <EntryDialog entry={open !== null ? experiences[open] : null} index={open ?? 0} onClose={() => setOpen(null)} />
    </section>
  )
}
