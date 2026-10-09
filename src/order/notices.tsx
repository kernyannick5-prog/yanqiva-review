import { useId, useState } from 'react'
import { DELIVERY_REGION, deliveryPlace, inDeliveryArea, OUT_OF_AREA_MESSAGE } from './deliveryArea'
import { beforeOrderStart, ORDER_START_LONG } from './orderStart'

/** Hinweis zum Start der Tätigkeit; erscheint nur vor dem Startdatum (R-01). */
export function StartNotice({ className = '' }: { className?: string }) {
  if (!beforeOrderStart()) return null
  return (
    <aside role="note" aria-label="Hinweis zum Start" className={`rounded-2xl border border-mint/40 bg-mint/[0.07] p-4 text-[15px] leading-snug text-text sm:p-5 ${className}`}>
      <p className="font-display text-base font-semibold">Wichtiger Hinweis zum Start</p>
      <p className="mt-1.5 text-muted">
        Wir nehmen unsere Tätigkeit am <strong className="font-semibold text-text">{ORDER_START_LONG}</strong> auf. Bestellungen, die vorher eingehen, prüfen und bestätigen wir ab dem {ORDER_START_LONG}; erst
        mit unserer Auftragsbestätigung kommt der Vertrag zustande. Lieferfristen laufen ab Auftragsbestätigung bzw. Zahlungseingang.
      </p>
    </aside>
  )
}

/** Liefergebiet-Hinweis mit kurzer PLZ-Prüfung (nur zur Information, nichts wird gespeichert oder gesendet). */
export function DeliveryAreaCheck() {
  const [zip, setZip] = useState('')
  const id = useId()
  const clean = zip.trim()
  const complete = /^\d{5}$/.test(clean)
  const ok = complete && inDeliveryArea(clean)
  return (
    <section aria-labelledby={`${id}-h`} className="rounded-2xl border border-line bg-white/[0.03] p-4 sm:p-5">
      <h3 id={`${id}-h`} className="font-display text-lg font-semibold text-text">
        Liefergebiet
      </h3>
      <p className="mt-1.5 text-[15px] leading-snug text-muted">
        Wir liefern derzeit nur {DELIVERY_REGION} persönlich aus: Übergabe und Einrichtung erfolgen vor Ort, es gibt keinen Postversand. Prüfen Sie kurz, ob Ihr Standort dabei ist.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label htmlFor={`${id}-zip`} className="text-[15px] font-medium text-text">
          Postleitzahl des Lieferorts
        </label>
        <input
          id={`${id}-zip`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
          aria-describedby={`${id}-res`}
          className="block min-h-12 w-32 rounded-xl border border-white/50 bg-white/[0.05] px-3 text-center text-lg font-semibold tabular-nums text-text focus-visible:border-mint"
          placeholder="z. B. 67346"
        />
      </div>
      <p id={`${id}-res`} role="status" aria-live="polite" className={`mt-2 min-h-6 text-[15px] leading-snug ${ok ? 'text-mint' : 'text-amber-200'}`}>
        {ok ? `Ja, wir liefern nach ${deliveryPlace(clean)}.` : complete ? OUT_OF_AREA_MESSAGE : ''}
      </p>
    </section>
  )
}

/** Sofort sichtbarer Hinweis unter einer PLZ-Eingabe, wenn die fünfstellige PLZ außerhalb des Liefergebiets liegt. */
export function ZipAreaNote({ zip, id }: { zip: string; id: string }) {
  const z = zip.trim()
  const show = /^\d{5}$/.test(z) && !inDeliveryArea(z)
  return (
    <p id={id} role="status" aria-live="polite" className={show ? 'mt-2 text-sm leading-snug text-amber-200' : 'sr-only'}>
      {show ? OUT_OF_AREA_MESSAGE : ''}
    </p>
  )
}
