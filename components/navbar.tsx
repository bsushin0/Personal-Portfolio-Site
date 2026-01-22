"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const logoText = "Sushin Bandha"
const logoHref = "#"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-cyan-500/20 dark:border-cyan-500/20 border-blue-200 dark:border-blue-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex-shrink-0 font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            <a href={logoHref}>{logoText}</a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-cyan-100 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <ModeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-cyan-300 hover:text-blue-600 dark:hover:text-cyan-100 hover:bg-blue-50 dark:hover:bg-cyan-500/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-200 dark:border-cyan-500/20">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-cyan-100 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
