import { Github, Linkedin, Mail, Twitter } from "lucide-react"

// TODO: Personalize this information
const name = "Alex Johnson"
const title = "AI & Cybersecurity Specialist"
const githubUrl = "https://github.com/your-username"
const linkedinUrl = "https://linkedin.com/in/your-username"
const twitterUrl = "https://twitter.com/your-username"
const emailUrl = "mailto:your-email@example.com"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{title}</p>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href={emailUrl}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>

          <div className="text-gray-500 dark:text-gray-500 text-sm">
            © {currentYear} {name}. All rights reserved.
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
        </div>
      </div>
    </footer>
  )
}
