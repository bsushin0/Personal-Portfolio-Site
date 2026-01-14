"use client"

import { useEffect, useRef, useState } from "react"

interface ExpressionState {
  happiness: number
  surprise: number
  lookingAt: "center" | "left" | "right" | "up" | "down"
  blink: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export default function AiAvatar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const leftPupilRef = useRef<HTMLDivElement>(null)
  const rightPupilRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [expression, setExpression] = useState<ExpressionState>({
    happiness: 0.5,
    surprise: 0,
    lookingAt: "center",
    blink: false,
  })
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const particleIdRef = useRef(0)

  // Blink animation
  useEffect(() => {
    blinkIntervalRef.current = setInterval(() => {
      setExpression(prev => ({ ...prev, blink: true }))
      setTimeout(() => {
        setExpression(prev => ({ ...prev, blink: false }))
      }, 150)
    }, 4000 + Math.random() * 2000)

    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)
    }
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setExpression(prev => ({ ...prev, surprise: 0 }))
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Eye tracking and emotion
  useEffect(() => {
    if (!avatarRef.current || !leftPupilRef.current || !rightPupilRef.current)
      return

    const avatarRect = avatarRef.current.getBoundingClientRect()
    const avatarCenterX = avatarRect.left + avatarRect.width / 2
    const avatarCenterY = avatarRect.top + avatarRect.height / 2

    const dx = mousePosition.x - avatarCenterX
    const dy = mousePosition.y - avatarCenterY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)

    // Emotion based on proximity
    let happiness = 0.5
    let lookingAt: ExpressionState["lookingAt"] = "center"

    if (distance < 500) {
      happiness = Math.min(1, 0.5 + (500 - distance) / 1000)

      const angleDeg = (angle * 180) / Math.PI
      if (angleDeg > -45 && angleDeg < 45) lookingAt = "right"
      else if (angleDeg >= 45 && angleDeg < 135) lookingAt = "down"
      else if (angleDeg >= 135 || angleDeg < -135) lookingAt = "left"
      else lookingAt = "up"
    }

    setExpression(prev => ({
      ...prev,
      happiness,
      lookingAt,
    }))

    // Eye movement
    const maxEyeMovement = 8
    const eyeX = Math.cos(angle) * maxEyeMovement
    const eyeY = Math.sin(angle) * maxEyeMovement

    leftPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
    rightPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
  }, [mousePosition])

  // Click handler
  const handleClick = () => {
    setExpression(prev => ({ ...prev, surprise: 1 }))
    createParticles()
    setTimeout(() => {
      setExpression(prev => ({ ...prev, surprise: 0 }))
    }, 300)
  }

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (avatarRef.current) {
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      setExpression(prev => ({ ...prev, surprise: 0.5 }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
    setExpression(prev => ({ ...prev, surprise: 0 }))
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - dragStartRef.current.x) * 0.3
      const offsetY = (e.clientY - dragStartRef.current.y) * 0.3
      setDragOffset({
        x: Math.max(-30, Math.min(30, offsetX)),
        y: Math.max(-30, Math.min(30, offsetY)),
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Particle creation
  const createParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const velocity = 3 + Math.random() * 2
      newParticles.push({
        id: particleIdRef.current++,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
      })
    }
    setParticles(newParticles)
  }

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            life: p.life - 0.05,
          }))
          .filter(p => p.life > 0)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [particles.length])

  const smileCurve = expression.happiness * 25
  const mouthY = expression.surprise * 5

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-sm"
            style={{
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              opacity: p.life,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Main Avatar Container */}
      <div
        ref={avatarRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`relative cursor-pointer transition-all duration-200 select-none ${
          isDragging ? "scale-105" : "scale-100"
        }`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${
            isDragging ? "scale(1.05)" : "scale(1)"
          }`,
        }}
      >
        {/* Face background */}
        <div
          className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full transition-all duration-300 ${
            isHovering
              ? "bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30"
              : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-500/20 shadow-lg shadow-slate-500/10"
          }`}
        >
          {/* Inner face glow */}
          <div
            className={`absolute inset-2 rounded-full bg-gradient-to-br from-transparent via-transparent to-emerald-500/5 transition-opacity duration-300 ${
              isHovering ? "opacity-100" : "opacity-50"
            }`}
          />

          {/* Face content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyebrows */}
            <div className="absolute top-20 flex space-x-16">
              {/* Left eyebrow */}
              <svg
                width="40"
                height="12"
                viewBox="0 0 40 12"
                className="transition-all duration-200"
                style={{
                  transform:
                    expression.surprise > 0.3
                      ? "rotate(-15deg)"
                      : expression.happiness > 0.7
                        ? "rotate(10deg)"
                        : "rotate(0deg)",
                }}
              >
                <path
                  d="M 5 8 Q 20 2 35 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className="text-slate-700 dark:text-slate-300"
                />
              </svg>

              {/* Right eyebrow */}
              <svg
                width="40"
                height="12"
                viewBox="0 0 40 12"
                className="transition-all duration-200"
                style={{
                  transform:
                    expression.surprise > 0.3
                      ? "rotate(15deg)"
                      : expression.happiness > 0.7
                        ? "rotate(-10deg)"
                        : "rotate(0deg)",
                }}
              >
                <path
                  d="M 5 8 Q 20 2 35 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className="text-slate-700 dark:text-slate-300"
                />
              </svg>
            </div>

            {/* Eyes container */}
            <div className="flex space-x-16 mb-6 mt-4">
              {/* Left eye */}
              <div
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-700 dark:to-emerald-800 flex items-center justify-center shadow-inner transition-all duration-200 overflow-hidden ${
                  expression.blink ? "scale-y-0" : "scale-y-100"
                }`}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:to-emerald-700" />
                <div
                  ref={leftPupilRef}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 shadow-md transition-transform duration-100"
                >
                  {/* Iris detail */}
                  <div className="absolute inset-1 rounded-full bg-emerald-700 dark:bg-emerald-300 opacity-40" />
                  {/* Shine effect */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white rounded-full opacity-80 blur-[0.5px]" />
                </div>
              </div>

              {/* Right eye */}
              <div
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-700 dark:to-emerald-800 flex items-center justify-center shadow-inner transition-all duration-200 overflow-hidden ${
                  expression.blink ? "scale-y-0" : "scale-y-100"
                }`}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600 dark:to-emerald-700" />
                <div
                  ref={rightPupilRef}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 shadow-md transition-transform duration-100"
                >
                  {/* Iris detail */}
                  <div className="absolute inset-1 rounded-full bg-emerald-700 dark:bg-emerald-300 opacity-40" />
                  {/* Shine effect */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white rounded-full opacity-80 blur-[0.5px]" />
                </div>
              </div>
            </div>

            {/* Mouth */}
            <div className="relative mt-8 w-40 h-20 flex items-center justify-center">
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                className="transition-all duration-200"
              >
                {/* Mouth outline */}
                <path
                  d={`M 25 45 Q 60 ${45 - smileCurve - mouthY} 95 45`}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className={`transition-colors duration-200 ${
                    expression.happiness > 0.7
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                />

                {/* Mouth fill (inner) */}
                {expression.happiness > 0.5 && (
                  <path
                    d={`M 25 45 Q 60 ${45 - smileCurve * 0.6 - mouthY} 95 45 Q 60 ${48 - mouthY} 25 45`}
                    fill="currentColor"
                    className={`transition-colors duration-200 ${
                      expression.happiness > 0.7
                        ? "text-emerald-500/15 dark:text-emerald-400/15"
                        : "text-slate-400/10 dark:text-slate-400/10"
                    }`}
                  />
                )}

                {/* Surprised/concerned mouth (inverted arc) */}
                {expression.surprise > 0.3 && (
                  <circle
                    cx="60"
                    cy={42 + expression.surprise * 3}
                    r={5 + expression.surprise * 3}
                    fill="currentColor"
                    className="text-slate-600/30 dark:text-slate-400/30 transition-all duration-200"
                  />
                )}
              </svg>
            </div>

            {/* Accent glow when dragging */}
            {isDragging && (
              <div className="absolute bottom-8 w-20 h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full blur-lg opacity-60 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
