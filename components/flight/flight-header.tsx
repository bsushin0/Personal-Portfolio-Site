"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FileDown, Keyboard, Menu, X } from "lucide-react"
import { CALLSIGN, RESUME_URL, SQUAWKS, waypoints, formatAltitude } from "@/lib/flight"
import { useFlight } from "@/context/flight-context"
import { IconLink } from "@/components/flight/primitives"
import { trackEvent } from "@/lib/analytics"

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)
}

function dialogOpen() {
  return !!document.querySelector('[role="dialog"][data-state="open"]')
}

function goTo(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id)
  if (id === "top") window.scrollTo({ top: 0 })
  else el?.scrollIntoView()
  history.replaceState(null, "", id === "top" ? " " : `#${id}`)
}

const SHORTCUTS: [string, string][] = [
  ["J / ]", "Next waypoint"],
  ["K / [", "Previous waypoint"],
  ["0–9 ×4", "Set the transponder (try 7700)"],
  ["← → ↑ ↓", "Move inside the logbook, board and radar"],
  ["Enter", "Open the selected item"],
  ["?", "Show or hide this card"],
]

export default function FlightHeader() {
  const { squawk, setSquawk } = useFlight()
  const [active, setActive] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [pending, setPending] = useState("")
  const [notice, setNotice] = useState<string | null>(null)
  const altRef = useRef<HTMLSpanElement>(null)
  const xpdrInputRef = useRef<HTMLInputElement>(null)
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(0)

  const announce = useCallback((msg: string) => {
    setNotice(msg)
    if (noticeTimer.current) clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 5200)
  }, [])

  const applySquawk = useCallback(
    (code: string) => {
      setSquawk(code)
      setPending("")
      const s = SQUAWKS[code]
      trackEvent("squawk", { code })
      if (s) {
        announce(s.message)
        if (s.target) setTimeout(() => goTo(s.target!), 650)
      } else {
        announce(`Squawk ${code}. Radar contact.`)
      }
    },
    [announce, setSquawk],
  )

  // Altimeter + active waypoint, interpolated between section tops.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY + window.innerHeight * 0.35
      // Altitude tracks the top of the viewport so the page top reads field elevation.
      const ya = window.scrollY
      const tops = waypoints.map((w) => {
        if (w.id === "top") return 0
        const el = document.getElementById(w.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
      })
      let i = 0
      for (let k = 0; k < tops.length; k++) if (y >= tops[k]) i = k
      let a = 0
      for (let k = 0; k < tops.length; k++) if (ya >= tops[k]) a = k
      const next = Math.min(a + 1, waypoints.length - 1)
      const span = tops[next] - tops[a]
      const f = next === a || !Number.isFinite(span) || span <= 0 ? 0 : Math.min(1, (ya - tops[a]) / span)
      const alt = waypoints[a].altitude + (waypoints[next].altitude - waypoints[a].altitude) * f
      if (altRef.current) altRef.current.textContent = formatAltitude(Math.round(alt / 10) * 10)
      if (i !== activeRef.current) {
        activeRef.current = i
        setActive(i)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Global keys: waypoint hopping, transponder digits, help.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || dialogOpen()) return
      if (e.key === "?") {
        setHelpOpen((v) => !v)
        return
      }
      if (e.key === "Escape") {
        setHelpOpen(false)
        setMenuOpen(false)
        return
      }
      if (e.key === "j" || e.key === "]") {
        e.preventDefault()
        goTo(waypoints[Math.min(activeRef.current + 1, waypoints.length - 1)].id)
        return
      }
      if (e.key === "k" || e.key === "[") {
        e.preventDefault()
        goTo(waypoints[Math.max(activeRef.current - 1, 0)].id)
        return
      }
      if (/^[0-7]$/.test(e.key)) {
        setPending((p) => {
          const next = (p + e.key).slice(-4)
          if (next.length === 4) {
            setTimeout(() => applySquawk(next), 0)
            return ""
          }
          return next
        })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [applySquawk])

  // Pending digits time out like a real control head.
  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => setPending(""), 2500)
    return () => clearTimeout(t)
  }, [pending])

  const emergency = squawk === "7700" || squawk === "7600"
  const shown = pending ? pending.padEnd(4, "–") : squawk

  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] fd-btn fd-btn-primary">
        Skip to content
      </a>
      <header className="fd-header fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6">
          <a href="#top" onClick={(e) => { e.preventDefault(); goTo("top") }} className="flex shrink-0 items-center gap-2 font-mono-fd text-[13px] tracking-[0.12em] text-[color:var(--fd-text)]">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="text-[color:var(--fd-magenta)]">
              <path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </svg>
            <span>{CALLSIGN}</span>
          </a>

          {/* Route strip */}
          <nav aria-label="Flight plan" className="hidden lg:flex flex-1 items-center justify-center">
            <ol className="flex items-center font-mono-fd text-[12px] tracking-[0.1em]">
              {waypoints.map((w, i) => (
                <li key={w.id} className="flex items-center">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-1.5 h-px w-5 xl:w-7"
                      style={{ background: i <= active ? "var(--fd-magenta)" : "var(--fd-line-strong)" }}
                    />
                  )}
                  <a
                    href={`#${w.id}`}
                    onClick={(e) => { e.preventDefault(); goTo(w.id) }}
                    className="fd-route-leg rounded px-1.5 py-1 text-[color:var(--fd-dim)] hover:text-[color:var(--fd-cyan)]"
                    data-active={i === active}
                    data-passed={i < active}
                    aria-current={i === active ? "location" : undefined}
                    title={w.name}
                  >
                    {w.ident}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex-1 lg:hidden" />

          {/* Instruments */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="fd-label text-[9.5px]">ALT</span>
              <span ref={altRef} className="w-[76px] text-right font-mono-fd text-[13px] text-[color:var(--fd-cyan)] tabular-nums">606 FT</span>
            </div>
            <button
              type="button"
              onClick={() => {
                xpdrInputRef.current?.focus()
              }}
              className="fd-xpdr flex items-center gap-2 px-2.5 py-1.5"
              data-alert={emergency}
              aria-label={`Transponder ${squawk}. Click to set a squawk code.`}
              title="Transponder — type a 4-digit squawk"
            >
              <span className="text-[9.5px] tracking-[0.18em] text-[color:var(--fd-muted)]">XPDR</span>
              <span className="text-[15px] tracking-[0.2em] tabular-nums">{shown}</span>
              <span className="hidden sm:inline text-[9.5px] tracking-[0.18em] text-[color:var(--fd-muted)]">{SQUAWKS[squawk]?.label ?? "ALT"}</span>
            </button>
            <input
              ref={xpdrInputRef}
              inputMode="numeric"
              aria-label="Squawk code"
              maxLength={4}
              className="sr-only"
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-7]/g, "").slice(0, 4)
                e.target.value = v
                setPending(v)
                if (v.length === 4) {
                  e.target.value = ""
                  e.target.blur()
                  applySquawk(v)
                }
              }}
            />
            <IconLink href={RESUME_URL} label="Download resume" download tipPos="bottom" className="hidden sm:inline-flex h-9 w-9">
              <FileDown size={17} />
            </IconLink>
            <button type="button" className="fd-icon-btn hidden md:inline-flex h-9 w-9" data-tip="Shortcuts (?)" data-tip-pos="bottom" aria-label="Keyboard shortcuts" onClick={() => setHelpOpen((v) => !v)}>
              <Keyboard size={17} />
            </button>
            <button type="button" className="fd-icon-btn lg:hidden h-9 w-9" aria-label={menuOpen ? "Close flight plan" : "Open flight plan"} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile flight plan */}
        {menuOpen && (
          <nav aria-label="Flight plan" className="lg:hidden border-t border-[color:var(--fd-line)] bg-[rgba(5,8,15,0.96)]">
            <ol className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {waypoints.map((w, i) => (
                <li key={w.id}>
                  <a
                    href={`#${w.id}`}
                    onClick={(e) => { e.preventDefault(); setMenuOpen(false); goTo(w.id) }}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/5"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono-fd text-[13px] tracking-[0.1em]" style={{ color: i === active ? "var(--fd-magenta)" : "var(--fd-text)" }}>{w.ident}</span>
                      <span className="text-[14px] text-[color:var(--fd-muted)]">{w.name}</span>
                    </span>
                    <span className="font-mono-fd text-[11px] text-[color:var(--fd-dim)]">{formatAltitude(w.altitude)}</span>
                  </a>
                </li>
              ))}
              <li className="sm:col-span-2 pt-2 flex items-center gap-2 px-3">
                <a href={RESUME_URL} download className="fd-btn h-10 w-full justify-center">
                  <FileDown size={16} /> Resume
                </a>
              </li>
            </ol>
          </nav>
        )}

        {/* Annunciator */}
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-full flex justify-center px-4">
          {notice && (
            <div className="mt-2 max-w-xl rounded-lg border px-4 py-2 font-mono-fd text-[12.5px] tracking-[0.04em]"
              style={{
                background: "rgba(20,14,2,0.92)",
                borderColor: emergency ? "var(--fd-red)" : "var(--fd-amber)",
                color: emergency ? "#ffd0d0" : "var(--fd-amber)",
              }}>
              {notice}
            </div>
          )}
        </div>
      </header>

      {helpOpen && (
        <div role="note" aria-label="Keyboard shortcuts" className="fixed right-4 top-[calc(var(--fd-header-h)+12px)] z-50 w-[min(340px,calc(100vw-32px))] fd-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="fd-label">Quick reference</span>
            <button type="button" aria-label="Close shortcuts" onClick={() => setHelpOpen(false)} className="text-[color:var(--fd-muted)] hover:text-[color:var(--fd-text)]">
              <X size={16} />
            </button>
          </div>
          <dl className="space-y-2">
            {SHORTCUTS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 text-[13px]">
                <dt className="font-mono-fd text-[color:var(--fd-cyan)] shrink-0">{k}</dt>
                <dd className="text-right text-[color:var(--fd-muted)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  )
}
