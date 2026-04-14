"use client"

import { motion, type Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, TrendingUp, BookOpen, Star } from "lucide-react"
import { headingVariants, cardVariants as fadeUpVariants, badgeVariants } from "@/lib/motion-variants"

const coreCourses = [
  "Intro to Artificial Intelligence",
  "Data Mining & Machine Learning",
  "Data Structures & Algorithms",
  "Systems Programming",
  "Computer Architecture",
  "OOP (Java)",
  "Programming in C",
  "Intro to Analysis of Algorithms",
  "Probability",
  "Linear Algebra",
  "Ethics of Data Science",
  "Cognitive Psychology",
]

const highlights = [
  {
    icon: <Star className="h-5 w-5" />,
    label: "The Data Mine",
    detail: "Corporate Partners program — semesters I & III, collaborating with industry partners on data-driven projects",
  },
  {
    icon: <Star className="h-5 w-5" />,
    label: "CERIAS Security Seminar",
    detail: "Specialized cybersecurity coursework (CS 59100) through Purdue's security research center",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: "Upward GPA Trend",
    detail: "Improved from 2.66 (Fall 2023) to 3.28 (Spring 2025) — consistent semester-over-semester growth",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: "27 AP Transfer Credits",
    detail: "Entered Purdue with advanced standing in Biology, CS, English, Calculus I & II, and Psychology",
  },
  {
    icon: <Star className="h-5 w-5" />,
    label: "Floor Senator",
    detail: "Purdue University Residences student government representative (Aug 2025 – May 2026)",
  },
]


const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const badgeContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}


export default function Education() {
  return (
    <section id="education" className="py-20 border-t border-border-subtle/80">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">Education</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Computer Science degree with an AI specialization, grounded in mathematics, data science, and ethics.
        </p>
      </motion.div>

      {/* Degree Header Card */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariants}
        className="mb-8"
      >
        <Card className="glass-effect-sm border-glow">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">B.S. Artificial Intelligence</CardTitle>
                  <p className="text-foreground/60 text-sm font-medium mt-0.5">Minor: Computer Networking and Information Technology (CNIT)</p>
                  <p className="text-foreground/70 font-medium mt-1">Purdue University, West Lafayette, IN</p>
                  <p className="text-foreground/50 text-sm mt-1">August 2023 – May 2027 (Expected)</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 w-fit">
                  GPA: 2.94 / 4.00
                </Badge>
                <Badge variant="outline" className="border-border-subtle/80 text-foreground/60 w-fit">
                  Good Academic Standing
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Highlights */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
        >
          <Card className="glass-effect-sm border-glow h-full">
            <CardHeader>
              <CardTitle className="text-base text-foreground/80 uppercase tracking-widest text-sm">
                Programs & Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
              >
                {highlights.map((h) => (
                  <motion.div key={h.label} className="flex items-start gap-3" variants={itemVariants}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0 mt-0.5">
                      {h.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{h.label}</p>
                      <p className="text-sm text-foreground/60 leading-relaxed">{h.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Coursework */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
        >
          <Card className="glass-effect-sm border-glow h-full">
            <CardHeader>
              <CardTitle className="text-base text-foreground/80 uppercase tracking-widest text-sm">
                Relevant Coursework
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
                {coreCourses.map((course) => (
                  <motion.div key={course} variants={badgeVariants}>
                    <Badge
                      variant="secondary"
                      className="bg-surface-tag text-foreground/70 border border-border-subtle/80"
                    >
                      {course}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-xs text-foreground/40 mt-4">
                Also completed: Multivariate Calculus, Intro to Statistics, Philosophy of Science, Cognitive Psychology,
                and ongoing Aviation coursework (AT 43300 Supervised Aviation Experience).
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
