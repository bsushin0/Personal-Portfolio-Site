"use client"

import { useEffect, useRef, useState } from "react"

export default function AiAvatar() {
  const avatarRef = useRef<HTMLDivElement>(null)
  const leftEyeRef = useRef<HTMLDivElement>(null)
  const rightEyeRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!avatarRef.current || !leftEyeRef.current || !rightEyeRef.current) return

    const avatarRect = avatarRef.current.getBoundingClientRect()
    const avatarCenterX = avatarRect.left + avatarRect.width / 2
    const avatarCenterY = avatarRect.top + avatarRect.height / 2

    const angle = Math.atan2(mousePosition.y - avatarCenterY, mousePosition.x - avatarCenterX)

    // Limit eye movement
    const maxEyeMovement = 5
    const eyeX = Math.cos(angle) * maxEyeMovement
    const eyeY = Math.sin(angle) * maxEyeMovement

    leftEyeRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
    rightEyeRef.current.style.transform = `translate(${eyeX}px, ${eyeY}px)`
  }, [mousePosition])

  return (
    <div
      ref={avatarRef}
      className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-full mx-auto border-4 border-emerald-500/30 shadow-lg shadow-emerald-500/20"
    >
      {/* Robot face elements */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Eyes container */}
        <div className="flex space-x-12 mb-6">
          {/* Left eye */}
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <div
              ref={leftEyeRef}
              className="w-6 h-6 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-md shadow-emerald-500/50 transition-transform duration-75"
            />
          </div>

          {/* Right eye */}
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <div
              ref={rightEyeRef}
              className="w-6 h-6 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-md shadow-emerald-500/50 transition-transform duration-75"
            />
          </div>
        </div>

        {/* Mouth */}
        <div className="w-24 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-4" />

        {/* Decorative elements */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-emerald-500/50 rounded-full" />
      </div>
    </div>
  )
}
