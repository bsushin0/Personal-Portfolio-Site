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
      {/* 1. Android Ambient Glow (Subtle Backlight) */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] -z-10" />

      {/* 2. The Android SVG */}
      <svg
        viewBox="0 0 200 240"
        className={cn(
          "w-full h-full",
          "drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]", // Solid shadow, not glow
          "animate-hologram-float" // Gentle float remains for "Advanced Tech" feel
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* SKIN: Metallic Android Gradient */}
          <linearGradient id="androidSkin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="1" />   {/* Light Silver */}
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="1" />   {/* Mid Metal */}
            <stop offset="100%" stopColor="#475569" stopOpacity="1" />  {/* Shadow Metal */}
          </linearGradient>

          {/* HAIR: Matte Carbon Fiber */}
          <linearGradient id="hairGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="1" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
          </linearGradient>

          {/* SUIT: Deep Navy Armor */}
          <linearGradient id="suitGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </linearGradient>

          {/* TIE: The "Power Core" Crystal */}
          <linearGradient id="coreGradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="1" />   {/* Indigo Light */}
            <stop offset="50%" stopColor="#6366F1" stopOpacity="1" />   {/* Indigo Main */}
            <stop offset="100%" stopColor="#4338CA" stopOpacity="1" />  {/* Deep Indigo */}
          </linearGradient>

          {/* STATIC TEXTURE: Micro-Circuitry (Fixed, no animation) */}
          <pattern id="circuitry" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
             <path d="M0 5H10" stroke="#000" strokeOpacity="0.05" strokeWidth="0.5" />
             <path d="M5 0V10" stroke="#000" strokeOpacity="0.05" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* === LAYER 1: THE SUIT (Armor Plates) === */}
        <g stroke="#334155" strokeWidth="1" fill="url(#suitGradient)">
          {/* Left Shoulder Plate */}
          <path d="M60,120 L20,135 L10,240 L100,240 L90,160 Z" />
          {/* Right Shoulder Plate */}
          <path d="M140,120 L180,135 L190,240 L100,240 L110,160 Z" />
          
          {/* Collar/Shirt Area (Lighter Metal) */}
          <path d="M60,120 L90,160 L110,160 L140,120 L100,180 Z" fill="#94A3B8" />
        </g>

        {/* === LAYER 2: THE POWER TIE (Refined) === */}
        <g filter="drop-shadow(0 0 5px rgba(99, 102, 241, 0.5))">
          {/* The Knot */}
          <path d="M90,160 L110,160 L105,175 L95,175 Z" fill="#4338CA" />
          {/* The Blade (Crystal Core) */}
          <path d="M95,175 L105,175 L115,240 L85,240 Z" fill="url(#coreGradient)" />
          {/* Internal Glow Line */}
          <path d="M100,175 L100,240" stroke="#A5B4FC" strokeWidth="1" opacity="0.5" />
        </g>

        {/* === LAYER 3: THE HEAD (Android Geometry) === */}
        <g stroke="#475569" strokeWidth="0.5" fill="url(#androidSkin)">
          
          {/* Ears (Back Layer) */}
          <path d="M45,90 L55,80 L55,110 L50,115 Z" fill="#64748B" /> {/* Left Ear */}
          <path d="M155,90 L145,80 L145,110 L150,115 Z" fill="#64748B" /> {/* Right Ear */}

          {/* Main Face Shape (Jaw & Temples) */}
          <path d="M55,60 L60,115 L100,150 L140,115 L145,60 L100,50 Z" />

          {/* Neck Connection */}
          <path d="M75,140 L125,140 L125,160 L75,160 Z" fill="#64748B" />
        </g>

        {/* === LAYER 4: FACIAL FEATURES (The "Human" Element) === */}
        <g fill="#334155" stroke="none">
          
          {/* NOSE: Geometric Bridge */}
          <path d="M98,90 L102,90 L104,115 L96,115 Z" fill="#94A3B8" />
          <path d="M96,115 L100,120 L104,115" fill="#64748B" /> {/* Shadow Tip */}

          {/* MOUTH: Synthetic Plate */}
          <path d="M85,130 Q100,135 115,130 L115,132 Q100,137 85,132 Z" fill="#475569" />

          {/* EYES: The Android Lenses */}
          {/* Left Eye */}
          <g transform="translate(75, 90)">
             <ellipse cx="0" cy="0" rx="8" ry="4" fill="#1E293B" /> {/* Socket */}
             <circle cx="0" cy="0" r="2" fill="#22D3EE" className="animate-pulse" /> {/* Optic Lens */}
          </g>
          {/* Right Eye */}
          <g transform="translate(125, 90)">
             <ellipse cx="0" cy="0" rx="8" ry="4" fill="#1E293B" />
             <circle cx="0" cy="0" r="2" fill="#22D3EE" className="animate-pulse" />
          </g>
        </g>

        {/* === LAYER 5: HAIR (Voluminous Solid Block) === */}
        <path 
          d="M55,60 L65,30 L110,25 L145,35 L145,60 L100,50 Z" 
          fill="url(#hairGradient)" 
          stroke="#0F172A"
        />

        {/* === LAYER 6: TEXTURE OVERLAYS (Static) === */}
        {/* Static Horizontal Lines (Circuitry) */}
        <rect x="55" y="30" width="90" height="120" fill="url(#circuitry)" opacity="0.4" style={{ mixBlendMode: 'multiply' }} />
        
        {/* Subtle Shine/Reflection on Forehead */}
        <path d="M70,60 Q100,55 130,60 Q130,75 100,75 Q70,75 70,60" fill="white" opacity="0.1" />

      </svg>
    </div>
  )
}