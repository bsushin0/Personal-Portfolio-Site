import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar } from "lucide-react"

type Experience = {
  id: number
  title: string
  company: string
  period: string
  type: string
  description: string[]
  skills: string[]
}

const experiences: Experience[] = [
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

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Experience</h2>
        <p className="text-cyan-200/80 dark:text-cyan-200/70 max-w-2xl mx-auto">
          Product and leadership roles are highlighted here. For technical AI work (including the BASF forecasting project), see the
          <a href="#projects" className="ml-1 text-cyan-200 underline underline-offset-4 hover:text-cyan-100">Projects</a> section.
        </p>
      </div>

      <div className="space-y-8">
        {experiences.map((exp) => (
          <Card
            key={exp.id}
            className="glass-effect-sm border-glow-indigo card-interactive"
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-cyan-300 dark:text-cyan-400 flex items-center gap-2">
                    <Building className="h-5 w-5 text-purple-400" />
                    {exp.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-cyan-200 dark:text-cyan-300 mt-1">
                    {exp.company}
                  </CardDescription>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <Badge variant="outline" className="w-fit border-cyan-500/50 text-cyan-300">
                    <Calendar className="h-3 w-3 mr-1" />
                    {exp.period}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-purple-500/20 dark:bg-purple-500/30 text-purple-200 dark:text-purple-300 border border-purple-500/30"
                  >
                    {exp.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {exp.description.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-cyan-100/80 dark:text-cyan-100/70">
                    <span className="text-cyan-400 mt-1.5 text-xs">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-500/20 dark:bg-blue-500/30 text-blue-200 dark:text-blue-300 border border-blue-500/30"
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