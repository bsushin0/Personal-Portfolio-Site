import { Github, Linkedin, Mail } from "lucide-react"

const name = "Sushin Bandha"
const title = "AI & Cybersecurity Specialist"
const githubUrl = "https://github.com/bsushin0"
const linkedinUrl = "https://linkedin.com/in/sushin-bandha"
const emailUrl = "mailto:Bsushin@outlook.com"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-effect border-t border-glow-cyan/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 dark:from-cyan-400 to-indigo-500 dark:to-indigo-400 bg-clip-text text-transparent mb-2">{name}</h3>
            <p className="text-slate-600 dark:text-cyan-200/70">{title}</p>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-100 hover:scale-110 transition-all duration-300 hover:drop-shadow-lg hover:drop-shadow-blue-500/30 dark:hover:drop-shadow-cyan-500/50"
            >
              <Github size={20} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-100 hover:scale-110 transition-all duration-300 hover:drop-shadow-lg hover:drop-shadow-blue-500/30 dark:hover:drop-shadow-cyan-500/50"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={emailUrl}
              className="text-blue-600 dark:text-cyan-300 hover:text-blue-700 dark:hover:text-cyan-100 hover:scale-110 transition-all duration-300 hover:drop-shadow-lg hover:drop-shadow-blue-500/30 dark:hover:drop-shadow-cyan-500/50"
            >
              <Mail size={20} />
            </a>
          </div>

          <div className="text-slate-500 dark:text-cyan-400/60 text-sm">
            © {currentYear} {name}. All rights reserved.
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cyan-500/20 text-center text-cyan-400/50 text-sm">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui • Powered by AI Innovation</p>
        </div>
      </div>
    </footer>
  )
}
