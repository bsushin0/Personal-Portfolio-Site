import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

type Certification = {
  id: number
  title: string
  issuer: string
  date: string
  description: string
  icon: string
}

const certifications: Certification[] = [
  {
    id: 1,
    title: "CompTIA Security+ (In Progress)",
    issuer: "CompTIA",
    date: "Present",
    description: "Industry-standard certification for cybersecurity fundamentals and best practices.",
    icon: "🛡️",
  },
  {
    id: 2,
    title: "Google Cybersecurity Certificate",
    issuer: "Google",
    date: "2024",
    description: "Comprehensive program covering cybersecurity principles, tools, and practices.",
    icon: "🔒",
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-gray-100 dark:bg-gray-950">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Professional certifications demonstrating expertise in cybersecurity and industry best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Award size={24} />
              </div>
              <div>
                <CardTitle className="text-lg text-emerald-600 dark:text-emerald-400">{cert.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {cert.issuer} • {cert.date}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{cert.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
