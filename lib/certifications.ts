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
    id: 2,
    title: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2023",
    image: "",
    credentialUrl: "#",
    description: "Validates baseline skills necessary to perform core security functions and pursue an IT security career.",
  },
];