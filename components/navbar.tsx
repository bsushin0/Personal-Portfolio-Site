"use client"

import { useState } from "react"
import { Menu, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const logoText = "Sushin Bandha"
const logoHref = "#"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Interests", href: "#interests" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex-shrink-0 font-semibold text-lg md:text-xl text-foreground tracking-tight">
            <a href={logoHref}>{logoText}</a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-slate-100/70 dark:hover:bg-slate-900/40 transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <a
              href="/Sushin Bandha Resume.pdf"
              download
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
            <ModeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/70 hover:text-foreground hover:bg-slate-100/70 dark:hover:bg-slate-900/40"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200/80 dark:border-slate-800/80">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-slate-100/70 dark:hover:bg-slate-900/40 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href="/Sushin Bandha Resume.pdf"
            download
            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
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
