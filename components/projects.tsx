"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { projects } from "@/lib/projects"

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="projects" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Featured Projects</h2>
        <p className="text-cyan-200/80 dark:text-cyan-200/70 max-w-2xl mx-auto">
          Innovative projects combining AI, data analysis, and practical applications to solve real-world problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`border-glow-purple bg-card overflow-hidden transition-all duration-300 ${
              hoveredId === project.id ? "transform scale-[1.02] shadow-2xl shadow-purple-500/30" : ""
            }`}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                style={{
                  transform: hoveredId === project.id ? "scale(1.05)" : "scale(1)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <CardHeader>
              <CardTitle className="text-cyan-300 dark:text-cyan-400">{project.title}</CardTitle>
              <CardDescription className="text-cyan-200/70 dark:text-cyan-200/60">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-purple-500/20 dark:bg-purple-500/30 text-purple-200 dark:text-purple-300 border border-purple-500/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {project.liveUrl && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
