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
    <div
      className={cn(
        "w-full",
        "border-b",
        "bg-yellow-50 text-yellow-900 border-yellow-200",
        "dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800/40",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Megaphone className="h-5 w-5 text-yellow-700 dark:text-yellow-300" aria-hidden />
          <p className="text-sm">
            This portfolio is in active development. Suggestions and fixes are encouraged — share via
            <Link href="#contact" className="ml-1 font-medium underline underline-offset-2 text-yellow-800 dark:text-yellow-200 hover:opacity-80">Get In Touch</Link>.
          </p>
        </div>
        <button
          aria-label="Dismiss banner"
          className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-yellow-100 dark:hover:bg-yellow-800/40 transition"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
