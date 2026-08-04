import { BANDS, type Band } from "@/lib/kbt/scoring"
import { cn } from "@/lib/utils"

const BAND_COLOR: Record<Band["id"], string> = {
  settled: "var(--thermal-settled)",
  manageable: "var(--thermal-manageable)",
  elevated: "var(--thermal-elevated)",
  high: "var(--thermal-high)",
}

export function ThermalGauge({
  score,
  band,
  className,
}: {
  score: number
  band: Band
  className?: string
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Thermal reading
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span
              className="text-6xl font-bold tabular-nums leading-none sm:text-7xl"
              style={{ color: `hsl(${BAND_COLOR[band.id]})` }}
            >
              {score}
            </span>
            <span className="text-lg text-muted-foreground">/ 100</span>
          </p>
        </div>
        <span
          className="rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: `hsl(${BAND_COLOR[band.id]})` }}
        >
          {band.label}
        </span>
      </div>

      {/* Scale */}
      <div className="mt-8">
        <div
          className="relative h-3 w-full rounded-full"
          style={{
            background: `linear-gradient(90deg,
              hsl(var(--thermal-settled)) 0%,
              hsl(var(--thermal-manageable)) 38%,
              hsl(var(--thermal-elevated)) 68%,
              hsl(var(--thermal-high)) 100%)`,
          }}
          role="img"
          aria-label={`Thermal reading ${score} out of 100 — ${band.label}`}
        >
          <div
            className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background bg-foreground shadow-lg"
            style={{ left: `${score}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between">
          {BANDS.map((b) => (
            <span
              key={b.id}
              className={cn(
                "text-[11px] font-medium",
                b.id === band.id
                  ? "text-foreground"
                  : "text-muted-foreground/70",
              )}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MeterBar({
  label,
  value,
  caption,
  tone,
}: {
  label: string
  value: number
  caption: string
  tone: "primary" | "accent"
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm font-bold tabular-nums">{value}%</p>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "primary" ? "bg-primary" : "bg-accent",
          )}
          style={{ width: `${Math.max(value, 2)}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {caption}
      </p>
    </div>
  )
}
