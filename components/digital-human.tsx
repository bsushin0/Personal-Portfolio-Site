'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function DigitalHuman() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [distance, setDistance] = useState(0)
  const [scale, setScale] = useState(1)
  const [glowIntensity, setGlowIntensity] = useState(0.3)

  // Track mouse movement and proximity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Normalized mouse position relative to container (-1 to 1)
      const relX = (e.clientX - centerX) / (rect.width / 2)
      const relY = (e.clientY - centerY) / (rect.height / 2)

      // Distance from center (0 to ~1.4 for diagonal)
      const dist = Math.sqrt(relX * relX + relY * relY)
      
      setMousePos({ x: relX, y: relY })
      setDistance(Math.min(dist, 2))

      // Scale up when cursor is close, down when far
      const newScale = 1 + (1 - Math.min(dist / 2, 1)) * 0.15
      setScale(newScale)

      // Glow intensity based on proximity
      const glowIntensity = 0.3 + (1 - Math.min(dist / 2, 1)) * 0.7
      setGlowIntensity(glowIntensity)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Figure movement within frame (subtle)
  const figureShiftX = mousePos.x * 8   // Subtle shift toward cursor
  const figureShiftY = mousePos.y * 8

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] flex items-center justify-center">
      {/* Fixed Frame Container - STAYS STILL */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: `0 0 ${40 + glowIntensity * 60}px rgba(99, 102, 241, ${0.2 + glowIntensity * 0.3}), 0 0 ${100 + glowIntensity * 100}px rgba(99, 102, 241, ${0.1 + glowIntensity * 0.15})`,
        }}
      >
        {/* Figure Inside Frame - Only this moves */}
        <div
          className="relative w-full h-full transition-transform"
          style={{
            transform: `
              scale(${scale})
              translateX(${figureShiftX}px)
              translateY(${figureShiftY}px)
            `,
            transformOrigin: 'center center',
            transitionDuration: '80ms',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
          }}
        >
          {/* The Portrait Figure */}
          <Image
            src="/avatar-portrait.jpg"
            alt="Sushin Bandha - AI Engineer"
            fill
            priority
            className="object-contain object-center"
            style={{
              filter: `
                grayscale(${20 - distance * 5}%)
                contrast(${1.1 + distance * 0.1})
                brightness(${0.95 + distance * 0.05})
                saturate(${1 + distance * 0.2})
              `,
            }}
          />
        </div>

        {/* Dynamic Aura/Glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(ellipse at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(99, 102, 241, ${0.2 + glowIntensity * 0.3}), transparent 70%)`,
            mixBlendMode: 'screen',
            opacity: glowIntensity * 0.6,
          }}
        />

        {/* Energy pulse at center */}
        <div
          className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-32 h-40 bg-indigo-500/40 blur-[40px] rounded-full mix-blend-overlay animate-pulse pointer-events-none"
          style={{
            opacity: glowIntensity * 0.8,
          }}
        />

        {/* HUD Overlay (Fixed) */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl border border-cyan-500/20 overflow-hidden">
          
          {/* Status Badge */}
          <div className="absolute top-6 right-6 flex items-center space-x-2 bg-black/70 backdrop-blur-sm border border-cyan-500/40 rounded-lg px-3 py-1.5 shadow-lg shadow-cyan-900/30">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-300">
              ONLINE
            </span>
          </div>

          {/* Subtle scanning lines */}
          <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scan-fast" />
          <div className="absolute left-0 w-full h-[1px] top-1/3 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-50" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Ambient light reflection */}
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-cyan-500/15 blur-2xl rounded-full -z-10 transition-all duration-500"
        style={{
          opacity: glowIntensity,
          transform: `scaleX(${1 + distance * 0.3})`,
        }}
      />
    </div>
  )
}
