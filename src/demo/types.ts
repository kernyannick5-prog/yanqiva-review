/** Domänenmodell der Demo – so wie es später ein echtes Backend ausliefern würde. */

export type ViewId = 'overview' | 'cards' | 'statistics' | 'reviews' | 'company' | 'settings'

export type CardStatus = 'active' | 'paused'

export interface Card {
  id: string
  /** Aufgedruckte Kartennummer, z. B. YANQIVA-001 */
  cardNumber: string
  /** Teil der Redirect-URL: https://yanqiva-bewertung.de/r/<slug> */
  slug: string
  businessName: string
  /** Genau das, was der Redirect-Worker unter /r/<slug> auflöst (z. B. Google-Bewertungslink). */
  targetUrl: string
  status: CardStatus
  /** Scans im Auswertungszeitraum (30 Tage), getrennt nach Kanal */
  scans: { nfc: number; qr: number }
  /** ISO-Zeitstempel oder null, wenn die Karte noch nie gescannt wurde */
  lastScanAt: string | null
}

export interface DailyPoint {
  /** ISO-Datum (YYYY-MM-DD) */
  date: string
  nfc: number
  qr: number
}

export type Stars = 1 | 2 | 3 | 4 | 5

export interface Review {
  id: string
  author: string
  businessSlug: string
  stars: Stars
  text: string
  /** ISO-Zeitstempel */
  createdAt: string
}

export interface CompanyMeta {
  industry: string
  address: string
  placeId: string
  reviewCount: number
  rating: number
}

export interface DemoSettings {
  weeklyReport: boolean
  newReviewAlert: boolean
  idleCardAlert: boolean
}

export interface NewCardInput {
  businessName: string
  targetUrl: string
  cardNumber: string
}
