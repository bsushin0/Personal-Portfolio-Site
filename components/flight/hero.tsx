"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, FileDown, Github, Linkedin } from "lucide-react"
import { useFlight, type SkyPhase } from "@/context/flight-context"
import { useTypewriter } from "@/hooks/use-typewriter"
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "@/lib/flight"
import { IconLink } from "@/components/flight/primitives"

const Plane3D = dynamic(() => import("@/components/flight/plane-3d"), { ssr: false })

const ROLES = ["AI Engineer", "ML Practitioner", "Product Thinker", "Project Manager", "Licensed EMT", "Student Pilot", "Purdue Builder", "Systems Designer"]

const GROUND: Record<SkyPhase, string> = {
  day: "linear-gradient(180deg, #24331f 0%, #18221a 35%, #0d130f 100%)",
  dawn: "linear-gradient(180deg, #2a1f26 0%, #181218 40%, #0b090c 100%)",
  dusk: "linear-gradient(180deg, #2b1c20 0%, #171015 40%, #0a080b 100%)",
  night: "linear-gradient(180deg, #0b0f17 0%, #070a10 40%, #040507 100%)",
}

const CONDITION_TEXT: Record<string, string> = {
  clear: "CLR",
  cloudy: "SCT",
  overcast: "OVC",
  fog: "BR",
  rain: "RA",
  snow: "SN",
  storm: "TS",
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    const first = setTimeout(tick, 0)
    const t = setInterval(tick, 15_000)
    return () => {
      clearTimeout(first)
      clearInterval(t)
    }
  }, [])
  return now
}

const pad = (n: number) => String(n).padStart(2, "0")

export default function Hero() {
  const { wx, phase } = useFlight()
  const { displayText, cursorVisible } = useTypewriter(ROLES)
  const attitudeRef = useRef<HTMLDivElement>(null)
  const now = useClock()

  // Horizon banks with the pointer, mirroring the plane.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let target = 0
    let cur = 0
    let raf = 0
    const loop = () => {
      cur += (target - cur) * 0.06
      if (attitudeRef.current) attitudeRef.current.style.transform = `rotate(${cur.toFixed(3)}deg)`
      raf = Math.abs(target - cur) > 0.01 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e: PointerEvent) => {
      target = ((e.clientX / window.innerWidth) * 2 - 1) * 4
      if (!raf) raf = requestAnimationFrame(loop)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const wxLine = wx
    ? `${wx.city.toUpperCase()} · ${CONDITION_TEXT[wx.condition]}${wx.tempC !== null ? ` · ${Math.round(wx.tempC)}°C` : ""}${
        wx.windKt !== null && wx.windDir !== null ? ` · ${pad(Math.round(wx.windDir / 10) * 10).padStart(3, "0")}/${pad(Math.round(wx.windKt))}KT` : ""
      }`
    : "ATIS —"

  return (
    <section id="top" aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Plane, in the sky above the horizon */}
      <Plane3D
        phase={phase}
        className="pointer-events-none absolute left-1/2 top-[92px] h-[210px] w-[min(92vw,380px)] -translate-x-1/2 sm:h-[260px] sm:w-[480px] md:left-auto md:right-[3%] md:top-[9%] md:translate-x-0 md:h-[340px] md:w-[600px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-[calc(var(--fd-header-h)+14px)] sm:px-6">
        {/* Instrument strip */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 font-mono-fd text-[11px] tracking-[0.14em] text-[color:var(--fd-muted)]">
          <span>DEP KLAF · PURDUE UNIV</span>
          <span className="hidden sm:inline" suppressHydrationWarning>
            {now ? `LCL ${pad(now.getHours())}:${pad(now.getMinutes())} · ${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}Z` : "LCL --:--"}
          </span>
          <span className="w-full sm:w-auto">WX {wxLine}</span>
        </div>
      </div>

      {/* Open sky */}
      <div className="min-h-[220px] flex-1 sm:min-h-[200px]" />

      <h1 className="relative mx-auto w-full max-w-7xl px-4 font-display-fd font-semibold uppercase tracking-[-0.02em] text-[color:var(--fd-text)] sm:px-6">
        <span aria-hidden="true" className="block pb-3 text-[clamp(64px,16vw,200px)] leading-[0.8] sm:pb-4" style={{ textShadow: "0 6px 40px rgba(0,0,0,0.35)" }}>
          Sushin
        </span>
        <span className="sr-only">Sushin Bandha</span>
      </h1>

      {/* Below the horizon: ground, last name, and the rest */}
      <div className="relative">
        <div aria-hidden="true" ref={attitudeRef} className="absolute -inset-x-[25%] top-0 -bottom-[60%] -z-10 origin-top">
          <div className="absolute inset-0" style={{ background: GROUND[phase] }} />
          {/* Ground grid + runway converging on the horizon */}
          <svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full opacity-30 md:opacity-100 md:translate-x-[15%]">
            {Array.from({ length: 29 }, (_, k) => (
              <line key={`r${k}`} x1="800" y1="0" x2={-2000 + k * 200} y2="600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {Array.from({ length: 9 }, (_, k) => {
              const y = 600 * Math.pow((k + 1) / 9, 2)
              return <line key={`h${k}`} x1="0" y1={y} x2="1600" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            })}
            <polygon points="797,4 803,4 1010,600 590,600" fill="rgba(8,10,14,0.78)" />
            {Array.from({ length: 16 }, (_, k) => {
              const t = Math.pow((k + 1) / 16, 1.6)
              const y = 4 + 596 * t
              const half = 3 + 207 * t
              const r = 0.6 + 3.2 * t
              const c = phase === "day" ? "rgba(255,255,255,0.55)" : "rgba(255,206,120,0.95)"
              return (
                <g key={`l${k}`}>
                  <circle cx={800 - half - 6 * t} cy={y} r={r} fill={c} />
                  <circle cx={800 + half + 6 * t} cy={y} r={r} fill={c} />
                </g>
              )
            })}
            {Array.from({ length: 9 }, (_, k) => {
              const t0 = Math.pow((k + 0.2) / 9, 1.6)
              const t1 = Math.pow((k + 0.55) / 9, 1.6)
              return (
                <polygon
                  key={`c${k}`}
                  points={`${800 - 0.5 - 3 * t0},${4 + 596 * t0} ${800 + 0.5 + 3 * t0},${4 + 596 * t0} ${800 + 0.5 + 3 * t1},${4 + 596 * t1} ${800 - 0.5 - 3 * t1},${4 + 596 * t1}`}
                  fill="rgba(255,255,255,0.6)"
                />
              )
            })}
          </svg>
          {phase === "night" && (
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,196,120,0.9) 0 1px, transparent 1.5px), radial-gradient(circle, rgba(255,255,255,0.7) 0 1px, transparent 1.5px)",
                backgroundSize: "37px 23px, 53px 31px",
                backgroundPosition: "0 6px, 19px 14px",
                maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 35%)",
                WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 35%)",
              }}
            />
          )}
          {/* Horizon line */}
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 20%, rgba(255,255,255,0.85) 80%, transparent)", boxShadow: "0 0 18px rgba(255,255,255,0.45)" }} />
          <div className="absolute inset-x-0 -top-24 h-24" style={{ background: "linear-gradient(0deg, rgba(255,220,180,0.10), transparent)" }} />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <p aria-hidden="true" className="pt-3 font-display-fd font-semibold uppercase leading-[0.8] tracking-[-0.02em] text-transparent text-[clamp(64px,16vw,200px)] sm:pt-4" style={{ WebkitTextStroke: "1.5px rgba(231,237,246,0.9)" }}>
            Bandha
          </p>

          <div className="mt-8 grid gap-8 pb-10 sm:pb-12 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-xl">
              <p className="font-mono-fd text-[15px] sm:text-base text-[color:var(--fd-cyan)]">
                <span className="text-[color:var(--fd-dim)]">&gt; </span>
                {displayText}
                <span style={{ opacity: cursorVisible ? 1 : 0 }}>_</span>
              </p>
              <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[color:var(--fd-muted)]">
                Purdue AI student at the intersection of machine learning, product strategy, and security. Student pilot, practicing EMT, and the person you want owning the launch checklist.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#about" className="fd-btn fd-btn-primary">
                  Begin climb <ArrowDown size={15} />
                </a>
                <a href="#projects" className="fd-btn">
                  Departures
                </a>
                <div className="flex items-center gap-2">
                  <IconLink href={GITHUB_URL} label="GitHub">
                    <Github size={18} />
                  </IconLink>
                  <IconLink href={LINKEDIN_URL} label="LinkedIn">
                    <Linkedin size={18} />
                  </IconLink>
                  <IconLink href={RESUME_URL} label="Resume (PDF)" download>
                    <FileDown size={18} />
                  </IconLink>
                </div>
              </div>
            </div>
            <p className="hidden md:block font-mono-fd text-[11px] tracking-[0.22em] text-[color:var(--fd-muted)] text-right">
              RWY 28 · CLEARED FOR TAKEOFF
              <br />
              SCROLL TO CLIMB
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
