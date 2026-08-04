import Link from "next/link"
import { ArrowRight, ClipboardList, Compass, LineChart } from "lucide-react"
import { SiteHeader } from "@/components/dawn/site-header"
import { SiteFooter } from "@/components/dawn/site-footer"
import { DRIVER_TRAITS, RESOURCE_TRAITS } from "@/lib/kbt/questions"
import { DOMAINS } from "@/lib/kbt/domains"

const STEPS = [
  {
    icon: Compass,
    title: "Pick one area of life",
    body: "Personal, work, relationships, or society. The test reads one at a time, because the same dimension behaves quite differently at your desk than it does at your dinner table.",
  },
  {
    icon: ClipboardList,
    title: "Rate 21 dimensions",
    body: "One at a time, you mark each dimension Low, Medium, or High within that area. Plain-language guidance and a short explainer sit behind every question. About ten minutes.",
  },
  {
    icon: LineChart,
    title: "Get your stress level",
    body: "A reading from 0 to 100, your filled-in KBT sheet, and the figure that matters most — how much of the effort you put into that area is actually reaching it.",
  },
]

const FAQ = [
  {
    q: "Why only one area of life at a time?",
    a: "Because a single number covering all of life tells you almost nothing. A person can be steady at home and coming apart at work; averaged together, both facts disappear. Taking the test once per area gives you a reading you can actually act on — and you are welcome to take it on another area afterwards.",
  },
  {
    q: "What is the God Line?",
    a: "It is the line down the centre of the sheet, which people also call the Guru Line or simply the line of wholeness — whatever name fits your own understanding. It marks perfect balance: no strain at all, and every ounce of effort landing where it is aimed. Nobody reaches it. Everyone carries some stress about something, and that gap is the point of the exercise. Your score is simply how far your marks sit from that line.",
  },
  {
    q: "What does “thermal” mean here?",
    a: "The test reads your stress the way a thermometer reads temperature — as a level on a scale rather than a yes-or-no verdict. Two people can carry the same pressures and register very differently, and that difference is the useful part.",
  },
  {
    q: "What is the effectiveness figure?",
    a: "Stress and effectiveness move one-for-one against each other. If your reading in an area is 40, then roughly 60% of what you put into that area actually reaches it — the rest is absorbed by the strain before it does any good. It is usually the number people find hardest to argue with.",
  },
  {
    q: "Is this a medical diagnosis?",
    a: "No. The KBT is a structured self-reflection tool. It can show you where your strain is concentrated and open a useful conversation, but it does not diagnose any condition. For that you need a qualified professional — which Dawn Org can arrange.",
  },
  {
    q: "How honest do I need to be?",
    a: "Completely, or the reading is worthless. Nobody sees your answers but you. The instinct to answer as the person you would like to be is the single most common way to get a misleading result.",
  },
  {
    q: "What happens to my answers?",
    a: "In this version, nothing leaves your browser. Your responses are held on your own device only, and closing the tab clears them.",
  },
  {
    q: "What do I do with the result?",
    a: "Read it as a starting point, not a verdict. The breakdown points to the two or three areas drawing most heavily on you, which is usually where counselling, yoga, or personality development work has the fastest effect.",
  },
]

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="paper-wash relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-border-strong bg-card px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-primary">
                Kernal Behaviour Thermal Test — I
              </span>

              <h1 className="mt-7 text-4xl font-bold leading-[1.08] text-foreground sm:text-6xl">
                Find out what your stress is actually made of.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                Most of us can tell that we are under pressure. Far fewer can
                say where it is coming from. The KBT reads twenty-one dimensions
                of mind — eleven inner capacities and ten sources of strain —
                and gives you a single clear picture of the balance between
                them.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/test"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Begin the test
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#what-it-is"
                  className="inline-flex items-center justify-center rounded-full border border-border-strong bg-card px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-surface-hover"
                >
                  Learn more first
                </Link>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Free during trial · About 10 minutes · Nothing leaves your
                device
              </p>
            </div>
          </div>
        </section>

        {/* What it is */}
        <section
          id="what-it-is"
          className="scroll-mt-20 border-y border-border-subtle bg-card"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Two columns, one balance
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground text-pretty">
                <p>
                  The KBT sheet has always been read as a pair of columns. On
                  one side sit the capacities that carry you — balance of mind,
                  concentration, will power, acceptance. On the other sit the
                  forces that draw on you — fear, anger, ego, the sheer volume
                  of your own thoughts.
                </p>
                <p>
                  Stress, in this reading, is never just the size of what you
                  are carrying. It is the relationship between the load and the
                  strength available to bear it. Someone with heavy pressures
                  and deep resources may sit calmer than someone with light
                  pressures and none.
                </p>
                <p>
                  That is why the test scores both sides, and why the result
                  tells you which of the two to work on first.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/50 p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                The scale
              </p>
              <div className="mt-6 space-y-6">
                {[
                  {
                    k: "L",
                    label: "Low",
                    body: "This is barely present in me, or present only rarely.",
                  },
                  {
                    k: "M",
                    label: "Medium",
                    body: "This is a regular part of my life without dominating it.",
                  },
                  {
                    k: "H",
                    label: "High",
                    body: "This is strongly present and shapes how I live day to day.",
                  },
                ].map((s) => (
                  <div key={s.k} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-card text-sm font-bold text-primary">
                      {s.k}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{s.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The God Line */}
        <section id="god-line" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <GodLineDiagram />
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Everything is measured from one line
                </h2>
                <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground text-pretty">
                  <p>
                    Down the middle of the sheet runs a single line. Some call
                    it the God Line, some the Guru Line, some simply the line of
                    wholeness — the name matters less than what sits on it.
                  </p>
                  <p>
                    On that line there is no strain at all, and every ounce of
                    effort you spend arrives where you aimed it. It is the state
                    the whole practice points towards, and no living person
                    occupies it. Everyone is carrying something.
                  </p>
                  <p>
                    Which makes it a useful place to measure from. A mark
                    resting on the line scores nothing. One step out scores 5,
                    two steps out scores 10. Add the twenty-one marks, halve the
                    total, and you have your stress level — a plain statement of
                    how far from the line you are standing today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The four domains */}
        <section
          id="domains"
          className="scroll-mt-20 border-y border-border-subtle bg-card"
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                One area of life at a time
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                Stress is rarely spread evenly. Most people are steady in some
                parts of life and stretched thin in others, so the KBT is taken
                against a single area and read on its own terms.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DOMAINS.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <h3 className="text-lg font-semibold">{d.label}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {d.blurb}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {d.covers}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              What taking it is like
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {STEPS.map((step, i) => (
                <div key={step.title}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground text-pretty">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 21 dimensions */}
        <section
          id="dimensions"
          className="scroll-mt-20 border-y border-border-subtle bg-card"
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                The twenty-one dimensions
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
                These are the same dimensions, in the same order, as the printed
                sheet used in Dawn Org consultations.
              </p>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
              <DimensionList
                heading="Inner resources"
                caption="What carries you. Higher is healthier."
                tone="resource"
                items={RESOURCE_TRAITS.map((t) => t.label)}
              />
              <DimensionList
                heading="Sources of strain"
                caption="What draws on you. Higher means more load."
                tone="driver"
                items={DRIVER_TRAITS.map((t) => t.label)}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
            <h2 className="text-3xl font-bold sm:text-4xl">Before you begin</h2>
            <dl className="mt-12 divide-y divide-border-subtle border-y border-border-subtle">
              {FAQ.map((item) => (
                <div key={item.q} className="py-7">
                  <dt className="text-lg font-semibold">{item.q}</dt>
                  <dd className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-border-subtle bg-primary">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-24">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ten minutes of honesty is worth a great deal.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-primary-foreground/75 text-pretty">
              Answer as you actually are, not as you would like to be. That is
              the whole method.
            </p>
            <Link
              href="/test"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Begin the test
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

/** Miniature of the sheet's centre column, showing distance as score. */
function GodLineDiagram() {
  const rows = [
    { left: 2, right: 0 },
    { left: 1, right: 1 },
    { left: 0, right: 2 },
    { left: 1, right: 0 },
    { left: 2, right: 1 },
    { left: 1, right: 2 },
  ]
  const step = 34
  const top = 54
  const centre = 170

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <svg viewBox="0 0 340 300" className="w-full" aria-hidden="true">
        {/* Distance labels */}
        {[
          { x: centre - 2 * step, label: "10" },
          { x: centre - step, label: "5" },
          { x: centre, label: "0" },
          { x: centre + step, label: "5" },
          { x: centre + 2 * step, label: "10" },
        ].map((t) => (
          <text
            key={t.x}
            x={t.x}
            y={30}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            className="fill-muted-foreground"
          >
            {t.label}
          </text>
        ))}

        <text
          x={centre}
          y={288}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.2"
          className="fill-primary"
        >
          GOD LINE
        </text>

        <line
          x1={centre}
          y1={40}
          x2={centre}
          y2={268}
          className="stroke-primary"
          strokeWidth="2.5"
        />

        {rows.map((r, i) => {
          const y = top + i * step
          const lx = centre - r.left * step
          const rx = centre + r.right * step
          return (
            <g key={i}>
              <line
                x1={centre - 2 * step}
                y1={y}
                x2={centre + 2 * step}
                y2={y}
                className="stroke-border-strong"
                strokeWidth="1"
              />
              <circle cx={lx} cy={y} r="6" className="fill-primary" />
              <circle cx={rx} cy={y} r="6" className="fill-accent" />
            </g>
          )
        })}
      </svg>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        The further a mark sits from the line, the more it costs you.
      </p>
    </div>
  )
}

function DimensionList({
  heading,
  caption,
  items,
  tone,
}: {
  heading: string
  caption: string
  items: string[]
  tone: "resource" | "driver"
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span
          className={
            tone === "resource"
              ? "h-2.5 w-2.5 rounded-full bg-primary"
              : "h-2.5 w-2.5 rounded-full bg-accent"
          }
          aria-hidden="true"
        />
        <h3 className="text-xl font-semibold">{heading}</h3>
      </div>
      <p className="mt-2 pl-[22px] text-sm text-muted-foreground">{caption}</p>
      <ul className="mt-6 pl-[22px]">
        {items.map((label, i) => (
          <li
            key={label}
            className="flex items-baseline gap-4 border-b border-border-subtle py-3 last:border-0"
          >
            <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[15px] font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
