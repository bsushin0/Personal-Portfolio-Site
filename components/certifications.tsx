import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { certifications } from "@/lib/certifications"

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">Certifications</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Professional certifications demonstrating expertise in cybersecurity and industry best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className="glass-effect-sm border-glow card-interactive"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Award size={24} />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">{cert.title}</CardTitle>
                <CardDescription className="text-foreground/60">
                  {cert.issuer} • {cert.date}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">{cert.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
