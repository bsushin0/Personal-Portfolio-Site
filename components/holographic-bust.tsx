"use client"

import { cn } from "@/lib/utils"

interface HolographicBustProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export default function HolographicBust({
  className,
  size = "lg",
}: HolographicBustProps) {
  const sizeClasses = {
    sm: "w-48 h-56 md:w-56 md:h-64",
    md: "w-56 h-64 md:w-64 md:h-72",
    lg: "w-64 h-72 md:w-72 md:h-80 lg:w-80 lg:h-96",
    xl: "w-72 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]",
  }

  return (
    <div
      className={cn(
        "relative flex justify-center items-end",
        sizeClasses[size],
        className
      )}
    >
      {/* 1. Projector Beam (Base) */}
      <div className="absolute bottom-0 w-40 h-1 bg-cyan-500/50 blur-[20px] rounded-[100%] animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent blur-3xl -z-10" />

      {/* 2. The Personalized SVG Mesh */}
      <svg
        viewBox="0 0 200 240"
        className={cn(
          "w-full h-full",
          "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]",
          "animate-hologram-float"
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber Gradient for Skin/Suit */}
          <linearGradient id="holoGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.05" />
          </linearGradient>

          {/* PURPLE TIE CORE GRADIENT (Your Signature Feature) */}
          <linearGradient id="coreGradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
          </linearGradient>

          {/* Scanline Pattern */}
          <pattern id="scanlines" x="0" y="0" width="100%" height="4" patternUnits="userSpaceOnUse">
            <rect width="100%" height="1" fill="#22D3EE" fillOpacity="0.15" />
          </pattern>
        </defs>

        {/* GROUP 1: The Head Structure (Modeled on your photo) */}
        <g stroke="#22D3EE" strokeWidth="0.8" fill="url(#holoGradient)">
          
          {/* HAIR BLOCK - capturing your volume and right-sweep */}
          {/* Points: Left Temple -> Top Left Volume -> Top Right Peak -> Right Temple */}
          <polygon points="55,60 65,30 110,25 140,35 150,65" strokeOpacity="0.8" />
          
          {/* FACE MASK - capturing your jawline */}
          {/* Points: L Temple -> L Jaw -> Chin -> R Jaw -> R Temple */}
          <polygon points="55,60 60,110 100,145 140,110 150,65" />

          {/* FOREHEAD PLANE (The "T-Zone") */}
          <polygon points="55,60 150,65 100,90" fillOpacity="0.2" />

          {/* CHEEKS/DEPTH */}
          <path d="M60,110 L100,90 L140,110 L100,145 Z" fillOpacity="0.1" />
        </g>

        {/* GROUP 2: The "Suit" Structure */}
        <g stroke="#22D3EE" strokeWidth="0.5" fill="url(#holoGradient)" className="animate-pulse-slow">
          
          {/* Left Shoulder (Suit Jacket) */}
          <polygon points="60,110 20,130 10,240 80,240 90,160" />
          
          {/* Right Shoulder */}
          <polygon points="140,110 180,130 190,240 120,240 110,160" />
          
          {/* THE POWER CORE (Your Abstracted Tie) */}
          {/* This is the purple triangle in the center */}
          <polygon 
            points="100,145 115,240 85,240" 
            fill="url(#coreGradient)" 
            stroke="#6366F1" 
            strokeWidth="1" 
          />
        </g>

        {/* GROUP 3: Data Nodes (The AI "Brain") */}
        <g fill="#22D3EE">
          {/* Eye Nodes (Abstracted position) */}
          <circle cx="80" cy="85" r="1.5" opacity="0.8" className="animate-ping" style={{animationDuration: '3s'}}/>
          <circle cx="120" cy="85" r="1.5" opacity="0.8" className="animate-ping" style={{animationDuration: '3s', animationDelay: '1.5s'}}/>
          
          {/* Chin Node */}
          <circle cx="100" cy="145" r="2" fill="#6366F1" />
          
          {/* Temple/Jaw Nodes */}
          <circle cx="55" cy="60" r="1" opacity="0.5" />
          <circle cx="150" cy="65" r="1" opacity="0.5" />
          <circle cx="60" cy="110" r="1" opacity="0.5" />
          <circle cx="140" cy="110" r="1" opacity="0.5" />
        </g>

        {/* GROUP 4: Scanline Overlay */}
        <rect x="0" y="0" width="200" height="240" fill="url(#scanlines)" className="pointer-events-none opacity-40 mix-blend-overlay" />
        
        {/* Moving Glitch Line */}
        <rect x="0" y="0" width="200" height="2" fill="#22D3EE" opacity="0.5" className="animate-scan-fast" />

      </svg>
    </div>
  )
}