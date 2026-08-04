import {
  DRIVER_TRAITS,
  KBT_TRAITS,
  RESOURCE_TRAITS,
  type Level,
  type Trait,
} from "./questions"

/**
 * PLACEHOLDER SCORING — NOT THE CLIENT'S ALGORITHM.
 *
 * The printed KBT sheet has a "Score" field and a 1-100 scale in the
 * background, but the method for deriving that score is Dawn Org's own and has
 * not been supplied yet. Everything below is a transparent stand-in so the
 * demo produces a coherent result. Replace `computeScore` once the real
 * method is provided; the rest of the app reads only `KbtResult`.
 */

const LEVEL_VALUE: Record<Level, number> = { L: 1, M: 2, H: 3 }

/** Drivers count as-is; resources are inverted so that low capacity adds strain. */
function strainFor(trait: Trait, level: Level): number {
  const value = LEVEL_VALUE[level]
  return trait.group === "driver" ? value : 4 - value
}

const MIN_STRAIN = KBT_TRAITS.length * 1
const MAX_STRAIN = KBT_TRAITS.length * 3

export type BandId = "settled" | "manageable" | "elevated" | "high"

export interface Band {
  id: BandId
  label: string
  range: [number, number]
  summary: string
}

export const BANDS: Band[] = [
  {
    id: "settled",
    label: "Settled",
    range: [1, 25],
    summary:
      "Your inner resources are currently carrying you well and no single stressor is dominating. This is a good position from which to build, rather than repair.",
  },
  {
    id: "manageable",
    label: "Manageable",
    range: [26, 50],
    summary:
      "You are managing, but specific pressures are drawing on you more than they should. Small, targeted work now tends to prevent larger difficulty later.",
  },
  {
    id: "elevated",
    label: "Elevated",
    range: [51, 75],
    summary:
      "Several stressors are active at once and your reserves are being spent faster than they are replaced. This is the range where structured support makes the clearest difference.",
  },
  {
    id: "high",
    label: "High",
    range: [76, 100],
    summary:
      "Your reported strain is high across a number of areas. We would encourage you to speak with a Dawn Org counsellor rather than work through this alone.",
  },
]

export function bandFor(score: number): Band {
  return BANDS.find((b) => score >= b.range[0] && score <= b.range[1]) ?? BANDS[0]
}

export type Answers = Partial<Record<string, Level>>

export interface TraitResult {
  trait: Trait
  level: Level
  /** 1-3, where 3 always means "contributing most strain". */
  strain: number
}

export interface KbtResult {
  /** Overall thermal reading, 1-100. Higher means more strain. */
  score: number
  band: Band
  /** 0-100 — how much of the driver column is active. */
  driverLoad: number
  /** 0-100 — how much inner capacity is currently available. */
  resourceStrength: number
  /** Drivers reported High, then Medium. */
  topDrivers: TraitResult[]
  /** Resources reported Low, then Medium — where capacity is thinnest. */
  thinnestResources: TraitResult[]
  /** Resources reported High — what is already working. */
  strengths: TraitResult[]
  all: TraitResult[]
}

function pct(raw: number, min: number, max: number): number {
  return Math.round(((raw - min) / (max - min)) * 100)
}

export function computeScore(answers: Answers): KbtResult | null {
  const complete = KBT_TRAITS.every((t) => answers[t.id])
  if (!complete) return null

  const all: TraitResult[] = KBT_TRAITS.map((trait) => {
    const level = answers[trait.id] as Level
    return { trait, level, strain: strainFor(trait, level) }
  })

  const totalStrain = all.reduce((sum, r) => sum + r.strain, 0)
  // Map onto the 1-100 scale printed on the sheet.
  const score = Math.round(pct(totalStrain, MIN_STRAIN, MAX_STRAIN) * 0.99) + 1

  const driverRaw = DRIVER_TRAITS.reduce(
    (sum, t) => sum + LEVEL_VALUE[answers[t.id] as Level],
    0,
  )
  const resourceRaw = RESOURCE_TRAITS.reduce(
    (sum, t) => sum + LEVEL_VALUE[answers[t.id] as Level],
    0,
  )

  const byStrainDesc = (a: TraitResult, b: TraitResult) => b.strain - a.strain

  return {
    score,
    band: bandFor(score),
    driverLoad: pct(driverRaw, DRIVER_TRAITS.length, DRIVER_TRAITS.length * 3),
    resourceStrength: pct(
      resourceRaw,
      RESOURCE_TRAITS.length,
      RESOURCE_TRAITS.length * 3,
    ),
    topDrivers: all
      .filter((r) => r.trait.group === "driver" && r.level !== "L")
      .sort(byStrainDesc)
      .slice(0, 5),
    thinnestResources: all
      .filter((r) => r.trait.group === "resource" && r.level !== "H")
      .sort(byStrainDesc)
      .slice(0, 5),
    strengths: all.filter(
      (r) => r.trait.group === "resource" && r.level === "H",
    ),
    all,
  }
}
