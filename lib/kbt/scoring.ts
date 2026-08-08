import {
  DRIVER_TRAITS,
  KBT_TRAITS,
  RESOURCE_TRAITS,
  type Level,
  type Trait,
} from "./questions"

/**
 * Dawn Org's scoring method.
 *
 * Every mark is scored by its distance from the centre line of the sheet —
 * the God Line. On the left column the High mark is the innermost, so H scores
 * 0 and L (furthest out) scores 10. On the right column Low is the innermost,
 * so L scores 0 and H scores 10. The 21 points are summed and halved to give
 * the stress level.
 *
 * The theoretical maximum is 21 x 10 / 2 = 105, so a reading above 100 is
 * possible but takes near-worst answers throughout; it is capped at 100.
 *
 * Note that the innermost column is not the God Line itself — every diagram
 * draws it standing clear of the line, since nobody is untouched in any
 * dimension. The line is beyond the sheet's best answer, not on it.
 *
 * None of this arithmetic is shown to the participant. On the client's
 * instruction the site surfaces only the stress level, the effectiveness
 * figure, and which dimensions are carrying or draining them.
 */

/** Points for a mark, by how far it sits from the God Line. */
export function pointsFor(trait: Trait, level: Level): number {
  const distance: Record<Level, number> = { L: 10, M: 5, H: 0 }
  // The right column runs the other way: its Low mark is the one on the line.
  return trait.group === "driver" ? 10 - distance[level] : distance[level]
}

export const MAX_STRESS = 100

export type BandId = "settled" | "manageable" | "elevated" | "high"

export interface Band {
  id: BandId
  label: string
  /** Inclusive upper bound of the band. */
  max: number
  summary: string
}

/**
 * Provisional — Dawn Org has not told us what they call these ranges yet, so
 * both the names and the cut-offs are ours and are expected to change.
 *
 * The middle band is deliberately the widest. Answering Medium to all
 * twenty-one dimensions scores 52.5, and that is the ordinary middle of the
 * instrument rather than a warning sign; a narrower band would push it into
 * Elevated and overstate what the participant actually reported.
 */
export const BANDS: Band[] = [
  {
    id: "settled",
    label: "Settled",
    max: 25,
    summary:
      "Your marks sit close to the God Line in this area of life. Little is being lost to strain here, and most of what you put in is reaching its target.",
  },
  {
    id: "manageable",
    label: "Manageable",
    max: 55,
    summary:
      "You are managing in this area, but a meaningful share of your effort is being absorbed before it does any good. Small, targeted work now tends to prevent larger difficulty later.",
  },
  {
    id: "elevated",
    label: "Elevated",
    max: 80,
    summary:
      "Several dimensions are sitting well out from the God Line at once, and your reserves are being spent faster than they are replaced. This is the range where structured support makes the clearest difference.",
  },
  {
    id: "high",
    label: "High",
    max: 100,
    summary:
      "Your marks sit far from the God Line across this area of life, and most of your effort here is being lost to strain rather than reaching its object. We would encourage you to speak with a Dawn Org counsellor rather than work through this alone.",
  },
]

export function bandFor(score: number): Band {
  return BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1]
}

/** Lower bound of a band, for axis labelling. */
export function bandFloor(band: Band): number {
  const i = BANDS.indexOf(band)
  return i <= 0 ? 0 : BANDS[i - 1].max
}

export type Answers = Partial<Record<string, Level>>

export interface TraitResult {
  trait: Trait
  level: Level
  /** 0-10; distance of this mark from the God Line. */
  points: number
}

export interface KbtResult {
  /** Stress level, 0-100. */
  score: number
  /** Uncapped total before the 100 ceiling — kept so the cap is auditable. */
  rawScore: number
  capped: boolean
  band: Band
  /**
   * How much of the effort you put into this domain actually lands. The God
   * Line is 0% stress and 100% efficient, so the two move 1:1 against
   * each other.
   */
  efficiency: number
  /** 0-100 share of the strain column that is active. */
  driverLoad: number
  /** 0-100 inner capacity available. */
  resourceStrength: number
  topDrivers: TraitResult[]
  thinnestResources: TraitResult[]
  strengths: TraitResult[]
  all: TraitResult[]
}

/** Scores print as whole numbers where possible; halves are real (5 / 2). */
export function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

export function computeScore(answers: Answers): KbtResult | null {
  const complete = KBT_TRAITS.every((t) => answers[t.id])
  if (!complete) return null

  const all: TraitResult[] = KBT_TRAITS.map((trait) => {
    const level = answers[trait.id] as Level
    return { trait, level, points: pointsFor(trait, level) }
  })

  const total = all.reduce((sum, r) => sum + r.points, 0)
  const rawScore = total / 2
  const score = Math.min(rawScore, MAX_STRESS)

  const sumPoints = (traits: Trait[]) =>
    traits.reduce((sum, t) => sum + pointsFor(t, answers[t.id] as Level), 0)

  const driverPoints = sumPoints(DRIVER_TRAITS)
  const resourcePoints = sumPoints(RESOURCE_TRAITS)

  const byPointsDesc = (a: TraitResult, b: TraitResult) => b.points - a.points

  return {
    score,
    rawScore,
    capped: rawScore > MAX_STRESS,
    band: bandFor(score),
    efficiency: MAX_STRESS - score,
    driverLoad: Math.round((driverPoints / (DRIVER_TRAITS.length * 10)) * 100),
    resourceStrength: Math.round(
      100 - (resourcePoints / (RESOURCE_TRAITS.length * 10)) * 100,
    ),
    topDrivers: all
      .filter((r) => r.trait.group === "driver" && r.points > 0)
      .sort(byPointsDesc)
      .slice(0, 5),
    thinnestResources: all
      .filter((r) => r.trait.group === "resource" && r.points > 0)
      .sort(byPointsDesc)
      .slice(0, 5),
    strengths: all.filter(
      (r) => r.trait.group === "resource" && r.points === 0,
    ),
    all,
  }
}
