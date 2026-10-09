"use client"

import { useEffect, useRef } from "react"

// Small plane that replaces the pointer on fine-pointer devices and turns to
// face its direction of travel. Text fields keep the normal I-beam.
export default function PlaneCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    root.classList.add("fd-plane-cursor")

    let x = -100
    let y = -100
    let px = x
    let py = y
    let heading = -45
    let raf = 0
    let visible = false

    const render = () => {
      raf = 0
      const dx = x - px
      const dy = y - py
      if (dx * dx + dy * dy > 6) {
        const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        let diff = ((target - heading + 540) % 360) - 180
        if (Math.abs(diff) > 120) diff *= 0.35
        heading += diff * 0.35
        px = x
        py = y
      }
      el.style.transform = `translate(${x - 11}px, ${y - 11}px) rotate(${heading}deg)`
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        el.style.opacity = "1"
      }
      const t = e.target as Element | null
      const overText = !!t?.closest?.("input, textarea, select, iframe, [contenteditable='true']")
      el.style.visibility = overText ? "hidden" : "visible"
      el.dataset.hot = t?.closest?.("a, button, [role='button'], [role='tab'], [role='listitem'], tr[tabindex]") ? "1" : "0"
      if (!raf) raf = requestAnimationFrame(render)
    }
    const onLeave = () => {
      visible = false
      el.style.opacity = "0"
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)
    return () => {
      root.classList.remove("fd-plane-cursor")
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[22px] w-[22px] opacity-0 [&[data-hot='1']>svg]:scale-125 [&[data-hot='1']>svg]:text-[color:var(--fd-magenta)]"
      style={{ willChange: "transform" }}
    >
      <svg viewBox="0 0 24 24" className="h-full w-full text-[color:var(--fd-text)] transition-transform" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}>
        <path fill="currentColor" stroke="#05070d" strokeWidth="0.8" d="M12 1.5c.8 0 1.4.7 1.4 1.6V9l8.1 5v2.1l-8.1-2.4v5.1l2.3 1.7V22L12 21l-3.7 1v-1.5l2.3-1.7v-5.1l-8.1 2.4V14l8.1-5V3.1c0-.9.6-1.6 1.4-1.6z" />
      </svg>
    </div>
  )
}
