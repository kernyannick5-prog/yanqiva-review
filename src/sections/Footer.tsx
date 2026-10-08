import { Container } from './ui'

const internal = [
  { href: '#how', label: 'Produkt' },
  { href: '#pricing', label: 'Preise' },
  { href: '#demo', label: 'Dashboard' },
]
const external = [
  { href: 'mailto:support@yanqiva.de', label: 'Kontakt', ext: false },
  { href: 'https://yanqiva.de/impressum', label: 'Impressum', ext: true },
  { href: 'https://yanqiva.de/datenschutz', label: 'Datenschutz', ext: true },
]

const linkClass = 'inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-text'

/** Seitenfuß. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950/60 py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold tracking-[0.14em]">YANQIVA</p>
            <p className="mt-1 font-display text-lg text-text">Digital Solutions.</p>
            <p className="mt-1 text-sm text-muted">KI. Websites. Automatisierung. SaaS.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 md:max-w-md md:justify-end">
              {internal.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
              {external.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass} {...(l.ext ? { rel: 'noopener', target: '_blank' } : {})}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:justify-between">
          <p>© 2026 YANQIVA. Alle Rechte vorbehalten.</p>
          <p>Demo / Prototyp – alle Daten sind fiktiv.</p>
        </div>
      </Container>
    </footer>
  )
}
