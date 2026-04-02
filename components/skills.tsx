"use client"

import type React from "react"
import { motion, type Variants } from "framer-motion"
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

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const badgeContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-slate-200/80 dark:border-slate-800/80">
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
                        className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 hover:scale-105 transition-transform cursor-default"
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
