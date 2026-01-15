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
    title: "Google Cloud Associate Cloud Engineer",
    issuer: "Google Cloud",
    date: "2024",
    image: "/google-cloud-badge.png",
    credentialUrl: "https://www.credential.net/",
    description: "Demonstrates proficiency in deploying and managing infrastructure on Google Cloud Platform.",
  },
  {
    id: 2,
    title: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2023",
    image: "/comptia-badge.png",
    credentialUrl: "https://www.comptia.org/certifications/security",
    description: "Validates baseline skills necessary to perform core security functions and pursue an IT security career.",
  },
];