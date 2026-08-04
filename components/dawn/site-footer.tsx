import Link from "next/link"
import { DawnMark } from "./logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <DawnMark className="h-8 w-8" />
              <span className="text-sm font-bold tracking-tight text-primary">
                DAWN ORG [NGO]
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Counselling, psychiatry, yoga, and personality development. The
              Kernal Behaviour Thermal Test is our own instrument, developed in
              practice over many years.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:gap-16">
            <div>
              <h3 className="font-semibold text-foreground">The test</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <Link href="/test" className="hover:text-foreground">
                    Take the KBT
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-foreground">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-foreground">
                    Questions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Contact</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>Placeholder address</li>
                <li>Placeholder phone</li>
                <li>Placeholder email</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The KBT is a self-reflection aid, not a diagnostic instrument, and
            it does not replace assessment by a qualified professional. If you
            are in distress, please contact Dawn Org or your local emergency
            service directly.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dawn Org [NGO]. Demonstration site.
          </p>
        </div>
      </div>
    </footer>
  )
}
