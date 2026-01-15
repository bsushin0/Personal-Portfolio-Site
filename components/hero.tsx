"use client"

import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 flex flex-col items-center bg-gradient-futuristic">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 text-transparent bg-clip-text">
            Sushin Bandha
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-cyan-200 dark:text-cyan-300 mb-6">
            Building Secure, Smart Systems for the Future
          </h2>
          <p className="text-cyan-100/80 dark:text-cyan-100/70 mb-8 text-lg">
            Computer Science student at Purdue University with a passion for AI-driven innovation and cybersecurity.
            Transforming ideas into intelligent, secure, and scalable systems.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all">
              Download Resume
            </Button>
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-300 hover:text-cyan-100 bg-transparent hover:bg-cyan-500/10 dark:border-cyan-400 dark:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              View Projects
            </Button>
          </div>

          <div className="flex mt-8 space-x-4">
            <a
              href="https://github.com/bsushin0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 hover:scale-110 transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/sushin-bandha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://twitter.com/bsushin0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 hover:scale-110 transition-all duration-300"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <AiAvatar />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="mt-16 animate-bounce text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
        onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ArrowDown className="h-6 w-6" />
      </Button>
    </section>
  )
}
