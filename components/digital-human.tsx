'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function DigitalHuman() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Spring-based values for smooth, heavy robotic movement
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 })

  // Transform mouse position to rotation (max ~10 degrees)
  const rotateY = useTransform(mouseX, [-1, 1], [-10, 10])
  const rotateX = useTransform(mouseY, [-1, 1], [5, -5])

  // Eye glints move opposite to head for depth simulation
  const glintX = useTransform(mouseX, [-1, 1], [3, -3])
  const glintY = useTransform(mouseY, [-1, 1], [2, -2])

  // Cursor tracking for 3D parallax tilt effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate mouse position relative to center (-1 to 1)
    const relativeX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)))
    const relativeY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)))

    mouseX.set(relativeX)
    mouseY.set(relativeY)
  }, [mouseX, mouseY])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-3xl shadow-2xl border border-cyan-500/20 bg-slate-950"
      style={{
        boxShadow: '0 0 40px rgba(6, 182, 212, 0.15), 0 0 80px rgba(6, 182, 212, 0.05)'
      }}
    >
      {/* 1. BACKGROUND: Cyber-Physical Environment */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950">
        <motion.div 
          className="absolute top-0 inset-x-0 h-64 bg-cyan-500/5 blur-[100px]"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-cyan-500/5 blur-[80px]" />
      </div>

      {/* 2. THE AVATAR: 3D Parallax Tracking Portrait */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <motion.div 
          className="relative w-[90%] h-[90%] origin-bottom"
          style={{
            perspective: 1000,
            rotateX,
            rotateY,
          }}
          animate={{
            scale: [1, 1.015, 1],
            y: [0, -2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* IMAGE: Avatar portrait */}
          <img 
            src="/avatar-portrait.jpg" 
            alt="Sushin Bandha AI" 
            className="w-full h-full object-cover object-top drop-shadow-2xl"
            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
          />
          
          {/* Cyber Eye Glints - Track opposite to head for depth */}
          <motion.div 
            className="absolute top-[35%] left-[32%] w-2 h-2 bg-cyan-400 rounded-full blur-[2px] opacity-50"
            style={{ x: glintX, y: glintY }}
          />
          <motion.div 
            className="absolute top-[35%] right-[32%] w-2 h-2 bg-cyan-400 rounded-full blur-[2px] opacity-50"
            style={{ x: glintX, y: glintY }}
          />
        </motion.div>
      </div>

      {/* 3. HUD OVERLAY: Scanner Interface */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-500/40" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500/40" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500/40" />
        
        {/* Center Crosshairs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Scan Lines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.03)_2px,rgba(6,182,212,0.03)_4px)]" />
      </div>

      {/* 4. STATUS OVERLAY */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
        {/* Header Status Badge */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-cyan-500/20 rounded-full px-4 py-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              'bg-cyan-400 animate-pulse'
            )} />
            <span className="text-xs font-mono font-medium text-cyan-400/90 tracking-wider">
              SYSTEM ACTIVE
            </span>
          </div>
          
          {/* Secondary Status */}
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-3 py-1">
            <span className="text-[10px] font-mono text-white/50 tracking-wide">
              OBSERVER v2.0
            </span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 text-[10px] font-mono text-cyan-500/50 tracking-wider">
            <span>TRACKING: ACTIVE</span>
            <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
            <span>LATENCY: 12ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
