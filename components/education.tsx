"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { GraduationCap, TrendingUp, BookOpen, Star } from "lucide-react"
import { headingVariants, cardVariants as fadeUpVariants, badgeVariants } from "@/lib/motion-variants"

// ── Course modal data ─────────────────────────────────────────────────────────
type CourseDetail = {
  institution: string
  narrative: string
}

const courseDetails: Record<string, CourseDetail> = {
  // ── Purdue University courses ───────────────────────────────────────────────
  "Intro to Artificial Intelligence": {
    institution: "Purdue University",
    narrative:
      "This was my formal entry point into AI as an academic discipline. We covered the classical foundations — search algorithms (BFS, DFS, A*), constraint satisfaction problems, game tree minimax with alpha-beta pruning, propositional and first-order logic, and basic probabilistic reasoning. I came out able to implement an A* pathfinder from scratch and reason about agent environments in terms of observability, determinism, and state space. It grounded everything I've done in ML since — understanding why search-based approaches break down at scale is what makes neural methods click.",
  },
  "Data Mining & Machine Learning": {
    institution: "Purdue University",
    narrative:
      "This course is where I went from knowing what machine learning is to being able to build and evaluate it. We worked through supervised learning (decision trees, SVMs, k-NN, logistic regression), unsupervised methods (k-means clustering, hierarchical clustering, PCA), and ensemble techniques (random forests, gradient boosting). I learned proper evaluation methodology — train/val/test splits, cross-validation, confusion matrices, ROC curves — and why getting this wrong makes results meaningless. The project work required end-to-end pipelines: data cleaning, feature engineering, model selection, and written analysis of results. This directly informed the BASF forecasting project where I had to make the same decisions on real business data.",
  },
  "Data Structures & Algorithms": {
    institution: "Purdue University",
    narrative:
      "The hardest and most foundational CS course I've taken at Purdue. We implemented and analyzed arrays, linked lists, stacks, queues, trees (BST, AVL, red-black), heaps, hash tables, and graphs from the ground up in Java. The second half was algorithm analysis — Big-O reasoning, sorting algorithms (merge, quick, heap), graph traversals (BFS, DFS), shortest paths (Dijkstra, Bellman-Ford), and dynamic programming. I now think about time and space complexity automatically when writing code, which shapes every data structure choice I make in TypeScript or Python production work.",
  },
  "Systems Programming": {
    institution: "Purdue University",
    narrative:
      "This course forced me to understand what happens below the abstraction layer. We wrote C programs that directly managed memory with malloc/free, implemented shell features using fork/exec/wait, handled signals, and built simple socket-based network programs. I debugged memory leaks with Valgrind and race conditions with thread synchronization primitives. The mental model I developed — that programs are processes with real memory layouts, that I/O is slow, that concurrency has real costs — informs how I think about performance in any language. It's also why the Linux CLI feels natural to me.",
  },
  "Computer Architecture": {
    institution: "Purdue University",
    narrative:
      "We went from transistors to ISA to pipelining to cache hierarchies. The core topics were: binary/hex arithmetic, Boolean logic and gates, combinational and sequential circuits, the Von Neumann model, MIPS assembly, instruction pipelines with hazards and forwarding, and cache organization (direct-mapped, set-associative, fully-associative). I can now read assembly output and reason about what the CPU is actually doing. Understanding cache locality directly shapes how I write Python data processing code — why iterating over rows vs columns matters in NumPy is not abstract to me.",
  },
  "OOP (Java)": {
    institution: "Purdue University",
    narrative:
      "This was the course where I internalized object-oriented design as a discipline, not just syntax. We built multi-class projects using encapsulation, inheritance, polymorphism, and interfaces — with proper separation of concerns enforced by code review. Design patterns (strategy, observer, factory) were introduced and applied in project work. Java's strict type system and verbose class hierarchy forced me to think carefully about interfaces before writing implementations. That habit now shows up in every TypeScript interface and abstract class I write.",
  },
  "Programming in C": {
    institution: "Purdue University",
    narrative:
      "Learning C meant learning what managed languages hide from you. We covered pointers and pointer arithmetic, manual memory management, struct layout, bitwise operations, file I/O, and the C standard library. I wrote programs that segfaulted and learned to debug them methodically. Understanding that a variable is just a named memory address, and that passing by value vs pointer has concrete implications, changed how I think about function arguments and data mutation in every language I use.",
  },
  "Intro to Analysis of Algorithms": {
    institution: "Purdue University",
    narrative:
      "Where DSA introduced algorithms empirically, this course made the analysis rigorous. We proved correctness and complexity bounds formally — Big-O, Big-Omega, Big-Theta — and worked through divide-and-conquer recurrences via Master Theorem, greedy algorithm proofs by exchange argument, and dynamic programming with memoization tables. I can now evaluate whether an algorithmic approach is fundamentally tractable before implementing it, which has saved real engineering time.",
  },
  "Probability": {
    institution: "Purdue University",
    narrative:
      "Rigorous probability theory at the calculus level — sample spaces, events, conditional probability, Bayes' theorem, discrete and continuous random variables (Bernoulli, binomial, geometric, Poisson, normal, exponential), expectation, variance, and the Central Limit Theorem. This is the mathematical backbone of machine learning: understanding why maximum likelihood estimation works, what a confidence interval actually means, and how Bayesian inference differs from frequentist interpretation. Every time I evaluate a model's uncertainty outputs, this course is the foundation.",
  },
  "Linear Algebra": {
    institution: "Purdue University",
    narrative:
      "Vector spaces, linear transformations, matrix operations, systems of equations (Gaussian elimination), determinants, eigenvalues and eigenvectors, and orthogonality. The geometric intuition — understanding what a matrix multiplication *does* to space — is what made neural network weight updates and attention mechanisms make sense to me. PCA, embeddings, and transformer attention are all linear algebra in application. I now think of model weights as linear transformations rather than magic numbers.",
  },
  "Ethics of Data Science": {
    institution: "Purdue University",
    narrative:
      "This course examined the ethical dimensions of data collection, algorithmic decision-making, and AI deployment through both philosophical frameworks and real-world case studies. We analyzed bias in training data and its downstream effects, discussed fairness metrics and their inherent tradeoffs, examined surveillance capitalism, and worked through case studies on algorithmic hiring, predictive policing, and medical AI. I apply this directly in my own AI work — the anti-hallucination guardrails and strict fact-based constraints in the portfolio chatbot are ethical design choices, not just technical ones.",
  },
  "Cognitive Psychology": {
    institution: "Purdue University",
    narrative:
      "We studied how humans perceive, attend, remember, and reason — with particular emphasis on cognitive biases, mental models, and the limits of working memory. The connection to AI and HCI is direct: understanding how people form mental models of systems informed how I design the chatbot's response style (concise, fact-anchored) and the portfolio's interaction patterns. The research methodology component — understanding what experimental results actually mean — is also directly applicable to evaluating ML papers.",
  },

  // ── Anthropic Academy courses ───────────────────────────────────────────────
  "Claude 101": {
    institution: "Anthropic Academy",
    narrative:
      "The foundational Anthropic course covering what Claude is, how large language models work at a conceptual level, and best practices for effective interaction. I learned Anthropic's Constitutional AI approach and how it shapes Claude's behavior, the difference between Claude's capability and its trained values, and how to write effective prompts for different task types. This gave me the conceptual scaffolding for all the more advanced Anthropic Academy courses I completed afterward.",
  },
  "Claude Code 101": {
    institution: "Anthropic Academy",
    narrative:
      "Hands-on introduction to Claude Code — Anthropic's agentic coding assistant. I learned the Claude Code tool ecosystem, how to structure projects for effective AI-assisted development, and how to use sub-agents and multi-agent orchestration patterns. This course directly led to the Mira multi-agent system I built into this portfolio: a Project Director agent (Mira) coordinating six specialist sub-agents for web development tasks.",
  },
  "Introduction to Claude at Work": {
    institution: "Anthropic Academy",
    narrative:
      "Focused on practical enterprise and professional applications of Claude — how to integrate it into workflows, use the API effectively for business tasks, and think about AI augmentation rather than replacement. We covered use cases in document processing, research synthesis, code review, and communication drafting. I apply this framing in my product work: AI as a force multiplier for specific workflow bottlenecks, not a general-purpose replacement for judgment.",
  },
  "Claude Code in Action": {
    institution: "Anthropic Academy",
    narrative:
      "Advanced Claude Code usage — building real projects with agentic assistance, working with the file system, running tests, and managing multi-step engineering tasks. The course covered how to scope tasks for AI agents effectively, how to review and validate AI-generated code, and how to structure a development workflow that maintains quality with speed. My ability to direct AI agents to produce production-quality code changes on this portfolio comes directly from this training.",
  },
  "Building with the Claude API": {
    institution: "Anthropic Academy",
    narrative:
      "Technical deep-dive into the Anthropic API — authentication, message formatting, system prompts, tool use, streaming responses, and rate limit management. I learned how to construct multi-turn conversations programmatically, how to implement tool-calling patterns for agentic workflows, and how to design system prompts that reliably constrain model behavior. The prompt engineering approach I used for the portfolio chatbot — low temperature, strict fact-based constraints, graceful degradation — directly applies principles from this course.",
  },
  "AI Fluency for Educators": {
    institution: "Anthropic Academy",
    narrative:
      "This course examined how AI tools change the landscape of teaching and learning — opportunities for personalized instruction, risks of over-reliance, academic integrity considerations, and frameworks for responsible AI integration in educational contexts. I took this as part of my AI Fluency series to understand how different professional communities are adapting to AI, which sharpens my ability to think about AI deployment across diverse stakeholder groups.",
  },
  "AI Fluency for Students": {
    institution: "Anthropic Academy",
    narrative:
      "Focused on how students can use AI tools effectively and ethically — for research, writing, problem-solving, and skill-building — while developing genuine understanding rather than outsourcing thinking. The course reinforced the distinction between using AI to accelerate learning vs using it to bypass learning. I apply this daily: using AI to move faster on problems I understand, not to substitute for understanding I don't have yet.",
  },
  "AI Fluency for Nonprofits": {
    institution: "Anthropic Academy",
    narrative:
      "Examined AI adoption in resource-constrained nonprofit contexts — where to invest limited technical capacity, how to evaluate AI tools against mission requirements, and how to think about data privacy and community trust. The course broadened my perspective on AI deployment beyond commercial contexts and reinforced that responsible AI use requires understanding the specific values and constraints of the deploying organization.",
  },
  "Introduction to Agent Skills": {
    institution: "Anthropic Academy",
    narrative:
      "Foundational course on agentic AI — what makes a system 'agentic,' how agents plan and execute multi-step tasks, tool use patterns, and how to design systems that maintain coherent behavior across many steps. I learned the core loop: perceive → plan → act → observe → repeat, and how to structure agent instructions to minimize failure modes. This directly informed the Mira orchestration system: task decomposition, sequential vs parallel routing, and QA gates before phase completion.",
  },
  "Introduction to Subagents": {
    institution: "Anthropic Academy",
    narrative:
      "Advanced the agent concepts from Introduction to Agent Skills into multi-agent coordination — how to design specialist sub-agents with narrow scopes, how an orchestrator routes tasks, and how to maintain context and state across agent handoffs. The course covered failure handling, ambiguity resolution, and quality gates in multi-agent pipelines. I applied this directly in building the six-agent team (architect, frontend, backend, content, QA, devops) that Mira coordinates on this portfolio.",
  },
}

// ── Static data ───────────────────────────────────────────────────────────────
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

const anthropicCourses = [
  "Claude 101",
  "Claude Code 101",
  "Introduction to Claude at Work",
  "Claude Code in Action",
  "Building with the Claude API",
  "AI Fluency for Educators",
  "AI Fluency for Students",
  "AI Fluency for Nonprofits",
  "Introduction to Agent Skills",
  "Introduction to Subagents",
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

// ── Animation variants ────────────────────────────────────────────────────────
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

// ── Course Modal ──────────────────────────────────────────────────────────────
interface CourseModalProps {
  course: string | null
  onClose: () => void
}

function CourseModal({ course, onClose }: CourseModalProps) {
  if (!course) return null
  const detail = courseDetails[course]

  return (
    <Dialog open={!!course} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">{course}</DialogTitle>
          <DialogDescription className="sr-only">Course detail for {course}</DialogDescription>
        </DialogHeader>
        {detail ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
              {detail.institution}
            </p>
            <p className="text-sm text-foreground/75 leading-relaxed">{detail.narrative}</p>
          </div>
        ) : (
          <p className="text-sm text-foreground/60">
            {course} is part of my coursework at Purdue or Anthropic Academy. Ask the AI assistant for more context.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Clickable course badge ────────────────────────────────────────────────────
interface CourseBadgeProps {
  course: string
  variant: "purdue" | "anthropic"
  onClick: (course: string) => void
}

function CourseBadge({ course, variant, onClick }: CourseBadgeProps) {
  return (
    <motion.div variants={badgeVariants}>
      <Badge
        variant="secondary"
        className={
          variant === "purdue"
            ? "bg-surface-tag text-foreground/70 border border-border-subtle/80 cursor-pointer select-none hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/30 hover:scale-105 transition-all"
            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 cursor-pointer select-none hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:scale-105 transition-all"
        }
        onClick={() => onClick(course)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(course) } }}
      >
        {course}
      </Badge>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Education() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null)

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
          Computer Science degree with an AI specialization, grounded in mathematics, data science, and ethics. Click any course to see what I took away from it.
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
            <CardContent className="space-y-6">
              {/* Purdue University */}
              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-3">Purdue University</p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={badgeContainerVariants}
                >
                  {coreCourses.map((course) => (
                    <CourseBadge
                      key={course}
                      course={course}
                      variant="purdue"
                      onClick={setActiveCourse}
                    />
                  ))}
                </motion.div>
                <p className="text-xs text-foreground/40 mt-4">
                  Also completed: Multivariate Calculus, Intro to Statistics, Philosophy of Science, Cognitive Psychology,
                  and ongoing Aviation coursework (AT 43300 Supervised Aviation Experience).
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border-subtle/60" />

              {/* Anthropic Academy */}
              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-widest mb-3">Anthropic Academy</p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={badgeContainerVariants}
                >
                  {anthropicCourses.map((course) => (
                    <CourseBadge
                      key={course}
                      course={course}
                      variant="anthropic"
                      onClick={setActiveCourse}
                    />
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <CourseModal course={activeCourse} onClose={() => setActiveCourse(null)} />
    </section>
  )
}
