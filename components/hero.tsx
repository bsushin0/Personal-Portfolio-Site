"use client"

import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { ArrowDown, Github, Linkedin, Download } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 flex flex-col items-center bg-gradient-lab dark:bg-gradient-neural">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground tracking-tight">
            Sushin Bandha
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-foreground/70 mb-6">
            Building the future of AI through Product Management and Cybersecurity
          </h2>
          <p className="text-foreground/60 mb-8 text-lg">
            Purdue AI student specializing in user-centric products at the intersection of machine learning and business strategy.
            Proven leader who directed a 25-member team, now seeking to build and launch innovative, AI-powered solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects
            </Button>
            <Button asChild variant="outline">
              <a href="/Sushin Bandha Resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          </div>

          <div className="flex mt-8 space-x-4">
            <a
              href="https://github.com/bsushin0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/sushin-bandha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 hidden md:flex justify-center">
          <div className="relative flex items-center justify-center rounded-full p-[2px] aspect-square w-56 sm:w-64 md:w-72 lg:w-80 bg-[conic-gradient(from_0deg,rgba(148,163,184,0.35),rgba(148,163,184,0.05),rgba(148,163,184,0.35))] dark:bg-[conic-gradient(from_0deg,rgba(34,211,238,0.25),rgba(34,211,238,0),rgba(34,211,238,0.25))]">
            <div className="flex items-center justify-center rounded-full aspect-square w-full h-full overflow-hidden border border-transparent dark:border-white/10 transition-all duration-500 filter brightness-100 saturate-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] dark:brightness-110 dark:contrast-105 dark:drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <AiAvatar />
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="mt-16 animate-bounce text-primary hover:text-primary/90 hover:bg-slate-100/70 dark:hover:bg-slate-900/40"
        onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ArrowDown className="h-6 w-6" />
      </Button>
    </section>
  )
}
