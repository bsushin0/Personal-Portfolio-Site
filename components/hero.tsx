"use client"

import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { ArrowDown, Github, Linkedin } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 flex flex-col items-center bg-gradient-futuristic-light dark:bg-gradient-futuristic">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 text-transparent bg-clip-text">
            Sushin Bandha
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-cyan-200 mb-6">
            AI Student | Product Management & Innovation
          </h2>
          <p className="text-gray-600 dark:text-cyan-100/80 mb-8 text-lg">
            Purdue AI student specializing in user-centric products at the intersection of machine learning and business strategy.
            Proven leader who directed a 25-member team, now seeking to build and launch innovative, AI-powered solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50 dark:border-cyan-400 dark:text-cyan-300 dark:hover:text-cyan-100 dark:hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-cyan-500/30 transition-all"
            >
              View Projects
            </Button>
          </div>

          <div className="flex mt-8 space-x-4">
            <a
              href="https://github.com/bsushin0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 dark:text-cyan-300 dark:hover:text-cyan-100 hover:scale-110 transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/sushin-bandha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 dark:text-cyan-300 dark:hover:text-cyan-100 hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 hidden md:flex justify-center">
          <AiAvatar />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="mt-16 animate-bounce text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-500/10"
        onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ArrowDown className="h-6 w-6" />
      </Button>
    </section>
  )
}
