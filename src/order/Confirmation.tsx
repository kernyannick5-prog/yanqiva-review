import { useEffect, useRef } from 'react'
import { LinkButton } from '../components/Button'
import { CONTACT_EMAIL, FORMATS, formatEuro, PRODUCTS, total, VAT_NOTE } from './catalog'
import { effectiveQuantity, trimmed, type OrderForm } from './state'
import { NextSteps } from './steps'

const BASE = import.meta.env.BASE_URL

interface Props {
  orderId: string
  form: OrderForm
}

/** Bestätigung nach erfolgreicher Bestellung. Die Überschrift erhält beim Erscheinen den Fokus. */
export function Confirmation({ orderId, form }: Props) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0 })
    heading.current?.focus({ preventScroll: true })
  }, [])
  const f = trimmed(form)
  const qty = effectiveQuantity(f.quantity)
  const p = PRODUCTS[f.product]
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="glass-accent rounded-3xl p-6 sm:p-8">
        <span className="chip">Bestellung eingegangen</span>
        <h2 ref={heading} tabIndex={-1} className="mt-4 font-display text-[clamp(1.6rem,1.2rem+1.8vw,2.3rem)] font-semibold leading-tight tracking-tight text-text outline-none">
          Vielen Dank! Ihre Bestellung ist eingegangen.
        </h2>
        {orderId && (
          <p className="mt-4 text-[15px] text-muted">
            Ihre Bestellnummer:{' '}
            <strong className="inline-block select-all whitespace-nowrap font-display text-lg font-semibold text-mint">{orderId}</strong>
          </p>
        )}
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Eine Eingangsbestätigung senden wir in der Regel innerhalb weniger Minuten an <strong className="break-all font-semibold text-text">{f.email}</strong>. Falls keine E-Mail
          ankommt, prüfen Sie bitte Ihren Spam-Ordner oder schreiben Sie an {CONTACT_EMAIL} unter Angabe der Bestellnummer. Die Eingangsbestätigung ist noch keine Annahme Ihrer
          Bestellung: Der Vertrag kommt mit unserer Auftragsbestätigung zustande, die Rechnung folgt mit ihr.
        </p>
        <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Bestellung</dt>
            <dd className="text-right text-text">
              {qty} × {p.name}, {FORMATS[f.format].name}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted">Gesamtbetrag einmalig</dt>
            <dd className="font-display text-2xl font-semibold text-mint">{formatEuro(total(f.product, qty))}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[13px] text-muted">{VAT_NOTE}</p>
      </div>

      <NextSteps dashboard={f.product === 'review-dashboard'} done />

      <p className="text-[15px] leading-relaxed text-muted">
        Fragen zur Bestellung? Schreiben Sie uns an{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-mint underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <LinkButton href={BASE} variant="ghost">
        Zurück zur Startseite
      </LinkButton>
    </div>
  )
}
