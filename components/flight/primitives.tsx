"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { waypoints, formatAltitude } from "@/lib/flight"
import { cn } from "@/lib/utils"

// ── Icon link: every external link on the site is an icon with a tooltip ────
export function IconLink({
  href,
  label,
  children,
  download,
  external = true,
  tipPos,
  className,
}: {
  href: string
  label: string
  children: ReactNode
  download?: boolean
  external?: boolean
  tipPos?: "bottom"
  className?: string
}) {
  return (
    <a
      href={href}
      aria-label={label}
      data-tip={label}
      data-tip-pos={tipPos}
      className={cn("fd-icon-btn", className)}
      {...(download ? { download: true } : {})}
      {...(external && !download ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  )
}

// ── In-view hook ─────────────────────────────────────────────────────────────
export function useInView<T extends Element>(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const once = options?.once ?? true
  const threshold = options?.threshold
  const rootMargin = options?.rootMargin

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, threshold, rootMargin])

  return [ref, inView] as const
}

// ── Waypoint section header ─────────────────────────────────────────────────
export function WaypointHeader({
  id,
  title,
  kicker,
  children,
}: {
  id: string
  title: string
  kicker?: string
  children?: ReactNode
}) {
  const wp = waypoints.find((w) => w.id === id)
  return (
    <header className="mb-10 md:mb-14">
      {wp && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 font-mono-fd text-[12px] tracking-[0.14em] uppercase">
          <span className="inline-flex items-center gap-2 text-[color:var(--fd-magenta)]">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="7" cy="7" r="1.6" fill="currentColor" />
            </svg>
            {wp.ident}
          </span>
          <span className="text-[color:var(--fd-dim)]">/</span>
          <span className="text-[color:var(--fd-cyan)]">{formatAltitude(wp.altitude)}</span>
          <span className="text-[color:var(--fd-dim)]">/</span>
          <span className="text-[color:var(--fd-muted)]">{wp.freq}</span>
          {kicker && (
            <>
              <span className="text-[color:var(--fd-dim)]">/</span>
              <span className="text-[color:var(--fd-muted)]">{kicker}</span>
            </>
          )}
        </div>
      )}
      <h2 className="font-display-fd text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--fd-text)]">
        {title}
      </h2>
      {children && <div className="mt-4 max-w-2xl text-[15px] sm:text-base leading-relaxed text-[#d3dbe7]">{children}</div>}
    </header>
  )
}

// ── ECG vitals divider between sections ─────────────────────────────────────
const BEAT = "l 40 0 l 6 -6 l 6 6 l 10 0 l 4 6 l 6 -46 l 6 52 l 5 -12 l 12 0 l 10 -10 l 12 10 l 30 0"

export function EcgDivider({ hr = 72, spo2 = 99 }: { hr?: number; spo2?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 })
  const d = `M 0 60 ${Array.from({ length: 7 }, () => BEAT).join(" ")}`
  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-4" aria-hidden="true">
      <div className="fd-ecg flex items-center gap-4" data-visible={inView}>
        <svg viewBox="0 0 1050 80" preserveAspectRatio="none" className="h-12 w-full">
          <path d="M 0 60 H 1050" stroke="rgba(70,224,138,0.10)" strokeWidth="1" />
          <path className="trace" d={d} />
        </svg>
        <div className="hidden sm:flex shrink-0 flex-col items-end font-mono-fd text-[11px] leading-tight">
          <span className="text-[color:var(--fd-green)]">HR {hr}</span>
          <span className="text-[color:var(--fd-cyan)]">SpO₂ {spo2}%</span>
        </div>
      </div>
    </div>
  )
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>
}
