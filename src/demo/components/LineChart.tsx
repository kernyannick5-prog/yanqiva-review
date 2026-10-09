import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useElementWidth } from '../useElementWidth'
import { formatInt } from '../utils'

export interface ChartPoint {
  key: string
  /** Kurzes Label für die X-Achse */
  axisLabel: string
  /** Ausführliches Label für den Tooltip */
  tooltipLabel: string
  value: number
}

interface LineChartProps {
  points: ChartPoint[]
  /** Einheit im Tooltip, z. B. "NFC-Taps" */
  valueLabel: string
  ariaLabel: string
}

const PAD = { top: 14, right: 14, bottom: 30, left: 42 }
const TICKS = 4

/** Rundet das Maximum so auf, dass 4 gleichmäßige Rasterlinien mit „glatten“ Werten entstehen. */
function niceStep(max: number) {
  const raw = max / TICKS
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw
  return Math.max(1, step)
}

/** Weiche Kurve ohne Überschwinger (horizontale Tangenten an jedem Punkt). */
function smoothPath(coords: [number, number][]) {
  if (coords.length === 0) return ''
  let d = `M${coords[0][0]},${coords[0][1]}`
  for (let i = 1; i < coords.length; i++) {
    const [x0, y0] = coords[i - 1]
    const [x1, y1] = coords[i]
    const mx = (x0 + x1) / 2
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`
  }
  return d
}

/** Eigenes SVG-Liniendiagramm: Gradient-Fläche, einzeichnende Linie, Hover-/Touch-/Tastatur-Tooltip. */
export function LineChart({ points, valueLabel, ariaLabel }: LineChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const width = useElementWidth(wrapRef, 640)
  const reduce = useReducedMotion()
  const inView = useInView(wrapRef, { once: true, amount: 0.3 })
  const gradientId = `area-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [active, setActive] = useState<number | null>(null)

  const height = width < 480 ? 210 : 260
  const innerW = Math.max(width - PAD.left - PAD.right, 10)
  const innerH = height - PAD.top - PAD.bottom
  const n = points.length
  const step = niceStep(Math.max(1, ...points.map((p) => p.value)))
  const max = step * TICKS

  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH

  const coords: [number, number][] = points.map((p, i) => [x(i), y(p.value)])
  const line = smoothPath(coords)
  const baseline = PAD.top + innerH
  const area = coords.length ? `${line} L${x(n - 1)},${baseline} L${x(0)},${baseline} Z` : ''

  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 62))))
  const dataKey = `${n}-${points[0]?.key ?? ''}`

  // Touch: Tooltip bleibt stehen, bis außerhalb des Diagramms getippt wird.
  useEffect(() => {
    if (active === null) return
    const onOutside = (e: globalThis.PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setActive(null)
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [active])

  const select = (e: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || n === 0) return
    const px = ((e.clientX - rect.left) / rect.width) * width
    const idx = Math.round(((px - PAD.left) / innerW) * (n - 1))
    setActive(Math.min(n - 1, Math.max(0, idx)))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const move = (to: number) => {
      e.preventDefault()
      setActive(Math.min(n - 1, Math.max(0, to)))
    }
    if (e.key === 'ArrowRight') move((active ?? -1) + 1)
    else if (e.key === 'ArrowLeft') move((active ?? n) - 1)
    else if (e.key === 'Home') move(0)
    else if (e.key === 'End') move(n - 1)
    else if (e.key === 'Escape') setActive(null)
  }

  const current = active !== null ? points[active] : undefined
  // Textalternative zum Diagramm (WCAG 1.1.1): Kernaussage als Text
  const summaryId = `${gradientId}-sum`
  const sum = points.reduce((s, p) => s + p.value, 0)
  const hi = points.reduce((b, p) => (p.value > b.value ? p : b), points[0])
  const lo = points.reduce((b, p) => (p.value < b.value ? p : b), points[0])
  const summary = n
    ? `${n} Tage von ${points[0].tooltipLabel} bis ${points[n - 1].tooltipLabel}. Insgesamt ${formatInt(sum)} ${valueLabel}, im Schnitt ${formatInt(Math.round(sum / n))} pro Tag. Höchster Wert: ${formatInt(hi.value)} am ${hi.tooltipLabel}. Niedrigster Wert: ${formatInt(lo.value)} am ${lo.tooltipLabel}.`
    : 'Keine Daten.'
  const duration = reduce ? 0 : 1.4

  return (
    <div
      ref={wrapRef}
      role="group"
      tabIndex={0}
      aria-label={`${ariaLabel}. Mit den Pfeiltasten einzelne Tage auswählen.`}
      aria-describedby={summaryId}
      onKeyDown={onKeyDown}
      onBlur={() => setActive(null)}
      className="relative w-full select-none rounded-xl"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden
        className="block h-auto w-full touch-pan-y"
        onPointerMove={select}
        onPointerDown={select}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setActive(null)
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: TICKS + 1 }, (_, i) => {
          const value = step * i
          return (
            <g key={value}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(value)}
                y2={y(value)}
                stroke="rgb(150 235 200)"
                strokeOpacity={i === 0 ? 0.3 : 0.15}
                strokeDasharray={i === 0 ? undefined : '3 5'}
              />
              <text x={PAD.left - 9} y={y(value) + 4} textAnchor="end" fontSize="12" fill="#a8c9ba" className="tabular-nums">
                {formatInt(value)}
              </text>
            </g>
          )
        })}

        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={p.key} x={x(i)} y={height - 9} textAnchor="middle" fontSize="12" fill="#a8c9ba">
              {p.axisLabel}
            </text>
          ) : null,
        )}

        <g key={dataKey}>
          <motion.path
            d={area}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.5 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#5eead4"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? 1 : 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          />
        </g>

        {current && active !== null && (
          <g>
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={baseline} stroke="#5eead4" strokeOpacity={0.45} strokeDasharray="3 4" />
            <circle cx={x(active)} cy={y(current.value)} r={9} fill="#5eead4" fillOpacity={0.2} />
            <circle cx={x(active)} cy={y(current.value)} r={4.5} fill="#5eead4" stroke="#07201a" strokeWidth={2} />
          </g>
        )}
      </svg>

      {current && active !== null && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-mint/30 bg-ink-800/95 px-2.5 py-1.5 text-xs shadow-lg"
          style={{
            left: Math.min(Math.max(x(active), 60), width - 60),
            top: Math.max(0, y(current.value) - 58),
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-faint">{current.tooltipLabel}</div>
          <div className="font-display text-sm font-semibold tabular-nums text-text">
            {formatInt(current.value)} <span className="text-xs font-normal text-muted">{valueLabel}</span>
          </div>
        </div>
      )}

      <p id={summaryId} className="sr-only">
        {summary}
      </p>
      <p className="sr-only" aria-live="polite">
        {current ? `${current.tooltipLabel}: ${formatInt(current.value)} ${valueLabel}` : ''}
      </p>
    </div>
  )
}
