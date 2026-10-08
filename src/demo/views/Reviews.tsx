import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Panel } from '../components/Panel'
import { StaggerItem } from '../components/Stagger'
import { StarRating } from '../components/StarRating'
import { REVIEWS, REVIEW_TOTAL } from '../data'
import type { Card, Stars } from '../types'
import { formatRelativeDate } from '../utils'

type Filter = 'all' | Stars
const STAR_FILTERS: Stars[] = [5, 4, 3, 2, 1]

export function Reviews({ cards }: { cards: Card[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const shown = filter === 'all' ? REVIEWS : REVIEWS.filter((r) => r.stars === filter)
  const nameFor = (slug: string) => cards.find((c) => c.slug === slug)?.businessName ?? slug

  return (
    <div className="space-y-4">
      <StaggerItem index={0}>
        <div role="group" aria-label="Nach Sternen filtern" className="flex flex-wrap gap-2">
          {(['all', ...STAR_FILTERS] as Filter[]).map((f) => {
            const count = f === 'all' ? REVIEWS.length : REVIEWS.filter((r) => r.stars === f).length
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-[color,background-color,border-color,transform] active:scale-[0.96] ${
                  filter === f
                    ? 'border-mint/50 bg-mint/15 text-mint'
                    : 'border-line bg-white/[0.03] text-muted hover:border-mint/30 hover:text-text'
                }`}
              >
                {f === 'all' ? 'Alle' : `${f} ★`} <span className="tabular-nums text-faint">({count})</span>
              </button>
            )
          })}
        </div>
      </StaggerItem>

      <StaggerItem index={1}>
        <Panel title="Neueste Bewertungen" description={`Zeigt die letzten ${REVIEWS.length} von ${REVIEW_TOTAL} Bewertungen. Erfundene Beispieltexte – YANQIVA speichert keine Namen oder Daten von Bewertenden.`}>
          {shown.length === 0 ? (
            <p className="py-8 text-center text-sm text-faint">Keine Bewertungen mit {filter} Sternen im aktuellen Ausschnitt.</p>
          ) : (
            <ul className="divide-y divide-line">
              <AnimatePresence initial={false} mode="popLayout">
                {shown.map((r) => (
                  <motion.li
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span
                      aria-hidden
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-dark to-indigo-deep text-sm font-semibold text-text ring-1 ring-white/10"
                    >
                      G
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <p className="text-sm font-medium text-text">Google-Bewertung</p>
                        <StarRating value={r.stars} className="text-sm" />
                        <span className="text-xs text-faint">{formatRelativeDate(r.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
                      <p className="mt-1.5 text-xs text-faint">{nameFor(r.businessSlug)}</p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Panel>
      </StaggerItem>
    </div>
  )
}
