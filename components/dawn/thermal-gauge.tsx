import { BANDS, formatScore, type Band } from "@/lib/kbt/scoring"
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
            Stress level
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span
              className="text-6xl font-bold tabular-nums leading-none sm:text-7xl"
              style={{ color: `hsl(${BAND_COLOR[band.id]})` }}
            >
              {formatScore(score)}
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

      {/* Scale — the low end sits nearest the God Line, never on it. */}
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
          aria-label={`Stress level ${formatScore(score)} out of 100 — ${band.label}`}
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

        <div className="mt-4 flex justify-between text-[11px] text-muted-foreground">
          <span>Closest to the God Line</span>
          <span>Furthest from it</span>
        </div>
      </div>
    </div>
  )
}
