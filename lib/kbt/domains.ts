/**
 * The KBT is taken against one domain of life at a time. A participant picks
 * the area they feel is under most strain and answers all 21 dimensions inside
 * that frame — the same dimension reads differently at work than it does at
 * home, which is the point.
 *
 * (Each domain will eventually be a separate paid test, so the flow is built
 * around one domain per sitting.)
 */
export type DomainId = "societal" | "personal" | "job" | "relationship"

export interface Domain {
  id: DomainId
  label: string
  /** One-liner on the chooser card. */
  blurb: string
  /** What sits inside this domain, listed on the chooser card. */
  covers: string
  /** Reminder shown with each question's guidance. */
  lens: string
  /** Short phrase dropped into the question header. */
  framing: string
}

export const DOMAINS: Domain[] = [
  {
    id: "personal",
    label: "Personal",
    blurb: "Your relationship with yourself.",
    covers: "Health, habits, discipline, self-worth, your own inner life.",
    lens: "Answer only as this shows up in your relationship with yourself — your health, your habits, your private thoughts. Set aside how you are with other people for now.",
    framing: "in yourself",
  },
  {
    id: "job",
    label: "Work",
    blurb: "Your job, study, or career.",
    covers: "Colleagues, workload, performance, money, ambition, your future.",
    lens: "Answer only as this shows up at work or in your studies — with colleagues, tasks, and your career. Set aside your home life for now.",
    framing: "at work",
  },
  {
    id: "relationship",
    label: "Relationships",
    blurb: "The people closest to you.",
    covers: "Partner, family, children, close friendships.",
    lens: "Answer only as this shows up with the people closest to you — your partner, family, and close friends. Set aside work and wider society for now.",
    framing: "in your close relationships",
  },
  {
    id: "societal",
    label: "Societal",
    blurb: "Your place among people generally.",
    covers: "Community, status, obligation, how you are seen, the wider world.",
    lens: "Answer only as this shows up in the wider world — your community, your standing, how you are seen by people outside your close circle.",
    framing: "in society",
  },
]

export function domainById(id: DomainId): Domain {
  return DOMAINS.find((d) => d.id === id) ?? DOMAINS[0]
}
