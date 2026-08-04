import { cn } from "@/lib/utils"

/**
 * Placeholder mark: a sun rising over still water. Swap for Dawn Org's real
 * emblem once we have it as vector artwork.
 */
export function DawnMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
    >
      <circle cx="20" cy="20" r="19" className="fill-primary" />
      <circle cx="20" cy="17.5" r="6.5" className="fill-accent" />
      <g className="stroke-primary-foreground" strokeLinecap="round" strokeWidth="1.6">
        <path d="M8 25.5h24" opacity="0.9" />
        <path d="M11 29h18" opacity="0.6" />
        <path d="M14 32h12" opacity="0.35" />
      </g>
    </svg>
  )
}

export function DawnWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <DawnMark />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-primary">
          DAWN ORG
        </span>
        <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
          Counselling &amp; Wellbeing
        </span>
      </span>
    </span>
  )
}
