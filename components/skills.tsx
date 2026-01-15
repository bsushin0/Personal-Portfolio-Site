import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Shield, Cog, Brain } from "lucide-react"

type SkillCategory = {
  id: number
  title: string
  icon: React.ReactNode
  skills: string[]
  color: string
}

const skillCategories: SkillCategory[] = [
  {
    id: 1,
    title: "Programming Languages",
    icon: <Code className="h-5 w-5" />,
    skills: ["Python", "Java", "JavaScript", "HTML/CSS", "SQL"],
    color: "bg-blue-500/20 dark:bg-blue-500/30 text-blue-200 dark:text-blue-300 border border-blue-500/30",
  },
  {
    id: 2,
    title: "Platforms & Tools",
    icon: <Cog className="h-5 w-5" />,
    skills: ["Salesforce", "Power Automate", "ServiceNow", "Git"],
    color: "bg-purple-500/20 dark:bg-purple-500/30 text-purple-200 dark:text-purple-300 border border-purple-500/30",
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    icon: <Brain className="h-5 w-5" />,
    skills: ["AI/ML", "LLM Integration", "Data Analysis", "System Integration"],
    color: "bg-cyan-500/20 dark:bg-cyan-500/30 text-cyan-200 dark:text-cyan-300 border border-cyan-500/30",
  },
  {
    id: 4,
    title: "Security & Testing",
    icon: <Shield className="h-5 w-5" />,
    skills: ["Cybersecurity", "IAM", "System Integration Testing", "Security Analysis"],
    color: "bg-red-500/20 dark:bg-red-500/30 text-red-200 dark:text-red-300 border border-red-500/30",
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gradient-futuristic border-t border-cyan-500/20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Technical Skills</h2>
        <p className="text-cyan-200/80 dark:text-cyan-200/70 max-w-2xl mx-auto">
          A comprehensive toolkit spanning programming, platforms, AI/ML, and cybersecurity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((category) => (
          <Card
            key={category.id}
            className="border-glow-purple bg-card hover:border-purple-400/60 transition-all duration-300 hover:transform hover:scale-[1.02]"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg text-cyan-300">
                <div className="p-2 rounded-lg bg-purple-500/20 dark:bg-purple-500/30 text-purple-400 dark:text-purple-300 border border-purple-500/30">
                  {category.icon}
                </div>
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className={`${category.color} hover:scale-105 transition-transform cursor-default`}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
