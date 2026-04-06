export type Certification = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl: string;
  description: string;
};

export const certifications: Certification[] = [
  {
    id: 1,
    title: "Data Handling Certification",
    issuer: "Purdue University",
    date: "2025",
    image: "",
    credentialUrl: "#",
    description: "Demonstrates proficiency in data handling, analysis, and management best practices.",
  },
  {
    id: 2,
    title: "Emergency Medical Technician (EMT)",
    issuer: "National Registry of Emergency Medical Technicians (NREMT)",
    date: "WIP",
    image: "",
    credentialUrl: "#",
    description: "Certified EMT with training in high-pressure decision-making, rapid assessment, and reliable response.",
  },
];