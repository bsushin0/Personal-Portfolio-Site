"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { LEVEL_LABELS, type Level, type Trait } from "@/lib/kbt/questions"
import { cn } from "@/lib/utils"

const STEP = 78
/**
 * Even the best answer sits clear of the God Line. Nobody is untouched in any
 * dimension of life, so no mark is ever drawn on the line itself.
 */
const GAP = 30
const CY = 62

/**
 * Animated stand-in for the counsellor explainer clips. It walks the three
 * possible answers outward from the God Line so the participant can see what
 * each choice means before they make it.
 *
 * Marks step away from the line in the same direction they do on the printed
 * sheet: resources sit to its left, strains to its right.
 */
export function TraitExplainer({ trait }: { trait: Trait }) {
  const [playing, setPlaying] = useState(true)

  const isResource = trait.group === "resource"
  const levels: Level[] = isResource ? ["H", "M", "L"] : ["L", "M", "H"]
  const lineX = isResource ? 236 : 14
  const dir = isResource ? -1 : 1
  const xAt = (i: number) => lineX + dir * (GAP + i * STEP)
  const playState = playing ? "running" : "paused"

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause explainer" : "Play explainer"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          )}
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          What each answer means
        </p>
      </div>

      <div className="px-4 pb-4 pt-3">
        <svg
          viewBox="0 0 250 106"
          className="w-full"
          role="img"
          aria-label={`Diagram: rating ${trait.label} ${LEVEL_LABELS[levels[0]]} places your mark closest to the God Line — still clear of it, since nobody sits on the line — while ${LEVEL_LABELS[levels[1]]} sits further out and ${LEVEL_LABELS[levels[2]]} furthest out.`}
        >
          {/* Track the marks sit on */}
          <line
            x1={xAt(0)}
            y1={CY}
            x2={xAt(2)}
            y2={CY}
            className="stroke-border-strong"
            strokeWidth="1.5"
          />

          {/* The God Line */}
          <line
            x1={lineX}
            y1={20}
            x2={lineX}
            y2={CY + 16}
            className="stroke-primary"
            strokeWidth="2.5"
          />
          <text
            x={lineX + dir * 4}
            y={14}
            textAnchor={isResource ? "end" : "start"}
            fontSize="9"
            fontWeight="700"
            letterSpacing="0.8"
            className="fill-primary"
          >
            GOD LINE
          </text>

          {levels.map((level, i) => (
            <g key={level}>
              <circle
                cx={xAt(i)}
                cy={CY}
                r="7"
                className="fill-card stroke-border-strong"
                strokeWidth="1.5"
              />
              <text
                x={xAt(i)}
                y={CY + 24}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className="fill-muted-foreground"
              >
                {level}
              </text>
              <text
                x={xAt(i)}
                y={CY + 36}
                textAnchor="middle"
                fontSize="9"
                className="fill-muted-foreground"
              >
                {LEVEL_LABELS[level]}
              </text>
            </g>
          ))}

          {/* The travelling mark */}
          <circle
            cx={xAt(0)}
            cy={CY}
            r="9"
            className={cn(
              "kbt-explainer-mark",
              isResource ? "fill-primary" : "fill-accent",
            )}
            style={
              {
                animationPlayState: playState,
                "--kbt-p1": `${dir * STEP}px`,
                "--kbt-p2": `${dir * 2 * STEP}px`,
              } as React.CSSProperties
            }
          />
        </svg>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Even the closest answer stands clear of the line — nobody is
          untouched in any part of life.
        </p>

        <div className="mt-3 grid">
          {levels.map((level, i) => (
            <p
              key={level}
              className="kbt-explainer-caption col-start-1 row-start-1 text-sm leading-relaxed text-muted-foreground"
              style={{
                animationPlayState: playState,
                animationDelay: `-${((3 - i) % 3) * 2}s`,
              }}
            >
              <strong className="font-semibold text-foreground">
                {LEVEL_LABELS[level]}
              </strong>{" "}
              — {trait.anchors[level]}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
