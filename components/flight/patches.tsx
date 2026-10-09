"use client"

import { useState } from "react"
import { FileText, Heart } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Container, WaypointHeader } from "@/components/flight/primitives"
import { certifications, type Certification } from "@/lib/certifications"
import { trackEvent } from "@/lib/analytics"

const EMS_IDS = [1, 23, 24, 21]
const ems = EMS_IDS.map((id) => certifications.find((c) => c.id === id)).filter((c): c is Certification => !!c)
const purdue = certifications.filter((c) => c.issuer === "Purdue University")
const academy = certifications.filter((c) => c.issuer === "Anthropic Academy")
const google = certifications.filter((c) => c.issuer.startsWith("Google"))

function StarOfLife({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        {[0, 60, 120].map((r) => (
          <rect key={r} x="39" y="6" width="22" height="88" rx="2" transform={`rotate(${r} 50 50)`} />
        ))}
      </g>
      <path d="M50 20 V82 M44 30 C58 34 58 42 44 46 C58 50 58 58 44 62 C56 66 56 72 46 75" stroke="#0e2350" strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const SHORT: Record<number, string> = { 5: "Data Classification", 6: "Protecting SSNs" }
const shortTitle = (c: Certification) => SHORT[c.id] ?? c.title.split(" — ")[0]

const STAMP_COLORS = ["#ff6b8a", "#5fb3ff", "#ffb53d", "#46e08a", "#c08bff"]
const STAMP_TILT = [-7, 5, -3, 8, -5]

export default function Patches() {
  const [open, setOpen] = useState<Certification | null>(null)

  const view = (c: Certification) => {
    setOpen(c)
    trackEvent("cert_view", { certId: c.id })
  }

  return (
    <section id="certifications" className="fd-section">
      <Container>
        <WaypointHeader id="certifications" title="Patches & Stamps" kicker="Certifications">
          {certifications.length} credentials and licenses: patches earned in the field, stamps from compliance training, and AI wings from Google and Anthropic Academy. Open any one for details, and the certificate where there is one.
        </WaypointHeader>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* EMS patches */}
          <div className="fd-panel p-5 sm:p-6">
            <p className="fd-label mb-5">Flight jacket · EMS</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {ems.map((c) => (
                <button key={c.id} type="button" onClick={() => view(c)} className="group flex flex-col items-center text-center">
                  <span className={`fd-patch ${c.id === 21 ? "red" : ""} flex h-32 w-32 items-center justify-center transition-transform group-hover:-rotate-3 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]`}>
                    {c.id === 23 || c.id === 24 ? (
                      <span className="flex flex-col items-center">
                        <StarOfLife className="h-12 w-12 text-[#5aa0ff]" />
                        <span className="mt-1 font-mono-fd text-[12px] font-bold tracking-[0.18em] text-[#e8c96a]">EMT · {c.id === 23 ? "NJ" : "IN"}</span>
                        <span className="font-mono-fd text-[9px] tracking-[0.2em] text-[#e8c96a]/80">LICENSED</span>
                      </span>
                    ) : c.id === 21 ? (
                      <span className="flex flex-col items-center text-[#f5efe0]">
                        <Heart size={44} fill="currentColor" aria-hidden="true" />
                        <span className="mt-1 font-mono-fd text-[13px] font-bold tracking-[0.2em]">BLS</span>
                      </span>
                    ) : (
                      <span className="flex flex-col items-center">
                        <StarOfLife className="h-16 w-16 text-[#5aa0ff]" />
                        <span className="mt-1 font-mono-fd text-[12px] font-bold tracking-[0.2em] text-[#e8c96a]">NREMT</span>
                      </span>
                    )}
                  </span>
                  <span className="mt-4 text-[14.5px] font-semibold leading-snug text-[color:var(--fd-text)] group-hover:text-[color:var(--fd-cyan)]">{c.title}</span>
                  <span className="mt-1 text-[12.5px] text-[color:var(--fd-muted)]">{c.issuer}</span>
                  <span className="mt-2 fd-chip" style={{ color: "var(--fd-green)", borderColor: "rgba(70,224,138,0.35)" }}>{c.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Purdue compliance stamps */}
          <div className="fd-passport p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="fd-label" style={{ color: "#c9a24a" }}>Passport · Purdue University</p>
              <span className="font-mono-fd text-[10.5px] text-[color:var(--fd-dim)]">VISAS {purdue.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {purdue.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => view(c)}
                  aria-label={`${c.title}, ${c.issuer}, ${c.date}. Open certificate.`}
                  className="group flex justify-center"
                >
                  <span
                    className="fd-stamp flex w-full max-w-[170px] flex-col items-center px-2 py-3 text-center transition-transform group-hover:scale-105 group-focus-visible:scale-105"
                    style={{ color: STAMP_COLORS[i % STAMP_COLORS.length], transform: `rotate(${STAMP_TILT[i % STAMP_TILT.length]}deg)` }}
                  >
                    <span className="text-[9px] tracking-[0.2em] opacity-80">PURDUE · CLEARED</span>
                    <span className="my-1 text-[14px] font-bold leading-tight tracking-[0.06em]">{shortTitle(c)}</span>
                    <span className="text-[9.5px] tracking-[0.14em]">{c.date.replace(" — ", " · ")}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-[12.5px] leading-relaxed text-[color:var(--fd-dim)]">
              Privacy and data-handling compliance: student records, health information, financial data, classification, and SSNs.
            </p>
          </div>
        </div>

        {/* Anthropic Academy pins */}
        <div className="mt-6 fd-panel p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="fd-label" style={{ color: "var(--fd-cyan)" }}>Wings · AI training</p>
            <span className="font-mono-fd text-[10.5px] text-[color:var(--fd-dim)]">{google.length + academy.length} PINS</span>
          </div>
          {google.map((c) => (
            <button key={c.id} type="button" onClick={() => view(c)} className="fd-wings group mb-4 flex w-full flex-wrap items-center gap-4 p-4 text-left hover:border-[color:var(--fd-amber)]" style={{ borderColor: "rgba(255,181,61,0.4)" }}>
              <svg viewBox="0 0 48 24" className="h-8 w-16 shrink-0 text-[color:var(--fd-amber)]" aria-hidden="true">
                <path d="M24 6 L20 12 L24 18 L28 12 Z" fill="currentColor" />
                <path d="M19 11 C14 6 8 6 2 7 C7 9 9 10 11 12 C8 12 6 13 4 14 C9 15 14 15 19 13 Z M29 11 C34 6 40 6 46 7 C41 9 39 10 37 12 C40 12 42 13 44 14 C39 15 34 15 29 13 Z" fill="currentColor" opacity="0.8" />
              </svg>
              <span className="min-w-0 flex-1">
                <span className="block font-display-fd text-[17px] font-semibold text-[color:var(--fd-text)] group-hover:text-[color:var(--fd-amber)]">{c.title}</span>
                <span className="mt-0.5 block text-[13px] text-[color:var(--fd-muted)]">{c.description}</span>
              </span>
              <span className="fd-chip" style={{ color: "var(--fd-amber)", borderColor: "rgba(255,181,61,0.4)" }}>{c.issuer.toUpperCase()} · {c.date.toUpperCase()}</span>
            </button>
          ))}
          <p className="fd-label mb-3 text-[10px]">Anthropic Academy · Apr 2026</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {academy.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => view(c)} className="fd-wings group flex h-full w-full items-center gap-3 p-3 text-left hover:border-[color:var(--fd-cyan)]">
                  <svg viewBox="0 0 48 24" className="h-6 w-12 shrink-0 text-[color:var(--fd-cyan)]" aria-hidden="true">
                    <path d="M24 6 L20 12 L24 18 L28 12 Z" fill="currentColor" />
                    <path d="M19 11 C14 6 8 6 2 7 C7 9 9 10 11 12 C8 12 6 13 4 14 C9 15 14 15 19 13 Z M29 11 C34 6 40 6 46 7 C41 9 39 10 37 12 C40 12 42 13 44 14 C39 15 34 15 29 13 Z" fill="currentColor" opacity="0.75" />
                  </svg>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold leading-snug text-[color:var(--fd-text)] group-hover:text-[color:var(--fd-cyan)]">{c.title}</span>
                    <span className="mt-0.5 block font-mono-fd text-[10.5px] text-[color:var(--fd-dim)]">{c.date.toUpperCase()}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className={`fd-dialog w-[95vw] flex flex-col gap-3 p-4 sm:p-5 ${open?.pdfPath ? "max-w-4xl h-[90vh]" : "max-w-lg"}`}>
          <DialogHeader className="shrink-0 text-left">
            <DialogTitle className="font-display-fd text-lg font-semibold leading-snug pr-8 text-[color:var(--fd-text)]">{open?.title}</DialogTitle>
            <DialogDescription className="text-[13.5px] leading-relaxed text-[color:var(--fd-muted)]">
              {open?.issuer} · {open?.date}. {open?.description}
            </DialogDescription>
          </DialogHeader>
          {open?.pdfPath ? (
            <>
              <iframe src={`${open.pdfPath}#toolbar=0&navpanes=0`} title={`${open.title} certificate`} className="min-h-0 flex-1 w-full rounded-lg border border-[color:var(--fd-line)] bg-white" />
              <a href={open.pdfPath} target="_blank" rel="noopener noreferrer" aria-label="Open certificate PDF in a new tab" data-tip="Open PDF" className="fd-icon-btn self-start h-9 w-9">
                <FileText size={16} />
              </a>
            </>
          ) : (
            <p className="font-mono-fd text-[12px] tracking-[0.06em] text-[color:var(--fd-dim)]">CERTIFICATE COPY AVAILABLE ON REQUEST</p>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
