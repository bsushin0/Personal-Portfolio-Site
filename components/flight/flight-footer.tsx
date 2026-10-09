import { FileDown, Github, Linkedin } from "lucide-react"
import pkg from "@/package.json"
import { CALLSIGN, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "@/lib/flight"
import { IconLink } from "@/components/flight/primitives"

const SHUTDOWN = ["Avionics — OFF", "Mixture — IDLE CUTOFF", "Mags — OFF", "Master — OFF"]

export default function FlightFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-[color:var(--fd-line)] bg-[rgba(3,5,10,0.88)] backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-display-fd text-xl font-semibold text-[color:var(--fd-text)]">Sushin Bandha</p>
          <p className="mt-1 text-[14px] text-[color:var(--fd-muted)]">Artificial Intelligence · Product Management · Project Management</p>
          <ol className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono-fd text-[11px] tracking-[0.08em] text-[color:var(--fd-dim)]" aria-label="Shutdown checklist">
            {SHUTDOWN.map((s) => (
              <li key={s}>☑ {s}</li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-2">
            <IconLink href={GITHUB_URL} label="GitHub">
              <Github size={18} />
            </IconLink>
            <IconLink href={LINKEDIN_URL} label="LinkedIn">
              <Linkedin size={18} />
            </IconLink>
            <IconLink href={RESUME_URL} label="Resume (PDF)" download>
              <FileDown size={18} />
            </IconLink>
          </div>
          <p className="font-mono-fd text-[11px] tracking-[0.08em] text-[color:var(--fd-dim)]">
            {CALLSIGN} · v{pkg.version} · © {year} Sushin Bandha
          </p>
        </div>
      </div>
    </footer>
  )
}
