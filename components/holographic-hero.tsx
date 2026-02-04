"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface HolographicHeroProps {
  /** Path to the 3D rendered glassmorphism bust image */
  imageSrc: string
  /** Alt text for accessibility */
  alt?: string
  /** Optional additional className for the container */
  className?: string
  /** Size variant for responsive scaling */
  size?: "sm" | "md" | "lg" | "xl"
}

/**
 * HolographicHero - A sci-fi inspired holographic avatar display component.
 * 
 * Features:
 * - Portrait-oriented rectangle with soft rounded corners
 * - Floating animation for weightless effect
 * - Breathing glow effect with cyan/indigo radial gradient
 * - Scanline overlay for digital projection aesthetic
 * - Mix-blend modes for projected light effect
 * - Glassmorphism backdrop blur
 * - Fully responsive design
 */
export default function HolographicHero({
  imageSrc,
  alt = "AI Avatar",
  className,
  size = "lg",
}: HolographicHeroProps) {
  // Size mappings for responsive scaling
  const sizeClasses = {
    sm: "w-48 h-64 md:w-56 md:h-72",
    md: "w-56 h-72 md:w-64 md:h-80",
    lg: "w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-[26rem]",
    xl: "w-72 h-96 md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem]",
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
    >
      {/* Breathing Glow Layer - Radial gradient pulsing behind avatar */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "animate-hologram-pulse",
          "rounded-3xl",
          // Radial gradient glow in Cyan/Indigo
          "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.4)_0%,rgba(99,102,241,0.15)_40%,transparent_70%)]",
          "dark:bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.5)_0%,rgba(99,102,241,0.2)_40%,transparent_70%)]",
          // Scale up slightly for glow overflow
          "scale-110"
        )}
        aria-hidden="true"
      />

      {/* Secondary ambient glow for depth */}
      <div
        className={cn(
          "absolute inset-0 -z-20",
          "animate-hologram-pulse-delayed",
          "rounded-3xl",
          "bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.2)_0%,transparent_50%)]",
          "dark:bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.25)_0%,transparent_50%)]",
          "scale-125",
          "blur-xl"
        )}
        style={{ animationDelay: "-2s" }}
        aria-hidden="true"
      />

      {/* Main Avatar Container - Floating animation */}
      <div
        className={cn(
          "relative",
          "animate-hologram-float",
          sizeClasses[size]
        )}
      >
        {/* Glassmorphism backdrop container */}
        <div
          className={cn(
            "relative w-full h-full",
            "rounded-3xl",
            "overflow-hidden",
            // Glassmorphism effect
            "backdrop-blur-md",
            "bg-white/5 dark:bg-slate-900/20",
            // Subtle border for definition
            "border border-white/10 dark:border-cyan-400/10",
            // Box shadow for depth
            "shadow-[0_8px_32px_rgba(99,102,241,0.15)]",
            "dark:shadow-[0_8px_32px_rgba(99,102,241,0.25)]"
          )}
        >
          {/* Avatar Image with holographic effects */}
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={alt}
              fill
              priority
              className={cn(
                "object-cover object-center",
                // Mix blend for projected light effect
                "mix-blend-screen dark:mix-blend-screen",
                // Subtle saturation and brightness adjustments
                "saturate-110 brightness-105",
                "dark:saturate-125 dark:brightness-110 dark:contrast-105"
              )}
              sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
            />

            {/* Edge glow overlay for projected light blending */}
            <div
              className={cn(
                "absolute inset-0",
                "pointer-events-none",
                "bg-gradient-to-t from-indigo-500/20 via-transparent to-cyan-400/10",
                "dark:from-indigo-500/30 dark:to-cyan-400/20",
                "mix-blend-overlay"
              )}
              aria-hidden="true"
            />

            {/* Corner vignette for depth */}
            <div
              className={cn(
                "absolute inset-0",
                "pointer-events-none",
                "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)]",
                "dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]"
              )}
              aria-hidden="true"
            />
          </div>

          {/* Scanline overlay - Digital projection effect */}
          <div
            className={cn(
              "absolute inset-0",
              "pointer-events-none",
              "animate-scanline",
              "opacity-[0.03] dark:opacity-[0.06]",
              // Horizontal scanlines using repeating gradient
              "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.8)_2px,rgba(255,255,255,0.8)_4px)]",
              "dark:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,211,238,0.6)_2px,rgba(34,211,238,0.6)_4px)]",
              "bg-[length:100%_200%]"
            )}
            aria-hidden="true"
          />

          {/* Subtle noise texture for hologram authenticity */}
          <div
            className={cn(
              "absolute inset-0",
              "pointer-events-none",
              "opacity-[0.02] dark:opacity-[0.04]",
              "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]",
              "mix-blend-overlay"
            )}
            aria-hidden="true"
          />

          {/* Holographic shimmer highlight */}
          <div
            className={cn(
              "absolute inset-0",
              "pointer-events-none",
              "bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5",
              "dark:from-cyan-400/10 dark:to-indigo-500/10"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute -inset-[1px]",
            "rounded-3xl",
            "bg-gradient-to-br from-cyan-400/20 via-transparent to-indigo-500/20",
            "dark:from-cyan-400/30 dark:to-indigo-500/30",
            "-z-10",
            "blur-sm"
          )}
          aria-hidden="true"
        />
      </div>

      {/* Floating particles/orbs for atmosphere (optional decorative elements) */}
      <div
        className={cn(
          "absolute top-1/4 -left-4",
          "w-2 h-2 rounded-full",
          "bg-cyan-400/40 dark:bg-cyan-400/60",
          "animate-hologram-float",
          "blur-[1px]"
        )}
        style={{ animationDelay: "-1s", animationDuration: "5s" }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute bottom-1/3 -right-3",
          "w-1.5 h-1.5 rounded-full",
          "bg-indigo-400/40 dark:bg-indigo-400/60",
          "animate-hologram-float",
          "blur-[1px]"
        )}
        style={{ animationDelay: "-3s", animationDuration: "7s" }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute top-1/2 -right-6",
          "w-1 h-1 rounded-full",
          "bg-cyan-300/30 dark:bg-cyan-300/50",
          "animate-hologram-float",
          "blur-[0.5px]"
        )}
        style={{ animationDelay: "-4s", animationDuration: "4s" }}
        aria-hidden="true"
      />
    </div>
  )
}
