import { projects, type Project } from "@/lib/projects"

// One case study per project in lib/projects.ts, shown at /work/<slug>.
// A field set to null is something only Sushin can fill in (a measured result, what broke).
// Preview builds show a dashed "to fill in" box for it; production builds leave the section out.

export type CaseStudy = {
  slug: string
  projectId: number
  role: string
  problem: string
  approach: string[]
  result: string | null
  resultTodo?: string
  whatBroke: string | null
  whatBrokeTodo?: string
  demo?: { label: string; href: string }
  demoTodo?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "aira",
    projectId: 2,
    role: "Solo build",
    problem:
      "I wanted a chatbot whose answers stay grounded in real documents instead of guesses.",
    approach: [
      "Started as a retrieval-augmented generation (RAG) setup. I generate my own embeddings and run vector search over them.",
      "Answers only use chunks above a semantic similarity threshold, and I tuned the chunk sizes so each one holds a full idea.",
      "Now moving it toward an agent with memory, tool use and multi-step reasoning, using Ollama, my own training datasets and a CI/CD loop that tests the model before changes go out.",
    ],
    result: "It runs in production.",
    resultTodo: "Add a measured result, for example how often answers stay grounded or how many questions it has handled.",
    whatBroke: null,
    whatBrokeTodo: "Add one thing that broke (bad retrieval, a threshold set too tight or too loose) and how you fixed it.",
    demoTodo: "Add a demo link if the AiRa chat on the home page is the one to point people to.",
  },
  {
    slug: "relay",
    projectId: 5,
    role: "Solo build, product and backend",
    problem:
      "At a big event the closest person who can help might work for a different department. EMS, security and event operations each run their own radio and roll call, not everyone carries a radio, and an EMT can be working a parking post. Org chart is a bad guide to who can actually help.",
    approach: [
      "Route each incident to the nearest qualified responder who is on duty, no matter which department they work for.",
      "Track qualifications per person instead of per organization.",
      "It comes straight from working as an EMT and supervising events with 60,000+ patrons.",
    ],
    result: null,
    resultTodo: "Still in progress. Add where it stands (prototype, pilot, first users) once there is something to show.",
    whatBroke: null,
    whatBrokeTodo: "Add one thing that didn't work the first time and how you changed it.",
    demoTodo: "Demo link once it is public.",
  },
  {
    slug: "basf-wine-forecasting",
    projectId: 1,
    role: "ML practitioner, BASF x The Data Mine",
    problem:
      "BASF needed sales forecasts it could plan inventory and marketing around, and updating the existing model took days.",
    approach: [
      "Turned the stakeholders' business requirements into technical specs.",
      "Built a time-series forecasting model with scikit-learn.",
      "Designed and deployed an automated MLOps pipeline for retraining and updates.",
      "Refactored the legacy analytics code it depended on.",
    ],
    result:
      "The model reached 92% sales prediction accuracy. Model updates went from 2 to 3 days down to about 1 to 2 hours, and the refactor improved system reliability by about 30%.",
    whatBroke: null,
    whatBrokeTodo: "Add one problem you hit (data quality, a model that overfit, a pipeline step that failed) and what you did about it.",
    demoTodo: "No public demo since this was client work. Leave out, or add a write-up link if one is allowed.",
  },
  {
    slug: "preflight-briefer",
    projectId: 4,
    role: "Solo build",
    problem:
      "Before a flight a student pilot has to read METARs, TAFs, SIGMETs and AIRMETs. They come as coded text that takes practice to read.",
    approach: [
      "Pull live METAR, TAF, SIGMET and AIRMET data from aviationweather.gov for the departure and destination airports.",
      "Send it to Claude with a prompt written the way a flight instructor would brief a student.",
      "Stream back a structured briefing in plain English: go/no-go call, ceiling and visibility, and hazards along the route.",
    ],
    result: "It is live on this site. Enter a departure and destination airport and it writes the briefing.",
    resultTodo: "Add a measured result if you have one, for example how many briefings it has run or what a student pilot or CFI said about it.",
    whatBroke: null,
    whatBrokeTodo: "Add one thing that broke (an airport with no TAF, a SIGMET format the parser missed, a bad briefing) and how you fixed it.",
    demo: { label: "Try the briefer", href: "/projects/preflight-briefer" },
  },
  {
    slug: "aerolog",
    projectId: 6,
    role: "Solo build, CS 348 Database Systems",
    problem:
      "A pilot logbook only covers flights you flew. I wanted one log for flights you flew, rode as a passenger, or spotted from the ground.",
    approach: [
      "Normalized PostgreSQL schema on Neon: flights, airlines, airports and aircraft types, with a role on each flight (piloted, passenger, spotted).",
      "Full create, read, update and delete workflow for flights, including picking the airline, airports and aircraft type.",
      "A filterable report page with totals and breakdowns by date range and category.",
      "Next.js App Router, TypeScript and Tailwind CSS.",
    ],
    result: null,
    resultTodo: "Add the result once the course project is done (what the report shows, how the demo went).",
    whatBroke:
      "Early on the build failed because I was on Node 25, a non-LTS release that broke Tailwind v4's native binary. Switching back to Node LTS fixed it.",
    demoTodo: "Demo link once the public version is ready.",
  },
  {
    slug: "traineeflightops",
    projectId: 7,
    role: "Project manager, three-person team, CNIT 18200",
    problem:
      "A simulated aviation department client needs one system to track pilot trainee progress, course and lesson prerequisites, and instructor credentials.",
    approach: [
      "Wrote the project charter and own the scope and schedule.",
      "Work with the two engineers on requirements, architecture and security controls.",
      "Web-accessible system backed by a relational database.",
    ],
    result: null,
    resultTodo: "Add the outcome when the project wraps up in December.",
    whatBroke: null,
    whatBrokeTodo: "Add one scope, schedule or technical problem the team hit and how you handled it.",
    demoTodo: "Leave out unless there is a public demo.",
  },
  {
    slug: "lostlink",
    projectId: 8,
    role: "Team of five, CS 47500 Human-Computer Interaction",
    problem:
      "LostLink connects people on Purdue's campus who lost something with people who found it.",
    approach: [
      "Followed the full user-centered design process: need-finding research, then high-fidelity prototypes in Figma.",
      "I ran two of the need-finding interviews myself.",
      "Usability testing with real users comes next.",
    ],
    result: null,
    resultTodo: "Add what the user study found once the team finishes it.",
    whatBroke: null,
    whatBrokeTodo: "Add one design idea that testing or interviews proved wrong, and what replaced it.",
    demoTodo: "Add a link to the Figma prototype or demo video if it can be public.",
  },
  {
    slug: "portfolio-site",
    projectId: 3,
    role: "Solo build",
    problem:
      "One place to show my projects and roles, with a chatbot visitors can ask about my work.",
    approach: [
      "Next.js 15 and TypeScript, deployed on Vercel with every push building a preview.",
      "The home page is a climb from runway 28 at KLAF to FL410, with live ATC audio and transcripts from the nearest airport.",
      "AiRa, a RAG chatbot, answers from the site's own content.",
      "Security headers (HSTS, frame and content-type rules) and a serverless contact form that stores messages in PostgreSQL and sends email through Resend.",
    ],
    result: null,
    resultTodo: "Add a result you are comfortable sharing, for example a recruiter conversation it started.",
    whatBroke:
      "When I updated my resume, the chatbot's embeddings still held the old bio, so it could answer with facts the site no longer showed. Regenerating the embeddings fixed it. The contact form's confirmation email also once showed raw code in its body, and the form let people leave the subject blank while the API rejected it. Both are fixed. The live ATC audio also took 20+ seconds to start on the low-bitrate feeds with a plain audio element, so I switched to streaming it through MediaSource, which starts in a few seconds.",
    demo: { label: "You're on it", href: "/" },
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug)
}

export function projectFor(c: CaseStudy): Project | undefined {
  return projects.find((p) => p.id === c.projectId)
}

export function slugForProject(id: number) {
  return caseStudies.find((c) => c.projectId === id)?.slug
}

// Placeholders stay visible on preview deployments and local dev, never on the live site.
export const showDrafts = process.env.VERCEL_ENV !== "production"
