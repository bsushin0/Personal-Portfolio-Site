"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Lock, Cog, Brain, Cloud, Users } from "lucide-react"
import {
  headingVariants,
  cardVariants,
  staggerContainer as containerVariants,
  fastStaggerContainer as badgeContainerVariants,
  badgeVariants,
} from "@/lib/motion-variants"

type SkillCategory = {
  id: number
  title: string
  icon: React.ReactNode
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    id: 1,
    title: "Languages & Frameworks",
    icon: <Code className="h-5 w-5" />,
    skills: ["Python", "Java", "C/C++", "SQL", "JavaScript", "TypeScript", "R", "HTML", "Bash/Linux", "Agile/Scrum"],
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    icon: <Brain className="h-5 w-5" />,
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "NLP", "Deep Learning", "Generative AI", "RAG", "LLM Fine-tuning", "MLOps", "Time-Series Forecasting"],
  },
  {
    id: 3,
    title: "Cloud & DevOps",
    icon: <Cloud className="h-5 w-5" />,
    skills: ["AWS", "Vercel", "CI/CD (GitHub Actions)", "Docker", "Linux Systems Administration", "Serverless Architecture"],
  },
  {
    id: 4,
    title: "Security & IAM",
    icon: <Lock className="h-5 w-5" />,
    skills: ["Identity & Access Management (IAM)", "UAT", "SIT", "Access Control", "Security Operations", "Risk Assessment", "Compliance Documentation"],
  },
  {
    id: 5,
    title: "Tools & Platforms",
    icon: <Cog className="h-5 w-5" />,
    skills: ["PostgreSQL", "Next.js", "Salesforce", "Git", "Power Platform", "Microsoft Azure", "SAP", "Resend", "Google API", "Prompt Engineering", "Ollama", "JIRA"],
  },
  {
    id: 6,
    title: "Product & Leadership",
    icon: <Users className="h-5 w-5" />,
    skills: ["Product Management", "Technical Leadership", "Stakeholder Management", "Cross-functional Collaboration", "AI Ethics", "Analytical Problem-Solving", "Strategic Communication"],
  },
]


export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-border-subtle/80">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Technical Skills</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          A comprehensive toolkit spanning programming, platforms, AI/ML, and product leadership.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {skillCategories.map((category) => (
          <motion.div key={category.id} variants={cardVariants}>
            <Card className="glass-effect-sm border-glow card-interactive h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    {category.icon}
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={badgeContainerVariants}
                >
                  {category.skills.map((skill) => (
                    <motion.div key={skill} variants={badgeVariants}>
                      <Badge
                        className="bg-surface-tag text-foreground/70 border border-border-subtle/80 hover:scale-105 transition-transform cursor-default"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
