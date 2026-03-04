"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { projects } from "@/lib/projects"

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="projects" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Featured Projects</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Innovative projects combining AI, data analysis, and practical applications to solve real-world problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`glass-effect-sm border-glow-indigo-lg overflow-hidden card-interactive-sm ${
              hoveredId === project.id ? "shadow-glow-indigo-lg" : ""
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
              
              {/* Status Banner */}
              {project.status === "not-available" && (
                <div className="absolute top-4 right-4 bg-rose-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              {project.status === "coming-soon" && (
                <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-foreground">{project.title}</CardTitle>
              <CardDescription className="text-foreground/60">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
                {project.githubUrl && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/90 hover:bg-slate-100/70 dark:hover:bg-slate-900/40"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/90 hover:bg-slate-100/70 dark:hover:bg-slate-900/40"
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
