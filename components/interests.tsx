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
    <section id="interests" className="py-20 bg-gradient-futuristic border-t border-cyan-500/20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">Interests & Involvement</h2>
        <p className="text-cyan-200/70 dark:text-cyan-200/60 max-w-2xl mx-auto">
          Areas of focus that guide my work in product, AI, and cybersecurity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interests.map((item) => (
          <Card
            key={item.title}
            className="glass-effect-sm border-glow-cyan card-interactive"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {item.icon}
              </div>
              <CardTitle className="text-lg text-cyan-300 dark:text-cyan-400">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-100/80 dark:text-cyan-100/70">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
