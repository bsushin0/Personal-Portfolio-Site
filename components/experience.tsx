"use client"

import { motion, type Variants } from "framer-motion"
import { headingVariants } from "@/lib/motion-variants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

type Experience = {
  id: number
  title: string
  company: string
  period: string
  startDate: Date
  endDate: Date
  type: string
  description: string[]
  skills: string[]
}

// Helper function to parse date strings like "June 2025" or "September 2025 - Present"
function parseDate(dateStr: string): Date {
  const months: { [key: string]: number } = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  }

  const parts = dateStr.toLowerCase().split(/\s+/)
  const month = months[parts[0]]
  const year = parseInt(parts[1])

  return new Date(year, month, 1)
}

// Helper function to check if two date ranges overlap
function hasOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && start2 < end1
}

// Helper function to find overlaps with other experiences
function findOverlappingIds(exp: Experience, allExps: Experience[]): number[] {
  return allExps
    .filter(other => other.id !== exp.id && hasOverlap(exp.startDate, exp.endDate, other.startDate, other.endDate))
    .map(other => other.id)
}

const experiencesData: Omit<Experience, 'startDate' | 'endDate'>[] = [
  {
    id: 1,
    title: "PSSP Student Security Patroller",
    company: "Purdue University Police Department",
    period: "September 2025 - Present",
    type: "Part-time",
    description: [
      "Conduct systematic campus security operations including facility inspections, interior sweeps, and unauthorized access identification — findings documented in Git-tracked compliance reports",
      "Coordinate emergency response and crowd management during university events alongside full-time officers, leveraging real-time communication tools to reduce incident response time",
      "Apply structured risk assessment frameworks to identify and mitigate environmental safety hazards, maintaining campus security compliance across academic and administrative assets",
    ],
    skills: ["Risk Assessment", "Safety Compliance", "Emergency Response", "Crowd Control", "Security Operations", "Facility Inspections", "Git", "Documentation"],
  },
  {
    id: 2,
    title: "Event Supervisor — Event Operations & Security",
    company: "Purdue Athletics",
    period: "August 2025 - Present",
    type: "Part-time",
    description: [
      "Supervised multi-location event operations for 10,000+ patron Big Ten athletic events, coordinating cross-site staff deployment and managing real-time communication across security, gate, and parking teams",
      "Directed cross-functional staff teams spanning multiple entry points and facility zones, delegating responsibilities, resolving personnel conflicts, and ensuring consistent service delivery under high-pressure conditions",
      "Executed time-critical incident response decisions, coordinating with law enforcement and facility management to resolve safety incidents swiftly while maintaining zero disruption to event flow",
      "Applied data-driven resource allocation strategies based on lot capacity and permit-tier analytics, maximizing space utilization and reducing entry/exit congestion by 60% at peak-attendance events",
    ],
    skills: ["Event Operations", "Cross-functional Leadership", "Incident Response", "Resource Allocation", "Security Management", "Stakeholder Communication"],
  },
  {
    id: 4,
    title: "Product Management Intern — Identity & Access Management (IAM)",
    company: "PSEG",
    period: "June 2025 - August 2025",
    type: "Internship",
    description: [
      "Served as product owner for an enterprise IAM platform, triaging and prioritizing a 50+ item backlog of security bug fixes and feature enhancements, improving system usability and access-control reliability",
      "Achieved 99% defect-free launch by designing and executing 300+ UAT and SIT test cases, validating end-to-end user workflows and access permission logic across business-critical systems",
      "Built a business case for a new IAM scalability solution — conducted market analysis and stakeholder user research using Excel and PowerPoint — securing executive approval and a documented growth roadmap",
      "Collaborated with security engineers, compliance leads, and business stakeholders using Agile practices to deliver iterative product improvements on schedule",
    ],
    skills: ["Product Management", "IAM", "UAT", "SIT", "Agile", "Stakeholder Management", "Business Case Development", "Access Control"],
  },
  {
    id: 5,
    title: "Product Intern — Automation & Internal Tools",
    company: "PSEG",
    period: "June 2024 - August 2024",
    type: "Internship",
    description: [
      "Engineered and presented 5 Proof of Concept (PoC) automation tools to senior leadership, securing executive approval and budget allocation for full-scale product development",
      "Led a cross-functional team of 25 interns to define requirements, architect, and launch a company-wide employee onboarding portal — directly accelerating new-hire time-to-productivity",
      "Owned end-to-end development of a critical process automation tool using Python and Salesforce, transforming a multi-day manual workflow into a near-instant execution pipeline",
    ],
    skills: ["Product Strategy", "Cross-functional Leadership", "Automation", "POC Development", "Python", "Salesforce"],
  },
]

// Build experiences with parsed dates
const experiences: Experience[] = experiencesData.map(exp => {
  const periodParts = exp.period.split(" - ")
  const start = parseDate(periodParts[0])
  const end = periodParts[1].toLowerCase() === "present" ? new Date() : parseDate(periodParts[1])

  return {
    ...exp,
    startDate: start,
    endDate: end,
  }
})

// Calculate overlaps for each experience
const overlapMap = new Map<number, number[]>()
experiences.forEach(exp => {
  overlapMap.set(exp.id, findOverlappingIds(exp, experiences))
})

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Experience</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Product and leadership roles are highlighted here. For technical AI work, see the
          <a href="#projects" className="ml-1 text-primary underline underline-offset-4 hover:text-primary/80">Projects</a> section.
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line - only visible on md and up */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-border-subtle via-primary/30 to-border-subtle" />

        {/* Timeline Items */}
        <div className="space-y-8 md:space-y-12">
          {experiences.map((exp, index) => {
            const overlappingIds = overlapMap.get(exp.id) || []
            const isOverlapping = overlappingIds.length > 0

            return (
              <motion.div
                key={exp.id}
                className={`relative md:flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
              >
                {/* Timeline Point */}
                <div className="hidden md:flex md:w-1/2 md:justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:top-6">
                  <div className="relative z-10 flex items-center justify-center">
                    {isOverlapping ? (
                      <>
                        {/* Outer pulsing ring for overlap indicator */}
                        <div className="absolute w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
                        {/* Main point */}
                        <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg" />
                      </>
                    ) : (
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg" />
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                  <Card className={`glass-effect-sm border-glow card-interactive h-full ${isOverlapping ? "border-primary/40 dark:border-primary/30" : ""}`}>
                    <CardHeader>
                      <div className="flex flex-col gap-2">
                        <CardTitle className="text-lg text-foreground">{exp.title}</CardTitle>
                        <CardDescription className="text-base font-medium text-foreground/70">
                          {exp.company}
                        </CardDescription>

                        <div className="flex flex-col gap-2 md:flex-row md:justify-between pt-1">
                          <Badge
                            variant="outline"
                            className="w-fit border-border-subtle/80 text-foreground/70 md:order-2"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {exp.period}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="w-fit bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
                          >
                            {exp.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/70">
                            <span className={`text-foreground/40 ${index % 2 === 0 ? "md:text-right" : ""}`}>●</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        {exp.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-surface-tag text-foreground/70 border border-border-subtle/80"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
