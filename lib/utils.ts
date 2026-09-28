import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidICAO(code: string): boolean {
  return /^[A-Z]{4}$/i.test(code.trim())
}

export function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }) + "Z"
  } catch {
    return isoString
  }
}
