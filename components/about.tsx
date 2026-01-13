import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Code, Shield, Users } from "lucide-react"

export default function About() {
  const highlights = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Education",
      description: "Computer Science at Purdue University",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Development",
      description: "Full-stack development with Cloud & AI integration",
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
    <section id="about" className="py-20 bg-gray-100 dark:bg-gray-950">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          I'm a results-driven student combining technical expertise with strong communication and leadership. I aim to
          innovate at the intersection of artificial intelligence, cloud computing, and security. With hands-on experience at PSEG, Purdue
          research labs, and leadership roles on campus, I bring both technical depth and cross-functional teamwork to
          every project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                {item.icon}
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
