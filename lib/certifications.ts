export type Certification = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl: string;
};

export const certifications: Certification[] = [
  {
    id: 1,
    title: "Google Cloud Associate Cloud Engineer",
    issuer: "Google Cloud",
    date: "2024",
    image: "/placeholder.svg?height=100&width=100",
    credentialUrl: "#",
  },
  {
    id: 2,
    title: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2023",
    image: "/placeholder.svg?height=100&width=100",
    credentialUrl: "#",
  },
];