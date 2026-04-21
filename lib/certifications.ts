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
    title: "National Registry Emergency Medical Technician (NREMT)",
    issuer: "National Registry of Emergency Medical Technicians",
    date: "Apr 2026 — Active",
    image: "",
    credentialUrl: "#",
    description: "Active NREMT certification (EMS ID: 3668-4546-3129) with 56+ hours of clinical field experience across hospital ER and pre-hospital EMS environments.",
  },
  {
    id: 2,
    title: "FERPA — Family Educational Rights and Privacy Act",
    issuer: "Purdue University",
    date: "Aug 2025 — Active",
    image: "",
    credentialUrl: "#",
    description: "Certified in student educational record privacy rights, permissible disclosures, and institutional compliance obligations under FERPA.",
  },
  {
    id: 3,
    title: "HIPAA — Health Insurance Portability and Accountability Act",
    issuer: "Purdue University",
    date: "Aug 2025 — Active",
    image: "",
    credentialUrl: "#",
    description: "Certified in protected health information (PHI) handling, patient privacy rights, and healthcare data security compliance under HIPAA.",
  },
  {
    id: 4,
    title: "GLBA — Gramm-Leach-Bliley / Financial Services Modernization Act",
    issuer: "Purdue University",
    date: "Aug 2025 — Active",
    image: "",
    credentialUrl: "#",
    description: "Certified in financial data privacy obligations, safeguarding consumer information, and institutional compliance under the Gramm-Leach-Bliley Act.",
  },
  {
    id: 5,
    title: "Data Classification and Handling",
    issuer: "Purdue University",
    date: "Aug 2025 — Active",
    image: "",
    credentialUrl: "#",
    description: "Demonstrates proficiency in institutional data classification tiers, handling requirements, and secure data management best practices.",
  },
  {
    id: 6,
    title: "Protecting Social Security Numbers",
    issuer: "Purdue University",
    date: "Aug 2025 — Active",
    image: "",
    credentialUrl: "#",
    description: "Certified in proper handling, storage, and protection of Social Security Numbers in compliance with university policy and federal requirements.",
  },
];