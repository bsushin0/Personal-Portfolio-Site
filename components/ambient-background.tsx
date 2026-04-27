"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  hue: number
}

interface Orb {
  x: number
  y: number
  radius: number
  hue: number
  saturation: number
  lightness: number
  opacity: number
  vx: number
  vy: number
  phase: number
  phaseSpeed: number
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const isMobile = () => window.innerWidth < 768
    let particleCount = isMobile() ? 40 : 90

    let mouseX = -9999
    let mouseY = -9999

    // Hue variants: indigo (239), cyan (188), purple (278)
    const hues = [239, 188, 278]

    const makeParticles = (count: number): Particle[] =>
      Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.35 + 0.25,
        hue: hues[Math.floor(Math.random() * hues.length)],
      }))

    // Soft drifting background orbs for depth
    const makeOrbs = (): Orb[] =>
      Array.from({ length: isMobile() ? 3 : 5 }, (_, i) => ({
        x: (width / 5) * (i + 0.5) + (Math.random() - 0.5) * 120,
        y: height * (0.2 + Math.random() * 0.65),
        radius: isMobile() ? 140 + Math.random() * 80 : 200 + Math.random() * 160,
        hue: hues[i % hues.length],
        saturation: 75 + Math.random() * 20,
        lightness: 58 + Math.random() * 10,
        opacity: 0.055 + Math.random() * 0.045,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.004 + Math.random() * 0.004,
      }))

    let particles = makeParticles(particleCount)
    let orbs = makeOrbs()
    let rafId: number
    let frame = 0

    const draw = () => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw)
        return
      }

      frame++
      ctx.clearRect(0, 0, width, height)

      // Draw soft orbs first (background layer)
      for (const orb of orbs) {
        orb.phase += orb.phaseSpeed
        orb.x += orb.vx + Math.sin(orb.phase * 0.7) * 0.18
        orb.y += orb.vy + Math.cos(orb.phase * 0.5) * 0.12

        // Soft boundary bounce
        if (orb.x < -orb.radius) orb.x = width + orb.radius
        if (orb.x > width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = height + orb.radius
        if (orb.y > height + orb.radius) orb.y = -orb.radius

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
        const pulsedOpacity = orb.opacity * (0.85 + 0.15 * Math.sin(orb.phase))
        grad.addColorStop(0, `hsl(${orb.hue} ${orb.saturation}% ${orb.lightness}% / ${pulsedOpacity})`)
        grad.addColorStop(0.5, `hsl(${orb.hue} ${orb.saturation}% ${orb.lightness}% / ${pulsedOpacity * 0.4})`)
        grad.addColorStop(1, `hsl(${orb.hue} ${orb.saturation}% ${orb.lightness}% / 0)`)
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120 && dist > 0) {
          const force = ((120 - dist) / 120) * 0.9
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        p.vx *= 0.983
        p.vy *= 0.983

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2.2) {
          p.vx = (p.vx / speed) * 2.2
          p.vy = (p.vy / speed) * 2.2
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Subtle opacity pulse per particle
        const pulsedOpacity = p.opacity * (0.8 + 0.2 * Math.sin(frame * 0.02 + i))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${p.hue} 84% 67% / ${pulsedOpacity})`
        ctx.fill()

        // Connection lines — increased range and alpha
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const cx = p.x - q.x
          const cy = p.y - q.y
          const d = Math.sqrt(cx * cx + cy * cy)

          if (d < 130) {
            const alpha = (1 - d / 130) * 0.32
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `hsl(${p.hue} 84% 67% / ${alpha})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    if (prefersReduced) {
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${p.hue} 84% 67% / ${p.opacity * 0.6})`
        ctx.fill()
      }
    } else {
      draw()
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      const newCount = isMobile() ? 40 : 90
      if (newCount !== particleCount) {
        particleCount = newCount
        particles = makeParticles(particleCount)
      }
      orbs = makeOrbs()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, willChange: "transform" }}
      aria-hidden="true"
    />
  )
}
