import type { ReactNode } from 'react'

const BASE = import.meta.env.BASE_URL

export const SkipLink = () => (
  <a href="#main" className="fixed left-3 top-3 z-[200] inline-flex min-h-11 -translate-y-[200%] items-center rounded-full bg-mint px-5 text-sm font-semibold text-ink-950 focus:translate-y-0">
    Zum Inhalt springen
  </a>
)

export function SiteBrand() {
  return (
    <a href={BASE} className="flex min-h-11 items-center gap-2.5 active:opacity-70" aria-label="YANQIVA Review – zur Startseite">
      <span className="font-display text-lg font-bold tracking-[0.12em] text-text">YANQIVA</span>{' '}
      <span className="rounded-full border border-mint/40 bg-mint/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-mint">Review</span>
    </a>
  )
}

export function SiteFooter() {
  const link = '-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm text-muted underline-offset-2 hover:text-text hover:underline'
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-[13px] text-faint">© 2026 YANQIVA. Fragen zum Dashboard: <a href="mailto:support@yanqiva.de" className="underline underline-offset-2 hover:text-text">support@yanqiva.de</a></p>
        <nav aria-label="Rechtliches">
          <ul className="flex flex-wrap gap-x-5">
            <li><a href={`${BASE}impressum/`} className={link}>Impressum</a></li>
            <li><a href={`${BASE}datenschutz/`} className={link}>Datenschutz</a></li>
            <li><a href={`${BASE}agb/`} className={link}>AGB</a></li>
            <li><a href={`${BASE}barrierefreiheit/`} className={link}>Barrierefreiheit</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

/** Rahmen für Anmelde- und Bestätigungsseite (heller Seitenhintergrund wie die übrige Website). */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="section-light flex min-h-dvh flex-col">
      <SkipLink />
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <SiteBrand />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-lg flex-1 px-4 py-10 outline-none sm:py-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
