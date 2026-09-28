export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  status?: "available" | "coming-soon" | "not-available";
  isPrivate?: boolean;
};

export const projects: Project[] = [
  {
    id: 2,
    title: "Project AiRa",
    description:
      "Custom agentic AI chatbot, built in-house and running in production. It started as a Retrieval-Augmented Generation (RAG) system with its own embedding generation and vector search, with semantic similarity thresholds and tuned document chunking so answers stay grounded in real documents instead of guesses. I'm now moving it from a RAG bot toward an agentic model with memory, tool use, and multi-step reasoning, using Ollama, custom training datasets, prompt engineering, bot monitoring, and CI/CD-based testing.",
    tags: ["Python", "RAG", "Vector Search", "Embeddings", "Ollama", "Agentic AI", "Prompt Engineering", "CI/CD"],
    image: "/project-banners/project-aira.svg",
    isPrivate: true,
  },
  {
    id: 5,
    title: "Relay",
    description:
      "Incident and emergency response platform that routes an incident to the nearest qualified on-duty responder across departments (EMS, security, event operations), instead of each organization running its own radio and roll-call process. I'm building it on my own and handling both the product side and the backend. It comes straight from working as an EMT and supervising 10,000+ patron events.",
    tags: ["Product Management", "Backend Engineering", "Incident Response", "Emergency Services"],
    image: "/project-banners/relay.svg",
    status: "coming-soon",
    isPrivate: true,
  },
  {
    id: 1,
    title: "Wine Varietals Yield Forecasting",
    description:
      "Delivered a machine learning solution providing 92% accurate wine sales forecasts for BASF. Built automated MLOps pipeline that reduced model update time from 2-3 days to 1-2 hours, enabling data-driven inventory and marketing decisions.",
    tags: ["Python", "TensorFlow", "Keras", "MLOps", "Time-Series Forecasting"],
    image: "/project-banners/wine-forecasting.svg",
    status: "not-available",
  },
  {
    id: 4,
    title: "Pre-Flight AI Briefer",
    description:
      "AI-powered aviation weather briefing tool built for student pilots. Fetches live METAR, TAF, SIGMET, and AIRMET data from the FAA and streams a structured plain-English pre-flight briefing via Claude AI. Features a CFI-grade prompt with go/no-go assessment, ceiling & visibility analysis, and en-route hazard detection.",
    tags: ["Next.js 15", "TypeScript", "Claude AI", "FAA APIs", "Streaming", "Aviation"],
    image: "/project-banners/preflight-briefer.svg",
    githubUrl: "https://github.com/bsushin0/Preflight-AI-Briefer",
    liveUrl: "/projects/preflight-briefer",
    status: "available",
  },
  {
    id: 6,
    title: "AeroLog",
    description:
      "Universal flight log and tracker for pilots, frequent flyers, and aviation enthusiasts. You log flights you flew, rode as a passenger, or spotted. It has a normalized PostgreSQL schema (flights, airlines, airports, aircraft types), full create/read/update/delete workflows, and a filterable reporting page. Built for CS 348 Database Systems.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Neon", "Tailwind CSS"],
    image: "/project-banners/aerolog.svg",
    status: "coming-soon",
    isPrivate: true,
  },
  {
    id: 7,
    title: "TraineeFlightOps (TFO)",
    description:
      "Web-accessible system that tracks pilot trainee flight progress, course and lesson prerequisites, and instructor credentials for a simulated aviation-department client. I'm the project manager on a three-person team. I wrote the project charter, own scope and schedule, and work with the two engineers on requirements, architecture, and security controls. Purdue CNIT 18200, due December 2026.",
    tags: ["Project Management", "Systems Development", "Security Controls", "Requirements"],
    image: "/project-banners/tfo.svg",
    status: "coming-soon",
    isPrivate: true
  },
  {
    id: 8,
    title: "LostLink",
    description:
      "Community-driven lost-and-found platform for Purdue's campus, designed by a team of five for CS 47500 (Human-Computer Interaction). We're following the full user-centered design process: need-finding research, high-fidelity Figma prototypes, and usability testing later in the semester.",
    tags: ["Figma", "User-Centered Design", "HCI", "Usability Testing"],
    image: "/project-banners/lostlink.svg",
    status: "coming-soon",
  },
  {
    id: 3,
    title: "Personal Portfolio Site",
    description:
      "Full-stack AI-powered portfolio showcasing product & leadership roles. Built with Next.js 15 and TypeScript, featuring an interactive RAG chatbot for visitor engagement, responsive design with Tailwind & Shadcn/UI, production-grade security hardening (HSTS, CSP), and comprehensive analytics tracking. Live demonstration of modern web development and AI integration.",
    tags: ["Next.js 15", "TypeScript", "RAG Chatbot", "Tailwind CSS", "PostgreSQL", "Vercel"],
    image: "/project-banners/nextjs-ai-stack.svg",
    githubUrl: "https://github.com/bsushin0/Personal-Portfolio-Site",
    liveUrl: "https://www.sushinbandha.com",
  },
];
