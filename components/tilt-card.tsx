"use client"

import { useRef, useEffect, useCallback } from "react"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const isTouchRef = useRef(false)
  const glowXRef = useRef(50)
  const glowYRef = useRef(50)

  useEffect(() => {
    isTouchRef.current =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchRef.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    const rotateY = x * 16
    const rotateX = -y * 12
    glowXRef.current = ((e.clientX - rect.left) / rect.width) * 100
    glowYRef.current = ((e.clientY - rect.top) / rect.height) * 100

    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return
      containerRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
      containerRef.current.style.boxShadow = "0 16px 40px rgba(99,102,241,0.22)"
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle 180px at ${glowXRef.current}% ${glowYRef.current}%, hsl(239 84% 67% / 0.12), transparent)`
        glowRef.current.style.opacity = "1"
      }
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current || !containerRef.current) return
    containerRef.current.style.transition = "none"
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    containerRef.current.style.transition =
      "transform 400ms cubic-bezier(0.23,1,0.32,1), box-shadow 400ms cubic-bezier(0.23,1,0.32,1)"
    containerRef.current.style.transform = ""
    containerRef.current.style.boxShadow = ""
    if (glowRef.current) glowRef.current.style.opacity = "0"
    const el = containerRef.current
    setTimeout(() => {
      if (el) el.style.transition = ""
    }, 400)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ willChange: "transform" }}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 z-[1] transition-opacity duration-300"
      />
      {children}
    </div>
  )
}
