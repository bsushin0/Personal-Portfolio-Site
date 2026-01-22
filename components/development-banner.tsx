"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface DevelopmentBannerProps {
  className?: string
}

export default function DevelopmentBanner({ className }: DevelopmentBannerProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <>
      {/* Fixed banner that stays visible on scroll */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-[60]",
          "w-full",
          "border-b border-white/20 dark:border-white/10",
          // High-contrast attention-grabbing gradient
          "bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 text-white",
          "dark:from-cyan-600 dark:via-blue-700 dark:to-purple-700",
          className
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Megaphone className="h-5 w-5 text-white" aria-hidden />
            <p className="text-sm">
              This portfolio is in active development. Suggestions and fixes are encouraged — share via
              <Link href="#contact" className="ml-1 font-medium underline underline-offset-2 text-white hover:opacity-90">Get In Touch</Link>.
            </p>
          </div>
          <button
            aria-label="Dismiss banner"
            className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-white/10 transition"
            onClick={() => setVisible(false)}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Spacer to prevent content from being covered by fixed banner */}
      <div aria-hidden className="h-12" />
    </>
  )
}
