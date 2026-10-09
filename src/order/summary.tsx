import { useEffect, useRef, type ReactNode } from 'react'
import { DASHBOARD_RENEWAL_EUR, FORMATS, formatEuro, PRODUCTS, SHIPPING_EUR, subtotal, total, shippingText, VAT_NOTE } from './catalog'
import { effectiveQuantity, type OrderForm } from './state'

/** Sticky Bestellübersicht (Desktop-Seitenleiste). */
export function OrderSidebar({ form }: { form: OrderForm }) {
  const qty = effectiveQuantity(form.quantity)
  const pid = form.product || null
  const p = pid ? PRODUCTS[pid] : null
  return (
    <aside aria-labelledby="sidebar-h" className="glass-accent rounded-3xl p-6">
      <h2 id="sidebar-h" className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        Ihre Bestellung
      </h2>
      <p className="mt-3 font-display text-lg font-semibold text-text">{p ? p.name : 'Noch keine Variante gewählt'}</p>
      <p className="text-sm text-muted">{FORMATS[form.format].name}</p>
      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[15px]">
        <Line k={p ? `${qty} × ${formatEuro(p.unitPrice)}` : `${qty} ×`} v={pid ? formatEuro(subtotal(pid, qty)) : '–'} />
        <Line k="Lieferung vor Ort" v={`${formatEuro(SHIPPING_EUR)} (inklusive)`} />
        <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
          <dt className="font-display font-semibold text-text">Gesamt einmalig</dt>
          <dd className="font-display text-3xl font-semibold text-mint">
            {pid ? formatEuro(total(pid, qty)) : '–'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[13px] leading-snug text-muted">{VAT_NOTE}</p>
      {pid && (
        <p className="mt-4 rounded-xl bg-white/[0.04] px-3 py-2.5 text-[13px] leading-snug text-muted">
          <span className="font-semibold text-text">Laufende Kosten: </span>
          {pid === 'review-dashboard' ? `Dashboard 12 Monate inklusive, danach optional ${DASHBOARD_RENEWAL_EUR} € pro Monat je Standort. Kein automatisches Abo.` : 'keine.'}
        </p>
      )}
      {p && <p className="mt-3 text-[13px] text-muted">Lieferzeit: {shippingText(p)}.</p>}
      <p className="mt-3 text-[13px] text-muted">Lieferung und Übergabe vor Ort im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe.</p>
      <p className="mt-3 text-[13px] text-muted">Zahlung per Rechnung (Überweisung), nur für Unternehmer.</p>
    </aside>
  )
}

function Line({ k, v }: { k: ReactNode; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right text-text">{v}</dd>
    </div>
  )
}

/** Fixierte Leiste unten auf Mobilgeräten: Gesamtpreis plus Hauptaktion (Button wird von der Seite übergeben). */
export function MobileBar({ form, children }: { form: OrderForm; children: ReactNode }) {
  const qty = effectiveQuantity(form.quantity)
  const ref = useRef<HTMLElement>(null)
  // WCAG 2.4.11: Die Leiste verdeckt sonst fokussierte Felder. scroll-padding-bottom (Höhe der Leiste + Luft)
  // sorgt dafür, dass der Browser Fokusziele oberhalb der Leiste einscrollt. Auf Desktop ist die Leiste ausgeblendet (Höhe 0).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const apply = () => {
      const h = el.offsetHeight
      root.style.scrollPaddingBottom = h > 0 ? `${h + 16}px` : ''
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.scrollPaddingBottom = ''
    }
  }, [])
  return (
    <section ref={ref} aria-label="Bestellsumme und Weiter" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 shrink-0">
          <p className="text-[13px] leading-tight text-muted">Gesamt einmalig</p>
          <p className="font-display text-xl font-semibold leading-tight text-text">
            {form.product ? formatEuro(total(form.product, qty)) : '–'}
          </p>
          <p className="text-[13px] leading-tight text-muted">Endpreis, keine USt.</p>
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  )
}
