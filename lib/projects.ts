export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  status?: "available" | "coming-soon" | "not-available";
};

export const projects: Project[] = [
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
    id: 2,
    title: "Project AiRa",
    description:
      "Architected and deployed a production-grade Retrieval-Augmented Generation (RAG) system with in-house embedding generation and vector search capabilities. Implemented semantic similarity scoring with configurable thresholds, optimized document chunking strategies, and integrated with LLM backends for fact-grounded responses while preventing hallucination.",
    tags: ["Python", "RAG", "Vector Search", "Embeddings", "LLM", "AI"],
    image: "/project-banners/project-aira.svg",
    githubUrl: "https://github.com/bsushin0/Project-AiRa",
  },
  {
    id: 4,
    title: "Custom Agentic AI Chatbot",
    description:
      "Architecting an evolution from a RAG-based bot to a fully agentic AI model with memory, tool-use, and autonomous reasoning capabilities using Ollama and custom training datasets. Applied advanced prompt engineering, bot monitoring, and AI workers within a CI/CD framework to support iterative, test-driven model improvement.",
    tags: ["Python", "Ollama", "RAG", "Agentic AI", "Prompt Engineering", "CI/CD"],
    image: "/project-banners/project-aira.svg",
    status: "coming-soon" as const,
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
