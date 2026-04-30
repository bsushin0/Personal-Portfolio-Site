import { Github, Linkedin, Mail } from "lucide-react"
import pkg from "@/package.json"

const name = "Sushin Bandha"
const title = "AI Engineer & Product Manager"
const githubUrl = "https://github.com/bsushin0"
const linkedinUrl = "https://linkedin.com/in/sushin-bandha"
const emailUrl = "mailto:Bsushin@outlook.com"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-effect border-t border-border-subtle/80 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
            <p className="text-foreground/60 mb-3">{title}</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/15 text-[11px] font-mono font-medium text-primary/50 tracking-wider select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 inline-block" />
              v{pkg.version}
            </span>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={emailUrl}
              className="text-foreground/70 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </div>

          <div className="text-foreground/50 text-sm">
            © {currentYear} {name}. All rights reserved.
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-subtle/80 text-center text-foreground/50 text-sm">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui • Powered by AI Innovation</p>
        </div>
      </div>
    </footer>
  )
}
