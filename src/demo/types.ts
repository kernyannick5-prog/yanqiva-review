/** Domänenmodell der Demo (Karten, Ziel-Links, Zähler für NFC und QR). */

export type ViewId = 'overview' | 'cards' | 'statistics' | 'settings'

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

export interface NewCardInput {
  businessName: string
  targetUrl: string
  cardNumber: string
}
