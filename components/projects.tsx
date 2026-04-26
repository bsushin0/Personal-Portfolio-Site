"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { headingVariants, staggerContainerSlow as containerVariants } from "@/lib/motion-variants"
import TiltCard from "@/components/tilt-card"

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
}

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [featured, ...rest] = projects

  return (
    <section id="projects" className="py-20">
      <motion.div
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-primary/65 mb-3">Selected Work</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Featured Projects</h2>
      </motion.div>

      <motion.div
        className="space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Featured first project — full-width horizontal card */}
        <motion.div variants={cardVariants}>
          <TiltCard>
            <Card
              className={`glass-effect-sm border-glow-indigo-lg overflow-hidden flex flex-col md:flex-row ${
                hoveredId === featured.id ? "shadow-glow-indigo-lg" : ""
              }`}
              onMouseEnter={() => setHoveredId(featured.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative md:w-[42%] h-56 md:h-auto overflow-hidden flex-shrink-0">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                  style={{ transform: hoveredId === featured.id ? "scale(1.04)" : "scale(1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/25" />
                {featured.status === "not-available" && (
                  <div className="absolute top-4 left-4 bg-error/90 backdrop-blur-sm text-error-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Not Available
                  </div>
                )}
                {featured.status === "coming-soon" && (
                  <div className="absolute top-4 left-4 bg-warning/90 backdrop-blur-sm text-warning-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Coming Soon
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-6 md:p-8">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary/55">
                    Featured Project
                  </span>
                  <span className="text-5xl font-bold text-foreground/[0.05] select-none leading-none">01</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">{featured.title}</h3>
                <p className="text-foreground/60 mb-5 leading-relaxed flex-1 text-[0.95rem]">{featured.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {featured.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-surface-tag text-foreground/70 border border-border-subtle/80 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4 pt-3 border-t border-border-subtle/40">
                  {featured.githubUrl && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90 hover:bg-surface-hover/70 px-0 h-8"
                    >
                      <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1.5 h-3.5 w-3.5" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {featured.liveUrl && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90 hover:bg-surface-hover/70 px-0 h-8"
                    >
                      <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TiltCard>
        </motion.div>

        {/* Remaining projects — 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((project, idx) => (
            <motion.div key={project.id} variants={cardVariants}>
              <TiltCard className="h-full">
                <Card
                  className={`glass-effect-sm border-glow-indigo-lg overflow-hidden h-full flex flex-col ${
                    hoveredId === project.id ? "shadow-glow-indigo-lg" : ""
                  }`}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                      style={{ transform: hoveredId === project.id ? "scale(1.05)" : "scale(1)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {project.status === "not-available" && (
                      <div className="absolute top-3 right-3 bg-error/90 backdrop-blur-sm text-error-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                        Not Available
                      </div>
                    )}
                    {project.status === "coming-soon" && (
                      <div className="absolute top-3 right-3 bg-warning/90 backdrop-blur-sm text-warning-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground tracking-tight">{project.title}</h3>
                      <span className="text-3xl font-bold text-foreground/[0.06] select-none leading-none shrink-0">
                        0{idx + 2}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{project.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-surface-tag text-foreground/70 border border-border-subtle/80 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 gap-3 border-t border-border-subtle/40">
                    {project.githubUrl && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/90 hover:bg-surface-hover/70 px-0 h-8"
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-1.5 h-3.5 w-3.5" />
                          View Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/90 hover:bg-surface-hover/70 px-0 h-8"
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
