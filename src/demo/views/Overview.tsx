import { useMemo, useState } from 'react'
import { ActionButton } from '../components/ActionButton'
import { CheckIcon, ShieldIcon } from '../components/Icons'
import { LineChart, type ChartPoint } from '../components/LineChart'
import { Panel } from '../components/Panel'
import { StaggerItem } from '../components/Stagger'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import type { Card, ViewId } from '../types'
import { dailySeries, dayLabelLong, dayLabelShort, formatInt, formatLastScan, mergeSeries, scansToday, sumScans, totalScans } from '../utils'

interface OverviewProps {
  cards: Card[]
  onNavigate: (view: ViewId) => void
}

const RANGES = [7, 30] as const
type Range = (typeof RANGES)[number]
const SHORTLIST = 3

export function Overview({ cards, onNavigate }: OverviewProps) {
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
  const today = series[series.length - 1] ?? { nfc: 0, qr: 0 }
  const rangeTotal = visible.reduce((sum, p) => sum + p.nfc, 0)
  const total = totals.nfc + totals.qr

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-12">
      <StaggerItem index={0} className="col-span-1 min-w-0 md:col-span-4">
        <StatCard label="NFC-Taps" value={totals.nfc} delta="+18 %" hint="ggü. Vormonat" trend={series.map((p) => p.nfc).slice(-14)} />
      </StaggerItem>
      <StaggerItem index={1} className="col-span-1 min-w-0 md:col-span-4">
        <StatCard label="QR-Scans" value={totals.qr} delta="+9 %" hint="ggü. Vormonat" trend={series.map((p) => p.qr).slice(-14)} />
      </StaggerItem>
      <StaggerItem index={2} className="col-span-2 min-w-0 md:col-span-4">
        <StatCard label="Aufrufe gesamt" value={total} delta="+15 %" hint="NFC und QR zusammen, ggü. Vormonat" trend={series.map((p) => p.nfc + p.qr).slice(-14)} />
      </StaggerItem>

      <StaggerItem index={3} className="col-span-2 min-w-0 md:col-span-12">
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm text-muted">
            Aufrufe heute: <span className="font-display text-lg font-semibold tabular-nums text-text">{formatInt(scansToday(series))}</span>
            <span className="ml-2 text-xs text-faint">
              {formatInt(today.nfc)} NFC · {formatInt(today.qr)} QR
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <ShieldIcon className="h-3.5 w-3.5 shrink-0 text-mint" />
            Aggregierte Zähler, keine Besucherdaten.
          </p>
        </div>
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

      <StaggerItem index={5} className="col-span-2 min-w-0 md:col-span-12 lg:col-span-4">
        <Panel title="Kanäle" description="Anteil an allen Aufrufen, letzte 30 Tage" className="h-full">
          <ul className="space-y-4">
            {[
              { label: 'NFC-Taps', value: totals.nfc, bar: 'bg-mint' },
              { label: 'QR-Scans', value: totals.qr, bar: 'bg-[#a78bfa]' },
            ].map((c) => (
              <li key={c.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-text">{c.label}</span>
                  <span className="text-xs tabular-nums text-muted">
                    {formatInt(c.value)} · {total > 0 ? Math.round((c.value / total) * 100) : 0} %
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <span className={`block h-full rounded-full ${c.bar}`} style={{ width: `${total > 0 ? (c.value / total) * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </StaggerItem>

      <StaggerItem index={6} className="col-span-2 min-w-0 md:col-span-12">
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
    </div>
  )
}
