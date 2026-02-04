"use client"

import { cn } from "@/lib/utils"

interface HolographicBustProps {
  /** Optional additional className for the container */
  className?: string
  /** Size variant for responsive scaling */
  size?: "sm" | "md" | "lg" | "xl"
}

/**
 * HolographicBust - A pure-code futuristic wireframe bust hologram.
 * 
 * Features:
 * - Inline SVG with professional head/shoulders silhouette
 * - Cyan-400 wireframe strokes with glow effects
 * - Ghostly gradient fill with scanline pattern
 * - Hologram flicker/glitch animation
 * - Floating animation for weightless effect
 * - Projector disc base for hologram origin
 * - No external assets required
 */
export default function HolographicBust({
  className,
  size = "lg",
}: HolographicBustProps) {
  // Size mappings for responsive scaling
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
      {/* Ambient glow backdrop */}
      <div
        className={cn(
          "absolute inset-0 -z-20",
          "bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15)_0%,transparent_60%)]",
          "dark:bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.2)_0%,transparent_60%)]",
          "animate-hologram-pulse",
          "blur-xl"
        )}
        aria-hidden="true"
      />

      {/* Projector beam cone */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2",
          "w-40 h-32 md:w-48 md:h-40",
          "bg-gradient-to-t from-cyan-500/25 via-cyan-400/10 to-transparent",
          "dark:from-cyan-400/30 dark:via-cyan-400/15",
          "blur-2xl",
          "-z-10"
        )}
        aria-hidden="true"
      />

      {/* Main SVG Hologram */}
      <svg
        viewBox="0 0 200 240"
        className={cn(
          "w-full h-full",
          "drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]",
          "dark:drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]",
          "animate-hologram-float",
          "animate-hologram-flicker"
        )}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Holographic AI Bust"
      >
        <defs>
          {/* Ghostly gradient fill */}
          <linearGradient id="holoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.05" />
            <stop offset="30%" stopColor="#6366F1" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.02" />
          </linearGradient>

          {/* Radial glow for inner lighting */}
          <radialGradient id="innerGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>

          {/* Scanline pattern */}
          <pattern id="scanlines" x="0" y="0" width="100%" height="3" patternUnits="userSpaceOnUse">
            <rect width="100%" height="1" fill="#22D3EE" fillOpacity="0.08" />
          </pattern>

          {/* Projector disc gradient */}
          <radialGradient id="discGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === PROJECTOR BASE DISC === */}
        <ellipse
          cx="100"
          cy="225"
          rx="55"
          ry="10"
          fill="url(#discGradient)"
          stroke="#22D3EE"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Inner disc ring */}
        <ellipse
          cx="100"
          cy="225"
          rx="35"
          ry="6"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="0.5"
          opacity="0.4"
        />
        {/* Core light point */}
        <ellipse
          cx="100"
          cy="225"
          rx="8"
          ry="2"
          fill="#22D3EE"
          opacity="0.8"
        />

        {/* === BUST SILHOUETTE === */}
        <g filter="url(#glow)">
          {/* Shoulders and neck base */}
          <path
            d="M100,175 
               C70,175 45,185 30,200 
               L30,215 
               L170,215 
               L170,200 
               C155,185 130,175 100,175 Z"
            fill="url(#holoGradient)"
            stroke="#22D3EE"
            strokeWidth="1.2"
            className="animate-hologram-pulse-slow"
          />

          {/* Neck */}
          <path
            d="M85,175 
               L85,155 
               C85,150 90,145 100,145 
               C110,145 115,150 115,155 
               L115,175"
            fill="url(#holoGradient)"
            stroke="#22D3EE"
            strokeWidth="1.2"
          />

          {/* Head - Professional oval shape */}
          <path
            d="M100,145 
               C75,145 60,120 60,90 
               C60,55 75,30 100,30 
               C125,30 140,55 140,90 
               C140,120 125,145 100,145 Z"
            fill="url(#holoGradient)"
            stroke="#22D3EE"
            strokeWidth="1.5"
          />

          {/* Inner glow layer */}
          <path
            d="M100,145 
               C75,145 60,120 60,90 
               C60,55 75,30 100,30 
               C125,30 140,55 140,90 
               C140,120 125,145 100,145 Z"
            fill="url(#innerGlow)"
          />
        </g>

        {/* === WIREFRAME DATA LINES === */}
        <g stroke="#22D3EE" fill="none" strokeWidth="0.5" opacity="0.4">
          {/* Horizontal scan lines */}
          <path d="M65,50 Q100,45 135,50" />
          <path d="M62,70 Q100,65 138,70" />
          <path d="M60,90 Q100,85 140,90" />
          <path d="M62,110 Q100,105 138,110" />
          <path d="M68,130 Q100,125 132,130" />

          {/* Vertical meridian */}
          <path d="M100,30 L100,145" strokeDasharray="3,3" />

          {/* Facial feature guides */}
          <ellipse cx="82" cy="80" rx="8" ry="5" opacity="0.3" />
          <ellipse cx="118" cy="80" rx="8" ry="5" opacity="0.3" />
          <path d="M95,100 Q100,108 105,100" opacity="0.3" />
          <path d="M85,118 Q100,125 115,118" opacity="0.3" />

          {/* Shoulder wireframe */}
          <path d="M30,200 Q65,190 100,187 Q135,190 170,200" />
          <path d="M45,207 Q100,195 155,207" />
        </g>

        {/* === NEURAL NETWORK NODES === */}
        <g fill="#22D3EE" opacity="0.6">
          {/* Forehead nodes */}
          <circle cx="85" cy="50" r="1.5" />
          <circle cx="100" cy="45" r="1.5" />
          <circle cx="115" cy="50" r="1.5" />

          {/* Temple nodes */}
          <circle cx="65" cy="75" r="1.5" />
          <circle cx="135" cy="75" r="1.5" />

          {/* Cheek nodes */}
          <circle cx="70" cy="105" r="1.5" />
          <circle cx="130" cy="105" r="1.5" />

          {/* Chin node */}
          <circle cx="100" cy="140" r="1.5" />

          {/* Shoulder nodes */}
          <circle cx="50" cy="195" r="1.5" />
          <circle cx="150" cy="195" r="1.5" />
        </g>

        {/* Neural connection lines */}
        <g stroke="#22D3EE" strokeWidth="0.3" opacity="0.25" fill="none">
          <path d="M85,50 L100,45 L115,50" />
          <path d="M65,75 L85,50" />
          <path d="M135,75 L115,50" />
          <path d="M65,75 L70,105 L100,140 L130,105 L135,75" />
          <path d="M70,105 L50,195" />
          <path d="M130,105 L150,195" />
        </g>

        {/* === SCANLINE OVERLAY === */}
        <path
          d="M100,145 
             C75,145 60,120 60,90 
             C60,55 75,30 100,30 
             C125,30 140,55 140,90 
             C140,120 125,145 100,145 Z"
          fill="url(#scanlines)"
          opacity="0.6"
        />

        {/* === DATA STREAM PARTICLES === */}
        <g className="animate-hologram-data-flow">
          <circle cx="100" cy="200" r="1" fill="#22D3EE" opacity="0.8">
            <animate
              attributeName="cy"
              values="220;30;220"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0.8;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="85" cy="200" r="0.8" fill="#6366F1" opacity="0.6">
            <animate
              attributeName="cy"
              values="220;50;220"
              dur="5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0.6;0"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="115" cy="200" r="0.8" fill="#6366F1" opacity="0.6">
            <animate
              attributeName="cy"
              values="220;60;220"
              dur="4.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0.6;0"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      {/* Horizontal scan line overlay */}
      <div
        className={cn(
          "absolute inset-0",
          "pointer-events-none",
          "overflow-hidden"
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            "absolute left-0 right-0 h-[2px]",
            "bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent",
            "animate-hologram-scan"
          )}
        />
      </div>

      {/* Glitch slice overlays */}
      <div
        className={cn(
          "absolute inset-0",
          "pointer-events-none",
          "animate-hologram-glitch-slice"
        )}
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-cyan-400/20 translate-x-1" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-indigo-400/15 -translate-x-1" />
        <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-cyan-400/20 translate-x-0.5" />
      </div>
    </div>
  )
}
