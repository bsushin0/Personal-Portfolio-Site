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
    color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  {
    id: 2,
    title: "Platforms & Tools",
    icon: <Cog className="h-5 w-5" />,
    skills: ["Salesforce", "Power Automate", "ServiceNow", "Git"],
    color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    icon: <Brain className="h-5 w-5" />,
    skills: ["AI/ML", "LLM Integration", "Data Analysis", "System Integration"],
    color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: 4,
    title: "Security & Testing",
    icon: <Shield className="h-5 w-5" />,
    skills: ["Cybersecurity", "IAM", "System Integration Testing", "Security Analysis"],
    color: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300",
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gray-100 dark:bg-gray-950">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A comprehensive toolkit spanning programming, platforms, AI/ML, and cybersecurity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((category) => (
          <Card
            key={category.id}
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
                    className={`${category.color} border-0 hover:scale-105 transition-transform cursor-default`}
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
