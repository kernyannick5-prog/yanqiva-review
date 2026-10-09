import { useReducedMotion } from 'framer-motion'
import { LinkButton } from '../components/Button'
import { QrCode } from '../components/QrCode'
import { Reveal } from '../components/Reveal'
import { useLoopVisible } from '../lib/useLoopVisible'
import { demoRedirectUrl, productionRedirectUrl } from '../lib/redirectUrl'
import { Container, SectionHead } from './ui'

const SLUG = 'demo-baeckerei'
const redirectUrl = productionRedirectUrl(SLUG)
const cut = Math.max(0, redirectUrl.indexOf('/r/'))
const redirectParts = [redirectUrl.slice(0, cut), redirectUrl.slice(cut)] as const

/** Verbindungsstück mit wanderndem Punkt. */
function Connector({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="relative mx-auto h-9 w-px bg-gradient-to-b from-mint/60 to-violet-glow/60">
      {!reduce && (
        <span className="yq-dot absolute -left-[3px] top-0 size-[7px] rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]" />
      )}
    </div>
  )
}

/** Animiertes Mini-Diagramm des Redirect-Prinzips. */
function RedirectDiagram({ reduce }: { reduce: boolean }) {
  return (
    <figure className="glass rounded-3xl p-5 sm:p-6">
      <figcaption className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-faint">So läuft die Weiterleitung</figcaption>
      <div className="flex justify-center gap-3">
        {['NFC', 'QR-Code'].map((l) => (
          <span key={l} className="rounded-lg border border-edge-weak bg-wash-weak px-3 py-1.5 text-[13px] font-semibold tracking-wide text-muted">{l}</span>
        ))}
      </div>
      <Connector reduce={reduce} />
      <div className="rounded-2xl border border-mint/40 bg-mint/[0.08] px-4 py-3 text-center shadow-[0_0_30px_-10px_rgb(94_234_212/0.6)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">YANQIVA Redirect-URL</p>
        <p className="mt-1 font-mono text-[13px] text-text sm:text-sm">{redirectParts[0]}<wbr />{redirectParts[1]}</p>
      </div>
      <Connector reduce={reduce} />
      <div className="rounded-2xl border border-line bg-wash-weak px-4 py-3 text-center">
        <p className="text-sm font-medium">Google-Bewertung</p>
        <p className="mt-0.5 text-xs text-muted">Ziel änderbar im Dashboard</p>
      </div>
    </figure>
  )
}

/** Abschnitt mit echtem QR-Code und Redirect-Erklärung. */
export function QrDemo() {
  const reduce = useReducedMotion() ?? false
  const loop = useLoopVisible<HTMLElement>()

  return (
    <section id="qr" ref={loop} className="section-light section-y section-sep relative overflow-hidden" aria-labelledby="qr-title">
      <Container className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:mx-0">
          <div className="relative rounded-[2rem] p-3 shadow-[0_0_80px_-10px_var(--qr-glow)]">
            <div aria-hidden className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-mint via-violet-glow to-mint/20 opacity-70" />
            <div className="relative rounded-[1.6rem] bg-ink-900 p-4 shadow-[inset_0_0_0_1px_var(--color-edge-weak)]">
              <div className="relative overflow-hidden rounded-2xl">
                <QrCode value={demoRedirectUrl(SLUG)} size={300} className="!h-auto !w-full aspect-square" />
                {!reduce && (
                  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="yq-scan h-full w-full border-b-2 border-mint bg-gradient-to-b from-transparent to-mint/30 shadow-[0_8px_20px_rgb(94_234_212/0.5)]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionHead eyebrow="QR + NFC" id="qr-title" lead="oder tippe mit deinem Smartphone auf die NFC-Karte.">
              Scanne den QR-Code
            </SectionHead>
          </Reveal>

          <Reveal delay={0.1} className="mt-7 sm:mt-8">
            <RedirectDiagram reduce={reduce} />
          </Reveal>

          <Reveal delay={0.15} className="mt-5">
            <p className="max-w-[65ch] text-[15px] leading-relaxed text-muted sm:text-base">
              Auf der Karte steht nur die Redirect-URL. Wohin sie führt, änderst du jederzeit im Dashboard, ohne die Karte neu zu programmieren.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center [&>a]:w-full sm:[&>a]:w-auto">
              <LinkButton href={demoRedirectUrl(SLUG)} target="_blank" rel="noopener">
                Weiterleitung testen<span aria-hidden>↗</span>
                <span className="sr-only">(öffnet in neuem Tab)</span>
              </LinkButton>
              <p className="text-[13px] leading-snug text-faint sm:max-w-[16rem]">
                Demo: Das Ziel ist eine simulierte Bewertungsseite, keine echte Google-Seite.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
