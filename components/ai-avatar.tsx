"use client"

import { useEffect, useRef, useState } from "react"

interface ExpressionState {
  happiness: number
  lookingAt: "center" | "left" | "right" | "up" | "down"
  blink: boolean
}

export default function AiAvatar() {
  const avatarRef = useRef<HTMLDivElement>(null)
  const leftEyeRef = useRef<HTMLDivElement>(null)
  const rightEyeRef = useRef<HTMLDivElement>(null)
  const leftPupilRef = useRef<HTMLDivElement>(null)
  const rightPupilRef = useRef<HTMLDivElement>(null)
  const mouthRef = useRef<SVGSVGElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [expression, setExpression] = useState<ExpressionState>({
    happiness: 0.5,
    lookingAt: "center",
    blink: false,
  })
  const [isHovering, setIsHovering] = useState(false)
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

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

    // Determine emotion based on cursor proximity
    let happiness = 0.5
    let lookingAt: ExpressionState["lookingAt"] = "center"

    if (distance < 500) {
      happiness = Math.min(1, 0.5 + (500 - distance) / 1000)

      // Determine gaze direction
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

    // Limit eye movement based on gaze
    const maxEyeMovement = 6
    const eyeX = Math.cos(angle) * maxEyeMovement
    const eyeY = Math.sin(angle) * maxEyeMovement

    leftPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
    rightPupilRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
  }, [mousePosition])

  const smileCurve = expression.happiness * 30

  return (
    <div
      ref={avatarRef}
      className={`relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 rounded-full mx-auto border-4 transition-all duration-300 ${
        isHovering
          ? "border-emerald-400 shadow-lg shadow-emerald-500/40"
          : "border-emerald-500/30 shadow-lg shadow-emerald-500/20"
      }`}
    >
      {/* Robot face elements */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes container */}
        <div className="flex space-x-12 mb-8">
          {/* Left eye */}
          <div
            ref={leftEyeRef}
            className={`relative w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center transition-all duration-200 overflow-hidden ${
              expression.blink ? "h-2" : ""
            }`}
          >
            <div
              ref={leftPupilRef}
              className="w-7 h-7 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-md shadow-emerald-500/60 transition-transform duration-100"
            >
              {/* Shine effect */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-70" />
            </div>
          </div>

          {/* Right eye */}
          <div
            ref={rightEyeRef}
            className={`relative w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center transition-all duration-200 overflow-hidden ${
              expression.blink ? "h-2" : ""
            }`}
          >
            <div
              ref={rightPupilRef}
              className="w-7 h-7 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-md shadow-emerald-500/60 transition-transform duration-100"
            >
              {/* Shine effect */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-70" />
            </div>
          </div>
        </div>

        {/* Mouth - Interactive Smile SVG */}
        <div className="relative mt-6 w-32 h-16 flex items-center justify-center">
          <svg
            ref={mouthRef}
            width="100"
            height="50"
            viewBox="0 0 100 50"
            className="transition-all duration-200"
          >
            {/* Smile curve */}
            <path
              d={`M 20 40 Q 50 ${40 - smileCurve} 80 40`}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className={`transition-all duration-200 ${
                expression.happiness > 0.7
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
            {/* Optional: Inner mouth fill for more expressive smile */}
            {expression.happiness > 0.6 && (
              <path
                d={`M 20 40 Q 50 ${40 - smileCurve} 80 40 Q 50 ${45 - smileCurve * 0.5} 20 40`}
                fill="currentColor"
                className="text-emerald-500/20 dark:text-emerald-400/20 transition-all duration-200"
              />
            )}
          </svg>
        </div>

        {/* Blush marks when happy */}
        {expression.happiness > 0.6 && (
          <>
            <div className="absolute w-8 h-6 rounded-full bg-pink-300/40 dark:bg-pink-500/30 top-1/2 left-8 transform -translate-y-1/3 transition-opacity duration-300" />
            <div className="absolute w-8 h-6 rounded-full bg-pink-300/40 dark:bg-pink-500/30 top-1/2 right-8 transform -translate-y-1/3 transition-opacity duration-300" />
          </>
        )}

        {/* Decorative elements */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-emerald-500/40 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
