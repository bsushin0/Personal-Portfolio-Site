"use client"

import { useCallback, useMemo, useRef, useState, type RefObject } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  Play,
  Printer,
  RotateCcw,
} from "lucide-react"
import {
  KBT_TRAITS,
  LEVEL_LABELS,
  type Level,
  type Trait,
} from "@/lib/kbt/questions"
import { computeScore, type Answers, type TraitResult } from "@/lib/kbt/scoring"
import { MeterBar, ThermalGauge } from "./thermal-gauge"
import { cn } from "@/lib/utils"

type Stage = "intro" | "questions" | "results"

interface Participant {
  name: string
  age: string
  email: string
  mobile: string
  locality: string
  occupation: string
}

const EMPTY_PARTICIPANT: Participant = {
  name: "",
  age: "",
  email: "",
  mobile: "",
  locality: "",
  occupation: "",
}

const LEVELS: Level[] = ["L", "M", "H"]

export function KbtTest() {
  const [stage, setStage] = useState<Stage>("intro")
  const [participant, setParticipant] = useState<Participant>(EMPTY_PARTICIPANT)
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  /**
   * The three options occupy the same screen position on every question, so
   * without this lock a double-click would answer the current question and
   * the next one in a single gesture.
   */
  const advancing = useRef(false)

  const trait = KBT_TRAITS[index]
  const result = useMemo(() => computeScore(answers), [answers])

  const goTo = useCallback((next: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advancing.current = false
    setIndex(next)
    setShowHelp(false)
    // Move focus to the new question so keyboard and screen-reader users
    // are not stranded at the bottom of the previous one.
    requestAnimationFrame(() => headingRef.current?.focus())
  }, [])

  const select = useCallback(
    (level: Level) => {
      if (advancing.current) return
      advancing.current = true

      setAnswers((prev) => ({ ...prev, [trait.id]: level }))

      advanceTimer.current = setTimeout(() => {
        advancing.current = false
        if (index < KBT_TRAITS.length - 1) {
          goTo(index + 1)
        } else {
          setStage("results")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }, 240)
    },
    [trait.id, index, goTo],
  )

  const restart = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advancing.current = false
    setAnswers({})
    setIndex(0)
    setParticipant(EMPTY_PARTICIPANT)
    setStage("intro")
    window.scrollTo({ top: 0 })
  }

  if (stage === "intro") {
    return (
      <IntroStage
        participant={participant}
        onChange={setParticipant}
        onStart={() => {
          setStage("questions")
          requestAnimationFrame(() => headingRef.current?.focus())
        }}
      />
    )
  }

  if (stage === "results" && result) {
    return (
      <ResultsStage
        result={result}
        participant={participant}
        onRestart={restart}
      />
    )
  }

  const answered = Object.keys(answers).length
  const progress = (answered / KBT_TRAITS.length) * 100

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Progress */}
      <div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Question {index + 1} of {KBT_TRAITS.length}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <QuestionCard
        key={trait.id}
        trait={trait}
        selected={answers[trait.id]}
        onSelect={select}
        showHelp={showHelp}
        onToggleHelp={() => setShowHelp((v) => !v)}
        headingRef={headingRef}
      />

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {answers[trait.id] && index < KBT_TRAITS.length - 1 && (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function IntroStage({
  participant,
  onChange,
  onStart,
}: {
  participant: Participant
  onChange: (p: Participant) => void
  onStart: () => void
}) {
  const set = (key: keyof Participant) => (value: string) =>
    onChange({ ...participant, [key]: value })

  const fields: Array<{
    key: keyof Participant
    label: string
    type?: string
    inputMode?: "text" | "numeric" | "tel" | "email"
  }> = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age", inputMode: "numeric" },
    { key: "email", label: "Email", type: "email", inputMode: "email" },
    { key: "mobile", label: "Mobile number", inputMode: "tel" },
    { key: "locality", label: "Locality" },
    { key: "occupation", label: "Occupation" },
  ]

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Before we start
      </h1>
      <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
        These details appear on your result sheet so you can keep or share it.
        Every field is optional — leave them blank and you can still take the
        test. Nothing you enter leaves this device.
      </p>

      <form
        className="mt-10 grid gap-5 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          onStart()
        }}
      >
        {fields.map((f) => (
          <div key={f.key} className={f.key === "name" ? "sm:col-span-2" : ""}>
            <label
              htmlFor={f.key}
              className="block text-sm font-medium text-foreground"
            >
              {f.label}
            </label>
            <input
              id={f.key}
              type={f.type ?? "text"}
              inputMode={f.inputMode}
              value={participant[f.key]}
              onChange={(e) => set(f.key)(e.target.value)}
              autoComplete="off"
              className="mt-2 w-full rounded-lg border border-border bg-surface-input px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25"
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <div className="rounded-xl border border-border bg-secondary/50 p-5">
            <h2 className="text-sm font-semibold">How to answer</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You will see twenty-one dimensions, one at a time. For each, mark
              whether it is <strong className="font-semibold text-foreground">Low</strong>,{" "}
              <strong className="font-semibold text-foreground">Medium</strong>,
              or <strong className="font-semibold text-foreground">High</strong>{" "}
              in you. Answer with your first honest instinct — the considered
              second answer is usually the flattering one.
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01] sm:w-auto"
          >
            Start the test
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function QuestionCard({
  trait,
  selected,
  onSelect,
  showHelp,
  onToggleHelp,
  headingRef,
}: {
  trait: Trait
  selected?: Level
  onSelect: (level: Level) => void
  showHelp: boolean
  onToggleHelp: () => void
  headingRef: RefObject<HTMLHeadingElement | null>
}) {
  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
          trait.group === "resource"
            ? "bg-primary/10 text-primary"
            : "bg-accent/15 text-accent",
        )}
      >
        {trait.group === "resource" ? "Inner resource" : "Source of strain"}
      </span>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-3xl font-bold outline-none sm:text-4xl"
      >
        {trait.label}
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground text-pretty">
        {trait.prompt}
      </p>

      {/* Options */}
      <fieldset className="mt-8">
        <legend className="sr-only">
          Rate {trait.label} as low, medium, or high
        </legend>
        <div className="space-y-3">
          {LEVELS.map((level) => {
            const isSelected = selected === level
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSelect(level)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all sm:p-5",
                  isSelected
                    ? "border-primary bg-primary/[0.06] ring-2 ring-primary/30"
                    : "border-border bg-card hover:border-border-strong hover:bg-surface-hover",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border-strong text-muted-foreground",
                  )}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : level}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold">
                    {LEVEL_LABELS[level]}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {trait.anchors[level]}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Help */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onToggleHelp}
          aria-expanded={showHelp}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <HelpCircle className="h-4 w-4" />
          {showHelp ? "Hide guidance" : "Help me answer this"}
        </button>

        {showHelp && (
          <div className="mt-4 space-y-4 rounded-xl border border-border bg-secondary/50 p-5 animate-in fade-in duration-200">
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {trait.help}
            </p>
            <VideoSlot trait={trait} />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Renders the client's explainer video when `videoUrl` is set on the trait,
 * and a labelled placeholder until then.
 */
function VideoSlot({ trait }: { trait: Trait }) {
  if (trait.videoUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
        <iframe
          src={trait.videoUrl}
          title={`${trait.label} — explainer`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-dashed border-border-strong bg-card px-4 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </span>
      <span>
        <span className="block text-sm font-semibold">
          Explainer video — {trait.label}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          A short clip from a Dawn Org counsellor will sit here.
        </span>
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function ResultsStage({
  result,
  participant,
  onRestart,
}: {
  result: NonNullable<ReturnType<typeof computeScore>>
  participant: Participant
  onRestart: () => void
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Kernal Behaviour Thermal Test — I
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        {participant.name ? `${participant.name}, here is your reading` : "Your reading"}
      </h1>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-9">
        <ThermalGauge score={result.score} band={result.band} />
        <p className="mt-8 leading-relaxed text-muted-foreground text-pretty">
          {result.band.summary}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MeterBar
          label="Load on you"
          value={result.driverLoad}
          tone="accent"
          caption="How much of the strain column is currently active."
        />
        <MeterBar
          label="Resources available"
          value={result.resourceStrength}
          tone="primary"
          caption="How much inner capacity you have to meet that load."
        />
      </div>

      {result.topDrivers.length > 0 && (
        <ResultGroup
          title="Drawing on you most"
          caption="These are the pressures you rated highest. They are the usual place to start."
          items={result.topDrivers}
        />
      )}

      {result.thinnestResources.length > 0 && (
        <ResultGroup
          title="Where your capacity is thinnest"
          caption="Building any one of these tends to lighten several pressures at once."
          items={result.thinnestResources}
        />
      )}

      {result.strengths.length > 0 && (
        <ResultGroup
          title="Already working for you"
          caption="Rated High. These are the resources to lean on while you work on the rest."
          items={result.strengths}
        />
      )}

      {/* Full sheet */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold">Your full sheet</h2>
        <ul className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
          {result.all.map((r) => (
            <li
              key={r.trait.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    r.trait.group === "resource" ? "bg-primary" : "bg-accent",
                  )}
                  aria-hidden="true"
                />
                <span className="truncate text-[15px]">{r.trait.label}</span>
              </span>
              <span className="shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold">
                {LEVEL_LABELS[r.level]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Next steps */}
      <section className="mt-12 rounded-2xl bg-primary p-7 sm:p-9">
        <h2 className="text-xl font-bold text-primary-foreground">
          Talk it through with someone
        </h2>
        <p className="mt-3 leading-relaxed text-primary-foreground/75 text-pretty">
          A reading is only useful if it goes somewhere. Dawn Org offers
          counselling, psychiatry, yoga, and personality development — and the
          KBT is how most of those conversations begin.
        </p>
        <Link
          href="/#faq"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          Book a consultation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          <Printer className="h-4 w-4" />
          Print or save as PDF
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Start again
        </button>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
        The KBT is a self-reflection aid, not a diagnostic instrument. It does
        not replace assessment by a qualified professional. If you are in
        distress, please contact Dawn Org or your local emergency service.
      </p>
    </div>
  )
}

function ResultGroup({
  title,
  caption,
  items,
}: {
  title: string
  caption: string
  items: TraitResult[]
}) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{caption}</p>
      <ul className="mt-5 space-y-3">
        {items.map((r) => (
          <li
            key={r.trait.id}
            className="rounded-xl border border-border bg-card p-4 sm:p-5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">{r.trait.label}</h3>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold",
                  r.trait.group === "driver"
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/10 text-primary",
                )}
              >
                {LEVEL_LABELS[r.level]}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {r.trait.anchors[r.level]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
