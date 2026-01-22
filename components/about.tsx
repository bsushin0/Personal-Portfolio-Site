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
    <section id="about" className="py-20 bg-gradient-futuristic border-t border-cyan-500/20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">About Me</h2>
        <p className="text-cyan-200/70 dark:text-cyan-200/60 max-w-3xl mx-auto text-lg leading-relaxed">
          I&apos;m a results-driven AI student combining technical expertise with strong communication and leadership. I specialize in
          user-centric products at the intersection of machine learning and business strategy. With hands-on experience as a
          Product Intern at PSEG, leading cross-functional teams, and building ML solutions for BASF, I bring both technical
          depth and strategic thinking to every project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item, index) => (
          <Card
            key={index}
            className="bg-card dark:bg-gray-900 border-glow-purple hover:scale-[1.05] transition-all duration-300 hover:border-purple-400/60"
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 dark:text-purple-400 mb-4 border border-purple-500/30">
                {item.icon}
              </div>
              <CardTitle className="text-lg text-cyan-300 dark:text-cyan-400">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-cyan-200/70 dark:text-cyan-200/60">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
