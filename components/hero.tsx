"use client"

import { Button } from "@/components/ui/button"
import AiAvatar from "./ai-avatar"
import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-500 text-transparent bg-clip-text">
            Sushin Bandha
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6">
            Building Secure, Smart Systems for the Future
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Computer Science student at Purdue University with a passion for AI-driven innovation and cybersecurity.
            Transforming ideas into intelligent, secure, and scalable systems.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700">
              Download Resume
            </Button>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              View Projects
            </Button>
          </div>

          <div className="flex mt-8 space-x-4">
            <a
              href="https://github.com/sushinbandha"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/sushinbandha/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
        className="mt-16 animate-bounce"
        onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ArrowDown className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </Button>
    </section>
  )
}
