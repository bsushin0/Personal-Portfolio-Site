export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Wine Varietals Yield Forecasting",
    description:
      "Delivered a machine learning solution providing 92% accurate wine sales forecasts for BASF. Built automated MLOps pipeline that reduced model update time from 2-3 days to 1-2 hours, enabling data-driven inventory and marketing decisions.",
    tags: ["Python", "TensorFlow", "Keras", "MLOps", "Time-Series Forecasting"],
    image: "https://placehold.co/1200x800/cffafe/0f172a?text=Wine+Forecasting",
    githubUrl: "",
    liveUrl: "",
  },
  {
    id: 2,
    title: "PSEG Onboarding Portal",
    description:
      "Led cross-functional team of 25 interns to define and launch company-wide onboarding site. Pioneered product initiative by building five Proof of Concept tools that secured executive approval for full-scale development.",
    tags: ["Product Management", "Salesforce", "Team Leadership", "Automation"],
    image: "https://placehold.co/1200x800/dbeafe/0f172a?text=PSEG+Onboarding",
    githubUrl: "",
    liveUrl: "",
  },
  {
    id: 3,
    title: "Personal Portfolio Site",
    description:
      "Built AI-powered conversational portfolio with in-house embedding generation and vector search. Features RAG-backed chatbot for visitor engagement, responsive Next.js frontend with Tailwind & Shadcn/UI, and production security hardening including HSTS headers and strict build validation.",
    tags: ["Next.js", "TypeScript", "Tailwind", "AI/RAG", "Product"],
    image: "https://placehold.co/1200x800/e0e7ff/0f172a?text=Portfolio+Site",
    githubUrl: "",
    liveUrl: "",
  },
  {
    id: 4,
    title: "Process Automation Tool",
    description:
      "Owned end-to-end development of critical automation tool at PSEG, transforming multi-day manual processes into near-instant execution, significantly improving operational efficiency.",
    tags: ["Python", "Automation", "Salesforce", "Business Process"],
    image: "https://placehold.co/1200x800/cffafe/0f172a?text=Automation+Tool",
    githubUrl: "",
    liveUrl: "",
  },
];
