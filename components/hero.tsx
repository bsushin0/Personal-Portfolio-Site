"use client"

import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { Github, Linkedin, Download, ArrowDown } from "lucide-react"

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Hero() {
  return (
    <section className="py-20 md:py-36 flex flex-col items-center">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center w-full"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="order-2 md:order-1">
          <motion.p variants={item} className="text-xs font-semibold tracking-[0.22em] uppercase text-primary/65 mb-5">
            AI · Product Management · Cybersecurity
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] text-foreground mb-5"
          >
            Sushin<br />Bandha
          </motion.h1>

          <motion.div variants={item} className="w-10 h-0.5 bg-primary mb-6" />

          <motion.p variants={item} className="text-foreground/60 mb-8 text-[1.05rem] leading-relaxed max-w-[38ch]">
            Purdue AI student at the intersection of machine learning, product strategy, and security.
            Directed a 25-member team. Shipped products. Building what&apos;s next.
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
          <div className="relative flex items-center justify-center rounded-full p-[2px] aspect-square w-56 sm:w-64 md:w-72 lg:w-80 bg-[conic-gradient(from_0deg,rgba(148,163,184,0.35),rgba(148,163,184,0.05),rgba(148,163,184,0.35))] dark:bg-[conic-gradient(from_0deg,rgba(34,211,238,0.25),rgba(34,211,238,0),rgba(34,211,238,0.25))]">
            <div className="flex items-center justify-center rounded-full aspect-square w-full h-full overflow-hidden border border-transparent dark:border-white/10 transition-all duration-500 filter brightness-100 saturate-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] dark:brightness-110 dark:contrast-105 dark:drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <AiAvatar />
            </div>
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
