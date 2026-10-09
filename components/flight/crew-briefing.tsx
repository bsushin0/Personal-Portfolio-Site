import { Cpu, GraduationCap, Plane, Shield, Code, Users, HeartPulse } from "lucide-react"
import { Container, WaypointHeader } from "@/components/flight/primitives"
import { CALLSIGN } from "@/lib/flight"

const crewId: [string, string, string][] = [
  ["I", "Name", "BANDHA, SUSHIN"],
  ["II", "Certificate", "STUDENT PILOT · PPL IN TRAINING"],
  ["III", "Medical", "NREMT EMT · AHA BLS (ACTIVE)"],
  ["IV", "Base", "KLAF · WEST LAFAYETTE, IN"],
  ["V", "Training", "B.S. ARTIFICIAL INTELLIGENCE · PURDUE '27"],
  ["VI", "Ratings", "PRODUCT · ML · IAM · OPS"],
]

const duties = [
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "B.S. Artificial Intelligence at Purdue University (Minor: CNIT) — student pilot in private pilot training, Data Mine Corporate Partners participant, CERIAS Security Seminar graduate.",
  },
  {
    icon: Code,
    title: "Product & ML",
    description:
      "Product Management Intern at PSEG in IAM (99%-defect-free launch, 300+ UAT/SIT cases). Automation Intern leading a 25-person team. Built a 92%-accurate wine sales forecasting model and MLOps pipeline reducing update time by 97% for BASF.",
  },
  {
    icon: HeartPulse,
    title: "Security & Clinical",
    description:
      "NREMT-certified EMT actively practicing inter-facility transport at OnTime Transport, with 56+ hours of clinical field experience across hospital ER and pre-hospital EMS. Hands-on IAM product ownership at a Fortune 500 utility. Assistant Team Lead with Purdue University Police Department.",
  },
  {
    icon: Users,
    title: "Leadership",
    description:
      "Led 25-intern cross-functional teams at PSEG. Event Supervisor for 10,000+ patron Big Ten athletic events at Purdue Athletics. Mentored 20–25 first-year students as a Boiler Gold Rush Team Leader.",
  },
]

const interests = [
  {
    icon: Plane,
    title: "Aerospace Technology",
    description: "Interested in aviation systems, aerospace tech, and national security applications of AI.",
  },
  {
    icon: Shield,
    title: "Secure AI Systems",
    description: "Focused on building reliable, secure, and compliant AI products for high-stakes environments.",
  },
  {
    icon: Cpu,
    title: "Applied ML Products",
    description: "Enjoy translating machine learning research into real-world product value and user outcomes.",
  },
]

export default function CrewBriefing() {
  return (
    <section id="about" className="fd-section">
      <Container>
        <WaypointHeader id="about" title="Crew Briefing" kicker="About" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
          {/* Crew ID, styled after an airman certificate */}
          <div className="fd-bezel p-5 sm:p-6 self-start">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--fd-line)] pb-4">
              <div>
                <p className="fd-label text-[10px]">Flight crew identification</p>
                <p className="mt-1 font-display-fd text-xl font-semibold text-[color:var(--fd-text)]">Pilot in Command</p>
              </div>
              <span className="fd-chip" style={{ color: "var(--fd-magenta)", borderColor: "rgba(255,79,216,0.4)" }}>{CALLSIGN}</span>
            </div>
            <dl className="mt-4 space-y-3">
              {crewId.map(([n, k, v]) => (
                <div key={n} className="grid grid-cols-[28px_88px_1fr] items-baseline gap-2">
                  <dt className="font-mono-fd text-[11px] text-[color:var(--fd-dim)]">{n}.</dt>
                  <dt className="fd-label text-[10px]">{k}</dt>
                  <dd className="font-mono-fd text-[12.5px] tracking-[0.04em] text-[color:var(--fd-text)]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-center justify-between border-t border-[color:var(--fd-line)] pt-4">
              <span className="font-mono-fd text-[11px] text-[color:var(--fd-muted)]">STATUS</span>
              <span className="inline-flex items-center gap-2 font-mono-fd text-[12px] text-[color:var(--fd-green)]">
                <span className="h-2 w-2 rounded-full bg-[color:var(--fd-green)] shadow-[0_0_8px_var(--fd-green)]" />
                CURRENT · OPEN TO ROLES
              </span>
            </div>
          </div>

          <div className="fd-panel space-y-5 p-5 sm:p-7 text-[15.5px] sm:text-[17px] leading-[1.75] text-[color:var(--fd-muted)]">
            <p>
              I&apos;m an Artificial Intelligence student at Purdue University (B.S. AI, class of 2027), pursuing a private pilot license on the
              side, and an NREMT-certified EMT actively practicing inter-facility transport — because I genuinely believe the best builders
              understand the systems and people they serve. My academic trajectory reflects that: I joined The Data Mine corporate partners
              program to work on real industry data problems, and completed the CERIAS cybersecurity seminar.
            </p>
            <p>
              Professionally, I&apos;ve spent two summers at PSEG as a Product Intern — owning an IAM product backlog of 50+ items, executing
              300+ UAT and SIT cases, and leading a cross-functional team of 25 interns to ship a company-wide onboarding site. In parallel, I
              built a time-series ML forecasting system for BASF that achieved ~92% accuracy and cut model update time from days to hours.{" "}
              <span className="text-[color:var(--fd-text)]">
                The throughline: I care about shipping things that actually work in production, not just demos.
              </span>{" "}
              I&apos;m especially drawn to Aerospace and National Security — domains where product rigor, secure AI, and reliability are not
              optional.
            </p>
            <p>
              This semester I&apos;m the project manager on a three-person team building a pilot-training tracking system for a simulated
              aviation client, and I&apos;m building Relay on my own, a platform that sends an incident to the nearest qualified responder no
              matter which department they work for. Both come out of things I&apos;ve seen working as an EMT and at large events.
            </p>
          </div>
        </div>

        {/* Crew duties */}
        <div className="mt-14">
          <p className="fd-label mb-4">Crew duties</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {duties.map(({ icon: Icon, title, description }) => (
              <article key={title} className="fd-panel p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--fd-line-strong)] text-[color:var(--fd-cyan)]">
                    <Icon size={17} />
                  </span>
                  <h3 className="font-display-fd text-[17px] font-semibold text-[color:var(--fd-text)]">{title}</h3>
                </div>
                <p className="text-[14px] leading-relaxed text-[color:var(--fd-muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div id="interests" className="mt-14 scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="fd-label">Mission profile · Interests &amp; involvement</p>
            <p className="text-[13px] text-[#c9d3e1]">Areas of focus that guide my work in product, AI, and cybersecurity.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {interests.map(({ icon: Icon, title, description }, i) => (
              <article key={title} className="relative overflow-hidden rounded-xl border border-[color:var(--fd-line)] bg-[rgba(9,14,25,0.6)] p-5">
                <span aria-hidden="true" className="absolute right-4 top-4 font-mono-fd text-[11px] text-[color:var(--fd-dim)]">
                  OBJ {i + 1}
                </span>
                <Icon size={20} className="text-[color:var(--fd-magenta)]" />
                <h3 className="mt-3 font-display-fd text-[17px] font-semibold text-[color:var(--fd-text)]">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--fd-muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
