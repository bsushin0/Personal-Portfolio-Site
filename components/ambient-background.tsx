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
  // per-particle noise parameters for organic drift
  noiseFreqX: number
  noiseFreqY: number
  noisePhaseX: number
  noisePhaseY: number
  // soft wrap: delay counter before reversing when past edge
  edgeDelayX: number
  edgeDelayY: number
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
  // second independent noise axis for organic path variety
  noiseFreqX: number
  noiseFreqY: number
  noisePhaseX: number
  noisePhaseY: number
  // soft wrap state
  edgeDelayX: number
  edgeDelayY: number
}

// ── Personality animation types ─────────────────────────────────────────────

interface ShootingStar {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  length: number
  life: number
  maxLife: number
  hue: number
}

interface OrbPulse {
  active: boolean
  orbIndex: number
  progress: number // 0→1
}

interface ConstellationEffect {
  active: boolean
  indices: number[] // indices into particles array
  progress: number // 0→1
}

interface RippleEffect {
  active: boolean
  x: number
  y: number
  progress: number // 0→1
}

interface ColorShift {
  active: boolean
  progress: number // 0→1
  fromHue: number
  toHue: number
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Returns true when the site is in light mode (no .dark class on <html>)
    const isLightMode = () => !document.documentElement.classList.contains("dark")

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
        opacity: isLightMode()
          ? Math.random() * 0.45 + 0.45
          : Math.random() * 0.35 + 0.25,
        hue: hues[Math.floor(Math.random() * hues.length)],
        // randomised noise parameters so no two particles share a path
        noiseFreqX: 0.008 + Math.random() * 0.018,
        noiseFreqY: 0.006 + Math.random() * 0.016,
        noisePhaseX: Math.random() * Math.PI * 2,
        noisePhaseY: Math.random() * Math.PI * 2,
        edgeDelayX: 0,
        edgeDelayY: 0,
      }))

    // Soft drifting background orbs for depth
    const makeOrbs = (): Orb[] =>
      Array.from({ length: isMobile() ? 3 : 5 }, (_, i) => ({
        x: (width / 5) * (i + 0.5) + (Math.random() - 0.5) * 120,
        y: height * (0.2 + Math.random() * 0.65),
        radius: isMobile() ? 140 + Math.random() * 80 : 200 + Math.random() * 160,
        hue: hues[i % hues.length],
        saturation: isLightMode() ? 88 + Math.random() * 12 : 75 + Math.random() * 20,
        lightness: isLightMode() ? 44 + Math.random() * 8 : 58 + Math.random() * 10,
        opacity: isLightMode() ? 0.18 + Math.random() * 0.12 : 0.055 + Math.random() * 0.045,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.004 + Math.random() * 0.004,
        // independent noise axes per orb
        noiseFreqX: 0.003 + Math.random() * 0.005,
        noiseFreqY: 0.002 + Math.random() * 0.004,
        noisePhaseX: Math.random() * Math.PI * 2,
        noisePhaseY: Math.random() * Math.PI * 2,
        edgeDelayX: 0,
        edgeDelayY: 0,
      }))

    let particles = makeParticles(particleCount)
    let orbs = makeOrbs()
    let rafId: number
    let frame = 0

    // ── Personality animation state ────────────────────────────────────────

    const shootingStar: ShootingStar = {
      active: false, x: 0, y: 0, vx: 0, vy: 0, length: 0, life: 0, maxLife: 1, hue: 188,
    }
    const orbPulse: OrbPulse = { active: false, orbIndex: 0, progress: 0 }
    const constellation: ConstellationEffect = { active: false, indices: [], progress: 0 }
    const ripple: RippleEffect = { active: false, x: 0, y: 0, progress: 0 }
    const colorShift: ColorShift = { active: false, progress: 0, fromHue: 239, toHue: 188 }

    // Personality animations fire if reduced motion is NOT preferred
    let personalityTimer: ReturnType<typeof setTimeout> | null = null

    const scheduleNextPersonality = () => {
      if (prefersReduced) return
      const delay = (8 + Math.random() * 12) * 1000 // 8–20s
      personalityTimer = setTimeout(triggerPersonalityEffect, delay)
    }

    const triggerPersonalityEffect = () => {
      // Pick one of 5 effects, weighted
      const roll = Math.random()
      if (roll < 0.25) {
        triggerShootingStar()
      } else if (roll < 0.45) {
        triggerOrbPulse()
      } else if (roll < 0.62) {
        triggerConstellation()
      } else if (roll < 0.80) {
        triggerRipple()
      } else {
        triggerColorShift()
      }
      scheduleNextPersonality()
    }

    const triggerShootingStar = () => {
      if (shootingStar.active) return
      // Spawn from a random top/left edge heading diagonally
      const fromLeft = Math.random() > 0.5
      shootingStar.x = fromLeft ? -30 : width + 30
      shootingStar.y = Math.random() * height * 0.6
      const speed = 10 + Math.random() * 6
      const angle = fromLeft
        ? (Math.PI / 6) + Math.random() * (Math.PI / 8)  // ~30–52° downward
        : Math.PI - (Math.PI / 6) - Math.random() * (Math.PI / 8)
      shootingStar.vx = Math.cos(angle) * speed * (fromLeft ? 1 : -1)
      shootingStar.vy = Math.sin(Math.abs(angle)) * speed
      shootingStar.length = 120 + Math.random() * 80
      shootingStar.life = 0
      shootingStar.maxLife = 55 + Math.random() * 20
      shootingStar.hue = hues[Math.floor(Math.random() * hues.length)]
      shootingStar.active = true
    }

    const triggerOrbPulse = () => {
      if (orbPulse.active || orbs.length === 0) return
      orbPulse.orbIndex = Math.floor(Math.random() * orbs.length)
      orbPulse.progress = 0
      orbPulse.active = true
    }

    const triggerConstellation = () => {
      if (constellation.active || particles.length < 6) return
      // Pick 5–8 nearby particles that will briefly connect
      const count = 5 + Math.floor(Math.random() * 4)
      // Pick a random seed particle and find nearest ones
      const seed = Math.floor(Math.random() * particles.length)
      const sp = particles[seed]
      const sorted = particles
        .map((p, i) => ({ i, d: Math.hypot(p.x - sp.x, p.y - sp.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, count)
        .map((x) => x.i)
      constellation.indices = sorted
      constellation.progress = 0
      constellation.active = true
    }

    const triggerRipple = () => {
      if (ripple.active) return
      ripple.x = width * (0.2 + Math.random() * 0.6)
      ripple.y = height * (0.2 + Math.random() * 0.6)
      ripple.progress = 0
      ripple.active = true
    }

    const triggerColorShift = () => {
      if (colorShift.active) return
      const from = hues[Math.floor(Math.random() * hues.length)]
      const options = hues.filter((h) => h !== from)
      colorShift.fromHue = from
      colorShift.toHue = options[Math.floor(Math.random() * options.length)]
      colorShift.progress = 0
      colorShift.active = true
    }

    // ── Personality draw helpers ───────────────────────────────────────────

    const drawShootingStar = () => {
      if (!shootingStar.active) return
      const { x, y, vx, vy, length, life, maxLife, hue } = shootingStar
      const t = life / maxLife
      const fade = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1
      const tailX = x - (vx / Math.hypot(vx, vy)) * length * fade
      const tailY = y - (vy / Math.hypot(vx, vy)) * length * fade

      const grad = ctx.createLinearGradient(tailX, tailY, x, y)
      grad.addColorStop(0, `hsl(${hue} 100% 70% / 0)`)
      grad.addColorStop(0.6, `hsl(${hue} 100% 80% / ${0.55 * fade})`)
      grad.addColorStop(1, `hsl(${hue} 100% 95% / ${0.9 * fade})`)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = grad
      ctx.lineWidth = 2.2
      ctx.lineCap = "round"
      ctx.stroke()
      // Head sparkle
      ctx.beginPath()
      ctx.arc(x, y, 3 * fade, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${hue} 100% 95% / ${0.8 * fade})`
      ctx.fill()
      ctx.restore()

      // Advance
      shootingStar.x += vx
      shootingStar.y += vy
      shootingStar.life++
      if (shootingStar.life >= shootingStar.maxLife) shootingStar.active = false
    }

    const drawOrbPulse = () => {
      if (!orbPulse.active) return
      const orb = orbs[orbPulse.orbIndex]
      if (!orb) { orbPulse.active = false; return }

      const t = orbPulse.progress
      // 0→0.4 expand, 0.4→1 contract
      const pulse = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6
      const boost = 1 + pulse * 1.8
      const alpha = orb.opacity * boost

      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * boost)
      grad.addColorStop(0, `hsl(${orb.hue} ${orb.saturation}% ${orb.lightness}% / ${alpha})`)
      grad.addColorStop(0.5, `hsl(${orb.hue} ${orb.saturation}% ${orb.lightness}% / ${alpha * 0.4})`)
      grad.addColorStop(1, `hsl(${orb.hue} ${orb.saturation}% ${orb.lightness}% / 0)`)

      ctx.save()
      ctx.beginPath()
      ctx.arc(orb.x, orb.y, orb.radius * boost, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

      orbPulse.progress += 0.012
      if (orbPulse.progress >= 1) orbPulse.active = false
    }

    const drawConstellation = () => {
      if (!constellation.active) return
      const t = constellation.progress
      // Appear 0→0.3, hold 0.3→0.7, dissolve 0.7→1
      const alpha = t < 0.3 ? t / 0.3 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3

      const pts = constellation.indices.map((i) => particles[i])
      const lightness = isLightMode() ? 55 : 80

      ctx.save()
      // Draw constellation lines
      for (let a = 0; a < pts.length - 1; a++) {
        const pa = pts[a]
        const pb = pts[a + 1]
        if (!pa || !pb) continue
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `hsl(188 100% ${lightness}% / ${0.55 * alpha})`
        ctx.lineWidth = 1.4
        ctx.stroke()
      }
      // Highlight nodes
      for (const p of pts) {
        if (!p) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(188 100% ${lightness}% / ${0.7 * alpha})`
        ctx.fill()
      }
      ctx.restore()

      constellation.progress += 0.007
      if (constellation.progress >= 1) constellation.active = false
    }

    const drawRipple = () => {
      if (!ripple.active) return
      const t = ripple.progress
      const maxRadius = Math.min(width, height) * 0.35
      const radius = t * maxRadius
      const fade = 1 - t
      const lightness = isLightMode() ? 45 : 68

      ctx.save()
      for (let ring = 0; ring < 3; ring++) {
        const r = radius * (1 - ring * 0.2)
        const a = fade * (0.22 - ring * 0.06)
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, r, 0, Math.PI * 2)
        ctx.strokeStyle = `hsl(278 68% ${lightness}% / ${a})`
        ctx.lineWidth = 1.5 - ring * 0.3
        ctx.stroke()
      }
      ctx.restore()

      ripple.progress += 0.014
      if (ripple.progress >= 1) ripple.active = false
    }

    // Color shift renders as a full-canvas overlay wash — very subtle
    const drawColorShift = () => {
      if (!colorShift.active) return
      const t = colorShift.progress
      // Triangle wave: 0→0.5 in, 0.5→1 out
      const alpha = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5
      const smoothAlpha = alpha * alpha * (0.042 + (isLightMode() ? 0.012 : 0)) // very subtle

      ctx.save()
      ctx.fillStyle = `hsl(${colorShift.toHue} 80% 60% / ${smoothAlpha})`
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      colorShift.progress += 0.005
      if (colorShift.progress >= 1) colorShift.active = false
    }

    // ── Main draw loop ─────────────────────────────────────────────────────

    const draw = () => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw)
        return
      }

      frame++
      ctx.clearRect(0, 0, width, height)

      // Color shift wash (behind everything)
      drawColorShift()

      // ── Soft edge return helper ──────────────────────────────────────────
      // Once an element drifts ~10% past the viewport edge, we count down a
      // short delay (≈60 frames ≈ 1 s) then apply an exponentially eased
      // steering force that pushes it back — no instant snap.
      const EDGE_MARGIN = 0.10   // 10% of dimension past the viewport
      const EDGE_DELAY  = 60     // frames to wait before steering begins
      const STEER_STR   = 0.006  // steering acceleration (gentle)

      const softWrapX = (el: { x: number; vx: number; edgeDelayX: number }, dim: number) => {
        const margin = dim * EDGE_MARGIN
        const past = el.x < -margin ? -1 : el.x > dim + margin ? 1 : 0
        if (past !== 0) {
          el.edgeDelayX++
          if (el.edgeDelayX > EDGE_DELAY) {
            // eased pull back: stronger the further out it is
            const overshoot = past === -1 ? Math.abs(el.x + margin) : Math.abs(el.x - dim - margin)
            const ease = Math.min(1, overshoot / (dim * 0.15))
            el.vx -= past * STEER_STR * (1 + ease * 2)
          }
        } else {
          el.edgeDelayX = 0
        }
      }

      const softWrapY = (el: { y: number; vy: number; edgeDelayY: number }, dim: number) => {
        const margin = dim * EDGE_MARGIN
        const past = el.y < -margin ? -1 : el.y > dim + margin ? 1 : 0
        if (past !== 0) {
          el.edgeDelayY++
          if (el.edgeDelayY > EDGE_DELAY) {
            const overshoot = past === -1 ? Math.abs(el.y + margin) : Math.abs(el.y - dim - margin)
            const ease = Math.min(1, overshoot / (dim * 0.15))
            el.vy -= past * STEER_STR * (1 + ease * 2)
          }
        } else {
          el.edgeDelayY = 0
        }
      }

      // Draw soft orbs first (background layer)
      for (const orb of orbs) {
        orb.phase += orb.phaseSpeed
        // Two independent sin/cos waves per orb give a continuously varying,
        // non-repeating Lissajous-style path instead of a single sine loop.
        orb.noisePhaseX += orb.noiseFreqX
        orb.noisePhaseY += orb.noiseFreqY
        const noiseX = Math.sin(orb.noisePhaseX) * 0.22 + Math.cos(orb.noisePhaseX * 0.61) * 0.10
        const noiseY = Math.cos(orb.noisePhaseY) * 0.15 + Math.sin(orb.noisePhaseY * 0.73) * 0.08
        orb.x += orb.vx + noiseX
        orb.y += orb.vy + noiseY

        // Soft return instead of instant teleport
        softWrapX(orb, width)
        softWrapY(orb, height)

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

      // Orb pulse overlay (on top of base orb)
      drawOrbPulse()

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

        // Per-particle organic noise: two sin waves with unique freq/phase
        // so each particle traces its own continuously varying path.
        p.noisePhaseX += p.noiseFreqX
        p.noisePhaseY += p.noiseFreqY
        const pNoiseX = Math.sin(p.noisePhaseX) * 0.08 + Math.cos(p.noisePhaseX * 0.57) * 0.04
        const pNoiseY = Math.cos(p.noisePhaseY) * 0.06 + Math.sin(p.noisePhaseY * 0.71) * 0.03

        p.vx *= 0.983
        p.vy *= 0.983

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2.2) {
          p.vx = (p.vx / speed) * 2.2
          p.vy = (p.vy / speed) * 2.2
        }

        p.x += p.vx + pNoiseX
        p.y += p.vy + pNoiseY

        // Soft edge return instead of instant teleport
        softWrapX(p, width)
        softWrapY(p, height)

        // Subtle opacity pulse per particle
        const pulsedOpacity = p.opacity * (0.8 + 0.2 * Math.sin(frame * 0.02 + i))
        const lightness = isLightMode() ? 42 : 67
        const lineAlphaScale = isLightMode() ? 1.8 : 1.0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${p.hue} 84% ${lightness}% / ${pulsedOpacity})`
        ctx.fill()

        // Connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const cx = p.x - q.x
          const cy = p.y - q.y
          const d = Math.sqrt(cx * cx + cy * cy)

          if (d < 130) {
            const alpha = (1 - d / 130) * 0.32 * lineAlphaScale
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `hsl(${p.hue} 84% ${lightness}% / ${alpha})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      // Personality effects (on top of particles)
      drawConstellation()
      drawRipple()
      drawShootingStar()

      rafId = requestAnimationFrame(draw)
    }

    if (prefersReduced) {
      const lightness = isLightMode() ? 42 : 67
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${p.hue} 84% ${lightness}% / ${p.opacity * 0.6})`
        ctx.fill()
      }
    } else {
      draw()
      // Kick off the personality animation schedule
      scheduleNextPersonality()
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

    // Re-initialise particles/orbs when the theme class changes (dark ↔ light toggle)
    const themeObserver = new MutationObserver(() => {
      particles = makeParticles(particleCount)
      orbs = makeOrbs()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      themeObserver.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (personalityTimer) clearTimeout(personalityTimer)
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
