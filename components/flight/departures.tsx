"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { ExternalLink, Github, Lock, PlayCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Container, IconLink, WaypointHeader } from "@/components/flight/primitives"
import { projects, type Project } from "@/lib/projects"
import { trackEvent } from "@/lib/analytics"

type BoardStatus = { text: string; tone: "green" | "amber" | "cyan" | "muted"; meaning: string }

const BOARD: Record<number, { dest: string; code: string; via: string }> = {
  2: { dest: "PROJECT AIRA", code: "AIR", via: "AGENTIC" },
  5: { dest: "RELAY", code: "RLY", via: "PLATFORM" },
  1: { dest: "WINE FORECASTING", code: "WIN", via: "ML/OPS" },
  4: { dest: "PREFLIGHT BRIEFER", code: "PFB", via: "CLAUDE" },
  6: { dest: "AEROLOG", code: "AEL", via: "POSTGRES" },
  7: { dest: "TRAINEE FLIGHT OPS", code: "TFO", via: "PM" },
  8: { dest: "LOSTLINK", code: "LST", via: "HCI" },
  3: { dest: "THIS PORTFOLIO", code: "WEB", via: "NEXT.JS" },
}

function boardInfo(p: Project) {
  return BOARD[p.id] ?? { dest: p.title.toUpperCase().slice(0, 18), code: p.title.slice(0, 3).toUpperCase(), via: (p.tags[0] ?? "").toUpperCase().slice(0, 8) }
}

function statusOf(p: Project): BoardStatus {
  if (p.liveUrl) return { text: "BOARDING", tone: "green", meaning: "Live — you can try it now" }
  if (p.status === "coming-soon") return { text: "EN ROUTE", tone: "amber", meaning: "In progress this semester" }
  if (p.status === "not-available") return { text: "LANDED", tone: "muted", meaning: "Completed; code is not public" }
  return { text: "IN FLIGHT", tone: "cyan", meaning: "Running in production" }
}

const flightNo = (p: Project) => `SB${String(100 + p.id * 7).padStart(3, "0")}`

const COLS = { flt: 5, dest: 18, via: 8, status: 9 }
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/."

// ── Split-flap text ─────────────────────────────────────────────────────────
type CellState = "blank" | "flip" | "done"

function Flaps({ text, width, tone, state, rowSeed, tick }: { text: string; width: number; tone?: string; state: (i: number) => CellState; rowSeed: number; tick: number }) {
  const chars = text.padEnd(width, " ").slice(0, width).split("")
  return (
    <span className="inline-flex" aria-hidden="true">
      {chars.map((c, i) => {
        const st = state(i)
        const shown = st === "done" ? c : st === "flip" ? GLYPHS[(rowSeed * 7 + i * 13 + tick) % GLYPHS.length] : " "
        return (
          <span key={i} className={`fd-flap ${tone ? `st-${tone}` : ""}`} data-flipping={st === "flip"}>
            {shown === " " ? "\u00a0" : shown}
          </span>
        )
      })}
    </span>
  )
}

// ── Boarding pass ───────────────────────────────────────────────────────────
function BoardingPass({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const info = project ? boardInfo(project) : null
  const st = project ? statusOf(project) : null
  return (
    <Dialog open={!!project} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[92vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none text-[#17202e]">
        {project && info && st && (
          <div className="fd-pass grid md:grid-cols-[1fr_200px]">
            <div className="min-w-0">
              <div className="flex items-center justify-between bg-[#17202e] px-5 py-3 text-[#f7f3e8]">
                <span className="font-mono-fd text-[11px] tracking-[0.2em]">BOARDING PASS</span>
                <span className="font-mono-fd text-[11px] tracking-[0.2em] pr-8 md:pr-0">{flightNo(project)}</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="fd-pass-label">From</p>
                    <p className="fd-pass-value text-3xl">KLAF</p>
                  </div>
                  <svg width="64" height="20" viewBox="0 0 64 20" aria-hidden="true" className="mb-2 text-[#b0306f]">
                    <path d="M2 10 H54" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5" />
                    <path d="M62 10 L52 5 L54 10 L52 15 Z" fill="currentColor" />
                  </svg>
                  <div className="text-right">
                    <p className="fd-pass-label">To</p>
                    <p className="fd-pass-value text-3xl">{info.code}</p>
                  </div>
                </div>
                <DialogTitle className="mt-4 font-display-fd text-2xl font-semibold leading-tight text-[#17202e]">{project.title}</DialogTitle>
                <div className="mt-4 grid grid-cols-3 gap-3 border-y border-dashed border-[#17202e]/20 py-3">
                  <div>
                    <p className="fd-pass-label">Passenger</p>
                    <p className="fd-pass-value text-[13px]">YOU / VISITOR</p>
                  </div>
                  <div>
                    <p className="fd-pass-label">Via</p>
                    <p className="fd-pass-value text-[13px]">{info.via}</p>
                  </div>
                  <div>
                    <p className="fd-pass-label">Status</p>
                    <p className="fd-pass-value text-[13px]" style={{ color: st.tone === "green" ? "#16794a" : st.tone === "amber" ? "#a05a00" : st.tone === "cyan" ? "#0f6f73" : "#5b6472" }}>
                      {st.text}
                    </p>
                  </div>
                </div>
                {project.image && (
                  <img src={project.image} alt="" className="mt-4 h-32 w-full rounded-lg object-cover sm:h-40" />
                )}
                <DialogDescription className="mt-4 text-[14.5px] leading-relaxed text-[#2c3443]">{project.description}</DialogDescription>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span key={t} className="rounded-full border border-[#17202e]/20 px-2.5 py-0.5 font-mono-fd text-[11px] text-[#2c3443]">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      aria-label={project.liveUrl.startsWith("/") ? "Open live demo" : "Open live site"}
                      data-tip={project.liveUrl.startsWith("/") ? "Live demo" : "Live site"}
                      className="fd-icon-btn !border-[#17202e]/25 !text-[#17202e] hover:!bg-[#17202e]/5"
                      onClick={() => trackEvent("project_click", { projectId: project.id, kind: "live" })}
                      {...(project.liveUrl.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {project.liveUrl.startsWith("/") ? <PlayCircle size={18} /> : <ExternalLink size={18} />}
                    </a>
                  )}
                  {project.githubUrl && (
                    <IconLink href={project.githubUrl} label="Source code" className="!border-[#17202e]/25 !text-[#17202e] hover:!bg-[#17202e]/5">
                      <Github size={18} />
                    </IconLink>
                  )}
                  {!project.githubUrl && (
                    <span className="inline-flex items-center gap-1.5 font-mono-fd text-[11px] tracking-[0.08em] text-[#5b6472]">
                      <Lock size={13} /> {project.isPrivate ? "PRIVATE REPOSITORY" : "SOURCE NOT PUBLIC"}
                    </span>
                  )}
                  <span className="ml-auto font-mono-fd text-[11px] text-[#5b6472]">{st.meaning}</span>
                </div>
              </div>
            </div>
            {/* Stub */}
            <div className="fd-pass-perf hidden md:flex flex-col justify-between bg-[#efe9d9] p-5">
              <div className="space-y-3">
                <div>
                  <p className="fd-pass-label">Flight</p>
                  <p className="fd-pass-value">{flightNo(project)}</p>
                </div>
                <div>
                  <p className="fd-pass-label">Gate</p>
                  <p className="fd-pass-value">GATES</p>
                </div>
                <div>
                  <p className="fd-pass-label">Seat</p>
                  <p className="fd-pass-value">1A</p>
                </div>
                <div>
                  <p className="fd-pass-label">Dest</p>
                  <p className="fd-pass-value">{info.code}</p>
                </div>
              </div>
              <div className="fd-barcode mt-6" aria-hidden="true" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Board ───────────────────────────────────────────────────────────────────
export default function Departures() {
  const boardRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [start, setStart] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  const [elapsed, setElapsed] = useState(-1)
  const [open, setOpen] = useState<Project | null>(null)
  const [selected, setSelected] = useState(0)

  // Per-cell settle times, staggered by row then column.
  const settleAt = useMemo(
    () => projects.map((_, r) => (c: number) => 250 + r * 140 + c * 38 + ((r * 31 + c * 17) % 7) * 45),
    [],
  )

  // Start flipping only once the whole board is on screen.
  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(() => {
        setStart(-1)
        setElapsed(1e9)
      }, 0)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const need = Math.min(entry.boundingClientRect.height, window.innerHeight - 56) * 0.97
        if (entry.intersectionRect.height >= need) {
          setStart(performance.now())
          io.disconnect()
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Drive the flip animation until every cell has settled.
  useEffect(() => {
    if (start === null || start < 0) return
    const total = 250 + projects.length * 140 + 40 * 38 + 6 * 45 + 100
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      if (t - last > 55) {
        last = t
        setTick((n) => n + 1)
        setElapsed(t - start)
      }
      if (t - start < total) raf = requestAnimationFrame(loop)
      else setElapsed(t - start)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [start])

  const cell = (r: number, offset: number) => (c: number): CellState =>
    start === null || elapsed < 0 ? "blank" : elapsed >= settleAt[r](c + offset) ? "done" : "flip"

  const openRow = (i: number) => {
    setSelected(i)
    setOpen(projects[i])
    trackEvent("project_click", { projectId: projects[i].id, kind: "board" })
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const n = e.key === "ArrowDown" ? Math.min(i + 1, projects.length - 1) : Math.max(i - 1, 0)
      setSelected(n)
      rowRefs.current[n]?.focus()
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openRow(i)
    }
  }

  return (
    <section id="projects" className="fd-section">
      <Container>
        <WaypointHeader id="projects" title="Departures" kicker="Projects">
          Everything I&apos;ve built or am building, on one board. Pick a flight to get your boarding pass.
        </WaypointHeader>

        <div ref={boardRef} className="fd-board p-3 sm:p-5 [--flap-w:clamp(12px,calc((100vw-72px)/18-2px),18px)] md:[--flap-w:15px] lg:[--flap-w:18px] xl:[--flap-w:20px]">
          <div className="mb-3 flex items-center justify-between px-1 font-mono-fd text-[11px] tracking-[0.18em] text-[#f5c542]">
            <span>DEPARTURES · KLAF</span>
            <span className="text-[#9aa3b4]">GATES 1–{projects.length}</span>
          </div>

          {/* Column heads */}
          <div className="hidden md:grid grid-cols-[auto_auto_auto_auto] justify-start gap-x-4 px-2 pb-2 font-mono-fd text-[10px] tracking-[0.18em] text-[#9aa3b4]" aria-hidden="true">
            <span style={{ width: `calc(${COLS.flt} * (var(--flap-w) + 2px))` }}>FLIGHT</span>
            <span style={{ width: `calc(${COLS.dest} * (var(--flap-w) + 2px))` }}>DESTINATION</span>
            <span style={{ width: `calc(${COLS.via} * (var(--flap-w) + 2px))` }}>VIA</span>
            <span>STATUS</span>
          </div>

          <div role="list" aria-label="Projects departures board" className="space-y-1">
            {projects.map((p, r) => {
              const info = boardInfo(p)
              const st = statusOf(p)
              const label = `${p.title}. Status ${st.text.toLowerCase()}: ${st.meaning}. Press Enter for the boarding pass.`
              return (
                <div
                  key={p.id}
                  role="listitem"
                  ref={(el) => { rowRefs.current[r] = el }}
                  tabIndex={0}
                  aria-label={label}
                  data-selected={selected === r && !!open}
                  className="fd-board-row px-2 py-1.5"
                  onClick={() => openRow(r)}
                  onKeyDown={(e) => onKey(e, r)}
                  onFocus={() => setSelected(r)}
                >
                  {/* md+: one line */}
                  <div className="hidden md:flex items-center gap-4">
                    <Flaps text={flightNo(p)} width={COLS.flt} tone="cyan" state={cell(r, 0)} tick={tick} rowSeed={r} />
                    <Flaps text={info.dest} width={COLS.dest} state={cell(r, COLS.flt)} tick={tick} rowSeed={r + 3} />
                    <Flaps text={info.via} width={COLS.via} tone="muted" state={cell(r, COLS.flt + COLS.dest)} tick={tick} rowSeed={r + 5} />
                    <Flaps text={st.text} width={COLS.status} tone={st.tone} state={cell(r, COLS.flt + COLS.dest + COLS.via)} tick={tick} rowSeed={r + 7} />
                    {p.isPrivate && <Lock size={13} className="text-[#9aa3b4]" aria-hidden="true" />}
                  </div>
                  {/* mobile: two lines */}
                  <div className="md:hidden">
                    <Flaps text={info.dest} width={COLS.dest} state={cell(r, 0)} tick={tick} rowSeed={r + 3} />
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono-fd text-[11px] tracking-[0.1em] text-[color:var(--fd-cyan)]">{flightNo(p)}</span>
                      <Flaps text={st.text} width={COLS.status} tone={st.tone} state={cell(r, 8)} tick={tick} rowSeed={r + 7} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 px-1 font-mono-fd text-[10.5px] tracking-[0.1em] text-[#9aa3b4]">
            <span><span className="text-[color:var(--fd-green)]">BOARDING</span> live now</span>
            <span><span className="text-[color:var(--fd-cyan)]">IN FLIGHT</span> in production</span>
            <span><span className="text-[color:var(--fd-amber)]">EN ROUTE</span> in progress</span>
            <span>LANDED complete</span>
          </div>
        </div>
      </Container>
      <BoardingPass project={open} onClose={() => setOpen(null)} />
    </section>
  )
}
