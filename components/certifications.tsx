import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { certifications } from "@/lib/certifications"

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-gradient-futuristic border-t border-cyan-500/20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">Certifications</h2>
        <p className="text-cyan-200/70 dark:text-cyan-200/60 max-w-2xl mx-auto">
          Professional certifications demonstrating expertise in cybersecurity and industry best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className="bg-card dark:bg-gray-900 border-glow-purple hover:border-purple-400/60 hover:scale-[1.02] transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Award size={24} />
              </div>
              <div>
                <CardTitle className="text-lg text-cyan-300 dark:text-cyan-400">{cert.title}</CardTitle>
                <CardDescription className="text-cyan-200/70 dark:text-cyan-200/60">
                  {cert.issuer} • {cert.date}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-100/80 dark:text-cyan-100/70">{cert.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
