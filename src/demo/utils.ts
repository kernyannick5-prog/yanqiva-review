import { redirects } from '../config/redirects'
import { productionRedirectUrl } from '../lib/redirectUrl'
import type { Card, DailyPoint } from './types'

const SERIES_DAYS = 30

export const formatInt = (n: number) => n.toLocaleString('de-DE')

export const formatDecimal = (n: number, digits = 1) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** "YANQIVA-001" -> "YANQIVA CARD #001" */
export const cardLabel = (cardNumber: string) => `YANQIVA CARD #${cardNumber.replace(/^YANQIVA-/i, '')}`

/** Gekürzte Redirect-URL für die Anzeige: yanqiva-bewertung.de/r/<slug> */
export const redirectDisplay = (slug: string) => productionRedirectUrl(slug).replace(/^https:\/\//, '')

/** Nur Karten aus redirects.ts besitzen eine live erreichbare Demo-Weiterleitung. */
export const isLiveDemoSlug = (slug: string) => redirects.some((r) => r.slug === slug)

export const totalScans = (card: Card) => card.scans.nfc + card.scans.qr

export function sumScans(cards: Card[]) {
  return cards.reduce(
    (acc, c) => ({ nfc: acc.nfc + c.scans.nfc, qr: acc.qr + c.scans.qr }),
    { nfc: 0, qr: 0 },
  )
}

export function isHttpsUrl(value: string) {
  if (!/^https:\/\//i.test(value)) return false
  try {
    return new URL(value).hostname.length > 0
  } catch {
    return false
  }
}

const SLUG_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz' // base32 ohne 0/1/i/l/o
const SLUG_LENGTH = 6

/**
 * Zufälliger Slug im Stil `card_7f82k4` – bewusst NICHT aus dem Firmennamen abgeleitet
 * (kein Personenbezug in URLs, nicht erratbar). Kollisionsfrei gegenüber vorhandenen Slugs.
 */
export function randomSlug(cards: Card[]) {
  const taken = new Set([...cards.map((c) => c.slug), ...redirects.map((r) => r.slug)])
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(SLUG_LENGTH))
    const slug = `card_${Array.from(bytes, (b) => SLUG_ALPHABET[b % 32]).join('')}`
    if (!taken.has(slug)) return slug
  }
}

/** Kartennummer: nur A–Z, 0–9, „-“ und „_“, max. 24 Zeichen (keine Leer- oder Namensmuster). */
export const CARD_NUMBER_MAX = 24
export const CARD_NUMBER_PATTERN = /^[A-Z0-9_-]+$/

/** Nächste freie Kartennummer, z. B. YANQIVA-003. */
export function nextCardNumber(cards: Card[]) {
  const highest = cards.reduce((max, c) => {
    const m = /^YANQIVA-(\d+)$/i.exec(c.cardNumber)
    return m ? Math.max(max, Number(m[1])) : max
  }, 0)
  return `YANQIVA-${String(highest + 1).padStart(3, '0')}`
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

/* ---------- Zeit ---------- */

const pad = (n: number) => String(n).padStart(2, '0')
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseDay = (iso: string) => new Date(`${iso}T12:00:00`)
const startOfDay = (d: Date) => new Date(d).setHours(0, 0, 0, 0)
const dayDiff = (iso: string) => Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000)

/** ISO-Zeitstempel für „heute um hh:mm“ (lokale Zeit). */
export function todayAt(hours: number, minutes: number) {
  const d = new Date()
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

export function daysAgoIso(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

export function formatLastScan(iso: string | null) {
  if (!iso) return 'Noch kein Scan'
  const d = new Date(iso)
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  const diff = dayDiff(iso)
  if (diff === 0) return `Heute, ${time}`
  if (diff === 1) return `Gestern, ${time}`
  return `${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}., ${time}`
}

export function formatRelativeDate(iso: string) {
  const days = Math.max(0, dayDiff(iso))
  if (days === 0) return 'heute'
  if (days === 1) return 'gestern'
  if (days < 7) return `vor ${days} Tagen`
  const weeks = Math.round(days / 7)
  return weeks === 1 ? 'vor 1 Woche' : `vor ${weeks} Wochen`
}

export const dayLabelShort = (iso: string) =>
  parseDay(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })

export const dayLabelLong = (iso: string) =>
  parseDay(iso).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })

/* ---------- Deterministische Demo-Zeitreihen ---------- */

function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Verteilt `total` ganzzahlig proportional auf `weights` (Summe bleibt exakt `total`). */
export function distribute(total: number, weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (total <= 0 || sum <= 0) return weights.map(() => 0)
  const raw = weights.map((w) => (w / sum) * total)
  const out = raw.map(Math.floor)
  const rest = total - out.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac)
  for (let k = 0; k < rest; k++) out[order[k].i] += 1
  return out
}

/** Wochentagsfaktor (So … Sa): Freitag/Samstag sind am stärksten. */
const WEEKDAY_FACTOR = [0.85, 0.9, 0.95, 1, 1.05, 1.3, 1.4]

/**
 * Feste Tageswerte „heute“ je Demo-Karte, damit „Aufrufe heute“ (Übersicht) exakt zur
 * Zeitreihe passt: 14 + 5 + 12 + 6 = 37. Neue Karten starten bei 0.
 */
const DEMO_TODAY: Record<string, { nfc: number; qr: number }> = {
  'demo-baeckerei': { nfc: 14, qr: 5 },
  'demo-barbershop': { nfc: 12, qr: 6 },
}

/** 30 Tageswerte pro Karte; die Summen entsprechen exakt card.scans.nfc / .qr. */
export function dailySeries(card: Card, days = SERIES_DAYS): DailyPoint[] {
  const rnd = mulberry32(hashString(card.slug))
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d
  })
  const weights = () =>
    dates.map((d, i) => WEEKDAY_FACTOR[d.getDay()] * (0.8 + (0.4 * i) / (days - 1)) * (0.55 + 0.9 * rnd()))
  const today = DEMO_TODAY[card.slug]
  const fixed = today && today.nfc <= card.scans.nfc && today.qr <= card.scans.qr ? today : { nfc: 0, qr: 0 }
  // Verteilung auf die Vortage; der letzte Tag erhält den festen Wert (Gewicht 0 für heute).
  const spread = (total: number, today: number) => {
    const w = weights()
    w[days - 1] = 0
    const out = distribute(total - today, w)
    out[days - 1] = today
    return out
  }
  const nfc = today ? spread(card.scans.nfc, fixed.nfc) : distribute(card.scans.nfc, weights())
  const qr = today ? spread(card.scans.qr, fixed.qr) : distribute(card.scans.qr, weights())
  return dates.map((d, i) => ({ date: isoDay(d), nfc: nfc[i], qr: qr[i] }))
}

/** Summe NFC + QR des letzten Tages („heute“) über alle Karten. */
export const scansToday = (series: DailyPoint[]) => {
  const last = series[series.length - 1]
  return last ? last.nfc + last.qr : 0
}

export function mergeSeries(all: DailyPoint[][]): DailyPoint[] {
  const first = all[0]
  if (!first) return []
  return first.map((p, i) => ({
    date: p.date,
    nfc: all.reduce((s, series) => s + series[i].nfc, 0),
    qr: all.reduce((s, series) => s + series[i].qr, 0),
  }))
}
