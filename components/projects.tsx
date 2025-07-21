"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
  githubUrl: string
  liveUrl?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Weather AI Chatbot",
    description:
      "An intelligent LLM-powered tool that analyzes and summarizes weather trends using BASF meteorological datasets. Features natural language processing for weather data interpretation and trend analysis.",
    tags: ["Python", "LLM", "AI/ML", "Data Analysis", "Natural Language Processing"],
    image: "/placeholder.svg?height=200&width=400",
    githubUrl: "https://github.com/bsushin0",
  },
]

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="projects" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Innovative projects combining AI, data analysis, and practical applications to solve real-world problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ${
              hoveredId === project.id ? "transform scale-[1.02] shadow-lg shadow-emerald-500/10" : ""
            }`}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                style={{
                  transform: hoveredId === project.id ? "scale(1.05)" : "scale(1)",
                }}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-emerald-600 dark:text-emerald-400">{project.title}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => window.open(project.githubUrl, "_blank")}
              >
                <Github className="mr-2 h-4 w-4" />
                Code
              </Button>
              {project.liveUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
