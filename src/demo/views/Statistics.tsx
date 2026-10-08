import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import { ShieldIcon } from '../components/Icons'
import { CountUp } from '../../components/CountUp'
import { LineChart, type ChartPoint } from '../components/LineChart'
import { Panel } from '../components/Panel'
import { StaggerItem } from '../components/Stagger'
import { DAY_PARTS, HEAT_WEIGHTS, WEEKDAYS } from '../data'
import type { Card } from '../types'
import { dailySeries, dayLabelLong, dayLabelShort, distribute, formatInt, mergeSeries, sumScans, totalScans } from '../utils'

interface StatisticsProps {
  cards: Card[]
  /** 'all' oder eine Karten-ID */
  selected: string
  onSelect: (selected: string) => void
}

export function Statistics({ cards, selected, onSelect }: StatisticsProps) {
  const reduce = useReducedMotion()
  const current = cards.some((c) => c.id === selected) ? selected : 'all'
  const scope = useMemo(() => (current === 'all' ? cards : cards.filter((c) => c.id === current)), [cards, current])
  const totals = sumScans(scope)
  const total = totals.nfc + totals.qr

  const series = useMemo(() => mergeSeries(scope.map((c) => dailySeries(c))), [scope])
  const points: ChartPoint[] = series.map((p) => ({
    key: p.date,
    axisLabel: dayLabelShort(p.date),
    tooltipLabel: dayLabelLong(p.date),
    value: p.nfc + p.qr,
  }))

  const heat = useMemo(() => {
    const flat = distribute(total, HEAT_WEIGHTS.flat())
    return DAY_PARTS.map((_, row) => flat.slice(row * WEEKDAYS.length, (row + 1) * WEEKDAYS.length))
  }, [total])
  const heatMax = Math.max(1, ...heat.flat())
  const barMax = Math.max(1, ...cards.map(totalScans))
  const nfcShare = total > 0 ? Math.round((totals.nfc / total) * 100) : 0

  return (
    <div className="space-y-4">
      <StaggerItem index={0}>
        <div role="group" aria-label="Karte filtern" className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'Alle Karten' }, ...cards.map((c) => ({ id: c.id, label: c.businessName }))].map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={current === opt.id}
              onClick={() => onSelect(opt.id)}
              className={`min-h-11 max-w-full truncate rounded-full border px-4 text-sm font-medium transition-[color,background-color,border-color,transform] active:scale-[0.96] ${
                current === opt.id
                  ? 'border-mint/50 bg-mint/15 text-mint'
                  : 'border-line bg-white/[0.03] text-muted hover:border-mint/30 hover:text-text'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem index={1} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Gesamt', value: total, suffix: '' },
          { label: 'NFC-Taps', value: totals.nfc, suffix: '' },
          { label: 'QR-Scans', value: totals.qr, suffix: '' },
        ].map((k) => (
          <div key={k.label} className="min-w-0 rounded-2xl border border-line bg-white/[0.03] p-3 sm:p-4">
            <p className="truncate text-xs text-muted">{k.label}</p>
            <p className="mt-1 font-display text-xl font-semibold tabular-nums text-text sm:text-2xl">
              <CountUp to={k.value} duration={1.1} suffix={k.suffix} />
            </p>
          </div>
        ))}
      </StaggerItem>

      <StaggerItem index={2}>
        <Panel title="Scans pro Tag" description={`Letzte 30 Tage · NFC-Anteil ${nfcShare} %`}>
          <LineChart points={points} valueLabel="Scans" ariaLabel="Liniendiagramm: Scans pro Tag der letzten 30 Tage" />
        </Panel>
      </StaggerItem>

      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerItem index={3} className="min-w-0">
          <Panel
            title="Taps vs. QR-Scans je Karte"
            className="h-full"
            action={
              <div className="flex gap-3 text-xs text-muted" aria-hidden>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-mint" />
                  NFC
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-glow" />
                  QR
                </span>
              </div>
            }
          >
            <ul className="space-y-4">
              {cards.map((card, i) => {
                const dim = current !== 'all' && current !== card.id
                return (
                  <li key={card.id} className={`transition-opacity duration-300 ${dim ? 'opacity-40' : ''}`}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate text-text">{card.businessName}</span>
                      <span className="shrink-0 text-xs tabular-nums text-muted">
                        {formatInt(card.scans.nfc)} NFC · {formatInt(card.scans.qr)} QR
                      </span>
                    </div>
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
                      {[
                        { key: 'nfc', value: card.scans.nfc, color: 'bg-mint' },
                        { key: 'qr', value: card.scans.qr, color: 'bg-violet-glow' },
                      ].map((seg, j) => (
                        <motion.span
                          key={seg.key}
                          className={`h-full origin-left ${seg.color}`}
                          style={{ width: `${(seg.value / barMax) * 100}%` }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.1 + i * 0.1 + j * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </StaggerItem>

        <StaggerItem index={4} className="min-w-0">
          <Panel title="Wochentag & Tageszeit" description="Wann deine Karten am häufigsten gescannt werden" className="h-full">
            <table className="w-full table-fixed border-separate border-spacing-1">
              <caption className="sr-only">Scans nach Wochentag und Tageszeit</caption>
              <thead>
                <tr>
                  <td className="w-[3.75rem] sm:w-28" />
                  {WEEKDAYS.map((d) => (
                    <th key={d} scope="col" className="pb-1 text-center text-xs font-medium text-muted">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAY_PARTS.map((part, row) => (
                  <tr key={part.label}>
                    <th scope="row" className="pr-1 text-left text-xs font-medium text-muted">
                      <span className="block truncate">{part.label}</span>
                      <span className="hidden text-xs font-normal text-faint sm:block">{part.range}</span>
                    </th>
                    {heat[row].map((count, col) => {
                      const intensity = count / heatMax
                      return (
                        <td
                          key={WEEKDAYS[col]}
                          title={`${WEEKDAYS[col]}, ${part.range}: ${count} Scans`}
                          className={`h-10 rounded-md text-center text-xs tabular-nums transition-transform duration-200 hover:scale-110 ${intensity > 0.55 ? 'font-semibold text-ink-950' : 'text-text'}`}
                          style={{ backgroundColor: `rgb(94 234 212 / ${(0.06 + intensity * 0.8).toFixed(2)})` }}
                        >
                          {count}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </StaggerItem>
      </div>

      <StaggerItem index={5}>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-faint">
          <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
          Alle Werte sind aggregierte Zähler pro Karte und Tag – es werden keine Besucherdaten (IP, Gerät, Standort, Profile) erhoben.
        </p>
      </StaggerItem>
    </div>
  )
}
