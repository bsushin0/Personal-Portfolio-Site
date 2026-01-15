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
    title: "AI Threat Detection System",
    description:
      "A machine learning-based system that detects potential security threats in real-time using anomaly detection algorithms.",
    tags: ["Python", "TensorFlow", "Cybersecurity", "Docker"],
    image: "/project1.png",
    githubUrl: "https://github.com/bsushin0/ai-threat-detection",
    liveUrl: "https://ai-threat-detection.vercel.app",
  },
  {
    id: 2,
    title: "Secure Chat Application",
    description:
      "End-to-end encrypted messaging platform with advanced security features and biometric authentication.",
    tags: ["React", "Node.js", "Encryption", "WebSockets"],
    image: "/project2.png",
    githubUrl: "https://github.com/bsushin0/secure-chat-app",
    liveUrl: "https://secure-chat-app.vercel.app",
  },
  {
    id: 3,
    title: "Vulnerability Scanner",
    description:
      "Automated tool for identifying security vulnerabilities in web applications and network infrastructure.",
    tags: ["Python", "Security", "API", "Automation"],
    image: "/project3.png",
    githubUrl: "https://github.com/bsushin0/vulnerability-scanner",
    liveUrl: "https://vulnerability-scanner.vercel.app",
  },
  {
    id: 4,
    title: "Neural Network Visualizer",
    description:
      "Interactive visualization tool for understanding and exploring neural network architectures and decision processes.",
    tags: ["JavaScript", "D3.js", "Machine Learning", "Visualization"],
    image: "/project4.png",
    githubUrl: "https://github.com/bsushin0/nn-visualizer",
    liveUrl: "https://nn-visualizer.vercel.app",
  },
];
