import { motion, useReducedMotion } from 'framer-motion'
import { LinkButton } from '../components/Button'
import { QrCode } from '../components/QrCode'
import { Reveal } from '../components/Reveal'
import { demoRedirectUrl, productionRedirectUrl } from '../lib/redirectUrl'
import { Container, Eyebrow, sectionTitle } from './ui'

const SLUG = 'demo-baeckerei'

/** Verbindungsstück mit wanderndem Punkt. */
function Connector({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="relative mx-auto h-9 w-px bg-gradient-to-b from-mint/60 to-violet-glow/60">
      {!reduce && (
        <motion.span
          className="absolute -left-[3px] top-0 size-[7px] rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]"
          animate={{ y: [0, 29], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )
}

/** Animiertes Mini-Diagramm des Redirect-Prinzips. */
function RedirectDiagram({ reduce }: { reduce: boolean }) {
  return (
    <figure className="glass rounded-3xl p-5 sm:p-6">
      <figcaption className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-faint">So läuft die Weiterleitung</figcaption>
      <div className="flex justify-center gap-3">
        {['NFC', 'QR-Code'].map((l) => (
          <span key={l} className="rounded-full border border-line bg-white/[0.05] px-4 py-2 text-sm font-medium">{l}</span>
        ))}
      </div>
      <Connector reduce={reduce} />
      <div className="rounded-2xl border border-mint/40 bg-mint/[0.08] px-4 py-3 text-center shadow-[0_0_30px_-10px_rgb(94_234_212/0.6)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">YANQIVA Redirect-URL</p>
        <p className="mt-1 break-all font-mono text-[13px] text-text sm:text-sm">{productionRedirectUrl(SLUG)}</p>
      </div>
      <Connector reduce={reduce} />
      <div className="rounded-2xl border border-line bg-white/[0.05] px-4 py-3 text-center">
        <p className="text-sm font-medium">Google-Bewertung</p>
        <p className="mt-0.5 text-xs text-faint">Ziel änderbar im Dashboard</p>
      </div>
    </figure>
  )
}

/** Abschnitt mit echtem QR-Code und Redirect-Erklärung. */
export function QrDemo() {
  const reduce = useReducedMotion() ?? false

  return (
    <section id="qr" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="qr-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="mx-auto w-full max-w-[340px] lg:mx-0">
          <div className="relative rounded-[2rem] p-3 shadow-[0_0_80px_-10px_rgb(94_234_212/0.35)]">
            <div aria-hidden className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-mint via-violet-glow to-mint/20 opacity-70" />
            <div className="relative rounded-[1.6rem] bg-ink-900 p-4">
              <div className="relative overflow-hidden rounded-2xl">
                <QrCode value={demoRedirectUrl(SLUG)} size={300} className="!h-auto !w-full aspect-square" />
                {!reduce && (
                  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <motion.div
                      className="h-full w-full border-b-2 border-mint bg-gradient-to-b from-transparent to-mint/30 shadow-[0_8px_20px_rgb(94_234_212/0.5)]"
                      initial={{ y: '-100%' }}
                      animate={{ y: ['-100%', '0%', '-100%'] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>QR + NFC</Eyebrow>
            <h2 id="qr-title" className={`${sectionTitle} mt-4`}>Scanne den QR-Code</h2>
            <p className="mt-4 text-xl text-muted">oder tippe mit deinem Smartphone auf die NFC-Karte.</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <RedirectDiagram reduce={reduce} />
          </Reveal>

          <Reveal delay={0.15} className="mt-5">
            <p className="text-[15px] leading-relaxed text-muted">
              Auf der Karte steht nur die Redirect-URL. Wohin sie führt, änderst du jederzeit im Dashboard, ohne die Karte neu zu programmieren.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <LinkButton href={demoRedirectUrl(SLUG)} target="_blank" rel="noopener">
                Weiterleitung testen<span aria-hidden>↗</span>
                <span className="sr-only">(öffnet in neuem Tab)</span>
              </LinkButton>
              <p className="text-xs leading-snug text-faint sm:max-w-[16rem]">
                Demo: Das Ziel ist eine simulierte Bewertungsseite, keine echte Google-Seite.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
