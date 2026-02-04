import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Shield, Cpu } from "lucide-react"

const interests = [
  {
    title: "Aerospace Technology",
    description: "Interested in aviation systems, aerospace tech, and national security applications of AI.",
    icon: <Plane className="h-6 w-6" />,
  },
  {
    title: "Secure AI Systems",
    description: "Focused on building reliable, secure, and compliant AI products for high-stakes environments.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Applied ML Products",
    description: "Enjoy translating machine learning research into real-world product value and user outcomes.",
    icon: <Cpu className="h-6 w-6" />,
  },
]

export default function Interests() {
  return (
    <section id="interests" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">Interests & Involvement</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Areas of focus that guide my work in product, AI, and cybersecurity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interests.map((item) => (
          <Card
            key={item.title}
            className="glass-effect-sm border-glow card-interactive"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                {item.icon}
              </div>
              <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
