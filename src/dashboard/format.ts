import type { DashCard, StatsPoint } from './api'
import type { ChartPoint } from '../demo/components/LineChart'

export const formatInt = (n: number) => n.toLocaleString('de-DE')

/** YYYY-MM-DD -> 31.10.2026 */
export const formatDay = (iso: string) => iso.split('-').reverse().join('.')

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }) + ' Uhr'

const dayDate = (key: string) => new Date(`${key}T12:00:00`)
const monthDate = (key: string) => new Date(`${key}-15T12:00:00`)

/** Statistikpunkte (Tage oder Monate) für das Liniendiagramm der Demo-Komponenten. */
export function toChartPoints(points: StatsPoint[], granularity: 'day' | 'month'): ChartPoint[] {
  return points.map((p) =>
    granularity === 'month'
      ? {
          key: p.key,
          axisLabel: monthDate(p.key).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' }),
          tooltipLabel: monthDate(p.key).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
          value: p.nfc + p.qr,
        }
      : {
          key: p.key,
          axisLabel: dayDate(p.key).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
          tooltipLabel: dayDate(p.key).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }),
          value: p.nfc + p.qr,
        },
  )
}

export const cardTitle = (c: Pick<DashCard, 'label' | 'slug'>) => c.label?.trim() || `Karte ${c.slug.slice(0, 6)}`

/** Host und Pfad ohne Schema/Query für die kompakte Anzeige. */
export const shortUrl = (url: string) => {
  try {
    const u = new URL(url)
    return u.host + (u.pathname === '/' ? '' : u.pathname)
  } catch {
    return url
  }
}

export function daysText(days: number): string {
  if (days === 0) return 'heute'
  if (days === 1) return 'in 1 Tag'
  return `in ${days} Tagen`
}
