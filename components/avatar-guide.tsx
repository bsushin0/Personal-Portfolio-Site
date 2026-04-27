"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChatContext } from "@/context/chat-context"

// ── Section tooltip copy ────────────────────────────────────────────────────
const SECTION_TIPS: Record<string, string> = {
  about:          "This is where I'm from — curious from day one.",
  interests:      "The things that light me up outside the code.",
  experience:     "My journey so far — earned every step.",
  projects:       "Here's what I've actually shipped.",
  education:      "Purdue built the foundation.",
  skills:         "Here's what I build with — and what I'm still learning.",
  certifications: "Proof of work, not just talk.",
  contact:        "Let's build something together.",
}

// ── Mini avatar face (pure SVG, no deps) ────────────────────────────────────
function MiniAvatarFace({ size = 60 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mg-face" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(188 100% 50%)" />
          <stop offset="50%" stopColor="hsl(239 84% 67%)" />
          <stop offset="100%" stopColor="hsl(278 68% 59%)" />
        </radialGradient>
        <radialGradient id="mg-eye" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="hsl(188 100% 50% / 0.5)" />
        </radialGradient>
      </defs>
      {/* Face */}
      <circle cx="30" cy="30" r="28" fill="url(#mg-face)" />
      {/* Inner shine */}
      <circle cx="22" cy="22" r="12" fill="rgba(255,255,255,0.12)" />
      {/* Left eye white */}
      <ellipse cx="21" cy="27" rx="6" ry="6.5" fill="url(#mg-eye)" />
      {/* Left pupil */}
      <circle cx="21" cy="27" r="3.5" fill="#0f172a" />
      <circle cx="19.5" cy="25.5" r="1.4" fill="white" opacity="0.9" />
      <circle cx="20" cy="26" r="0.7" fill="hsl(188 100% 70%)" opacity="0.8" />
      {/* Right eye white */}
      <ellipse cx="39" cy="27" rx="6" ry="6.5" fill="url(#mg-eye)" />
      {/* Right pupil */}
      <circle cx="39" cy="27" r="3.5" fill="#0f172a" />
      <circle cx="37.5" cy="25.5" r="1.4" fill="white" opacity="0.9" />
      <circle cx="38" cy="26" r="0.7" fill="hsl(188 100% 70%)" opacity="0.8" />
      {/* Smile */}
      <path d="M 22 37 Q 30 43 38 37" stroke="hsl(239 84% 85%)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function AvatarGuide() {
  const { openChat } = useChatContext()
  const heroRef = useRef<HTMLElement | null>(null)
  const [isPastHero, setIsPastHero] = useState(false)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const lastSectionRef = useRef<string>("")

  // Check reduced motion preference once on mount
  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  // Show a tooltip, auto-dismiss after 3s
  const showTooltip = useCallback((text: string) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)
    setTooltip(text)
    tooltipTimerRef.current = setTimeout(() => setTooltip(null), 3000)
  }, [])

  // Hero intersection observer — detach bubble when user leaves hero
  useEffect(() => {
    const heroEl = document.querySelector<HTMLElement>("section:first-of-type")
    if (!heroEl) return
    heroRef.current = heroEl

    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsPastHero(!entry.isIntersecting)
      },
      { threshold: 0.15 }
    )
    obs.observe(heroEl)
    return () => obs.disconnect()
  }, [])

  // Section intersection observers — show contextual tooltip as user scrolls in
  useEffect(() => {
    const sectionIds = Object.keys(SECTION_TIPS)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && lastSectionRef.current !== id) {
            lastSectionRef.current = id
            // Only show if bubble is visible (past hero)
            if (isPastHero) {
              showTooltip(SECTION_TIPS[id])
            }
          }
        },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [isPastHero, showTooltip])

  const handleBubbleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleChatLaunch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      openChat()
    },
    [openChat]
  )

  // Don't render on mobile (avatar is hidden on mobile anyway)
  // Also don't render when user is in hero
  return (
    <AnimatePresence>
      {isPastHero && (
        <motion.div
          key="avatar-guide-bubble"
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-24 left-5 z-40 hidden md:flex flex-col items-center"
          style={{ willChange: "transform" }}
        >
          {/* Speech bubble tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.92 }}
                transition={{ duration: 0.22 }}
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-[180px]"
              >
                <div className="glass-effect border border-border-subtle rounded-xl px-3 py-2 shadow-lg">
                  <p className="text-xs text-foreground/80 leading-snug text-center">{tooltip}</p>
                </div>
                {/* Bubble tail */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-0 h-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid hsl(var(--border-subtle))",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring — subtle ambient ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: prefersReduced ? "none" : "guide-pulse-ring 2.8s ease-in-out infinite",
            }}
          />

          {/* Bubble container */}
          <motion.button
            onClick={handleBubbleClick}
            whileHover={prefersReduced ? {} : { scale: 1.08 }}
            whileTap={prefersReduced ? {} : { scale: 0.94 }}
            className="relative w-[62px] h-[62px] rounded-full overflow-hidden border-2 shadow-xl cursor-pointer select-none"
            style={{
              borderColor: "hsl(188 100% 50% / 0.5)",
              boxShadow: "0 0 18px hsl(188 100% 50% / 0.25), 0 4px 16px rgba(0,0,0,0.18)",
              background: "linear-gradient(135deg, hsl(188 100% 50% / 0.15), hsl(278 68% 59% / 0.15))",
              animation: prefersReduced ? "none" : "avatar-guide-float 3.8s ease-in-out infinite",
            }}
            aria-label="Scroll back to top"
          >
            <MiniAvatarFace size={62} />
          </motion.button>

          {/* Small "chat" badge below the bubble */}
          <button
            onClick={handleChatLaunch}
            className="mt-1.5 text-[10px] font-medium text-primary/70 hover:text-primary transition-colors tracking-wide"
            aria-label="Open AI chat"
          >
            chat
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
