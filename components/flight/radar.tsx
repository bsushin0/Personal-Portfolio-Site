"use client"

import { useState, type KeyboardEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Container, WaypointHeader } from "@/components/flight/primitives"
import { skillCategories, skillDetails } from "@/lib/skills"

const SWEEP_S = 6

function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

type Blip = { skill: string; cat: number; x: number; y: number; angle: number }

function layout(): Blip[] {
  const n = skillCategories.length
  const width = 360 / n
  const blips: Blip[] = []
  skillCategories.forEach((cat, ci) => {
    const count = cat.skills.length
    cat.skills.forEach((skill, j) => {
      const seed = ci * 31 + j
      const angle = ci * width + ((j + 0.5) / count) * width * 0.86 + width * 0.07
      const r = 0.24 + ((j % 3) / 3) * 0.5 + rand(seed) * 0.16
      const rad = (angle * Math.PI) / 180
      blips.push({ skill, cat: ci, angle, x: 50 + r * 46 * Math.sin(rad), y: 50 - r * 46 * Math.cos(rad) })
    })
  })
  return blips
}

const blips = layout()

export default function Radar() {
  const [cat, setCat] = useState<number | null>(null)
  const [hover, setHover] = useState<Blip | null>(null)
  const [skill, setSkill] = useState<string | null>(null)
  const detail = skill ? skillDetails[skill] : null
  const n = skillCategories.length
  const width = 360 / n
  const shownCat = cat ?? 0

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1
    const next = (shownCat + dir + n) % n
    setCat(next)
    document.getElementById(`radar-tab-${next}`)?.focus()
  }

  return (
    <section id="skills" className="fd-section">
      <Container>
        <WaypointHeader id="skills" title="Radar" kicker="Skills">
          Every skill I work with, painted as a contact. Pick a sector to filter, then select a contact for where I&apos;ve actually used it.
        </WaypointHeader>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-12">
          {/* Scope */}
          <div className="mx-auto w-full max-w-[520px]">
            <div className="fd-radar" style={{ ["--sweep" as string]: `${SWEEP_S}s` }}>
              {/* rings + sector lines */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {[46, 34.5, 23, 11.5].map((r) => (
                  <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(70,224,138,0.18)" strokeWidth="0.25" />
                ))}
                {skillCategories.map((c, i) => {
                  const a = ((i * width) * Math.PI) / 180
                  const mid = (((i + 0.5) * width) * Math.PI) / 180
                  const active = cat === i
                  return (
                    <g key={c.id}>
                      {active && (
                        <path
                          d={`M50 50 L${50 + 46 * Math.sin(a)} ${50 - 46 * Math.cos(a)} A46 46 0 0 1 ${50 + 46 * Math.sin(a + (width * Math.PI) / 180)} ${50 - 46 * Math.cos(a + (width * Math.PI) / 180)} Z`}
                          fill="rgba(255,181,61,0.08)"
                        />
                      )}
                      <line x1="50" y1="50" x2={50 + 46 * Math.sin(a)} y2={50 - 46 * Math.cos(a)} stroke="rgba(70,224,138,0.14)" strokeWidth="0.25" />
                      <text
                        x={50 + 40.5 * Math.sin(mid)}
                        y={50 - 40.5 * Math.cos(mid) + 1}
                        textAnchor="middle"
                        fontSize="2.6"
                        letterSpacing="0.2"
                        fill={active ? "#ffb53d" : "rgba(120,220,170,0.75)"}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {c.short}
                      </text>
                    </g>
                  )
                })}
                {/* own ship */}
                <path d="M50 47.6 L51.1 51.6 L50 51 L48.9 51.6 Z" fill="#e7edf6" />
              </svg>
              <div className="fd-radar-sweep" aria-hidden="true" />

              {blips.map((b) => (
                <button
                  key={b.skill}
                  type="button"
                  className="fd-blip"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${(b.angle / 360) * SWEEP_S}s` }}
                  data-active={cat === b.cat}
                  data-dim={cat !== null && cat !== b.cat}
                  aria-label={`${b.skill} (${skillCategories[b.cat].title})`}
                  tabIndex={-1}
                  onMouseEnter={() => setHover(b)}
                  onMouseLeave={() => setHover((h) => (h === b ? null : h))}
                  onClick={() => setSkill(b.skill)}
                />
              ))}

              {hover && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-[rgba(70,224,138,0.5)] bg-[rgba(2,12,8,0.92)] px-2 py-1 font-mono-fd text-[11px] text-[color:var(--fd-green)]"
                  style={{ left: `${hover.x}%`, top: `calc(${hover.y}% + 12px)` }}
                >
                  {hover.skill}
                </div>
              )}
            </div>
            <p className="mt-4 text-center font-mono-fd text-[11px] tracking-[0.14em] text-[color:var(--fd-dim)]">
              {blips.length} CONTACTS · {n} SECTORS · SWEEP {SWEEP_S}s
            </p>
          </div>

          {/* Sector panel */}
          <div className="fd-panel p-4 sm:p-5">
            <div role="tablist" aria-label="Skill sectors" className="flex flex-wrap gap-1.5" onKeyDown={onTabKey}>
              {skillCategories.map((c, i) => (
                <button
                  key={c.id}
                  id={`radar-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={shownCat === i}
                  aria-controls="radar-panel"
                  tabIndex={shownCat === i ? 0 : -1}
                  onClick={() => setCat(cat === i ? null : i)}
                  className="rounded-md border px-2.5 py-1.5 font-mono-fd text-[11.5px] tracking-[0.08em]"
                  style={
                    cat === i
                      ? { borderColor: "var(--fd-amber)", color: "var(--fd-amber)", background: "rgba(255,181,61,0.08)" }
                      : { borderColor: "var(--fd-line-strong)", color: "var(--fd-muted)" }
                  }
                >
                  {c.short}
                </button>
              ))}
            </div>
            <div id="radar-panel" role="tabpanel" aria-labelledby={`radar-tab-${shownCat}`} className="mt-5">
              <h3 className="font-display-fd text-xl font-semibold text-[color:var(--fd-text)]">{skillCategories[shownCat].title}</h3>
              <p className="mt-1 font-mono-fd text-[11px] text-[color:var(--fd-dim)]">
                {skillCategories[shownCat].skills.length} CONTACTS IN SECTOR
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skillCategories[shownCat].skills.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setSkill(s)}
                      className="rounded-lg border border-[color:var(--fd-line-strong)] px-3 py-1.5 text-[13.5px] text-[color:var(--fd-text)] hover:border-[color:var(--fd-green)] hover:text-[color:var(--fd-green)]"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      <Dialog open={!!skill} onOpenChange={(v) => !v && setSkill(null)}>
        <DialogContent className="fd-dialog max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-left">
            <p className="fd-label text-[10px] text-[color:var(--fd-green)]">Radar contact</p>
            <DialogTitle className="font-display-fd text-2xl font-semibold text-[color:var(--fd-text)] pr-6">{skill}</DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed text-[color:var(--fd-muted)]">
              {detail?.narrative ?? `${skill} is part of my working toolkit. Ask AiRa, my first officer, for where I've used it.`}
            </DialogDescription>
          </DialogHeader>
          {detail && detail.appliedAt.length > 0 && (
            <div>
              <p className="fd-label mb-2">Applied at</p>
              <ul className="space-y-2">
                {detail.appliedAt.map((a) => (
                  <li key={a} className="flex gap-3 text-[14px] text-[color:var(--fd-text)]/90">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--fd-green)]" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
