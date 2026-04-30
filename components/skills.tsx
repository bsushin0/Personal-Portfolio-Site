"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Code, Lock, Cog, Brain, Cloud, Users } from "lucide-react"
import {
  headingVariants,
  cardVariants,
  staggerContainer as containerVariants,
  fastStaggerContainer as badgeContainerVariants,
  badgeVariants,
} from "@/lib/motion-variants"
import TiltCard from "@/components/tilt-card"

type SkillDetail = {
  narrative: string
  appliedAt: string[]
}

type SkillCategory = {
  id: number
  title: string
  icon: React.ReactNode
  skills: string[]
}

const skillDetails: Record<string, SkillDetail> = {
  "Python": {
    narrative: "Python is the language I think in for anything data or AI. I used it to build the Wine Varietals forecasting pipeline for BASF — data ingestion, feature engineering, model training with TensorFlow/Keras, all the way to MLOps automation. I also built the process automation tool at PSEG that compressed a multi-day workflow into near-instant execution. It's the first tool I reach for when the problem involves data, inference, or automation.",
    appliedAt: ["BASF — Wine Forecasting (92% accuracy ML pipeline)", "PSEG 2024 — Process automation tool", "Project AiRa — RAG system backend", "Personal Portfolio — Embedding generation scripts"],
  },
  "TypeScript": {
    narrative: "TypeScript is how I keep large Next.js codebases sane. For this portfolio site I've written everything in strict TypeScript — data models for certifications, projects, and experiences; typed API routes for the RAG chatbot; and strongly-typed component props across the entire UI. The type system catches whole categories of bugs before they reach the browser.",
    appliedAt: ["Personal Portfolio — Full-stack Next.js app (strict TS)", "RAG chatbot API routes", "All component interfaces and data layer"],
  },
  "JavaScript": {
    narrative: "JavaScript underlies all the interactive work in the portfolio. I use it for things that don't need server-side rendering — cursor animations, tilt effects, scroll-triggered motion — where runtime behavior and browser APIs are the real tools. TypeScript builds on top of it; JS is still where I think about DOM performance and event delegation.",
    appliedAt: ["Personal Portfolio — Cursor system, TiltCard animations", "PSEG 2024 — Browser-side tooling"],
  },
  "RAG": {
    narrative: "Retrieval-Augmented Generation is the core architecture behind both Project AiRa and the AI chatbot embedded in this site. I designed the full pipeline from scratch: document chunking, embedding generation with Google's text-embedding-004 model, cosine similarity search, and confidence-threshold filtering to prevent hallucinations. The chatbot answers only from the curated bio knowledge base, with a 60% similarity floor before it'll commit to a confident answer.",
    appliedAt: ["Project AiRa — Standalone RAG system", "Personal Portfolio — AI chatbot with in-house embeddings & vector search"],
  },
  "Vector Search": {
    narrative: "I implemented client-side vector search using cosine similarity on pre-computed 768-dimensional embeddings. The system scores incoming queries against a cached JSON index of document chunks and only surfaces context that clears a configurable confidence threshold. This was the key to making the chatbot factually grounded rather than generative-by-default.",
    appliedAt: ["Project AiRa — Core retrieval engine", "Personal Portfolio — lib/vector-search.ts"],
  },
  "Embeddings": {
    narrative: "Generating and managing embeddings is something I did hands-on — writing a build-time script that parses markdown bio files, chunks them into 512-token segments with 50-token overlap, calls Google's embedding API, and caches the results in a JSON index. I also tuned chunking strategies to maximize retrieval precision without losing inter-sentence context.",
    appliedAt: ["Project AiRa — In-house embedding pipeline", "Personal Portfolio — scripts/generate-embeddings.ts"],
  },
  "LLM": {
    narrative: "I've worked with LLMs as the generation layer in RAG systems rather than as a black box. The key discipline I developed is constraining generation: low temperature (0.3), strict system prompts that prohibit speculation beyond retrieved context, and graceful degradation to human fallback when confidence is low. I've integrated Gemini 2.5 Flash-Lite via the Vercel AI SDK.",
    appliedAt: ["Project AiRa — LLM backend integration", "Personal Portfolio — Gemini 2.5 Flash-Lite via Vercel AI SDK"],
  },
  "TensorFlow": {
    narrative: "I built the Wine Varietals forecasting model for BASF using TensorFlow and Keras. The project involved designing time-series architectures, tuning hyperparameters, running validation across seasonal patterns, and evaluating performance with proper holdout sets. The final model hit 92% accuracy and was wrapped in an MLOps pipeline that cut update cycles by 97%.",
    appliedAt: ["BASF — Wine Varietals yield forecasting (92% accuracy)"],
  },
  "MLOps": {
    narrative: "The biggest pain point I solved at BASF was operational: their model update cycle took 2–3 days because data ingestion, retraining, and validation were all manual steps. I automated the entire pipeline — ingestion, feature engineering, training, evaluation, and promotion — reducing turnaround to 1–2 hours. That's what MLOps means to me: making ML reliable in production, not just accurate in notebooks.",
    appliedAt: ["BASF — Wine Forecasting automated pipeline (2–3 days → 1–2 hours)"],
  },
  "Time-Series Forecasting": {
    narrative: "Time-series forecasting is where ML met real business impact for me. The BASF project required forecasting wine varietal sales across seasonal cycles, accounting for lead time, inventory constraints, and market volatility. Getting to 92% accuracy required thoughtful feature engineering of lag variables and rolling statistics, not just model selection.",
    appliedAt: ["BASF — Wine Varietals yield forecasting"],
  },
  "Deep Learning": {
    narrative: "My deep learning experience centers on applied architectures — neural networks for time-series regression, sequence models, and feature extraction. I've used both TensorFlow/Keras and PyTorch in coursework and projects. The focus has always been on understanding the architecture tradeoffs rather than just plugging in pretrained models.",
    appliedAt: ["BASF — Forecasting model architecture", "Purdue AI coursework"],
  },
  "Generative AI": {
    narrative: "Generative AI is central to both my coursework and my production work. I completed 14 Anthropic Academy certifications spanning Claude API integration, MCP, agentic systems, and AI fluency frameworks. Practically, I've built and deployed generative AI features — the RAG chatbot, prompt engineering patterns, and confidence-filtered generation — in a live production site.",
    appliedAt: ["Personal Portfolio — RAG chatbot", "Project AiRa", "Anthropic Academy — 14 certifications"],
  },
  "LLM Fine-tuning": {
    narrative: "Fine-tuning is something I've studied in depth in the context of when NOT to do it. For most production use cases, well-designed prompts with retrieved context outperform fine-tuned models at a fraction of the cost and maintenance burden. My coursework and Anthropic Academy training covered fine-tuning tradeoffs, data requirements, and evaluation methodology.",
    appliedAt: ["Purdue AI coursework", "Anthropic Academy training"],
  },
  "NLP": {
    narrative: "NLP is the foundation under the RAG work — tokenization, embedding semantics, similarity metrics, and context windowing. I've applied it hands-on when building document chunking strategies that preserve sentence coherence while keeping chunks small enough for accurate retrieval.",
    appliedAt: ["Project AiRa — Document chunking and retrieval", "Personal Portfolio — lib/document-processor.ts"],
  },
  "PyTorch": {
    narrative: "PyTorch is my framework of choice for research-oriented ML work and coursework at Purdue. I use TensorFlow/Keras when an existing production pipeline uses it (as at BASF), but for new experimentation PyTorch's dynamic computation graph and debugging ergonomics suit my work style better.",
    appliedAt: ["Purdue AI coursework", "Personal ML experiments"],
  },
  "Scikit-learn": {
    narrative: "Scikit-learn covers the classical ML toolkit — regression, classification, clustering, cross-validation, and feature pipelines. I used it for baseline models and feature selection before moving to deep learning architectures in the BASF project, and it remains my first stop for any tabular data problem.",
    appliedAt: ["BASF — Baseline models and feature analysis", "Purdue coursework"],
  },
  "AWS": {
    narrative: "I've used AWS for infrastructure fundamentals — IAM, S3, and cloud resource concepts learned through coursework and the Anthropic Claude with Google Cloud's Vertex AI course. My production deployments currently run on Vercel, but cloud architecture fundamentals are central to how I think about scalability and access control.",
    appliedAt: ["Cloud coursework", "Architecture understanding for production systems"],
  },
  "Vercel": {
    narrative: "Vercel is where I've deployed this entire portfolio. I use the CI/CD pipeline (auto-deploys from main branch), environment variable management for API keys and database connection strings, Edge network for performance, and Vercel Analytics for visitor insights. The deployment story for this site is zero-config production-grade.",
    appliedAt: ["Personal Portfolio — Live site at sushinbandha.com", "CI/CD pipeline management"],
  },
  "CI/CD (GitHub Actions)": {
    narrative: "CI/CD automation is how I ensure every push to this portfolio passes a build gate before it can merge. I've used GitHub Actions for lint, type-check, and build validation. The discipline of automating quality gates came from the PSEG IAM internship, where release reliability directly affected business-critical systems.",
    appliedAt: ["Personal Portfolio — Build validation pipeline", "PSEG IAM — Release process discipline"],
  },
  "Docker": {
    narrative: "Docker gives me portable, reproducible environments for development and deployment. I've containerized services in coursework and understand how container orchestration supports scalable microservices architectures. The portfolio repo includes a Dockerfile for local containerized builds.",
    appliedAt: ["Personal Portfolio — Dockerfile", "Coursework and infrastructure learning"],
  },
  "Linux Systems Administration": {
    narrative: "Linux is my day-to-day development environment. Shell scripting, process management, file permissions, and cron jobs are tools I use regularly. At PSEG, compliance documentation involved understanding system-level access controls that root in Linux permission models.",
    appliedAt: ["PSEG — IAM system administration context", "Personal development environment"],
  },
  "Serverless Architecture": {
    narrative: "The portfolio chatbot and contact form run as serverless API routes on Vercel's Edge Runtime. I chose serverless deliberately — zero cold-start management, auto-scaling for traffic spikes, and per-execution billing that's essentially free at portfolio-site traffic levels. The tradeoffs (stateless execution, Edge limitations on Node APIs) directly shaped how I structured the RAG pipeline.",
    appliedAt: ["Personal Portfolio — app/api/* serverless routes on Vercel Edge"],
  },
  "Identity & Access Management (IAM)": {
    narrative: "IAM is what I spent my PSEG summer 2025 internship owning as a product. I was the product owner for an enterprise IAM platform — prioritizing a 50+ item backlog, designing 300+ UAT/SIT test cases to achieve a 99%-defect-free launch, and building the business case for a next-generation scalability solution that secured executive approval. IAM is where product thinking and security intersect.",
    appliedAt: ["PSEG 2025 — Product owner for enterprise IAM platform (99% defect-free launch)"],
  },
  "UAT": {
    narrative: "At PSEG I designed and executed 300+ User Acceptance Test cases to validate end-to-end user workflows across access permission logic in business-critical systems. Writing good UAT means thinking like the end user in adversarial conditions — what happens when permissions conflict, when roles expire, when edge-case workflows hit the system.",
    appliedAt: ["PSEG 2025 — 300+ UAT test cases for IAM platform launch"],
  },
  "SIT": {
    narrative: "System Integration Testing at PSEG was about validating that the IAM platform talked correctly to all the downstream business systems it gatekept. I designed SIT cases that traced permission grants and revocations through the full integration chain — identity store to application-level access controls.",
    appliedAt: ["PSEG 2025 — SIT for enterprise IAM platform"],
  },
  "Access Control": {
    narrative: "Access control is the technical implementation of IAM policy — roles, permissions, least-privilege assignments, and audit trails. I learned the real complexity of access control systems at PSEG: legacy systems that don't support modern RBAC, users who accumulate permissions over years without review, and the product discipline needed to untangle that debt safely.",
    appliedAt: ["PSEG 2025 — IAM platform access control ownership", "PSSP — Campus facility access compliance"],
  },
  "Security Operations": {
    narrative: "Security operations in my experience spans both digital and physical contexts. At PSEG I worked on access permission logic for enterprise systems. As a Purdue Student Security Patroller, I conduct facility inspections, identify unauthorized access attempts, and document findings in compliance reports. Security operations is about consistent, systematic execution — not heroics.",
    appliedAt: ["PSEG 2025 — IAM security product ownership", "Purdue PSSP — Campus security patrols"],
  },
  "Risk Assessment": {
    narrative: "Risk assessment is a structured discipline I apply both in software (evaluating security vulnerabilities, IAM access risk, system integration failure modes) and in physical security (environmental hazard identification as a campus patroller). The common thread is: systematic enumeration of failure modes, likelihood-impact analysis, and clear mitigation documentation.",
    appliedAt: ["PSEG 2025 — IAM risk and compliance documentation", "PSSP — Campus hazard identification"],
  },
  "Compliance Documentation": {
    narrative: "I write compliance documentation that serves two audiences: auditors who need traceability, and engineers who need to know what 'compliant' actually means operationally. At PSEG and PSSP, compliance docs were tied to real accountability — 99%-defect-free launches and security incident reports.",
    appliedAt: ["PSEG 2025 — IAM compliance documentation", "PSSP — Git-tracked security reports"],
  },
  "PostgreSQL": {
    narrative: "This portfolio site uses Neon PostgreSQL for visit logging, analytics, and chatbot session management. I designed the schema, wrote the initialization scripts, and built the API routes that query it. PostgreSQL's JSON column support also handles flexible log payloads without requiring schema migrations for every new field.",
    appliedAt: ["Personal Portfolio — Neon PostgreSQL for analytics and visit tracking"],
  },
  "Next.js": {
    narrative: "Next.js 15 with the App Router is the foundation of this portfolio. I chose it for the combination of static generation (fast initial loads), server components (zero-bundle data fetching), and API routes (serverless backend without a separate service). The App Router's nested layouts also made the component architecture cleaner than pages-based Next.js.",
    appliedAt: ["Personal Portfolio — Full-stack Next.js 15 App Router application"],
  },
  "Salesforce": {
    narrative: "I built the PSEG process automation tool on top of Salesforce APIs — automating data extraction, transformation, and record updates that previously required 2–3 days of manual work per cycle. Salesforce is a platform I've used as a backend for business process automation, not just as a CRM.",
    appliedAt: ["PSEG 2024 — Process automation tool", "PSEG 2024 — Onboarding portal integration"],
  },
  "Git": {
    narrative: "Git is the connective tissue of every project I work on. At PSSP I specifically use Git-tracked compliance reports as part of the security documentation process — an unusual but effective application of version control to audit trails. For software, my commit discipline is atomic, meaningful commits with clear rationale in messages.",
    appliedAt: ["All software projects", "PSSP — Git-tracked compliance reporting"],
  },
  "Power Platform": {
    narrative: "Power Platform (Power Apps, Power Automate) was part of the toolset I used at PSEG for rapid internal tooling. The low-code approach accelerated PoC development significantly — I built and demonstrated tools to leadership before committing to full-scale engineering.",
    appliedAt: ["PSEG 2024 — PoC automation tools"],
  },
  "Microsoft Azure": {
    narrative: "Azure exposure came through the enterprise environment at PSEG, where Azure AD / Entra ID is the identity backbone for the IAM systems I was product-owning. Understanding Azure IAM architecture — tenants, groups, conditional access policies — was directly relevant to the access control work.",
    appliedAt: ["PSEG 2025 — IAM platform on Azure AD architecture"],
  },
  "Prompt Engineering": {
    narrative: "Prompt engineering is something I practice systematically, not intuitively. For the RAG chatbot, I designed a system prompt that enforces fact-based responses, prohibits speculation beyond retrieved context, sets tone and response length, and defines graceful degradation behavior. The prompt is a contract between the system and the LLM.",
    appliedAt: ["Personal Portfolio — RAG chatbot system prompt design", "Project AiRa", "Anthropic Academy certifications"],
  },
  "Product Management": {
    narrative: "Product management is how I think about almost everything — even this portfolio. I start with the user's goal (recruiters need to quickly assess fit), define success metrics (time on key sections, chatbot engagement), and make tradeoffs (depth vs. load time, interactivity vs. complexity). At PSEG I owned an actual product backlog: triaging 50+ items, writing acceptance criteria, running UAT, and shipping.",
    appliedAt: ["PSEG 2025 — IAM platform product ownership", "PSEG 2024 — Onboarding portal product lead", "Personal Portfolio — Product-led design decisions"],
  },
  "Technical Leadership": {
    narrative: "Technical leadership for me means making decisions and explaining the reasoning, not just making decisions. At PSEG I led 25 interns on the onboarding portal — defining requirements, distributing work, resolving technical blockers, and maintaining quality. At Purdue Athletics I supervise multi-location operations for 10,000+ patron events. Leadership is execution under pressure.",
    appliedAt: ["PSEG 2024 — Led 25-person cross-functional intern team", "Purdue Athletics — Event supervisor for Big Ten events"],
  },
  "Stakeholder Management": {
    narrative: "I've presented to executive leadership twice with successful outcomes — once for the PSEG automation PoCs (5 tools, secured budget for full-scale development) and once for the IAM scalability business case (secured executive approval and growth roadmap). Stakeholder management is about translating technical work into business value, clearly and with evidence.",
    appliedAt: ["PSEG 2025 — Executive stakeholder for IAM business case", "PSEG 2024 — Executive PoC presentations"],
  },
  "Cross-functional Collaboration": {
    narrative: "My work consistently spans disciplines. At PSEG I coordinated between product, security engineers, compliance leads, and business stakeholders. At Purdue Athletics I manage security staff, gate teams, and parking teams simultaneously. Cross-functional work is where alignment and communication discipline actually matter — without it, teams optimize locally and miss the system goal.",
    appliedAt: ["PSEG 2025 — Engineering + compliance + business collaboration", "PSEG 2024 — 25-person cross-functional team", "Purdue Athletics — Multi-team event operations"],
  },
  "AI Ethics": {
    narrative: "AI ethics isn't a checkbox to me — it's built into how I design AI systems. The chatbot anti-hallucination guardrails, the 60% confidence floor, the fact-based-only constraint, the graceful degradation to human contact: these are ethical design decisions. Through Anthropic Academy's AI Fluency curriculum I've developed a framework for responsible AI deployment that I apply in practice.",
    appliedAt: ["Personal Portfolio — Responsible chatbot design", "Anthropic Academy — AI Fluency certifications"],
  },
  "Analytical Problem-Solving": {
    narrative: "My approach to problems is structured: decompose into knowns and unknowns, identify the highest-leverage lever, test the hypothesis, iterate. Whether that's debugging a RAG retrieval issue (add logging, isolate the similarity scores, trace the embedding generation), resolving a staffing conflict at an athletic event, or building an IAM business case, the mental model is the same.",
    appliedAt: ["PSEG 2025 — IAM platform debugging and QA", "BASF — ML model evaluation", "Purdue Athletics — Real-time operational decisions"],
  },
  "Strategic Communication": {
    narrative: "Communication is the last mile that makes technical work matter. I've presented ML systems to non-technical BASF stakeholders, business cases to PSEG executives, and orientation programs to hundreds of new students. The discipline is knowing which details to include and which to leave out for a given audience.",
    appliedAt: ["PSEG — Executive presentations", "BASF — Stakeholder delivery", "BGR — Group facilitation for 20–25 students"],
  },
  "Agile/Scrum": {
    narrative: "Agile at PSEG wasn't theoretical — it was the rhythm of the team. Sprint planning, backlog refinement, daily standups, and retrospectives were how we kept the IAM platform moving despite a 50+ item backlog. I ran the backlog triage, wrote user stories with acceptance criteria, and tracked velocity to adjust scope.",
    appliedAt: ["PSEG 2025 — Agile/Scrum for IAM product team"],
  },
  "SQL": {
    narrative: "SQL is how I query and understand data at scale. I use it for the portfolio analytics database (visit logs, chatbot sessions) and understand it as the query interface for most production data systems. Writing clear, readable SQL with proper joins and aggregations is a baseline engineering discipline.",
    appliedAt: ["Personal Portfolio — PostgreSQL queries for analytics", "Purdue coursework"],
  },
  "Java": {
    narrative: "Java was my first serious programming language — the one I learned rigorous OOP in. I use it primarily in academic contexts now, but the discipline of thinking about types, interfaces, and class hierarchies that Java enforces has directly shaped how I write TypeScript.",
    appliedAt: ["Purdue CS coursework"],
  },
  "C/C++": {
    narrative: "C and C++ are where I learned to think about memory, pointers, and what the computer actually does beneath the abstraction layer. Systems programming coursework at Purdue required writing memory-safe code without garbage collection — a discipline that informs how I think about performance even when working in managed languages.",
    appliedAt: ["Purdue CS coursework — Systems programming"],
  },
  "R": {
    narrative: "R is my tool of choice for statistical analysis and data visualization in academic and research contexts. I used it for exploratory data analysis and statistical modeling in coursework, where the rich ecosystem of statistical packages and ggplot2 for visualization are genuinely better than Python equivalents for certain tasks.",
    appliedAt: ["Purdue statistics coursework", "Exploratory data analysis"],
  },
  "HTML": {
    narrative: "HTML is the semantic structure layer of everything I build for the web. I care about semantic HTML — using the right elements for the right content — because it directly affects accessibility and SEO. The portfolio is built with proper landmark regions, heading hierarchy, and ARIA attributes throughout.",
    appliedAt: ["Personal Portfolio — Semantic HTML throughout"],
  },
  "Bash/Linux": {
    narrative: "Shell scripting and Linux CLI are daily tools. I write bash scripts for build automation, file manipulation, and environment setup. The embedding generation pipeline, cert PDF copying, and deployment scripts for this portfolio are all bash-driven. Linux is the environment everything runs in — understanding it at the CLI level is non-optional for systems work.",
    appliedAt: ["Personal Portfolio — Build scripts and automation", "PSSP — Linux-based systems exposure"],
  },
  "Ollama": {
    narrative: "Ollama is my local LLM development environment — it lets me run and test models like Llama and Mistral on local hardware without API costs or latency. I use it for prompt iteration and evaluation before moving to production APIs, and it's shaped how I think about model deployment on edge and local hardware.",
    appliedAt: ["Project AiRa — Local LLM testing and development"],
  },
  "JIRA": {
    narrative: "JIRA was the backlog management tool at PSEG. I used it to triage the 50+ item IAM backlog — creating epics, breaking features into user stories, tagging dependencies, and tracking sprint progress. Good JIRA hygiene is a product management multiplier: visibility into what's blocked, why, and by whom.",
    appliedAt: ["PSEG 2025 — IAM product backlog management"],
  },
  "Google API": {
    narrative: "I've integrated Google's text-embedding-004 model via the Gemini API to generate 768-dimensional embeddings for the portfolio's RAG system. The API integration includes error handling, rate limiting, and batch processing of document chunks during the build-time embedding generation step.",
    appliedAt: ["Personal Portfolio — Google text-embedding-004 for RAG", "Project AiRa — Embedding generation"],
  },
  "Resend": {
    narrative: "Resend is the email delivery layer behind the portfolio contact form. I integrated it via their Node.js SDK in a serverless API route — the form POST hits the edge function, which validates the payload and dispatches a formatted transactional email to my inbox. Simple, reliable, no self-hosted infrastructure.",
    appliedAt: ["Personal Portfolio — Contact form email delivery"],
  },
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

interface SkillModalProps {
  skill: string | null
  onClose: () => void
}

function SkillModal({ skill, onClose }: SkillModalProps) {
  if (!skill) return null
  const detail = skillDetails[skill]

  return (
    <Dialog open={!!skill} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">{skill}</DialogTitle>
          <DialogDescription className="sr-only">Skill context for {skill}</DialogDescription>
        </DialogHeader>
        {detail ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground/75 leading-relaxed">{detail.narrative}</p>
            {detail.appliedAt.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Where I used it</p>
                <ul className="space-y-1.5">
                  {detail.appliedAt.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/65">
                      <span className="text-primary/50 mt-[0.18em] shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-foreground/60">
            {skill} is part of my technical toolkit. Click through to the Projects and Experience sections for context on where I applied it.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  return (
    <section id="skills" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-border-subtle/80">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground tracking-tight">Technical Skills</h2>
        <p className="text-foreground/55 max-w-2xl mx-auto text-sm">
          Programming, platforms, AI/ML, and product leadership. Click any skill to see where I applied it.
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
            <TiltCard className="h-full">
              <Card className="glass-effect-sm border-glow card-interactive h-full" data-cursor-hover>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
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
                          className="bg-surface-tag text-foreground/70 border border-border-subtle/80 hover:scale-105 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/30 transition-all cursor-pointer select-none"
                          onClick={() => setActiveSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      <SkillModal skill={activeSkill} onClose={() => setActiveSkill(null)} />
    </section>
  )
}
