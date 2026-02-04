import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Code, Shield, Users } from "lucide-react"

export default function About() {
  const highlights = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Education",
      description: "B.S. in Artificial Intelligence at Purdue University (Expected May 2027)",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Product & ML",
      description: "Product Management, Machine Learning, and MLOps",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security",
      description: "Cybersecurity and IAM expertise",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leadership",
      description: "Team leadership and mentoring experience",
    },
  ]

  return (
    <section id="about" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">About Me</h2>
        <p className="text-foreground/60 max-w-3xl mx-auto text-lg leading-relaxed">
          I&apos;m a results-driven AI student combining technical expertise with strong communication and leadership. I specialize in
          user-centric products at the intersection of machine learning and business strategy. With hands-on experience as a
          Product Intern at PSEG, leading cross-functional teams, and building ML solutions for BASF, I bring both technical
          depth and strategic thinking to every project. I&apos;m especially interested in Aerospace and National Security, where
          product rigor and secure AI systems create outsized impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item, index) => (
          <Card
            key={index}
            className="glass-effect-sm border-glow card-interactive"
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-4 border border-indigo-500/20">
                {item.icon}
              </div>
              <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-foreground/60">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
