import { CheckIcon } from '../components/Icons'
import { StarRating } from '../components/StarRating'
import { StaggerItem } from '../components/Stagger'
import { COMPANY_META } from '../data'
import type { Card } from '../types'
import { formatDecimal, formatInt, initials, redirectDisplay } from '../utils'

/** Redirect-URLs nur vor „/r/…“ umbrechen, nie am Bindestrich im Slug. */
function renderValue(value: string) {
  const i = value.indexOf('/r/')
  if (i < 0) return value
  return (
    <>
      {value.slice(0, i)}
      <wbr />
      <span className="whitespace-nowrap">{value.slice(i)}</span>
    </>
  )
}

export function Company({ cards }: { cards: Card[] }) {
  return (
    <div className="space-y-4">
      <StaggerItem index={0}>
        <p className="text-xs text-faint">Alle Firmen, Adressen und Profile sind frei erfunden.</p>
      </StaggerItem>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card, i) => {
          const meta = COMPANY_META[card.slug]
          const rows: { label: string; value: string }[] = [
            { label: 'Branche', value: meta?.industry ?? 'Noch nicht hinterlegt' },
            { label: 'Adresse', value: meta?.address ?? 'Noch nicht hinterlegt' },
            { label: 'Karte', value: card.cardNumber },
            { label: 'Redirect', value: redirectDisplay(card.slug) },
            { label: 'Ziel-URL', value: card.targetUrl },
          ]
          return (
            <StaggerItem index={i + 1} key={card.id} className="min-w-0">
              <article className="h-full rounded-2xl border border-line bg-white/[0.03] p-4 transition-[border-color,background-color] duration-300 hover:border-mint/30 hover:bg-white/[0.05] sm:p-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-dark to-indigo-deep font-display text-base font-semibold text-text ring-1 ring-white/10"
                  >
                    {initials(card.businessName)}
                  </span>
                  <div className="min-w-0">
                    <h4 className="truncate font-display text-lg font-semibold text-text">{card.businessName}</h4>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-mint">
                      <CheckIcon className="h-3.5 w-3.5" />
                      Google-Profil verbunden (Demo)
                    </p>
                  </div>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  {rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                      <dt className="text-faint">{row.label}</dt>
                      <dd className="break-words text-text">{renderValue(row.value)}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4">
                  {meta ? (
                    <>
                      <StarRating value={meta.rating} className="text-base" />
                      <span className="text-sm tabular-nums text-text">{formatDecimal(meta.rating)}</span>
                      <span className="text-xs text-faint">{formatInt(meta.reviewCount)} Google-Bewertungen</span>
                    </>
                  ) : (
                    <span className="text-xs text-faint">Noch keine Bewertungen über diese Karte</span>
                  )}
                </div>
              </article>
            </StaggerItem>
          )
        })}
      </div>
    </div>
  )
}
