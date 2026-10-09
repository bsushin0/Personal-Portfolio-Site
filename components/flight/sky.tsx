"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFlight, type SkyPhase } from "@/context/flight-context"
import type { WxCondition } from "@/app/api/wx/route"

// Fixed sky behind the whole page. Colour follows the visitor's local time;
// clouds and precipitation follow their local weather. Scrolling sets --climb
// (0 → 1), which darkens the sky toward the upper atmosphere, brings out stars
// and drops the cloud deck below you.

const GRADIENTS: Record<SkyPhase, string> = {
  night: "linear-gradient(180deg, #02040a 0%, #050b1c 40%, #0b1a36 80%, #12264a 100%)",
  dawn: "linear-gradient(180deg, #0a1430 0%, #2c3466 38%, #8d5a7a 70%, #e39a6a 100%)",
  day: "linear-gradient(180deg, #0a3470 0%, #1b5698 45%, #3577b8 80%, #5591cb 100%)",
  dusk: "linear-gradient(180deg, #070b22 0%, #27265a 40%, #7a3f62 72%, #d9774e 100%)",
}

const CLOUDS: Record<WxCondition, number> = {
  clear: 2,
  cloudy: 6,
  overcast: 10,
  fog: 7,
  rain: 9,
  snow: 9,
  storm: 10,
}

function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export default function Sky() {
  const { wx, phase } = useFlight()
  const condition: WxCondition = wx?.condition ?? "clear"
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)

  // Scroll → --climb on <html>
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const update = () => {
      raf = 0
      const max = Math.max(1, root.scrollHeight - window.innerHeight)
      root.style.setProperty("--climb", Math.min(1, window.scrollY / max).toFixed(4))
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

  // Stars + precipitation on one canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const stars = Array.from({ length: 160 }, (_, i) => ({
      x: seeded(i),
      y: seeded(i + 500) * 0.85,
      r: 0.4 + seeded(i + 900) * 1.2,
      tw: seeded(i + 1300) * Math.PI * 2,
    }))
    const precip = condition === "rain" || condition === "storm" ? "rain" : condition === "snow" ? "snow" : null
    const drops = precip
      ? Array.from({ length: precip === "rain" ? 140 : 90 }, (_, i) => ({
          x: seeded(i + 2000),
          y: seeded(i + 3000),
          v: 0.6 + seeded(i + 4000) * 0.6,
        }))
      : []

    let raf = 0
    let last = performance.now()
    let nextFlash = performance.now() + 6000 + Math.random() * 8000
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const climb = Number(getComputedStyle(document.documentElement).getPropertyValue("--climb") || 0)
      ctx.clearRect(0, 0, w, h)

      const starAlpha = phase === "night" ? 0.9 : phase === "day" ? Math.max(0, climb - 0.55) * 1.6 : 0.25 + climb * 0.6
      if (starAlpha > 0.02) {
        for (const s of stars) {
          const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(now / 900 + s.tw)
          ctx.globalAlpha = Math.min(1, starAlpha * tw)
          ctx.fillStyle = "#e9f1ff"
          ctx.beginPath()
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Precipitation only while you're still below the cloud deck.
      const precipAlpha = Math.max(0, 1 - climb * 3)
      if (precip && precipAlpha > 0.02) {
        ctx.globalAlpha = precipAlpha * (precip === "rain" ? 0.45 : 0.8)
        ctx.strokeStyle = "#c9dcf5"
        ctx.fillStyle = "#f4f8ff"
        ctx.lineWidth = 1
        for (const d of drops) {
          if (!reduce) {
            d.y += d.v * dt * (precip === "rain" ? 1.6 : 0.18)
            if (precip === "snow") d.x += Math.sin(now / 1000 + d.v * 10) * 0.0004
            if (d.y > 1.02) {
              d.y = -0.02
              d.x = Math.random()
            }
          }
          const x = d.x * w
          const y = d.y * h
          if (precip === "rain") {
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x - 3, y + 14)
            ctx.stroke()
          } else {
            ctx.beginPath()
            ctx.arc(x, y, 1.6 * d.v, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.globalAlpha = 1

      if (condition === "storm" && !reduce && now > nextFlash && flashRef.current && precipAlpha > 0.2) {
        const el = flashRef.current
        el.style.opacity = "0.5"
        setTimeout(() => (el.style.opacity = "0"), 90)
        setTimeout(() => (el.style.opacity = "0.3"), 180)
        setTimeout(() => (el.style.opacity = "0"), 260)
        nextFlash = now + 7000 + Math.random() * 12000
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else if (!reduce) {
        last = performance.now()
        raf = requestAnimationFrame(draw)
      }
    }
    const onScroll = () => {
      if (reduce) requestAnimationFrame(draw)
    }
    document.addEventListener("visibilitychange", onVis)
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [condition, phase])

  const clouds = useMemo(() => {
    const n = CLOUDS[condition]
    return Array.from({ length: n }, (_, i) => ({
      top: 18 + seeded(i + 70) * 70,
      left: -20 + seeded(i + 80) * 110,
      w: 280 + seeded(i + 90) * 420,
      h: 70 + seeded(i + 100) * 90,
      dur: 90 + seeded(i + 110) * 120,
      delay: -seeded(i + 120) * 200,
      o: 0.35 + seeded(i + 130) * 0.4,
    }))
  }, [condition])

  const cloudTint = phase === "day" ? "255,255,255" : phase === "night" ? "120,135,170" : "235,190,190"
  const grey = condition === "overcast" || condition === "rain" || condition === "storm"

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: GRADIENTS[phase] }} />
      {/* Low ceilings grey the sky out */}
      {grey && <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(70,78,92,0.55), rgba(110,118,132,0.45))" }} />}
      {condition === "fog" && <div className="absolute inset-0" style={{ background: "rgba(150,160,175,0.3)" }} />}
      {/* Readability scrim once you leave the hero */}
      <div className="absolute inset-0" style={{ background: "rgba(4,8,18,0.42)", opacity: "min(1, calc(var(--climb, 0) * 9))" }} />
      {/* Upper atmosphere: darkens as you climb */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #01030a 0%, #040a1c 55%, #0a1834 100%)",
          opacity: "calc(var(--climb, 0) * 0.92)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Cloud deck: sinks below you as you climb */}
      <div className="absolute inset-0" style={{ transform: "translateY(calc(var(--climb, 0) * 110vh))", opacity: "calc(1 - var(--climb, 0) * 0.9)" }}>
        {clouds.map((c, i) => (
          <div
            key={i}
            className="absolute fd-cloud"
            style={{
              top: `${c.top}%`,
              left: `${c.left}%`,
              width: c.w,
              height: c.h,
              opacity: c.o * (grey ? 1 : 0.8),
              background: `radial-gradient(ellipse at 50% 60%, rgba(${grey ? "150,160,178" : cloudTint},0.55) 0%, rgba(${grey ? "150,160,178" : cloudTint},0.18) 45%, transparent 70%)`,
              filter: "blur(18px)",
              animation: `fd-drift ${c.dur}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
        {condition === "fog" && (
          <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(0deg, rgba(190,200,215,0.35), transparent)" }} />
        )}
      </div>
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" style={{ transition: "opacity 60ms" }} />
      <style>{`
        @keyframes fd-drift { from { transform: translateX(-10vw); } to { transform: translateX(30vw); } }
        @media (prefers-reduced-motion: reduce) { .fd-cloud { animation: none !important; } }
      `}</style>
    </div>
  )
}
