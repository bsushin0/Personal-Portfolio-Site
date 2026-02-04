import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Shield, Cog, Brain } from "lucide-react"

type SkillCategory = {
  id: number
  title: string
  icon: React.ReactNode
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    id: 1,
    title: "Programming Languages",
    icon: <Code className="h-5 w-5" />,
    skills: ["Python", "Java", "C", "JavaScript", "TypeScript", "SQL", "R", "C++", "Power Fx"],
  },
  {
    id: 2,
    title: "Platforms & Tools",
    icon: <Cog className="h-5 w-5" />,
    skills: ["Salesforce CRM", "ServiceNow ITSM", "SAP ERP", "Microsoft Power Platform", "Git"],
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    icon: <Brain className="h-5 w-5" />,
    skills: ["TensorFlow", "Keras", "MLOps", "Data Analysis", "Time-Series Forecasting"],
  },
  {
    id: 4,
    title: "Product & Leadership",
    icon: <Shield className="h-5 w-5" />,
    skills: ["Product Management", "Product Strategy", "Team Leadership", "UAT/SIT Testing", "Stakeholder Management"],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Technical Skills</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          A comprehensive toolkit spanning programming, platforms, AI/ML, and cybersecurity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((category) => (
          <Card
            key={category.id}
            className="glass-effect-sm border-glow card-interactive"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
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
                    className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 hover:scale-105 transition-transform cursor-default"
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
