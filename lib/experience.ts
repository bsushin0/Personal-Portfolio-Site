export type ExperienceEntry = {
  id: number
  title: string
  company: string
  period: string
  type: string
  summary: string
  description: string[]
  skills: string[]
  narrative: string
}

export const experiences: ExperienceEntry[] = [
  {
    id: 3,
    title: "Emergency Medical Technician (EMT)",
    company: "OnTime Transport",
    period: "May 2026 - Present",
    type: "Part-time",
    summary: "Provide NREMT-certified BLS care during inter-facility and non-emergency patient transports — conducting patient assessments, monitoring vitals, and delivering clinical handoffs to receiving facilities.",
    description: [
      "Provide BLS patient care during inter-facility and non-emergency patient transports — conducting patient assessments, monitoring vital signs, and delivering structured clinical handoffs to receiving facilities",
      "Apply NREMT-certified protocols and standard of care across varied patient acuity levels, ensuring patient safety, dignity, and continuity of care throughout the transport workflow",
      "Document patient encounters with accurate, HIPAA-compliant Patient Care Reports (PCRs), and complete pre-shift rig and equipment readiness checks to maintain operational compliance",
      "Collaborate with paramedics, nurses, and dispatch teams to coordinate timely transports and respond effectively to dynamic patient needs in time-sensitive environments",
    ],
    skills: ["Patient Assessment", "BLS", "NREMT Protocols", "Vitals Monitoring", "Patient Care Reporting (PCR)", "HIPAA", "Inter-Facility Transport", "Clinical Handoff"],
    narrative: "Working as an EMT in active inter-facility transport is the most patient-facing thing I do. Every transport is a self-contained clinical episode — pre-shift equipment checks, patient assessment, vital monitoring throughout, HIPAA-compliant PCR documentation, and a structured clinical handoff at the receiving facility. What I didn't expect was how much of the job is information management: capturing accurate baseline vitals, tracking changes in transit, and delivering a clear handoff that the receiving facility can act on immediately. The discipline of that information chain — accurate input, reliable processing, clean output — is the same discipline I apply to data pipelines. EMT work also keeps me grounded in what users of healthcare systems actually experience, which directly informs how I think about AI applied to medical contexts.",
  },
  {
    id: 1,
    title: "PSSP Assistant Team Lead — Window Program",
    company: "Purdue University Police Department",
    period: "September 2025 - Present",
    type: "Part-time",
    summary: "Lead administrative operations and scheduling for the PUPD Window Program — owning shift coverage, process improvement, and patroller onboarding while serving as the escalation point between patrol staff and officers.",
    description: [
      "Lead administrative operations and day-to-day workflow management for the Purdue University Police Department's Window Program, overseeing front-desk operations, public-facing service requests, and coordination between civilian staff and sworn officers",
      "Own end-to-end shift coverage and scheduling for the patroller team, balancing personnel availability against fluctuating staffing demands to maintain 100% coverage of critical posts",
      "Spearheaded a process-improvement project to overhaul appointment-based fingerprinting operations — designed a staffing model and scheduling protocol that guarantees a trained patroller is on site for every scheduled appointment, eliminating service gaps and reducing missed appointments",
      "Train and onboard incoming patrollers on department SOPs, front-desk protocols, and customer service standards — accelerating ramp-up and driving consistent service quality across all shifts",
      "Serve as the primary escalation point between patrollers and full-time officers, triaging incoming requests, routing complex issues to the appropriate department personnel, and maintaining clear lines of communication across the department",
      "Apply structured risk assessment frameworks to identify and mitigate environmental safety hazards, maintaining campus security compliance across academic and administrative assets",
    ],
    skills: ["Operations Management", "Scheduling", "Process Improvement", "Team Leadership", "Risk Assessment", "Security Operations", "Onboarding", "Compliance Documentation"],
    narrative: "Being promoted to Assistant Team Lead changed what the job was about. As a patroller I executed protocols; as a team lead, I own the protocols — scheduling coverage to keep 100% of critical posts covered, redesigning the fingerprinting appointment process to eliminate service gaps, and training incoming patrollers to maintain consistent quality. The fingerprinting process improvement was a classic operations problem: appointments were being missed because scheduling didn't guarantee a trained patroller on site. I mapped the failure mode, designed a staffing model that closed the gap, and documented it as SOP. That's the same problem-solving approach I use in software — identify the constraint, design around it, document the fix so it doesn't reopen.",
  },
  {
    id: 2,
    title: "Event Supervisor — Event Operations & Security",
    company: "Purdue Athletics",
    period: "August 2025 - Present",
    type: "Part-time",
    summary: "Supervise multi-location operations for 60,000+ patron Big Ten athletic events, managing cross-site staff and real-time incident response.",
    description: [
      "Supervised multi-location event operations for Big Ten athletic events drawing 60,000+ patrons, coordinating cross-site staff deployment and managing real-time communication across security, gate, and parking teams",
      "Directed cross-functional staff teams spanning multiple entry points and facility zones, delegating responsibilities, resolving personnel conflicts, and ensuring consistent service delivery under high-pressure conditions",
      "Led customer support operations on the ground — de-escalating patron disputes, resolving ticketing and access issues, and serving as the primary point of contact for attendee concerns during live events",
      "Executed time-critical incident response decisions, coordinating with law enforcement and facility management to resolve safety incidents swiftly while maintaining zero disruption to event flow",
      "Applied data-driven resource allocation strategies based on lot capacity and permit-tier analytics, maximizing space utilization and reducing entry/exit congestion by 60% at peak-attendance events",
    ],
    skills: ["Event Operations", "Cross-functional Leadership", "Customer Support", "Incident Response", "Resource Allocation", "Security Management", "Stakeholder Communication"],
    narrative: "Managing 60,000+ patron events is a real-time product management problem. You have a fixed set of resources — staff, gates, lots, communication channels — and a dynamic demand curve that spikes unpredictably at kickoff and halftime. The data-driven approach I brought to lot capacity and permit-tier analytics isn't different from how I approached the IAM backlog at PSEG: identify the constraint, measure it, and reallocate resources against it. The 60% congestion reduction came from applying that discipline consistently, not from any single heroic decision. What this role teaches that engineering doesn't is managing human systems under pressure — personnel conflicts don't pause for you to think.",
  },
  {
    id: 7,
    title: "Hospital Clinical Rotation — Emergency Department",
    company: "IU Health — Arnett Hospital",
    period: "Fall 2026",
    type: "Clinical",
    summary: "Completed a 28-hour emergency department rotation observing and assisting with EMT functions across live ER intake and patient care workflows.",
    description: [
      "Completed a 28-hour emergency department clinical rotation, observing and assisting with EMT functions within a hospital setting across live ER intake and patient care workflows",
      "Gained hands-on exposure to hospital-based emergency protocols, learning how EMT scope of practice and standard of care (SOC) differs between pre-hospital ambulance environments and in-hospital ER operations",
      "Supported clinical staff during patient assessment, triage support, and care coordination — developing adaptability across high-acuity, fast-paced medical environments",
    ],
    skills: ["Emergency Medicine", "Patient Assessment", "Triage", "Clinical Protocols", "Care Coordination", "NREMT"],
    narrative: "The hospital ER rotation was where NREMT training met the reality of in-hospital emergency medicine. The most striking thing was the difference in scope between pre-hospital EMT work and ER operations — the ER is a high-resource environment with physicians, nurses, and specialists; the field is you, a partner, and the tools in the ambulance. Both require clinical decision-making under pressure, but the constraints are completely different. Those 28 hours gave me direct exposure to triage decision-making, care coordination across specialties, and how high-acuity patient care actually flows in a real ER. The adaptability I developed — quickly orienting to a new environment and functioning usefully in it — is something I carry into every new technical context.",
  },
  {
    id: 9,
    title: "Field Ride-Along Rotation — Pre-Hospital Emergency Response",
    company: "TEAS — Tippecanoe Emergency Ambulance Service",
    period: "Fall 2026",
    type: "Clinical",
    summary: "Completed a 28-hour field ride-along responding to live emergency calls alongside certified EMTs and paramedics in a pre-hospital environment.",
    description: [
      "Completed a 28-hour field ride-along with the local Lafayette EMS system, responding to live emergency calls alongside certified EMTs and paramedics in a pre-hospital environment",
      "Observed and assisted with patient assessment, scene management, and emergency medical interventions across a range of medical and trauma calls",
      "Applied NREMT training in real-world field conditions, reinforcing clinical decision-making, patient communication, and protocol adherence under time-critical circumstances",
    ],
    skills: ["Pre-Hospital Emergency Response", "Scene Management", "Trauma Response", "Clinical Decision-Making", "NREMT", "Emergency Response"],
    narrative: "Pre-hospital EMS is the most uncontrolled environment I've worked in — you respond to calls where you don't know what you're walking into, with a fixed kit, in a stranger's home or on a roadway. What NREMT training prepares you for is a systematic assessment protocol that works in chaos: scene safety, primary survey, history, interventions, transport decision. The discipline of that protocol under pressure is directly analogous to how I approach technical debugging — systematic, evidence-based, no skipping steps even when you think you know the answer. The field ride-along validated that the structured approach to emergency medicine translates to real situations with real patients.",
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
    title: "Product Intern — Automation & Internal Tools",
    company: "PSEG",
    period: "June 2024 - August 2024",
    type: "Internship",
    summary: "Led 25 interns to launch a company-wide employee onboarding portal and engineered 5 PoC automation tools that secured executive approval and budget for full-scale development.",
    description: [
      "Engineered and presented 5 Proof of Concept (PoC) automation tools to senior leadership, securing executive approval and budget allocation for full-scale product development",
      "Led a cross-functional team of 25 interns to define requirements, architect, and launch a company-wide employee onboarding portal — directly accelerating new-hire time-to-productivity",
      "Owned end-to-end development of a critical process automation tool using Python and Salesforce, transforming a multi-day manual workflow into a near-instant execution pipeline",
    ],
    skills: ["Product Strategy", "Cross-functional Leadership", "Automation", "POC Development", "Python", "Salesforce"],
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
