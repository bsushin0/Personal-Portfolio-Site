export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl: string;
  liveUrl?: string;
};

// TODO: Replace with your own projects
export const projects: Project[] = [
  {
    id: 1,
    title: "AI Threat Detection System",
    description:
      "A machine learning-based system that detects potential security threats in real-time using anomaly detection algorithms.",
    tags: ["Python", "TensorFlow", "Cybersecurity", "Docker"],
    // TODO: Replace with your own image
    image: "/project1.png",
    githubUrl: "https://github.com/your-username/ai-threat-detection",
    liveUrl: "https://your-live-demo-url.com",
  },
  {
    id: 2,
    title: "Secure Chat Application",
    description:
      "End-to-end encrypted messaging platform with advanced security features and biometric authentication.",
    tags: ["React", "Node.js", "Encryption", "WebSockets"],
    // TODO: Replace with your own image
    image: "/project2.png",
    githubUrl: "https://github.com/your-username/secure-chat-app",
  },
  {
    id: 3,
    title: "Vulnerability Scanner",
    description:
      "Automated tool for identifying security vulnerabilities in web applications and network infrastructure.",
    tags: ["Python", "Security", "API", "Automation"],
    // TODO: Replace with your own image
    image: "/project3.png",
    githubUrl: "https://github.com/your-username/vulnerability-scanner",
    liveUrl: "https://your-live-demo-url.com",
  },
  {
    id: 4,
    title: "Neural Network Visualizer",
    description:
      "Interactive visualization tool for understanding and exploring neural network architectures and decision processes.",
    tags: ["JavaScript", "D3.js", "Machine Learning", "Visualization"],
    // TODO: Replace with your own image
    image: "/project4.png",
    githubUrl: "https://github.com/your-username/nn-visualizer",
    liveUrl: "https://your-live-demo-url.com",
  },
  {
    id: 5,
    title: "Google Cloud Compute Portfolio",
    description:
      "A scalable portfolio website containerized with Docker and deployed on Google Cloud via Cloud Code, demonstrating modern cloud-native development workflows.",
    tags: ["Google Cloud", "Cloud Run", "Docker", "Skaffold", "DevOps"],
    // TODO: Replace with your own image
    image: "/project-gce.png",
    githubUrl: "https://github.com/your-username/gce-portfolio",
  },
];
