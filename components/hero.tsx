"use client"

import {
  motion,
  type Variants,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { Github, Linkedin, Download, ArrowDown, X } from "lucide-react"
import { useTypewriter } from "@/hooks/use-typewriter"
import { blurUpVariants } from "@/lib/motion-variants"
import { useChatContext } from "@/context/chat-context"

const ROLES = [
  "AI Engineer",
  "ML Practitioner",
  "Product Thinker",
  "Purdue Builder",
  "Systems Designer",
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
}

const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const INTRO_MESSAGE =
  "Hey, I'm AiRa — Bandha's AI assistant. Scroll down to explore, or ask me anything."

// Corner button dimensions and position (matches chatbot.tsx AvatarCornerButton)
const CORNER_SIZE = 64
const CORNER_BOTTOM = 24
const CORNER_RIGHT = 24

export default function Hero() {
  const { displayText, cursorVisible } = useTypewriter(ROLES)
  const { isPastHero, openChat } = useChatContext()
  const avatarWrapperRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const tiltRafRef = useRef<number | null>(null)
  const mousePosRef = useRef({ x: -9999, y: -9999 })
  const hasShownIntroRef = useRef(false)
  const [showIntro, setShowIntro] = useState(false)
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const introDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scroll-progress-driven scroll traveler ─────────────────────────────────────
  // scrollYProgress: 0 at "hero top at viewport top", 1 at "hero bottom at viewport top"
  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  })

  // Motion values for the scroll traveler transform — computed from scrollYProgress
  // We use useMotionValue + useMotionValueEvent so we can incorporate the measured
  // hero avatar position (a runtime value not available to useTransform's input array).
  const travelerX = useMotionValue(0)
  const travelerY = useMotionValue(0)
  const travelerScale = useMotionValue(1)
  const travelerOpacity = useMotionValue(0)

  // Store measured offsets in refs so they're available in the scroll callback
  // without triggering re-renders.
  const offsetXRef = useRef(0)   // px hero avatar center is to the left of corner center
  const offsetYRef = useRef(0)   // px hero avatar center is above corner center
  const scaleRatioRef = useRef(1) // hero avatar width / corner button width

  // Measure the hero avatar's position relative to the corner button.
  // This must run after paint so getBoundingClientRect is accurate.
  useEffect(() => {
    const measure = () => {
      if (!avatarWrapperRef.current) return
      const rect = avatarWrapperRef.current.getBoundingClientRect()

      // Hero avatar center (viewport-relative)
      const heroCX = rect.left + rect.width / 2
      const heroCY = rect.top + rect.height / 2

      // Corner button center (viewport-relative, fixed)
      const cornerCX = window.innerWidth - CORNER_RIGHT - CORNER_SIZE / 2
      const cornerCY = window.innerHeight - CORNER_BOTTOM - CORNER_SIZE / 2

      offsetXRef.current = heroCX - cornerCX   // positive = hero is left of corner
      offsetYRef.current = heroCY - cornerCY   // positive = hero is above corner (negative value)
      scaleRatioRef.current = rect.width / CORNER_SIZE
    }

    // Measure after the first paint and whenever the window resizes
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Drive the traveler transform from scrollYProgress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Scroll animation range: 0 → 0.85
    const progress = Math.max(0, Math.min(1, latest / 0.85))
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2 // ease-in-out quad

    // Position: interpolate from hero center offset → 0 (at corner)
    travelerX.set(offsetXRef.current * (1 - eased))
    travelerY.set(offsetYRef.current * (1 - eased))

    // Scale: interpolate from hero size → 1× (corner button size)
    travelerScale.set(scaleRatioRef.current + (1 - scaleRatioRef.current) * eased)

    // Opacity:
    //   - Fade IN quickly at scroll start (0 → 0.12 = fully visible)
    //   - Hold through most of the travel
    //   - Fade OUT as it snaps to corner (0.72 → 0.85)
    if (latest < 0.01) {
      travelerOpacity.set(0)
    } else if (latest < 0.12) {
      travelerOpacity.set((latest - 0.01) / 0.11)
    } else if (latest < 0.72) {
      travelerOpacity.set(1)
    } else if (latest < 0.85) {
      travelerOpacity.set(1 - (latest - 0.72) / 0.13)
    } else {
      travelerOpacity.set(0)
    }
  })

  // Hero avatar opacity — fades out as the traveler becomes the dominant element
  const heroAvatarOpacity = useTransform(scrollYProgress, [0, 0.05, 0.35], [1, 0.85, 0])

  // ── Mouse tilt on hero avatar ────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMouseMove)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let currentTiltX = 0
    let currentTiltY = 0
    let currentShiftX = 0
    let currentShiftY = 0

    const loop = () => {
      if (avatarWrapperRef.current) {
        const rect = avatarWrapperRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = mousePosRef.current.x - cx
        const dy = mousePosRef.current.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const proximity = Math.max(0, 1 - dist / 380)

        const targetTiltX = -dy * 0.022 * proximity
        const targetTiltY = dx * 0.022 * proximity
        const targetShiftX = dx * 0.04 * proximity
        const targetShiftY = dy * 0.04 * proximity

        currentTiltX = lerp(currentTiltX, targetTiltX, 0.06)
        currentTiltY = lerp(currentTiltY, targetTiltY, 0.06)
        currentShiftX = lerp(currentShiftX, targetShiftX, 0.06)
        currentShiftY = lerp(currentShiftY, targetShiftY, 0.06)

        avatarWrapperRef.current.style.transform = `perspective(900px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) translate(${currentShiftX}px, ${currentShiftY}px)`
      }
      tiltRafRef.current = requestAnimationFrame(loop)
    }

    tiltRafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current)
    }
  }, [])

  // Hero intro tooltip — fires once per session, 1.5s after mount, auto-dismisses after 5s
  useEffect(() => {
    if (hasShownIntroRef.current) return
    introTimerRef.current = setTimeout(() => {
      hasShownIntroRef.current = true
      setShowIntro(true)
      introDismissTimerRef.current = setTimeout(() => setShowIntro(false), 5000)
    }, 1500)
    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current)
      if (introDismissTimerRef.current) clearTimeout(introDismissTimerRef.current)
    }
  }, [])

  return (
    <section ref={heroSectionRef} className="pt-6 pb-20 md:pt-8 md:pb-36 flex flex-col items-center">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center w-full"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="order-2 md:order-1">
          <motion.p
            variants={item}
            className="text-xs font-semibold tracking-[0.22em] uppercase text-primary/65 mb-5"
          >
            AI · Product Management · Cybersecurity
          </motion.p>

          <motion.div variants={item} className="mb-4">
            <motion.div
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] text-foreground"
              initial="hidden"
              animate="visible"
              variants={headlineContainer}
            >
              {["Sushin", "Bandha"].map((word) => (
                <motion.span key={word} className="block" variants={blurUpVariants}>
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Typewriter role line */}
          <motion.div variants={item} className="h-6 mb-4 flex items-center">
            <span className="text-sm font-medium text-primary/80 tracking-wide font-mono">
              {displayText}
              <span
                className="ml-px"
                style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
              >
                |
              </span>
            </span>
          </motion.div>

          <motion.div variants={item} className="w-10 h-0.5 bg-primary mb-6" />

          <motion.p
            variants={item}
            className="text-foreground/60 mb-8 text-[1.05rem] leading-relaxed max-w-[38ch]"
          >
            Purdue AI student at the intersection of machine learning, product strategy, and
            security. Directed a 25-member team. Shipped products. Building what&apos;s next.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="font-medium"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects
            </Button>
            <Button asChild variant="outline" size="lg" className="font-medium">
              <a href="/sushin-bandha-resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Resume
              </a>
            </Button>
          </motion.div>

          <motion.div variants={item} className="flex mt-8 gap-5">
            <a
              href="https://github.com/bsushin0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/35 hover:text-foreground transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/sushin-bandha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/35 hover:text-foreground transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="order-1 md:order-2 hidden md:flex justify-center"
        >
          {/* Intro speech bubble — fires once per session after 1.5s */}
          <div className="relative flex flex-col items-center">
            <AnimatePresence>
              {showIntro && !isPastHero && (
                <motion.div
                  key="hero-intro-bubble"
                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.94 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="mb-4 w-max max-w-[260px] relative"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="glass-effect border border-border-subtle rounded-2xl px-4 py-3 shadow-xl">
                    <button
                      onClick={() => { setShowIntro(false); if (introDismissTimerRef.current) clearTimeout(introDismissTimerRef.current) }}
                      className="absolute top-2 right-2 text-foreground/40 hover:text-foreground/70 transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => { setShowIntro(false); openChat() }}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group pr-4 text-left"
                    >
                      {INTRO_MESSAGE}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
                    </button>
                  </div>
                  {/* Tail pointing down toward avatar */}
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

            {/*
              Hero avatar — static, always in-document flow.
              Fades out as scroll begins (the scroll traveler takes over visually).
              No layoutId here — the traveler handles the continuous motion.
            */}
            <motion.div
              style={{ opacity: heroAvatarOpacity, willChange: "opacity" }}
            >
              <div
                ref={avatarWrapperRef}
                className="relative flex items-center justify-center rounded-full p-[2px] aspect-square w-56 sm:w-64 md:w-72 lg:w-80 bg-[conic-gradient(from_0deg,rgba(148,163,184,0.35),rgba(148,163,184,0.05),rgba(148,163,184,0.35))] dark:bg-[conic-gradient(from_0deg,rgba(34,211,238,0.25),rgba(34,211,238,0),rgba(34,211,238,0.25))]"
                style={{ willChange: "transform", transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center justify-center rounded-full aspect-square w-full h-full overflow-hidden border border-transparent dark:border-white/10 transition-all duration-500 filter brightness-100 saturate-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] dark:brightness-110 dark:contrast-105 dark:drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <AiAvatar />
                </div>
              </div>
            </motion.div>

            {/*
              Scroll Traveler — fixed overlay that physically travels from the hero avatar
              position down to the corner button position as the user scrolls.

              Strategy: the element is permanently anchored at the corner position in DOM
              space (bottom: 24px, right: 24px, 64×64). At scroll=0 it is translated and
              scaled outward to visually overlay the hero avatar. As scroll progresses to
              0.85, translation and scale interpolate back to identity, landing exactly at
              the corner. The corner button then mounts and this element fades out.

              Only shown on md+ screens (matching corner button visibility).
              pointer-events-none and aria-hidden — purely decorative.
            */}
            {!isPastHero && (
              <motion.div
                aria-hidden="true"
                className="fixed pointer-events-none z-40 rounded-full overflow-hidden hidden md:block"
                style={{
                  bottom: `${CORNER_BOTTOM}px`,
                  right: `${CORNER_RIGHT}px`,
                  width: `${CORNER_SIZE}px`,
                  height: `${CORNER_SIZE}px`,
                  x: travelerX,
                  y: travelerY,
                  scale: travelerScale,
                  opacity: travelerOpacity,
                  transformOrigin: "center center",
                  willChange: "transform, opacity",
                  background: "linear-gradient(135deg, hsl(188 100% 50% / 0.18), hsl(239 84% 67%), hsl(278 68% 59%))",
                  border: "2px solid hsl(188 100% 50% / 0.5)",
                  boxShadow: "0 0 20px hsl(188 100% 50% / 0.28), 0 4px 20px rgba(0,0,0,0.22)",
                }}
              >
                {/* Full AiAvatar face SVG — same design as AvatarFace in chatbot.tsx */}
                <svg
                  width={CORNER_SIZE}
                  height={CORNER_SIZE}
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="traveler-face" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(188 100% 50%)" />
                      <stop offset="50%" stopColor="hsl(239 84% 67%)" />
                      <stop offset="100%" stopColor="hsl(278 68% 59%)" />
                    </radialGradient>
                    <radialGradient id="traveler-eye" cx="50%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                      <stop offset="100%" stopColor="hsl(188 100% 50% / 0.5)" />
                    </radialGradient>
                  </defs>
                  <circle cx="30" cy="30" r="28" fill="url(#traveler-face)" />
                  <circle cx="22" cy="22" r="12" fill="rgba(255,255,255,0.12)" />
                  <ellipse cx="21" cy="27" rx="6" ry="6.5" fill="url(#traveler-eye)" />
                  <circle cx="21" cy="27" r="3.5" fill="#0f172a" />
                  <circle cx="19.5" cy="25.5" r="1.4" fill="white" opacity="0.9" />
                  <circle cx="20" cy="26" r="0.7" fill="hsl(188 100% 70%)" opacity="0.8" />
                  <ellipse cx="39" cy="27" rx="6" ry="6.5" fill="url(#traveler-eye)" />
                  <circle cx="39" cy="27" r="3.5" fill="#0f172a" />
                  <circle cx="37.5" cy="25.5" r="1.4" fill="white" opacity="0.9" />
                  <circle cx="38" cy="26" r="0.7" fill="hsl(188 100% 70%)" opacity="0.8" />
                  <path d="M 22 37 Q 30 43 38 37" stroke="hsl(239 84% 85%)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mt-16 animate-bounce text-foreground/25 hover:text-primary hover:bg-transparent"
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll to projects"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </motion.div>
    </section>
  )
}
