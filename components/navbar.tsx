"use client"

import { useState, useEffect } from "react"
import { Menu, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Interests", href: "#interests" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border-subtle/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <a href="#" className="flex-shrink-0 font-bold text-lg md:text-xl text-foreground tracking-tight font-display">
            Sushin Bandha
          </a>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const sectionId = item.href.slice(1)
              const isActive = activeSection === sectionId
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground hover:bg-surface-hover/70"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-3 right-3 h-px bg-primary rounded-full" />
                  )}
                </a>
              )
            })}
            <a
              href="/sushin-bandha-resume.pdf"
              download
              className="ml-3 px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </a>
            <ModeToggle />
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/70 hover:text-foreground hover:bg-surface-hover/70"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border-subtle/80">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-surface-hover/70 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href="/sushin-bandha-resume.pdf"
            download
            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </div>
      </div>
    </nav>
  )
}
