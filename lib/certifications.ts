export type Certification = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl: string;
  description: string;
  credentialDetails?: { label: string; value: string }[];
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
    date: "April 2026",
    image: "",
    credentialUrl: "#",
    description: "NREMT-certified EMT (Active) with 56+ hours of clinical field experience across hospital ER (IU Health — Arnett Hospital) and pre-hospital EMS (TEAS — Tippecanoe Emergency Ambulance Service) environments.",
    credentialDetails: [
      { label: "EMS ID", value: "3668-4546-3129" },
      { label: "Registry #", value: "E4137018" },
      { label: "Expires", value: "03/31/2028" },
      { label: "Status", value: "Active" },
    ],
  },
];