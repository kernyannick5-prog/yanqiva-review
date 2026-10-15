import { LinkButton } from '../components/Button'
import { ReviewCardFace } from '../components/ReviewCardFace'
import { DELIVERY_SHORT } from '../order/deliveryArea'
import {
  DASHBOARD_EXTRA_CARD_EUR,
  DASHBOARD_FIRST_CARD_EUR,
  DASHBOARD_INCLUDED_MONTHS,
  DASHBOARD_RENEWAL_EUR,
  formatEuro,
  KOMBI_SINGLE_EUR,
  PRODUCTS,
  shippingText,
  subtotal,
  type Product,
} from '../order/catalog'
import { Reveal } from '../components/Reveal'
import { Container, SectionHead } from './ui'

interface Plan {
  p: Product
  name: string
  tagline: string
  /** Zeile unter dem Preis. */
  priceNote: string
  note: string
  features: string[]
  popular?: boolean
  accent?: boolean
}

const CARD = '1 NFC-Bewertungskarte (Acryl, 12 × 12 cm)'
const renewal = `Danach nur auf Wunsch verlängerbar für ${DASHBOARD_RENEWAL_EUR} €/Monat je Standort, monatlich kündbar, kein automatisches Abo. Ohne Verlängerung leitet die Karte direkt weiter zu Google.`
const staffel = `${DASHBOARD_FIRST_CARD_EUR} € für die erste Karte, jede weitere Karte ${DASHBOARD_EXTRA_CARD_EUR} €: 1 Karte ${formatEuro(subtotal('review-dashboard', 1))}, 2 Karten ${formatEuro(subtotal('review-dashboard', 2))}, 3 Karten ${formatEuro(subtotal('review-dashboard', 3))}.`

const common = (p: Product) => [DELIVERY_SHORT, shippingText(p)]

const singles: Plan[] = [
  {
    p: PRODUCTS['review-klassik'],
    name: 'Klassik',
    tagline: PRODUCTS['review-klassik'].tagline,
    priceNote: 'einmalig je Karte · Endpreis',
    note: 'Kein Dashboard, keine Folgekosten.',
    features: [CARD, 'Farbe nach Wahl: Schwarz oder Weiß', 'QR-Code', 'Weiterleitung direkt zum Google-Bewertungsformular', 'Einrichtung inklusive', ...common(PRODUCTS['review-klassik'])],
  },
  {
    p: PRODUCTS['review-dashboard'],
    name: 'Dashboard',
    tagline: PRODUCTS['review-dashboard'].tagline,
    priceNote: `für die erste Karte · jede weitere ${formatEuro(DASHBOARD_EXTRA_CARD_EUR)} · Endpreise`,
    note: `${staffel} Inkl. ${DASHBOARD_INCLUDED_MONTHS} Monate Dashboard. ${renewal}`,
    features: [CARD, 'Farbe nach Wahl: Schwarz oder Weiß', 'QR-Code', `YANQIVA Dashboard, ${DASHBOARD_INCLUDED_MONTHS} Monate inklusive`, 'Statistiken zu Taps und Scans', 'Einrichtung inklusive', ...common(PRODUCTS['review-dashboard'])],
    popular: true,
    accent: true,
  },
]

const combos: Plan[] = [
  {
    p: PRODUCTS['review-kombi'],
    name: 'Kombi',
    tagline: PRODUCTS['review-kombi'].tagline,
    priceNote: 'einmalig für 2 Karten · Endpreis',
    note: `Einzeln kosten zwei Klassik-Karten ${formatEuro(KOMBI_SINGLE_EUR)}. Kein Dashboard, keine Folgekosten.`,
    features: ['1 schwarze und 1 weiße NFC-Bewertungskarte (Acryl, 12 × 12 cm)', 'QR-Code', 'Weiterleitung direkt zum Google-Bewertungsformular', 'Einrichtung inklusive', ...common(PRODUCTS['review-kombi'])],
  },
  {
    p: PRODUCTS['review-kombi-dashboard'],
    name: 'Kombi mit Dashboard',
    tagline: PRODUCTS['review-kombi-dashboard'].tagline,
    priceNote: 'einmalig für 2 Karten · Endpreis',
    note: `${formatEuro(DASHBOARD_FIRST_CARD_EUR)} Dashboard-Paket plus ${formatEuro(DASHBOARD_EXTRA_CARD_EUR)} für die zweite Karte. Inkl. ${DASHBOARD_INCLUDED_MONTHS} Monate Dashboard. ${renewal}`,
    features: ['1 schwarze und 1 weiße NFC-Bewertungskarte (Acryl, 12 × 12 cm)', 'QR-Code', `YANQIVA Dashboard, ${DASHBOARD_INCLUDED_MONTHS} Monate inklusive`, 'Statistiken zu Taps und Scans', 'Einrichtung inklusive', ...common(PRODUCTS['review-kombi-dashboard'])],
    accent: true,
  },
]

function PlanCard({ plan, delay }: { plan: Plan; delay: number }) {
  const { p } = plan
  return (
    <li>
      <Reveal delay={delay} className="h-full">
        <div className={`relative flex h-full flex-col rounded-3xl p-6 sm:p-8 ${plan.accent ? 'glass-accent' : 'glass'}`}>
          {plan.popular && (
            <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#7ff0dc] to-mint px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink-950 shadow-[0_6px_18px_-6px_rgb(94_234_212/0.7)]">
              Beliebt
            </span>
          )}
          <h4 className="font-display text-lg font-semibold uppercase tracking-[0.16em] text-muted">{plan.name}</h4>
          <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
          <p className="mt-4 font-display text-5xl font-semibold tracking-tight">
            <span className="tabular-nums">{formatEuro(p.unitPrice)}</span>
          </p>
          <p className="mt-1 text-sm text-faint">{plan.priceNote}</p>
          <p className="mt-2 text-sm text-muted">{plan.note}</p>

          <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] text-text">
                <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <LinkButton href={`${import.meta.env.BASE_URL}bestellen/?paket=${p.param}`} variant={plan.accent ? 'primary' : 'ghost'} className="mt-8 w-full">
            {plan.name} bestellen
          </LinkButton>
        </div>
      </Reveal>
    </li>
  )
}

function Group({ title, lead, plans }: { title: string; lead: string; plans: Plan[] }) {
  return (
    <div className="mx-auto mt-10 max-w-4xl first:mt-9 sm:mt-14 sm:first:mt-12">
      <Reveal>
        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
        <p className="mt-1 text-sm text-muted sm:text-base">{lead}</p>
      </Reveal>
      <ul className="mt-5 grid items-stretch gap-5 md:grid-cols-2">
        {plans.map((plan, i) => (
          <PlanCard key={plan.p.id} plan={plan} delay={i * 0.1} />
        ))}
      </ul>
    </div>
  )
}

/** Preise (Endpreise, Kleinunternehmer; Dashboard 6 Monate inklusive, danach optional; Dashboard-Staffel; Kombi aus schwarzer und weißer Karte). */
export function Pricing() {
  return (
    <section id="preise" className="section-y section-tint relative overflow-hidden" aria-labelledby="preise-title">
      <Container>
        <Reveal>
          <SectionHead
            eyebrow="Preise"
            id="preise-title"
            lead={`Die Acrylkarte gibt es in Schwarz und Weiß. Das Dashboard ist ${DASHBOARD_INCLUDED_MONTHS} Monate inklusive, danach optional für ${DASHBOARD_RENEWAL_EUR} €/Monat je Standort. Die Karte funktioniert auch ohne. Im Dashboard-Paket kostet jede weitere Karte ${DASHBOARD_EXTRA_CARD_EUR} €. Mehr als 10 Karten oder mehrere Filialen auf Anfrage.`}
          >
            Einmal zahlen. Persönlich übergeben.
          </SectionHead>
        </Reveal>

        <Reveal>
          <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-4 sm:mt-10" aria-label="Farben der Karte">
            {(['schwarz', 'weiss'] as const).map((c) => (
              <li key={c} className="flex items-center gap-4">
                <ReviewCardFace variant={c} className="block size-24 shrink-0 rounded-2xl ring-1 ring-white/40 sm:size-28" />
                <span className="text-[15px] text-text">
                  <span className="block font-display text-lg font-semibold">{c === 'schwarz' ? 'Schwarz' : 'Weiß'}</span>
                  <span className="block text-muted">Acrylkarte, 12 × 12 cm</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Group title="Einzelkarten" lead="Sie wählen die Farbe: Schwarz oder Weiß." plans={singles} />
        <Group title="Kombi-Paket" lead="Je eine schwarze und eine weiße Karte zusammen." plans={combos} />

        <p className="mx-auto mt-8 max-w-3xl text-center text-[13px] text-faint">
          Weiterleitung: Wir betreiben die Weiterleitung, solange wir YANQIVA REVIEW anbieten, mindestens jedoch 24 Monate ab Lieferung (<a href={`${import.meta.env.BASE_URL}agb/#weiterleitung`} className="underline underline-offset-2 hover:text-text">AGB Ziffer 9</a>).
        </p>
        <p className="mt-2 text-center text-[13px] text-faint">Endpreise inkl. Lieferung und Übergabe vor Ort. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet. Nur für Unternehmer.</p>
        <p className="mt-2 text-center text-[13px] text-faint">Zahlung per Vorkasse (Zahlungsaufforderung bzw. Rechnung), per Überweisung innerhalb von 14 Tagen. Einrichtung und Übergabe nach Zahlungseingang.</p>
      </Container>
    </section>
  )
}
