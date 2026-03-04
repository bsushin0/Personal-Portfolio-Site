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
    title: "Student Patroller",
    company: "Purdue University Police Department",
    period: "September 2025 - Present",
    type: "Part-time",
    description: [
      "Assess and mitigate environmental risks by identifying unauthorized access points and safety hazards, using systematic checklists and Excel logs to document findings, which improves campus safety compliance",
      "Provide emergency response and crowd control during university events, coordinating with full-time officers and using real-time communication tools to reduce incident response time and maintain safe environments",
      "Conduct security operations and facility inspections across campus, performing interior sweeps and recording observations in Git-tracked reports to ensure the physical integrity of academic and administrative assets",
    ],
    skills: ["Risk Assessment", "Safety Compliance", "Emergency Response", "Crowd Control", "Security Operations", "Facility Inspections", "Git", "Documentation"],
  },
  {
    id: 2,
    title: "Clerical Attendant",
    company: "Purdue Athletics",
    period: "August 2025 - Present",
    type: "Part-time",
    description: [
      "Optimized high-volume traffic flow for 10,000+ patrons during Big Ten athletic events, utilizing real-time problem-solving to reduce entry/exit congestion by 60%",
      "Manage complex logistical operations by coordinating with security, law enforcement, and facility managers, ensuring campus-wide safety and efficiency while maintaining zero safety incidents",
      "Execute precision resource allocation by strategically directing vehicle placement based on lot capacity and permit-tiering, maximizing space utility for peak-attendance events",
    ],
    skills: ["Event Logistics", "Traffic Flow Management", "Coordination", "Resource Allocation", "Security Management", "Problem-Solving"],
  },
  {
    id: 4,
    title: "Product Intern",
    company: "PSEG",
    period: "June 2025 - August 2025",
    type: "Internship",
    description: [
      "Acted as a product owner for Identity & Access Management (IAM), partnering with stakeholders to prioritize a backlog of 50+ bug fixes and enhancements that improved system usability",
      "Guaranteed a 99% defect-free launch by executing 300+ User Acceptance Testing (UAT) and SIT cases to validate product quality and end-to-end user workflows, minimizing post-launch defects",
      "Championed a strategic technical initiative by developing a compelling business case that analyzed market and user needs to align the proposed solution with long-term scalability goals",
    ],
    skills: ["Product Management", "IAM", "UAT", "SIT", "Stakeholder Management", "Business Case Development"],
  },
  {
    id: 5,
    title: "Product Intern",
    company: "PSEG",
    period: "June 2024 - August 2024",
    type: "Internship",
    description: [
      "Pioneered product initiative by building and presenting five Proof of Concept tools, securing executive approval for full-scale development",
      "Led cross-functional team of 25 interns to define and launch a company-wide onboarding site, incorporating stakeholder and end-user discovery to refine requirements and success metrics",
      "Owned end-to-end development of critical automation tool, transforming multi-day manual process into near-instant execution",
    ],
    skills: ["Product Strategy", "Cross-functional Leadership", "Automation", "POC Development", "Salesforce"],
  },
  {
    id: 6,
    title: "BGR Team Leader",
    company: "Purdue University Orientation Programs",
    period: "September 2023 - August 2024",
    type: "Volunteer",
    description: [
      "Served as a Team Leader (TL) during Boiler Gold Rush, responsible for welcoming, mentoring, and supporting a cohort of 20–25 first-year students through orientation programs",
      "Guided and coordinated student groups through events, campus navigation, and resources to accelerate acclimation and build community while fostering an inclusive and welcoming environment",
      "Coordinated closely with fellow Team Leaders to design and deliver a cohesive, immersive orientation experience across sessions, aligning activities and messaging for consistent student support",
      "Provided ongoing peer mentorship and informal advising — acting as a resource, friend, and advocate — and collaborated with Orientation Programs staff to train volunteers and iterate on programming based on participant feedback",
    ],
    skills: ["Leadership", "Group Facilitation", "Mentoring", "Event Coordination", "Campus Navigation", "Volunteer Training", "Community Building", "Team Collaboration"],
  },
  {
    id: 8,
    title: "Tutor",
    company: "Kumon",
    period: "June 2022 - August 2023",
    type: "Part-time",
    description: [
      "Taught mathematics and English to elementary and middle school students, customizing instruction to individual learning styles and pace",
      "Developed engaging lesson plans and assessments that improved student proficiency and test scores",
      "Mentored struggling students through patient, one-on-one instruction and positive reinforcement",
    ],
    skills: ["Teaching", "Curriculum Development", "Student Mentoring", "Communication", "Patience"],
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

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Experience</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Product and leadership roles are highlighted here. For technical AI work (including the BASF forecasting project), see the
          <a href="#projects" className="ml-1 text-primary underline underline-offset-4 hover:text-primary/80">Projects</a> section.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line - only visible on md and up */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-slate-200 via-primary/30 to-slate-200 dark:from-slate-800 dark:via-primary/20 dark:to-slate-800" />

        {/* Timeline Items */}
        <div className="space-y-8 md:space-y-12">
          {experiences.map((exp, index) => {
            const overlappingIds = overlapMap.get(exp.id) || []
            const isOverlapping = overlappingIds.length > 0
            
            return (
              <div
                key={exp.id}
                className={`relative md:flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline Point */}
                <div className="hidden md:flex md:w-1/2 md:justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:top-6">
                  <div className="relative z-10 flex items-center justify-center">
                    {isOverlapping ? (
                      <>
                        {/* Outer pulsing ring for overlap indicator */}
                        <div className="absolute w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
                        {/* Main point */}
                        <div className="w-4 h-4 bg-primary rounded-full border-4 border-background dark:border-slate-900 shadow-lg" />
                      </>
                    ) : (
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background dark:border-slate-900 shadow-lg" />
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
                        
                        {/* Overlap indicator badge */}
                        {isOverlapping && (
                          <Badge className="w-fit bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5" />
                            Concurrent role
                          </Badge>
                        )}
                        
                        <div className="flex flex-col gap-2 md:flex-row md:justify-between pt-1">
                          <Badge
                            variant="outline"
                            className="w-fit border-slate-200/80 dark:border-slate-800/80 text-foreground/70 md:order-2"
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
                            className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
