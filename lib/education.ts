export type CourseDetail = {
  institution: string
  narrative: string
}

export const courseDetails: Record<string, CourseDetail> = {
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
  "Great Issues in Computer Science": {
    institution: "Purdue University",
    narrative:
      "A seminar-style course examining the societal, ethical, and philosophical dimensions of computing — privacy, surveillance, algorithmic bias, digital rights, and the future of work in an AI-driven economy. We read primary sources from CS, philosophy, and policy, then wrote argumentative papers defending positions on contentious issues. It sharpened my ability to reason through tradeoffs in AI deployment beyond technical metrics, and the writing discipline it demanded carries into how I communicate about AI products.",
  },
  "Science Writing & Presentation": {
    institution: "Purdue University",
    narrative:
      "Taught me to translate complex technical material for non-specialist audiences — writing research summaries, preparing and delivering presentations, and structuring arguments for clarity rather than completeness. The course emphasized that effective scientific communication requires understanding what your audience needs to know, not everything you know. I apply this constantly: in the portfolio's writing, in how the chatbot explains technical concepts, and in how I pitch AI features to non-technical stakeholders.",
  },
  "Philosophy of Science": {
    institution: "Purdue University",
    narrative:
      "A rigorous examination of what scientific knowledge is, how it's produced, and what makes theories good or bad — covering falsificationism, paradigm shifts, the demarcation problem, and underdetermination. Directly relevant to AI: understanding what it means for a model to 'learn,' whether AI outputs constitute knowledge, and how to evaluate competing approaches with epistemic humility. This course reinforces why I care about calibrated uncertainty in AI systems rather than overconfident predictions.",
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

export const coreCourses = [
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
  "Great Issues in Computer Science",
  "Science Writing & Presentation",
  "Philosophy of Science",
]

export const anthropicCourses = [
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

export const otherCoursework =
  "Also completed: Multivariate Calculus, Intro to Statistics, History of Modern Philosophy (A), and ongoing Aviation coursework (AT 43300 Supervised Aviation Experience)."

export const degree = {
  title: "B.S. Artificial Intelligence",
  minor: "Minor: Computer Networking and Information Technology (CNIT)",
  school: "Purdue University, West Lafayette, IN",
  period: "August 2023 – May 2027 (Expected)",
  gpa: "GPA: 3.01 / 4.00",
  standing: "Good Academic Standing",
}

// AP credits are intentionally never shown on the site.
export const educationHighlights = [
  {
    label: "The Data Mine",
    detail: "Corporate Partners program — semesters I & III, collaborating with industry partners on data-driven projects",
  },
  {
    label: "CERIAS Security Seminar",
    detail: "Specialized cybersecurity coursework (CS 59100) through Purdue's security research center",
  },
  {
    label: "Upward GPA Trend",
    detail: "Improved from 2.66 (Fall 2023) to 3.01 overall (as of Spring 2026) — consistent growth each academic year",
  },
  {
    label: "Private Pilot Training",
    detail: "Student pilot working toward a Private Pilot License, alongside AT 43300 Supervised Aviation Experience",
  },
  {
    label: "Floor Senator",
    detail: "Purdue University Residences student government representative (Aug 2025 – May 2026)",
  },
]
