import { LinkButton } from '../components/Button'
import { CountUp } from '../components/CountUp'
import { Reveal } from '../components/Reveal'
import { Container, Eyebrow, sectionTitle } from './ui'

const plans = [
  {
    name: 'Klassik',
    tagline: 'Der klassische Google-NFC-Tag',
    price: 60,
    features: ['1 NFC-Karte oder Aufsteller', 'QR-Code', 'Direkter Google-Bewertungslink', 'Einrichtung inklusive'],
    popular: false,
  },
  {
    name: 'Dashboard',
    tagline: 'Alles aus Klassik, plus Kontrolle',
    price: 90,
    features: ['1 NFC-Karte oder Aufsteller', 'QR-Code', 'YANQIVA Dashboard', 'Statistiken zu Taps und Scans', 'Ziel-Link jederzeit änderbar', 'Einrichtung inklusive'],
    popular: true,
  },
]

/** Preise (einmalig, Endpreise). */
export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="pricing-title">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Preise</Eyebrow>
          <h2 id="pricing-title" className={`${sectionTitle} mt-4`}>Einmal zahlen. Sofort loslegen.</h2>
          <p className="mt-4 text-muted">
            Einmalpreise, keine Abo-Pflicht. Mehrere Karten oder Filialen auf Anfrage.
          </p>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
          {plans.map((p, i) => (
            <li key={p.name} className={p.popular ? 'md:-my-3' : ''}>
              <Reveal delay={i * 0.1} className="h-full">
                <div
                  className={`glass relative flex h-full flex-col rounded-3xl p-6 sm:p-8 ${
                    p.popular ? 'border-mint/40 shadow-glow' : ''
                  }`}
                >
                  {p.popular && (
                    <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-mint px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink-950">
                      Beliebt
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold uppercase tracking-[0.16em] text-muted">{p.name}</h3>
                  <p className="mt-1 text-sm text-faint">{p.tagline}</p>
                  <p className="mt-4 font-display text-5xl font-semibold tracking-tight">
                    <CountUp to={p.price} suffix=" €" />
                  </p>
                  <p className="mt-1 text-sm text-faint">einmalig · Endpreis</p>

                  <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[15px] text-text">
                        <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <LinkButton href="#cta" variant={p.popular ? 'primary' : 'ghost'} className="mt-8 w-full">
                    Paket wählen<span className="sr-only"> ({p.name})</span>
                  </LinkButton>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-faint">Demo: Es erfolgt keine echte Bestellung.</p>
      </Container>
    </section>
  )
}
