// Short profile copy used by the Flight Deck home page (hero typewriter + Crew Brief interests).

export const roles = [
  "AI Engineer",
  "ML Practitioner",
  "Product Thinker",
  "Project Manager",
  "Licensed EMT",
  "Student Pilot",
  "Purdue Builder",
  "Systems Designer",
]

export const interests = [
  {
    title: "Aerospace Technology",
    description: "Interested in aviation systems, aerospace tech, and national security applications of AI.",
  },
  {
    title: "Secure AI Systems",
    description: "Focused on building reliable, secure, and compliant AI products for high-stakes environments.",
  },
  {
    title: "Applied ML Products",
    description: "Enjoy translating machine learning research into real-world product value and user outcomes.",
  },
]

// Captain's notes in the Crew Brief section. Rendered on the server into the page and read by
// public/flight-deck.js from the page data.
export const about = [
  "I'm an Artificial Intelligence student at Purdue University (B.S. AI, class of 2027), pursuing a private pilot license on the side, and a licensed EMT (NREMT, New Jersey, and Indiana) actively practicing inter-facility transport — because I genuinely believe the best builders understand the systems and people they serve. My academic trajectory reflects that: I joined The Data Mine corporate partners program as a machine learning practitioner on a BASF project, completed the CERIAS cybersecurity seminar, and earned the Google AI Professional Certificate.",
  "Professionally, I've spent two summers at PSEG as a Product Intern — owning an IAM product backlog of 50+ items, executing 300+ UAT and SIT cases, and leading a cross-functional team of 25 interns to ship a company-wide onboarding site. In parallel, I built a time-series ML forecasting system for BASF that achieved ~92% accuracy and cut model update time from days to hours. The throughline: I care about shipping things that actually work in production, not just demos. I'm especially drawn to Aerospace and National Security — domains where product rigor, secure AI, and reliability are not optional.",
  "This semester I'm the project manager on a three-person team building a pilot-training tracking system for a simulated aviation client, and I'm building Relay on my own, a platform that sends an incident to the nearest qualified responder no matter which department they work for. Both come out of things I've seen working as an EMT and at large events."
]
