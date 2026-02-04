"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface ExpressionState {
  energy: number
  surprise: number
  lookingAt: "center" | "left" | "right" | "up" | "down"
  blink: boolean
  bounce: number
  emotion: "neutral" | "excited" | "thinking" | "confused" | "happy" | "focused"
  mouthOpen: number
  eyeScale: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  type: "spark" | "glow" | "trail"
  color: string
}

interface TouchPoint {
  x: number
  y: number
  time: number
}

export default function AiAvatar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const leftPupilRef = useRef<HTMLDivElement>(null)
  const rightPupilRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const particleIdRef = useRef(0)
  const touchRef = useRef<TouchPoint | null>(null)
  const velocityRef = useRef({ x: 0, y: 0 })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [expression, setExpression] = useState<ExpressionState>({
    energy: 0.8,
    surprise: 0,
    lookingAt: "center",
    blink: false,
    bounce: 0,
    emotion: "neutral",
    mouthOpen: 0,
    eyeScale: 1,
  })
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [isKeyboardInteracting, setIsKeyboardInteracting] = useState(false)
  const [focusEnergy, setFocusEnergy] = useState(0)

  // Placeholder particle generator to prevent runtime errors in production
  const createParticles = useCallback(() => {
    // Particle visuals are currently disabled; keep no-op to avoid reference errors
  }, [])

  // Optimized animation loop with requestAnimationFrame
  useEffect(() => {
    let startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      
      // Smooth bounce animation
      setExpression((prev: ExpressionState) => ({
        ...prev,
        bounce: Math.sin(elapsed / 300) * 0.3,
      }))

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Blink animation
  useEffect(() => {
    const scheduleBlink = () => {
      blinkTimeoutRef.current = setTimeout(() => {
        setExpression((prev: ExpressionState) => ({ ...prev, blink: true }))
        setTimeout(() => {
          setExpression((prev: ExpressionState) => ({ ...prev, blink: false }))
          scheduleBlink()
        }, 150)
      }, 4000 + Math.random() * 2000)
    }

    scheduleBlink()

    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
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
      setExpression((prev: ExpressionState) => ({ ...prev, surprise: 0 }))
    }

    window.addEventListener("mousemove", handleMouseMove as EventListener)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as EventListener)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Keyboard interaction - detect when user is typing/focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsKeyboardInteracting(true)
      setExpression((prev: ExpressionState) => ({
        ...prev,
        emotion: "focused",
        energy: Math.min(1, prev.energy + 0.1),
      }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setTimeout(() => setIsKeyboardInteracting(false), 1000)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Scroll detection
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null
    const handleScroll = () => {
      setExpression((prev: ExpressionState) => ({
        ...prev,
        emotion: "thinking",
        energy: Math.min(1, prev.energy + 0.15),
      }))

      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setExpression((prev: ExpressionState) => ({
          ...prev,
          emotion: "neutral",
        }))
      }, 1500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  // Touch support for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        setExpression((prev: ExpressionState) => ({
          ...prev,
          emotion: "excited",
          surprise: 0.7,
          energy: 1,
        }))
        createParticles()
      } else {
        touchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchRef.current) {
        const dx = e.touches[0].clientX - touchRef.current.x
        const dy = e.touches[0].clientY - touchRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 10) {
          setExpression((prev: ExpressionState) => ({
            ...prev,
            emotion: "happy",
            energy: Math.min(1, prev.energy + 0.05),
          }))
        }
      }
    }

    const handleTouchEnd = () => {
      touchRef.current = null
      setTimeout(() => {
        setExpression((prev: ExpressionState) => ({
          ...prev,
          emotion: "neutral",
          surprise: 0,
        }))
      }, 300)
    }

    window.addEventListener("touchstart", handleTouchStart as EventListener)
    window.addEventListener("touchmove", handleTouchMove as EventListener)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart as EventListener)
      window.removeEventListener("touchmove", handleTouchMove as EventListener)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [createParticles])

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

    setExpression((prev: ExpressionState) => ({
      ...prev,
      lookingAt,
      energy: Math.min(1, 0.8 + (distance < 400 ? 0.2 : 0)),
    }))

    // Eye movement
    const maxEyeMovement = 12
    const eyeX = Math.cos(angle) * maxEyeMovement
    const eyeY = Math.sin(angle) * maxEyeMovement

    if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
    if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
  }, [mousePosition])

  // Click handler - big celebration
  const handleClick = () => {
    setExpression((prev: ExpressionState) => ({ ...prev, surprise: 1, energy: 1 }))
    createParticles()
    createParticles()
    setTimeout(() => {
      setExpression((prev: ExpressionState) => ({ ...prev, surprise: 0, energy: 0.8 }))
    }, 400)
  }

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable drag on mobile devices
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return
    }
    if (avatarRef.current) {
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      setExpression((prev: ExpressionState) => ({ ...prev, surprise: 0.6, energy: 1 }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
    setExpression((prev: ExpressionState) => ({ ...prev, surprise: 0, energy: 0.8 }))
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

    window.addEventListener("mousemove", handleMouseMove as EventListener)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as EventListener)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles((prev: Particle[]) =>
        prev
          .map((p: Particle) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.08,
            life: p.life - 0.04,
          }))
          .filter((p: Particle) => p.life > 0)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [particles.length])

  const smileCurve = 30 + expression.energy * 10
  const mouthY = expression.surprise * 8
  const eyeScale = 0.95 + expression.energy * 0.1

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* SVG Filters for advanced effects */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glow-effect">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="intensity-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Particles - disabled */}
      {/* Removed particle rendering to clean up avatar face */}

      {/* Main Avatar Container */}
      <div
        ref={avatarRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`relative cursor-pointer transition-transform duration-150 select-none ${
          isDragging ? "scale-105" : "scale-100"
        }`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y + expression.bounce * 5}px) ${
            isDragging ? "scale(1.08)" : "scale(1)"
          }`,
        }}
      >
        {/* Enhanced Aura/Energy glow with multiple layers */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-150 pointer-events-none`}
          style={{
            background: `radial-gradient(circle, rgba(0, 193, 255, ${0.5 + expression.energy * 0.3}), rgba(157, 78, 221, ${0.25}), transparent)`,
            transform: `scale(${1.1 + expression.energy * 0.15})`,
          }}
        />

        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-150 pointer-events-none`}
          style={{
            background: `radial-gradient(circle, rgba(157, 78, 221, ${0.4 + expression.energy * 0.2}), transparent)`,
            transform: `scale(${1 + expression.energy * 0.1})`,
          }}
        />

        {/* Face background with dynamic gradient */}
        <div
          className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full transition-all duration-300 overflow-hidden border-4 shadow-2xl ${
            isHovering || isDragging
              ? "border-cyan-400 shadow-cyan-500/70 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-600 dark:via-blue-600 dark:to-purple-700"
              : "border-cyan-400 shadow-cyan-500/50 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 dark:from-cyan-500 dark:via-blue-500 dark:to-purple-600"
          }`}
          style={{
            filter: "drop-shadow(0 0 30px rgba(0, 193, 255, 0.5))",
          }}
        >
          {/* Inner animated glow layer */}
          <div
            className={`absolute inset-2 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent animate-pulse`}
            style={{
              opacity: 0.5 + expression.energy * 0.4,
              animation: `pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            }}
          />

          {/* Dynamic energy shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,${expression.energy * 0.15}), transparent)`,
              animation: `spin 8s linear infinite`,
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
                    expression.emotion === "excited"
                      ? "rotate(-25deg) scale(1.15)"
                      : expression.emotion === "thinking"
                        ? "rotate(10deg) scale(1.05)"
                        : expression.emotion === "confused"
                          ? "rotate(-5deg) skewX(-10deg)"
                          : expression.surprise > 0.4
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
                  className="text-primary/80 dark:text-primary/70 drop-shadow-lg"
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
                    expression.emotion === "excited"
                      ? "rotate(25deg) scale(1.15)"
                      : expression.emotion === "thinking"
                        ? "rotate(-10deg) scale(1.05)"
                        : expression.emotion === "confused"
                          ? "rotate(5deg) skewX(10deg)"
                          : expression.surprise > 0.4
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
                  className="text-primary/80 dark:text-primary/70 drop-shadow-lg"
                />
              </svg>
            </div>

            {/* Eyes container with enhanced styling */}
            <div className="flex space-x-16 mb-6 mt-4">
              {/* Left eye */}
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 overflow-hidden ${
                  expression.blink ? "scale-y-0" : "scale-y-100"
                }`}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(0, 193, 255, 0.6))",
                  boxShadow: `0 0 20px rgba(0, 193, 255, ${0.4 + expression.energy * 0.3}), inset 0 0 10px rgba(255,255,255,0.3)`,
                }}
              >
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-400 dark:to-blue-400" />
                <div
                  ref={leftPupilRef}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-950 to-slate-800 shadow-md transition-transform duration-100"
                  style={{
                    transform: `scale(${eyeScale})`,
                  }}
                >
                  <div className="absolute inset-1 rounded-full bg-slate-700 dark:bg-slate-300 opacity-60" />
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white rounded-full opacity-100 blur-[0.3px]" />
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-80" />
                </div>
              </div>

              {/* Right eye */}
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 overflow-hidden ${
                  expression.blink ? "scale-y-0" : "scale-y-100"
                }`}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(0, 193, 255, 0.6))",
                  boxShadow: `0 0 20px rgba(0, 193, 255, ${0.4 + expression.energy * 0.3}), inset 0 0 10px rgba(255,255,255,0.3)`,
                }}
              >
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-400 dark:to-blue-400" />
                <div
                  ref={rightPupilRef}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-950 to-slate-800 shadow-md transition-transform duration-100"
                  style={{
                    transform: `scale(${eyeScale})`,
                  }}
                >
                  <div className="absolute inset-1 rounded-full bg-slate-700 dark:bg-slate-300 opacity-60" />
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white rounded-full opacity-100 blur-[0.3px]" />
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-80" />
                </div>
              </div>
            </div>

            {/* Blush - appears with emotion */}
            {(expression.energy > 0.6 || expression.emotion === "happy") && (
              <>
                <div
                  className="absolute top-32 left-12 w-10 h-7 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full blur-2xl transition-all duration-300"
                  style={{
                    opacity: (expression.energy - 0.6) * 0.5 + (expression.emotion === "happy" ? 0.3 : 0),
                  }}
                />
                <div
                  className="absolute top-32 right-12 w-10 h-7 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full blur-2xl transition-all duration-300"
                  style={{
                    opacity: (expression.energy - 0.6) * 0.5 + (expression.emotion === "happy" ? 0.3 : 0),
                  }}
                />
              </>
            )}

            {/* Mouth */}
            <div className="relative mt-8 w-40 h-24 flex items-center justify-center">
              <svg
                width="120"
                height="80"
                viewBox="0 0 120 80"
                className="transition-all duration-200"
              >
                {/* Mouth outline */}
                <path
                  d={`M 20 45 Q 60 ${45 + smileCurve + mouthY} 100 45`}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary dark:text-primary/80 drop-shadow-lg transition-colors"
                  style={{
                    filter: expression.emotion === "focused" ? "brightness(1.2)" : "brightness(1)",
                  }}
                />

                {/* Mouth fill (inner) */}
                <path
                  d={`M 20 45 Q 60 ${45 + smileCurve * 0.5 + mouthY} 100 45 Q 60 ${50 + mouthY} 20 45`}
                  fill="currentColor"
                  className="text-primary/40 dark:text-primary/50 transition-colors duration-200"
                />

                {/* Tongue peek when thinking */}
                {expression.emotion === "thinking" && expression.energy > 0.6 && (
                  <ellipse
                    cx="60"
                    cy={50 + expression.energy * 2}
                    rx="5"
                    ry="6"
                    fill="currentColor"
                    className="text-purple-300 opacity-70 transition-all duration-200"
                  />
                )}
              </svg>
            </div>

            {/* Emotion indicators - more expressive */}
            {isHovering && expression.emotion !== "neutral" && (
              <>
                <div className="absolute -top-8 left-8 text-3xl animate-bounce" style={{ animationDelay: "0s" }}>
                  {expression.emotion === "excited" ? "🚀" : expression.emotion === "thinking" ? "💭" : expression.emotion === "focused" ? "⚡" : "✨"}
                </div>
              </>
            )}

            {isDragging && (
              <>
                <div className="absolute -top-4 right-6 text-2xl animate-bounce" style={{ animationDelay: "0.1s" }}>
                  ⭐
                </div>
                <div className="absolute -bottom-8 left-6 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                  💫
                </div>
              </>
            )}

            {/* Accent glow when dragging */}
            {isDragging && (
              <div className="absolute bottom-6 w-28 h-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full blur-lg opacity-90 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
