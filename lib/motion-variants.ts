import type { Variants } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number]

/** Fade + slide up for section headings */
export const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

/** Fade + slide up for cards and content blocks */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

/** Blur + fade + slide up for hero headline words */
export const blurUpVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease },
  },
}

/** Horizontal clip-path wipe for section h2 headings */
export const wipeVariants: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.7, ease },
  },
}

/** Stagger container — 0.06s between children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

/** Stagger container — 0.08s between children (sparser grids) */
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/** Fast stagger container — 0.04s between children (dense badge/skill grids) */
export const fastStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

/** Badge scale-in animation */
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
}
