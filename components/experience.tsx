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
    title: "Salesforce Intern",
    company: "PSEG",
    period: "Summer 2024",
    type: "Internship",
    description: [
      "Resolved 50+ technical tickets and managed user Identity & Access Management (IAM)",
      "Executed 300+ System Integration Testing (SIT) test cases during Salesforce project rollout",
      "Collaborated with release teams to bundle development work into go-live deployments",
      "Supported business case documentation and functional specifications",
    ],
    skills: ["Salesforce", "IAM", "Google Cloud Platform", "System Integration Testing", "Technical Documentation"],
  },
  {
    id: 2,
    title: "BGR Team Leader",
    company: "Purdue University",
    period: "2023 - Present",
    type: "Leadership",
    description: [
      "Mentored new students during orientation and transition programs",
      "Led orientation events and activities for incoming freshmen",
      "Modeled professionalism and academic excellence for peer groups",
      "Facilitated team-building exercises and campus integration activities",
    ],
    skills: ["Leadership", "Mentoring", "Event Planning", "Communication"],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Professional experience combining technical expertise with leadership and collaboration.
        </p>
      </div>

      <div className="space-y-8">
        {experiences.map((exp) => (
          <Card
            key={exp.id}
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all duration-300"
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {exp.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {exp.company}
                  </CardDescription>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <Badge variant="outline" className="w-fit">
                    <Calendar className="h-3 w-3 mr-1" />
                    {exp.period}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  >
                    {exp.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {exp.description.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-emerald-500 mt-1.5 text-xs">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
