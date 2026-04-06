"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Code, Shield, Users } from "lucide-react"
import { headingVariants, cardVariants, staggerContainer as containerVariants } from "@/lib/motion-variants"

export default function About() {
  const highlights = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Education",
      description: "B.S. Computer Science (AI major) at Purdue University — entering with 27 AP credits, Data Mine Corporate Partners participant, ACERIAS Security Seminar graduate.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Product & ML",
      description: "Two summers as Product Intern at PSEG (IAM ownership, 300+ UAT cases, 25-person team lead). Built a 92%-accurate wine sales forecasting system and a full MLOps pipeline for BASF.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security",
      description: "Hands-on IAM product ownership at a Fortune 500 utility. ACERIAS cybersecurity coursework. Current student patroller with Purdue University Police Department.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leadership",
      description: "Led 25-intern cross-functional teams at PSEG, mentored 20–25 first-year students as a Boiler Gold Rush Team Leader, and tutored students at Kumon.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-slate-200/80 dark:border-slate-800/80">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">About Me</h2>
        <p className="text-foreground/60 max-w-3xl mx-auto text-lg leading-relaxed">
          I&apos;m a Computer Science student specializing in Artificial Intelligence at Purdue University (class of 2027),
          pursuing a private pilot license on the side, and working toward an EMT certification — because I genuinely
          believe the best builders understand the systems and people they serve. My academic trajectory reflects that: I
          entered Purdue with 27 AP credits, joined The Data Mine corporate partners program to work on real industry
          data problems, and completed the CERIAS cybersecurity seminar.
        </p>
        <p className="text-foreground/60 max-w-3xl mx-auto text-lg leading-relaxed mt-4">
          Professionally, I&apos;ve spent two summers at PSEG as a Product Intern — owning an IAM product backlog of 50+
          items, executing 300+ UAT and SIT cases, and leading a cross-functional team of 25 interns to ship a
          company-wide onboarding site. In parallel, I built a time-series ML forecasting system for BASF that achieved
          ~92% accuracy and cut model update time from days to hours. The throughline: I care about shipping things
          that actually work in production, not just demos. I&apos;m especially drawn to Aerospace and National Security —
          domains where product rigor, secure AI, and reliability are not optional.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        {highlights.map((item, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className="glass-effect-sm border-glow card-interactive h-full">
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
