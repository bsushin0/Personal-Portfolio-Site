"use client"

import { useEffect, useRef, useState } from "react"

interface ExpressionState {
  energy: number
  surprise: number
  lookingAt: "center" | "left" | "right" | "up" | "down"
  blink: boolean
  bounce: number
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
    energy: 0.8,
    surprise: 0,
    lookingAt: "center",
    blink: false,
    bounce: 0,
  })
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const particleIdRef = useRef(0)
  const bounceIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Idle bounce animation
  useEffect(() => {
    bounceIntervalRef.current = setInterval(() => {
      setExpression(prev => ({
        ...prev,
        bounce: Math.sin(Date.now() / 300) * 0.3,
      }))
    }, 30)

    return () => {
      if (bounceIntervalRef.current) clearInterval(bounceIntervalRef.current)
    }
  }, [])

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

    // Always high energy! Track looking direction
    let lookingAt: ExpressionState["lookingAt"] = "center"

    if (distance < 500) {
      const angleDeg = (angle * 180) / Math.PI
      if (angleDeg > -45 && angleDeg < 45) lookingAt = "right"
      else if (angleDeg >= 45 && angleDeg < 135) lookingAt = "down"
      else if (angleDeg >= 135 || angleDeg < -135) lookingAt = "left"
      else lookingAt = "up"
    }

    setExpression(prev => ({
      ...prev,
      lookingAt,
      energy: Math.min(1, 0.8 + (distance < 400 ? 0.2 : 0)),
    }))

    // Eye movement
    const maxEyeMovement = 12
    const eyeX = Math.cos(angle) * maxEyeMovement
    const eyeY = Math.sin(angle) * maxEyeMovement

    leftPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
    rightPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
  }, [mousePosition])

  // Click handler - big celebration
  const handleClick = () => {
    setExpression(prev => ({ ...prev, surprise: 1, energy: 1 }))
    createParticles()
    createParticles()
    setTimeout(() => {
      setExpression(prev => ({ ...prev, surprise: 0, energy: 0.8 }))
    }, 400)
  }

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (avatarRef.current) {
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      setExpression(prev => ({ ...prev, surprise: 0.6, energy: 1 }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
    setExpression(prev => ({ ...prev, surprise: 0, energy: 0.8 }))
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
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const velocity = 2 + Math.random() * 4
      newParticles.push({
        id: particleIdRef.current++,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
      })
    }
    setParticles(prev => [...prev, ...newParticles])
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
            vy: p.vy + 0.08,
            life: p.life - 0.04,
          }))
          .filter(p => p.life > 0)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [particles.length])

  const smileCurve = 30 + expression.energy * 10
  const mouthY = expression.surprise * 8
  const eyeScale = 0.95 + expression.energy * 0.1

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-400 rounded-full blur-sm"
            style={{
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              opacity: p.life * 0.8,
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
          transform: `translate(${dragOffset.x}px, ${dragOffset.y + expression.bounce * 5}px) ${
            isDragging ? "scale(1.08)" : "scale(1)"
          }`,
        }}
      >
        {/* Aura/Energy glow */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-200 pointer-events-none ${
            isHovering || isDragging ? "opacity-70" : "opacity-50"
          }`}
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, ${0.3 + expression.energy * 0.2}), transparent)`,
            transform: `scale(${1 + expression.energy * 0.1})`,
          }}
        />

        {/* Face background */}
        <div
          className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full transition-all duration-300 overflow-hidden ${
            isHovering || isDragging
              ? "bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 border-3 border-yellow-400 shadow-2xl shadow-yellow-400/50"
              : "bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 dark:from-blue-700 dark:via-cyan-700 dark:to-purple-700 border-3 border-cyan-400 shadow-xl shadow-cyan-500/30"
          }`}
        >
          {/* Inner animated glow */}
          <div
            className={`absolute inset-2 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent transition-all duration-300 animate-pulse`}
            style={{
              opacity: 0.4 + expression.energy * 0.3,
            }}
          />

          {/* Face content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyebrows - super expressive */}
            <div className="absolute top-20 flex space-x-16">
              {/* Left eyebrow */}
              <svg
                width="40"
                height="12"
                viewBox="0 0 40 12"
                className="transition-all duration-200"
                style={{
                  transform:
                    expression.surprise > 0.4
                      ? "rotate(-20deg) scale(1.1)"
                      : expression.energy > 0.7
                        ? "rotate(15deg) scale(1.05)"
                        : "rotate(5deg)",
                }}
              >
                <path
                  d="M 5 8 Q 20 2 35 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-slate-800 dark:text-slate-100 drop-shadow"
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
                    expression.surprise > 0.4
                      ? "rotate(20deg) scale(1.1)"
                      : expression.energy > 0.7
                        ? "rotate(-15deg) scale(1.05)"
                        : "rotate(-5deg)",
                }}
              >
                <path
                  d="M 5 8 Q 20 2 35 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-slate-800 dark:text-slate-100 drop-shadow"
                />
              </svg>
            </div>

            {/* Eyes container */}
            <div className="flex space-x-16 mb-6 mt-4">
              {/* Left eye */}
              <div
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-white to-blue-100 dark:from-blue-200 dark:to-blue-300 flex items-center justify-center shadow-inner transition-all duration-200 overflow-hidden ${
                  expression.blink ? "scale-y-0" : "scale-y-100"
                }`}
                style={{
                  boxShadow: `0 0 15px rgba(59, 130, 246, ${0.3 + expression.energy * 0.3})`,
                }}
              >
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-300 dark:to-cyan-300" />
                <div
                  ref={leftPupilRef}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 shadow-md transition-transform duration-100"
                  style={{
                    transform: `scale(${eyeScale})`,
                  }}
                >
                  {/* Iris detail */}
                  <div className="absolute inset-1 rounded-full bg-slate-700 dark:bg-slate-300 opacity-50" />
                  {/* Shine effect */}
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full opacity-90 blur-[0.5px]" />
                </div>
              </div>

              {/* Right eye */}
              <div
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-white to-blue-100 dark:from-blue-200 dark:to-blue-300 flex items-center justify-center shadow-inner transition-all duration-200 overflow-hidden ${
                  expression.blink ? "scale-y-0" : "scale-y-100"
                }`}
                style={{
                  boxShadow: `0 0 15px rgba(59, 130, 246, ${0.3 + expression.energy * 0.3})`,
                }}
              >
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-300 dark:to-cyan-300" />
                <div
                  ref={rightPupilRef}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 shadow-md transition-transform duration-100"
                  style={{
                    transform: `scale(${eyeScale})`,
                  }}
                >
                  {/* Iris detail */}
                  <div className="absolute inset-1 rounded-full bg-slate-700 dark:bg-slate-300 opacity-50" />
                  {/* Shine effect */}
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full opacity-90 blur-[0.5px]" />
                </div>
              </div>
            </div>

            {/* Blush - appears when happy */}
            {expression.energy > 0.6 && (
              <>
                <div className="absolute top-32 left-12 w-8 h-6 bg-pink-400/30 rounded-full blur-xl transition-opacity duration-300" />
                <div className="absolute top-32 right-12 w-8 h-6 bg-pink-400/30 rounded-full blur-xl transition-opacity duration-300" />
              </>
            )}

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
                  d={`M 20 45 Q 60 ${45 - smileCurve - mouthY} 100 45`}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-rose-500 dark:text-rose-400 drop-shadow"
                />

                {/* Mouth fill (inner) */}
                <path
                  d={`M 20 45 Q 60 ${45 - smileCurve * 0.5 - mouthY} 100 45 Q 60 ${50 - mouthY} 20 45`}
                  fill="currentColor"
                  className="text-rose-300/30 dark:text-rose-300/40 transition-colors duration-200"
                />

                {/* Surprised/excited mouth (grows bigger) */}
                {expression.surprise > 0.3 && (
                  <circle
                    cx="60"
                    cy={42 + expression.surprise * 4}
                    r={6 + expression.surprise * 4}
                    fill="currentColor"
                    className="text-rose-400/50 dark:text-rose-300/50 transition-all duration-200"
                  />
                )}
              </svg>
            </div>

            {/* Energy star twinkles when hovering */}
            {(isHovering || isDragging) && (
              <>
                <div className="absolute -top-8 left-10 text-2xl animate-bounce" style={{ animationDelay: "0s" }}>
                  ✨
                </div>
                <div className="absolute -top-4 right-8 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                  ⭐
                </div>
                <div className="absolute -bottom-6 -left-4 text-2xl animate-bounce" style={{ animationDelay: "0.1s" }}>
                  💫
                </div>
              </>
            )}

            {/* Accent glow when dragging */}
            {isDragging && (
              <div className="absolute bottom-8 w-24 h-3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full blur-lg opacity-80 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
