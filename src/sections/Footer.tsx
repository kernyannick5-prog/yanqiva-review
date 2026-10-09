import { MotionToggle } from '../components/MotionToggle'
import { Container } from './ui'

const BASE = import.meta.env.BASE_URL

const internal = [
  { hash: '#how', label: 'Produkt' },
  { hash: '#pricing', label: 'Preise' },
  { hash: '#demo', label: 'Dashboard' },
]
const external = [
  { href: `${BASE}bestellen/`, label: 'Bestellen' },
  { href: 'mailto:support@yanqiva.de', label: 'Kontakt' },
  { href: `${BASE}impressum/`, label: 'Impressum' },
  { href: `${BASE}datenschutz/`, label: 'Datenschutz' },
  { href: `${BASE}agb/`, label: 'AGB' },
  { href: `${BASE}barrierefreiheit/`, label: 'Barrierefreiheit' },
  { href: `${BASE}dashboard/`, label: 'Kunden-Login' },
]

const linkClass =
  '-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-[15px] text-muted transition-colors hover:text-text active:text-mint'

/** Seitenfuß. Auf Rechtsseiten zeigen die Anker auf die Startseite. */
export function Footer({ onLegalPage = false }: { onLegalPage?: boolean }) {
  return (
    <footer className={`${onLegalPage ? 'section-sep ' : ''}relative overflow-hidden bg-gradient-to-b from-transparent to-ink-950/80 pb-8 pt-12 sm:pt-16`}>
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold tracking-[0.14em]">YANQIVA</p>
            <p className="mt-1.5 font-display text-lg text-text">Digital Solutions.</p>
            <p className="mt-1 text-sm text-muted">KI. Websites. Automatisierung. SaaS.</p>
            <p className="mt-3 text-sm text-muted">
              <a href="https://yanqiva.de/" className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 underline-offset-2 transition-colors hover:text-text hover:underline active:text-mint">Ein Angebot von Yanqiva</a>
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 sm:flex sm:flex-wrap sm:gap-x-6 md:max-w-md md:justify-end">
              {internal.map((l) => (
                <li key={l.hash}>
                  <a href={onLegalPage ? `${BASE}${l.hash}` : l.hash} className={linkClass}>{l.label}</a>
                </li>
              ))}
              {external.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
              {!onLegalPage && (
                <li>
                  <MotionToggle className={`${linkClass} underline-offset-2 hover:underline aria-pressed:text-mint`} />
                </li>
              )}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-1.5 border-t border-line pt-6 text-[13px] text-faint sm:flex-row sm:justify-between">
          <p>© 2026 YANQIVA. Alle Rechte vorbehalten.</p>
          <p>Endpreise, gemäß § 19 UStG keine Umsatzsteuer. Daten in der Dashboard-Demo sind fiktiv.</p>
        </div>
        <p className="mt-3 text-[13px] text-faint">Google ist eine Marke der Google LLC; YANQIVA steht in keiner Verbindung zu Google.</p>
      </Container>
    </footer>
  )
}
