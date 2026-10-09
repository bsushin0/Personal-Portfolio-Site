"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { AlertTriangle, CheckCircle2, Radio } from "lucide-react"
import { Container, WaypointHeader } from "@/components/flight/primitives"
import { CALLSIGN } from "@/lib/flight"

type Form = { name: string; email: string; subject: string; message: string }
const EMPTY: Form = { name: "", email: "", subject: "", message: "" }

const FIELDS: { name: keyof Form; label: string; hint: string; type?: string; placeholder: string }[] = [
  { name: "name", label: "Callsign", hint: "Your name", placeholder: "Your name" },
  { name: "email", label: "Return frequency", hint: "Your email", type: "email", placeholder: "you@example.com" },
  { name: "subject", label: "Request", hint: "Subject", placeholder: "What is this regarding?" },
]

export default function RadioContact() {
  const [form, setForm] = useState<Form>(EMPTY)
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_agent: navigator.userAgent }),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setForm(EMPTY)
      setState("sent")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setState("error")
    }
  }

  return (
    <section id="contact" className="fd-section pb-24">
      <Container>
        <WaypointHeader id="contact" title="Center" kicker="Contact">
          Interested in collaborating or have questions about my work? Let&apos;s connect. Call in below and I&apos;ll get back to you promptly to
          discuss opportunities, share my resume, or chat about AI and cybersecurity.
        </WaypointHeader>

        <div className="fd-bezel grid overflow-hidden lg:grid-cols-[300px_1fr]">
          {/* Radio stack */}
          <div className="border-b border-[#222d42] p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <p className="fd-label mb-3">COM 1</p>
            <div className="fd-radio-display grid grid-cols-2 gap-2 px-3 py-3">
              <div>
                <p className="text-[9.5px] tracking-[0.18em] text-[color:var(--fd-muted)]">ACTIVE</p>
                <p className="text-[24px] leading-none tabular-nums">134.875</p>
              </div>
              <div className="text-right">
                <p className="text-[9.5px] tracking-[0.18em] text-[color:var(--fd-muted)]">STBY</p>
                <p className="text-[24px] leading-none tabular-nums text-[color:var(--fd-cyan)]" style={{ textShadow: "none" }}>121.500</p>
              </div>
            </div>
            <dl className="mt-5 space-y-2.5 font-mono-fd text-[12px]">
              <div className="flex justify-between gap-3"><dt className="text-[color:var(--fd-dim)]">FACILITY</dt><dd className="text-[color:var(--fd-text)]">{CALLSIGN} CENTER</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[color:var(--fd-dim)]">RESPONSE</dt><dd className="text-[color:var(--fd-text)]">24–48 HRS</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[color:var(--fd-dim)]">CHANNEL</dt><dd className="text-[color:var(--fd-text)]">THIS FORM ONLY</dd></div>
            </dl>
            <p className="mt-5 text-[13px] leading-relaxed text-[color:var(--fd-muted)]">
              Prefer a quick answer? AiRa, my first officer, is on frequency in the corner of every page.
            </p>
          </div>

          {/* Transmission */}
          <div className="p-5 sm:p-6">
            {state === "sent" ? (
              <div role="status" className="flex h-full flex-col items-start justify-center py-6">
                <CheckCircle2 className="text-[color:var(--fd-green)]" size={30} />
                <p className="mt-4 font-mono-fd text-[12px] tracking-[0.14em] text-[color:var(--fd-green)]">READBACK CORRECT</p>
                <h3 className="mt-2 font-display-fd text-2xl font-semibold text-[color:var(--fd-text)]">Message received.</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[color:var(--fd-muted)]">
                  {CALLSIGN} copies. Thanks for reaching out. I&apos;ll get back to you within 24–48 hours. You should receive a confirmation email shortly.
                </p>
                <button type="button" className="fd-btn mt-6" onClick={() => setState("idle")}>
                  New transmission
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                {state === "error" && (
                  <div role="alert" className="flex items-start gap-3 rounded-lg border border-[rgba(255,90,90,0.4)] bg-[rgba(255,90,90,0.08)] p-3.5">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[color:var(--fd-red)]" />
                    <p className="text-[14px] text-[#ffd0d0]">Transmission failed: {error}. Please try again.</p>
                  </div>
                )}
                <div className="grid gap-5 md:grid-cols-2">
                  {FIELDS.map((f) => (
                    <div key={f.name} className={f.name === "subject" ? "md:col-span-2" : undefined}>
                      <label htmlFor={`c-${f.name}`} className="mb-1.5 flex items-baseline justify-between gap-2">
                        <span className="fd-label">{f.label}</span>
                        <span className="text-[12px] text-[color:var(--fd-dim)]">{f.hint}</span>
                      </label>
                      <input
                        id={`c-${f.name}`}
                        name={f.name}
                        type={f.type ?? "text"}
                        required
                        autoComplete={f.name === "name" ? "name" : f.name === "email" ? "email" : "off"}
                        value={form[f.name]}
                        onChange={onChange}
                        placeholder={f.placeholder}
                        className="fd-input"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label htmlFor="c-message" className="mb-1.5 flex items-baseline justify-between gap-2">
                    <span className="fd-label">Message</span>
                    <span className="text-[12px] text-[color:var(--fd-dim)]">Go ahead</span>
                  </label>
                  <textarea id="c-message" name="message" required rows={5} value={form.message} onChange={onChange} placeholder="Your message…" className="fd-input" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={state === "sending"} className="fd-btn fd-btn-primary h-12 px-6">
                    <Radio size={16} />
                    {state === "sending" ? "Transmitting…" : "Transmit"}
                  </button>
                  <span className="font-mono-fd text-[11px] tracking-[0.1em] text-[color:var(--fd-dim)]">
                    {state === "sending" ? "TX ●" : "PUSH TO TALK"}
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
