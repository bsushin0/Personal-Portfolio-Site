"use client"

import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { ArrowDown, Github, Linkedin, Download } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 flex flex-col items-center bg-gradient-lab dark:bg-gradient-neural">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 text-transparent bg-clip-text">
            Sushin Bandha
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-cyan-200 mb-6">
            Building the future of AI through Product Management and Cybersecurity
          </h2>
          <p className="text-gray-600 dark:text-cyan-100/80 mb-8 text-lg">
            Purdue AI student specializing in user-centric products at the intersection of machine learning and business strategy.
            Proven leader who directed a 25-member team, now seeking to build and launch innovative, AI-powered solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="border-blue-500 text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-cyan-500/50 transition-all"
            >
              View Projects
            </Button>
            <Button
              asChild
              className="border-purple-500 text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/50 transition-all"
            >
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
