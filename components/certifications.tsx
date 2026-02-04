import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { certifications } from "@/lib/certifications"

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-glow-cyan/30">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 dark:from-cyan-400 to-indigo-500 dark:to-indigo-400 bg-clip-text text-transparent mb-4">Certifications</h2>
        <p className="text-slate-600 dark:text-cyan-200/70 max-w-2xl mx-auto">
          Professional certifications demonstrating expertise in cybersecurity and industry best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className="glass-effect-sm border-glow-cyan card-interactive"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400/20 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-400/30 dark:border-cyan-400/20">
                <Award size={24} />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-cyan-300">{cert.title}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-cyan-200/70">
                  {cert.issuer} • {cert.date}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-cyan-100/80">{cert.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
