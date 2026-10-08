import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ActionButton } from '../components/ActionButton'
import { CheckIcon } from '../components/Icons'
import { LineChart, type ChartPoint } from '../components/LineChart'
import { LiveFeed } from '../components/LiveFeed'
import { Panel } from '../components/Panel'
import { StaggerItem } from '../components/Stagger'
import { StarRating } from '../components/StarRating'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { CONVERSION_RATE, KPI_TRENDS, RATING_AVERAGE, RATING_DISTRIBUTION, REVIEWS_THIS_MONTH, REVIEW_TOTAL } from '../data'
import type { Card, Stars, ViewId } from '../types'
import { dailySeries, dayLabelLong, dayLabelShort, formatDecimal, formatInt, formatLastScan, mergeSeries, sumScans, totalScans } from '../utils'

interface OverviewProps {
  cards: Card[]
  onNavigate: (view: ViewId) => void
}

const RANGES = [7, 30] as const
type Range = (typeof RANGES)[number]
const STAR_ROWS: Stars[] = [5, 4, 3, 2, 1]
const SHORTLIST = 3

export function Overview({ cards, onNavigate }: OverviewProps) {
  const reduce = useReducedMotion()
  const [range, setRange] = useState<Range>(30)
  const totals = useMemo(() => sumScans(cards), [cards])
  const series = useMemo(() => mergeSeries(cards.map((c) => dailySeries(c))), [cards])

  const visible = series.slice(-range)
  const points: ChartPoint[] = visible.map((p) => ({
    key: p.date,
    axisLabel: dayLabelShort(p.date),
    tooltipLabel: dayLabelLong(p.date),
    value: p.nfc,
  }))
  const rangeTotal = visible.reduce((sum, p) => sum + p.nfc, 0)
  const maxStarCount = Math.max(...Object.values(RATING_DISTRIBUTION))

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-12">
      <StaggerItem index={0} className="col-span-1 min-w-0 md:col-span-3">
        <StatCard label="Bewertungen" value={REVIEW_TOTAL} delta="+12 %" hint="ggü. Vormonat" trend={KPI_TRENDS.reviews} />
      </StaggerItem>
      <StaggerItem index={1} className="col-span-1 min-w-0 md:col-span-3">
        <StatCard label="NFC-Taps" value={totals.nfc} delta="+18 %" hint="ggü. Vormonat" trend={series.map((p) => p.nfc).slice(-14)} />
      </StaggerItem>
      <StaggerItem index={2} className="col-span-1 min-w-0 md:col-span-3">
        <StatCard label="QR-Scans" value={totals.qr} delta="+9 %" hint="ggü. Vormonat" trend={series.map((p) => p.qr).slice(-14)} />
      </StaggerItem>
      <StaggerItem index={3} className="col-span-1 min-w-0 md:col-span-3">
        <StatCard label="Conversion" value={CONVERSION_RATE} decimals={1} suffix={' %'} delta="+2,1 Pp." hint="Bewertungsklicks je Scan" trend={KPI_TRENDS.conversion} />
      </StaggerItem>

      <StaggerItem index={4} className="col-span-2 min-w-0 md:col-span-12 lg:col-span-8">
        <Panel
          title={`NFC-Taps der letzten ${range} Tage`}
          description={`${formatInt(rangeTotal)} Taps · alle Karten`}
          className="h-full"
          action={
            <div role="group" aria-label="Zeitraum" className="flex rounded-xl border border-line bg-ink-950/50 p-0.5">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={range === r}
                  onClick={() => setRange(r)}
                  className={`min-h-11 min-w-14 rounded-[10px] px-3 text-xs font-medium transition-colors ${
                    range === r ? 'bg-white/[0.1] text-text' : 'text-muted hover:text-text'
                  }`}
                >
                  {r} Tage
                </button>
              ))}
            </div>
          }
        >
          <LineChart points={points} valueLabel="NFC-Taps" ariaLabel={`Liniendiagramm: NFC-Taps der letzten ${range} Tage`} />
        </Panel>
      </StaggerItem>

      <StaggerItem index={5} className="col-span-2 min-w-0 md:col-span-6 lg:col-span-4">
        <Panel title="Google-Bewertungen" className="h-full">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-semibold leading-none tabular-nums text-text">{formatDecimal(RATING_AVERAGE)}</span>
            <div className="pb-1">
              <StarRating value={Math.round(RATING_AVERAGE * 10) / 10} className="text-lg" />
              <p className="mt-1 text-[13px] text-mint">+{REVIEWS_THIS_MONTH} Bewertungen diesen Monat</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5" aria-label="Sterneverteilung">
            {STAR_ROWS.map((stars, i) => {
              const count = RATING_DISTRIBUTION[stars]
              return (
                <li key={stars} className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                  <span className="tabular-nums text-muted">{stars} ★</span>
                  <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-gradient-to-r from-mint-strong to-mint"
                      style={{ width: `${(count / maxStarCount) * 100}%` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-text">{formatInt(count)}</span>
                </li>
              )
            })}
          </ul>
        </Panel>
      </StaggerItem>

      <StaggerItem index={6} className="col-span-2 min-w-0 md:order-1 md:col-span-12 lg:order-none lg:col-span-8">
        <Panel
          title="Meine Karten"
          className="h-full"
          action={
            <ActionButton onClick={() => onNavigate('cards')} className="-mt-1">
              Alle Karten
            </ActionButton>
          }
        >
          <ul className="space-y-3">
            {cards.slice(0, SHORTLIST).map((card) => (
              <li
                key={card.id}
                className="flex min-w-0 flex-col gap-3.5 rounded-xl border border-line bg-ink-950/40 p-4 transition-colors duration-200 hover:border-mint/30 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="truncate font-medium text-text">{card.businessName}</p>
                    <StatusBadge status={card.status} uppercase />
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                    <span>NFC-Karte {card.cardNumber}</span>
                    <span aria-hidden className="text-faint">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckIcon className="h-3.5 w-3.5 text-mint" />
                      Google-Link {card.status === 'active' ? 'Aktiv' : 'Pausiert'}
                    </span>
                  </p>
                </div>
                <dl className="grid shrink-0 grid-cols-2 gap-4 border-t border-line pt-3 text-xs sm:flex sm:gap-6 sm:border-0 sm:pt-0">
                  <div>
                    <dt className="text-muted">Scans</dt>
                    <dd className="mt-0.5 font-display text-base font-semibold tabular-nums text-text">{formatInt(totalScans(card))}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Letzter Scan</dt>
                    <dd className="mt-0.5 text-sm text-text">{formatLastScan(card.lastScanAt)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          {cards.length > SHORTLIST && <p className="mt-3 text-[13px] text-faint">+ {cards.length - SHORTLIST} weitere Karten</p>}
        </Panel>
      </StaggerItem>

      <StaggerItem index={7} className="col-span-2 min-w-0 md:col-span-6 lg:col-span-4">
        <Panel
          title="Live-Aktivität"
          className="h-full"
          action={<span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">Simulation</span>}
        >
          <LiveFeed cards={cards} />
        </Panel>
      </StaggerItem>
    </div>
  )
}
