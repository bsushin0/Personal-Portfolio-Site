"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { headingVariants } from "@/lib/motion-variants"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Calendar, ChevronRight } from "lucide-react"
import TiltCard from "@/components/tilt-card"

type Experience = {
  id: number
  title: string
  company: string
  period: string
  startDate: Date
  endDate: Date
  type: string
  summary: string
  description: string[]
  skills: string[]
  narrative: string
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
    summary: "Conduct systematic campus security patrols and compliance documentation alongside full-time PUPD officers.",
    description: [
      "Conduct systematic campus security operations including facility inspections, interior sweeps, and unauthorized access identification — findings documented in Git-tracked compliance reports",
      "Coordinate emergency response and crowd management during university events alongside full-time officers, leveraging real-time communication tools to reduce incident response time",
      "Apply structured risk assessment frameworks to identify and mitigate environmental safety hazards, maintaining campus security compliance across academic and administrative assets",
    ],
    skills: ["Risk Assessment", "Safety Compliance", "Emergency Response", "Crowd Control", "Security Operations", "Facility Inspections", "Git", "Documentation"],
    narrative: "Campus security work is where I apply structured operational thinking in a physically demanding, high-stakes environment. Every patrol is a systematic process — facility inspections follow a documented checklist, findings go into Git-tracked reports, and anomalies get escalated with clear severity context. What I've found is that security operations and software engineering share the same core discipline: consistent process execution prevents the failures that improvisation misses. The NREMT certification I earned alongside this role is no coincidence — emergency preparedness and security response are the same skill applied across different domains.",
  },
  {
    id: 2,
    title: "Event Supervisor — Event Operations & Security",
    company: "Purdue Athletics",
    period: "August 2025 - Present",
    type: "Part-time",
    summary: "Supervise multi-location operations for 10,000+ patron Big Ten athletic events, managing cross-site staff and real-time incident response.",
    description: [
      "Supervised multi-location event operations for 10,000+ patron Big Ten athletic events, coordinating cross-site staff deployment and managing real-time communication across security, gate, and parking teams",
      "Directed cross-functional staff teams spanning multiple entry points and facility zones, delegating responsibilities, resolving personnel conflicts, and ensuring consistent service delivery under high-pressure conditions",
      "Executed time-critical incident response decisions, coordinating with law enforcement and facility management to resolve safety incidents swiftly while maintaining zero disruption to event flow",
      "Applied data-driven resource allocation strategies based on lot capacity and permit-tier analytics, maximizing space utilization and reducing entry/exit congestion by 60% at peak-attendance events",
    ],
    skills: ["Event Operations", "Cross-functional Leadership", "Incident Response", "Resource Allocation", "Security Management", "Stakeholder Communication"],
    narrative: "Managing 10,000+ patron events is a real-time product management problem. You have a fixed set of resources — staff, gates, lots, communication channels — and a dynamic demand curve that spikes unpredictably at kickoff and halftime. The data-driven approach I brought to lot capacity and permit-tier analytics isn't different from how I approached the IAM backlog at PSEG: identify the constraint, measure it, and reallocate resources against it. The 60% congestion reduction came from applying that discipline consistently, not from any single heroic decision. What this role teaches that engineering doesn't is managing human systems under pressure — personnel conflicts don't pause for you to think.",
  },
  {
    id: 4,
    title: "Product Management Intern — Identity & Access Management (IAM)",
    company: "PSEG",
    period: "June 2025 - August 2025",
    type: "Internship",
    summary: "Product owner for an enterprise IAM platform — led 300+ test cases to achieve 99% defect-free launch and built the executive-approved IAM scalability roadmap.",
    description: [
      "Served as product owner for an enterprise IAM platform, triaging and prioritizing a 50+ item backlog of security bug fixes and feature enhancements, improving system usability and access-control reliability",
      "Achieved 99% defect-free launch by designing and executing 300+ UAT and SIT test cases, validating end-to-end user workflows and access permission logic across business-critical systems",
      "Built a business case for a new IAM scalability solution — conducted market analysis and stakeholder user research using Excel and PowerPoint — securing executive approval and a documented growth roadmap",
      "Collaborated with security engineers, compliance leads, and business stakeholders using Agile practices to deliver iterative product improvements on schedule",
    ],
    skills: ["Product Management", "IAM", "UAT", "SIT", "Agile", "Stakeholder Management", "Business Case Development", "Access Control"],
    narrative: "The IAM internship is where I went from understanding product management conceptually to owning it operationally. When you're the product owner for a platform that controls who can access business-critical enterprise systems, shipping with defects isn't a learning experience — it's a security incident. The 99%-defect-free launch came from disciplined test design: 300+ UAT and SIT cases that mapped every permission boundary and integration point before a single user touched production. The business case work was a different muscle — translating a technical scalability problem into executive language, backing it with market analysis, and presenting a roadmap that secured approval. That combination of engineering rigor and business communication is exactly where I want to build.",
  },
  {
    id: 5,
    title: "Product Intern",
    company: "PSEG",
    period: "June 2024 - August 2024",
    type: "Internship",
    summary: "Led 25 interns to ship a company-wide onboarding portal and built 5 PoC automation tools that secured executive approval for full-scale development.",
    description: [
      "Pioneered product initiative by building and presenting five Proof of Concept tools, securing executive approval for full-scale development",
      "Led cross-functional team of 25 interns to define and launch a company-wide onboarding site, incorporating stakeholder and end-user discovery to refine requirements and success metrics",
      "Owned end-to-end development of critical automation tool, transforming multi-day manual process into near-instant execution",
    ],
    skills: ["Product Strategy", "Cross-functional Leadership", "Automation", "POC Development", "Salesforce"],
    narrative: "My first PSEG summer taught me that the fastest path to executive buy-in is showing, not telling. Five PoC tools in eight weeks, each solving a real operational pain point, each demonstrated live to leadership. The 25-person intern team I led to ship the onboarding portal was the most complex coordination challenge I'd faced at that point — 25 people with different skill levels, competing priorities, and no formal authority to direct them. What worked was clarity: clear goals, clear ownership, clear criteria for what 'done' meant. The automation tool I built personally — compressing a multi-day manual process into near-instant execution — was the moment I understood what software is actually for.",
  },
  {
    id: 6,
    title: "BGR Team Leader",
    company: "Purdue University Orientation Programs",
    period: "September 2023 - August 2024",
    type: "Volunteer",
    summary: "Mentored 20–25 first-year students through Boiler Gold Rush orientation and collaborated to design cohesive orientation programming.",
    description: [
      "Served as a Team Leader (TL) during Boiler Gold Rush, responsible for welcoming, mentoring, and supporting a cohort of 20–25 first-year students through orientation programs",
      "Guided and coordinated student groups through events, campus navigation, and resources to accelerate acclimation and build community while fostering an inclusive and welcoming environment",
      "Coordinated closely with fellow Team Leaders to design and deliver a cohesive, immersive orientation experience across sessions, aligning activities and messaging for consistent student support",
      "Provided ongoing peer mentorship and informal advising — acting as a resource, friend, and advocate — and collaborated with Orientation Programs staff to train volunteers and iterate on programming based on participant feedback",
    ],
    skills: ["Leadership", "Group Facilitation", "Mentoring", "Event Coordination", "Campus Navigation", "Volunteer Training", "Community Building", "Team Collaboration"],
    narrative: "BGR was my first leadership role with real human stakes — not project deliverables, but 20–25 first-year students navigating one of the most disorienting weeks of their lives. The skills that mattered were the ones that don't show up on a technical resume: reading a room, managing energy across a 12-hour orientation day, adapting to a student who was struggling without drawing attention to it. I chose to volunteer a second year specifically to iterate — I knew the program's weaknesses from year one and wanted to fix them. The experience of facilitating large group dynamics under time pressure with limited resources is directly transferable to engineering team leadership, even if the domain looks completely different.",
  },
  {
    id: 7,
    title: "Hospital Clinical Rotation — Emergency Department",
    company: "IU Health — Arnett Hospital",
    period: "October 2026 - December 2026",
    type: "Clinical",
    summary: "Completed 28-hour emergency department rotation observing and assisting with EMT functions across live ER intake and patient care workflows.",
    description: [
      "Completed a 28-hour emergency department clinical rotation, observing and assisting with EMT functions within a hospital setting across live ER intake and patient care workflows",
      "Gained hands-on exposure to hospital-based emergency protocols, learning how EMT scope of practice and standard of care (SOC) differs between pre-hospital and in-hospital ER operations",
      "Supported clinical staff during patient assessment, triage support, and care coordination — developing adaptability across high-acuity, fast-paced medical environments",
    ],
    skills: ["Emergency Medicine", "Patient Assessment", "Triage", "Clinical Protocols", "Care Coordination", "NREMT"],
    narrative: "The hospital ER rotation was where NREMT training met the reality of in-hospital emergency medicine. The most striking thing was the difference in scope between pre-hospital EMT work and ER operations — the ER is a high-resource environment with physicians, nurses, and specialists; the field is you, a partner, and the tools in the ambulance. Both require clinical decision-making under pressure, but the constraints are completely different. Those 28 hours gave me direct exposure to triage decision-making, care coordination across specialties, and how high-acuity patient care actually flows in a real ER. The adaptability I developed — quickly orienting to a new environment and functioning usefully in it — is something I carry into every new technical context.",
  },
  {
    id: 9,
    title: "Field Ride-Along Rotation — Pre-Hospital EMS",
    company: "TEAS — Tippecanoe Emergency Ambulance Service",
    period: "October 2026 - December 2026",
    type: "Clinical",
    summary: "Completed 28-hour field ride-along responding to live emergency calls alongside certified EMTs and paramedics in pre-hospital EMS.",
    description: [
      "Completed a 28-hour field ride-along with the local Lafayette EMS system, responding to live emergency calls alongside certified EMTs and paramedics in a pre-hospital environment",
      "Observed and assisted with patient assessment, scene management, and emergency medical interventions across a range of medical and trauma calls",
      "Applied NREMT training in real-world field conditions, reinforcing clinical decision-making, patient communication, and protocol adherence under time-critical circumstances",
    ],
    skills: ["Pre-Hospital EMS", "Scene Management", "Trauma Response", "Clinical Decision-Making", "NREMT", "Emergency Response"],
    narrative: "Pre-hospital EMS is the most uncontrolled environment I've worked in — you respond to calls where you don't know what you're walking into, with a fixed kit, in a stranger's home or on a roadway. What NREMT training prepares you for is a systematic assessment protocol that works in chaos: scene safety, primary survey, history, interventions, transport decision. The discipline of that protocol under pressure is directly analogous to how I approach technical debugging — systematic, evidence-based, no skipping steps even when you think you know the answer. The field ride-along validated that the structured approach to emergency medicine translates to real situations with real patients.",
  },
  {
    id: 8,
    title: "Tutor",
    company: "Kumon",
    period: "June 2022 - August 2023",
    type: "Part-time",
    summary: "Taught mathematics and English to elementary and middle school students with instruction customized to individual learning pace and style.",
    description: [
      "Taught mathematics and English to elementary and middle school students, customizing instruction to individual learning styles and pace",
      "Developed engaging lesson plans and assessments that improved student proficiency and test scores",
      "Mentored struggling students through patient, one-on-one instruction and positive reinforcement",
    ],
    skills: ["Teaching", "Curriculum Development", "Student Mentoring", "Communication", "Patience"],
    narrative: "Teaching at Kumon before I had any formal leadership experience taught me the most fundamental communication skill: meeting people where they are. Every student had a different cognitive style, a different background with math, a different relationship with failure and frustration. The ones who were struggling the most weren't lacking intelligence — they were lacking a framework that matched how they thought. Adapting instruction in real-time based on a student's response is something I still do when explaining technical concepts to non-technical stakeholders, or when onboarding someone to a new codebase. The patience required to teach well and the patience required to debug a complex system are the same quality.",
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

interface ExperienceModalProps {
  exp: Experience | null
  onClose: () => void
}

function ExperienceModal({ exp, onClose }: ExperienceModalProps) {
  if (!exp) return null
  return (
    <Dialog open={!!exp} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge
              variant="secondary"
              className="w-fit text-[11px] px-2 py-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
            >
              {exp.type}
            </Badge>
            <span className="text-xs text-foreground/40 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {exp.period}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground leading-snug">{exp.title}</DialogTitle>
          <DialogDescription className="text-sm font-medium text-foreground/55">{exp.company}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Narrative / biopic */}
          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/15 p-4">
            <p className="text-sm text-foreground/70 leading-relaxed italic">{exp.narrative}</p>
          </div>

          {/* Bullet points */}
          <div>
            <p className="text-xs font-semibold text-foreground/45 uppercase tracking-wider mb-3">Responsibilities & Achievements</p>
            <ul className="space-y-3">
              {exp.description.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/65 leading-relaxed">
                  <span className="text-primary/40 mt-[0.18em] shrink-0 font-medium">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold text-foreground/45 uppercase tracking-wider mb-2">Skills Applied</p>
            <div className="flex flex-wrap gap-1.5">
              {exp.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-surface-tag text-foreground/60 border border-border-subtle/80 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Experience() {
  const [activeExp, setActiveExp] = useState<Experience | null>(null)

  return (
    <section id="experience" className="py-20">
      <motion.div
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-primary/65 mb-3">Career</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">Experience</h2>
        <p className="text-foreground/55 text-sm">
          Product and leadership roles. Click any card to read the full story. For technical AI work, see the{" "}
          <a href="#projects" className="text-primary underline underline-offset-4 hover:text-primary/80">Projects</a> section.
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line - only visible on md and up */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-primary/25 to-transparent" />

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
                        <div className="absolute w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
                        <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg" />
                      </>
                    ) : (
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg" />
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                  <TiltCard className="h-full">
                    <Card
                      className={`glass-effect-sm border-glow card-interactive h-full cursor-pointer group ${isOverlapping ? "border-primary/40 dark:border-primary/30" : ""}`}
                      onClick={() => setActiveExp(exp)}
                      data-cursor-hover
                    >
                      <CardHeader className="pb-3">
                        <div className="flex flex-col gap-1">
                          <div className={`flex items-center gap-2 flex-wrap ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                            <Badge
                              variant="secondary"
                              className="w-fit text-[11px] px-2 py-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
                            >
                              {exp.type}
                            </Badge>
                            <span className="text-xs text-foreground/40 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {exp.period}
                            </span>
                          </div>
                          <CardTitle className="text-xl font-bold text-foreground leading-snug mt-1">{exp.title}</CardTitle>
                          <CardDescription className="text-sm font-medium text-foreground/55">
                            {exp.company}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/60 leading-relaxed mb-4">{exp.summary}</p>
                        <div className={`flex items-center gap-1 text-xs text-primary/60 group-hover:text-primary transition-colors ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          <span>Full story</span>
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <ExperienceModal exp={activeExp} onClose={() => setActiveExp(null)} />
    </section>
  )
}
