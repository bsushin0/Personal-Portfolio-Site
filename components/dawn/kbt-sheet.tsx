import {
  DRIVER_TRAITS,
  RESOURCE_TRAITS,
  type Level,
  type Trait,
} from "@/lib/kbt/questions"
import type { Domain } from "@/lib/kbt/domains"
import { formatScore, type KbtResult } from "@/lib/kbt/scoring"

export interface SheetParticipant {
  name: string
  age: string
  email: string
  mobile: string
  locality: string
  occupation: string
}

/* Geometry of the printed grid. The God Line sits at the centre, with clear
   space either side of it: the innermost columns (left H, right L) stop short
   of the line, because no mark ever lands on it. */
const VIEW_W = 900
const VIEW_H = 600
const CHART_TOP = 60
const CHART_BOTTOM = 556
const CHART_H = CHART_BOTTOM - CHART_TOP

const GOD_LINE_X = 396
const LEFT_X: Record<Level, number> = { L: 190, M: 272, H: 354 }
const RIGHT_X: Record<Level, number> = { L: 438, M: 520, H: 602 }
const LEFT_LABEL_X = 158
const RIGHT_LABEL_X = 634

const INK = "#22308a"
const INK_SOFT = "#9aa4cf"
const INK_FAINT = "#dfe3f2"
const MARK = "#ef8a24"

function rowY(index: number, count: number) {
  return CHART_TOP + ((index + 0.5) * CHART_H) / count
}

function xFor(trait: Trait, level: Level) {
  return trait.group === "resource" ? LEFT_X[level] : RIGHT_X[level]
}

export function KbtSheet({
  participant,
  domain,
  result,
  takenAt,
}: {
  participant: SheetParticipant
  domain: Domain
  result: KbtResult
  takenAt: Date
}) {
  const levelOf = (trait: Trait) =>
    result.all.find((r) => r.trait.id === trait.id)!.level

  const leftPoints = RESOURCE_TRAITS.map((t, i) => ({
    x: xFor(t, levelOf(t)),
    y: rowY(i, RESOURCE_TRAITS.length),
  }))
  const rightPoints = DRIVER_TRAITS.map((t, i) => ({
    x: xFor(t, levelOf(t)),
    y: rowY(i, DRIVER_TRAITS.length),
  }))

  const dateTime = takenAt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <div
      id="kbt-sheet"
      className="rounded-xl border-[3px] border-[#22308a] bg-white p-4 text-[#22308a] sm:p-6"
    >
      <div className="rounded-md border border-[#22308a] p-4 sm:p-5">
        <SheetHeader domain={domain} />

        <Particulars
          participant={participant}
          domain={domain}
          result={result}
          dateTime={dateTime}
        />

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mt-4 w-full"
          role="img"
          aria-label={`KBT sheet for the ${domain.label} domain. Stress level ${formatScore(result.score)} out of 100.`}
        >
          {/* Column guides */}
          {[...Object.values(LEFT_X), ...Object.values(RIGHT_X)].map((x) => (
            <line
              key={x}
              x1={x}
              y1={CHART_TOP - 8}
              x2={x}
              y2={CHART_BOTTOM + 8}
              stroke={INK_FAINT}
              strokeWidth="1"
            />
          ))}

          {/* Column headings */}
          {(["L", "M", "H"] as Level[]).map((lv) => (
            <g key={`h-${lv}`} fontSize="13" fontWeight="700" fill={INK}>
              <text x={LEFT_X[lv]} y={44} textAnchor="middle">
                {lv}
              </text>
              <text x={RIGHT_X[lv]} y={44} textAnchor="middle">
                {lv}
              </text>
            </g>
          ))}

          {/* The God Line */}
          <line
            x1={GOD_LINE_X}
            y1={CHART_TOP - 22}
            x2={GOD_LINE_X}
            y2={CHART_BOTTOM + 10}
            stroke={INK}
            strokeWidth="2.5"
          />
          <text
            x={GOD_LINE_X}
            y={26}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1.4"
            fill={INK}
          >
            GOD LINE
          </text>

          <TraitRows
            traits={RESOURCE_TRAITS}
            levelOf={levelOf}
            labelX={LEFT_LABEL_X}
            anchor="end"
            ruleFrom={LEFT_X.L}
            ruleTo={LEFT_X.H}
          />
          <TraitRows
            traits={DRIVER_TRAITS}
            levelOf={levelOf}
            labelX={RIGHT_LABEL_X}
            anchor="start"
            ruleFrom={RIGHT_X.L}
            ruleTo={RIGHT_X.H}
          />

          {/* Profile lines through the marks */}
          <polyline
            points={leftPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={MARK}
            strokeWidth="1.6"
            strokeLinejoin="round"
            opacity="0.75"
          />
          <polyline
            points={rightPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={MARK}
            strokeWidth="1.6"
            strokeLinejoin="round"
            opacity="0.75"
          />
          {[...leftPoints, ...rightPoints].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="5.5" fill={MARK} />
          ))}

          <text
            x={VIEW_W / 2}
            y={584}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill={INK}
          >
            L – Low&#160;&#160;&#160;&#160;M – Medium&#160;&#160;&#160;&#160;H –
            High
          </text>
        </svg>

        <p className="mt-3 border-t border-[#dfe3f2] pt-3 text-[10.5px] leading-relaxed text-[#5a6296]">
          The line down the centre is the God Line — perfect balance, no strain,
          every effort landing where it is aimed. No mark reaches it: everyone
          carries something in every dimension, so even the innermost columns
          stand clear of the line. The nearer your marks sit to it, the less of
          you is being spent on strain.
        </p>
      </div>
    </div>
  )
}

function SheetHeader({ domain }: { domain: Domain }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-2 border-[#22308a] pb-3">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 40 40" className="h-11 w-11 shrink-0" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill={INK} />
          <circle cx="20" cy="17.5" r="6.5" fill={MARK} />
          <g stroke="#fff" strokeLinecap="round" strokeWidth="1.6">
            <path d="M8 25.5h24" opacity="0.9" />
            <path d="M11 29h18" opacity="0.6" />
            <path d="M14 32h12" opacity="0.35" />
          </g>
        </svg>
        <div>
          <p className="text-xl font-extrabold leading-none tracking-tight sm:text-2xl">
            DAWN ORG [NGO]
          </p>
          <p className="mt-1 text-[10px] font-semibold leading-tight sm:text-[11px]">
            For Counselling / Psychiatry / Yoga / Personality Development
          </p>
          <p className="mt-2 inline-block rounded-full bg-[#22308a] px-3 py-1 text-[10px] font-bold text-white sm:text-[11px]">
            Kernal Behaviour Thermal Test - I (KBT)
          </p>
        </div>
      </div>

      <div className="shrink-0 rounded-md border-2 border-[#22308a] px-3 py-2 text-center">
        <p className="text-[9px] font-semibold uppercase tracking-wider">
          Domain
        </p>
        <p className="text-sm font-extrabold">{domain.label}</p>
      </div>
    </div>
  )
}

function Particulars({
  participant,
  domain,
  result,
  dateTime,
}: {
  participant: SheetParticipant
  domain: Domain
  result: KbtResult
  dateTime: string
}) {
  const left: Array<[string, string]> = [
    ["Name", participant.name],
    ["Age", participant.age],
    ["Email", participant.email],
    ["Mobile No", participant.mobile],
    ["Locality", participant.locality],
  ]
  const right: Array<[string, string]> = [
    ["Occupation", participant.occupation],
    ["Domain", domain.label],
    ["Stress Level", `${formatScore(result.score)}%  (${result.band.label})`],
    ["Effectiveness", `${formatScore(result.efficiency)}%`],
    ["Date & Time", dateTime],
  ]

  return (
    <div className="mt-4 grid gap-x-8 gap-y-1.5 rounded-md border border-[#22308a] p-3 sm:grid-cols-2 sm:p-4">
      {[left, right].map((column, ci) => (
        <div key={ci} className="space-y-1.5">
          {column.map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="w-[86px] shrink-0 text-[11px] font-bold sm:text-xs">
                {label}
              </span>
              <span className="text-[11px] font-bold">:</span>
              <span className="min-w-0 flex-1 border-b border-[#9aa4cf] pb-0.5 text-[11px] font-medium sm:text-xs">
                {value || " "}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function TraitRows({
  traits,
  levelOf,
  labelX,
  anchor,
  ruleFrom,
  ruleTo,
}: {
  traits: Trait[]
  levelOf: (t: Trait) => Level
  labelX: number
  anchor: "start" | "end"
  ruleFrom: number
  ruleTo: number
}) {
  return (
    <g>
      {traits.map((trait, i) => {
        const y = rowY(i, traits.length)
        return (
          <g key={trait.id}>
            <text
              x={labelX}
              y={y + 4}
              textAnchor={anchor}
              fontSize="11.5"
              fontWeight="700"
              fill={INK}
            >
              {trait.label}
            </text>
            <line
              x1={ruleFrom}
              y1={y}
              x2={ruleTo}
              y2={y}
              stroke={INK}
              strokeWidth="1.2"
            />
            {(["L", "M", "H"] as Level[]).map((lv) => (
              <circle
                key={lv}
                cx={xFor(trait, lv)}
                cy={y}
                r="3"
                fill="#fff"
                stroke={INK_SOFT}
                strokeWidth="1.2"
              />
            ))}
          </g>
        )
      })}
    </g>
  )
}
