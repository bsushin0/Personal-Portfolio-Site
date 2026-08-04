import Link from "next/link"
import { ArrowRight, ClipboardList, LineChart, Timer } from "lucide-react"
import { SiteHeader } from "@/components/dawn/site-header"
import { SiteFooter } from "@/components/dawn/site-footer"
import { DRIVER_TRAITS, RESOURCE_TRAITS } from "@/lib/kbt/questions"

const STEPS = [
  {
    icon: ClipboardList,
    title: "Rate 21 dimensions",
    body: "One at a time, you mark each dimension Low, Medium, or High. There are no trick questions and no right answers — only your own reading of yourself.",
  },
  {
    icon: Timer,
    title: "Take about ten minutes",
    body: "Each dimension comes with plain-language guidance and a short explainer, so you are never left guessing what a word means. Answer at your own pace.",
  },
  {
    icon: LineChart,
    title: "See where the heat is",
    body: "You get a thermal reading from 1 to 100, split into the pressures acting on you and the inner resources you have to meet them.",
  },
]

const FAQ = [
  {
    q: "What does “thermal” mean here?",
    a: "The test reads your stress the way a thermometer reads temperature — as a level on a scale rather than a yes-or-no verdict. Two people can carry the same pressures and register very differently, and that difference is the useful part.",
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
