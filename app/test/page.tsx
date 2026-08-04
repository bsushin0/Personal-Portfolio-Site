import type { Metadata } from "next"
import Link from "next/link"
import { X } from "lucide-react"
import { DawnWordmark } from "@/components/dawn/logo"
import { KbtTest } from "@/components/dawn/kbt-test"

export const metadata: Metadata = {
  title: "Take the KBT",
  description:
    "Rate twenty-one dimensions of mind and get a thermal reading of where your stress is coming from.",
}

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border-subtle bg-background/85 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Dawn Org home">
            <DawnWordmark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Exit
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <KbtTest />
      </main>
    </div>
  )
}
