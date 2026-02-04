'use client'

import { useState, useEffect, useRef } from 'react'

export default function DigitalHuman() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  // Track mouse movement for 3D parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate tilt (Max 5deg for heavy, robotic feel)
      const rotateX = ((e.clientY - centerY) / (window.innerHeight / 2)) * -5
      const rotateY = ((e.clientX - centerX) / (window.innerWidth / 2)) * 5

      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Container with Cyber Glow */}
      <div
        ref={containerRef}
        className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 0 60px rgba(99, 102, 241, 0.3), 0 0 100px rgba(99, 102, 241, 0.1)',
        }}
      >
        {/* 1. THE ANDROID AVATAR (Metallic Re-Skin) */}
        <div
          className="absolute inset-0 animate-breathe"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* The Photo with 'Androidification' Filter */}
          <img
            src="/avatar-portrait.jpg"
            alt="Sushin Bandha - Cyber AI"
            className="w-full h-full object-cover object-top"
            style={{
              filter: 'grayscale(30%) contrast(1.15) brightness(0.95)',
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            }}
          />

          {/* METALLIC TINT OVERLAY (Cool Blue/Slate) */}
          <div className="absolute inset-0 bg-slate-900/40 mix-blend-hard-light pointer-events-none" />

          {/* PURPLE POWER CORE (Glowing Tie Area) */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-24 h-32 bg-indigo-600/60 blur-[30px] rounded-full mix-blend-overlay animate-pulse" />
          
          {/* CYBER EYES (The Glint) */}
          <div 
            className="absolute top-[36%] left-[34%] w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px] shadow-[0_0_10px_#22d3ee]"
            style={{ transform: `translate(${-rotation.y * 1.5}px, ${-rotation.x * 1.5}px)` }}
          />
          <div 
            className="absolute top-[36%] right-[34%] w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px] shadow-[0_0_10px_#22d3ee]" 
            style={{ transform: `translate(${-rotation.y * 1.5}px, ${-rotation.x * 1.5}px)` }}
          />
        </div>

        {/* 2. HUD OVERLAY (The Scanner Interface) */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl border border-cyan-500/10 bg-gradient-to-b from-cyan-500/5 to-transparent">
          
          {/* Status Badge */}
          <div className="absolute top-6 right-6 flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg px-3 py-1.5 shadow-lg shadow-cyan-900/20">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-400">
              SYSTEM ONLINE
            </span>
          </div>

          {/* Facial Target Frame */}
          <div className="absolute top-[25%] left-[20%] w-[60%] h-[30%] border border-cyan-500/20 rounded-lg opacity-50" />
          
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/30 shadow-[0_0_10px_#22d3ee] animate-scan-fast" />
        </div>
      </div>
      
      {/* 3. REFLECTION (Grounding) */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/10 blur-xl rounded-[100%] -z-10" />
    </div>
  )
}
