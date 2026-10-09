/**
 * Demo-Daten (ausschließlich erfunden).
 *
 * Später kommen diese Daten aus der YANQIVA-API (GET /cards, /stats).
 * `Card.targetUrl` ist exakt das, was der Redirect-Worker unter /r/<slug> auflöst
 * (302 auf die Google-Bewertungsseite) – die Karte selbst trägt nur die Redirect-URL.
 *
 * Konsistenz: Alle Kennzahlen beziehen sich auf die letzten 30 Tage. Die
 * Übersicht summiert die Kartenwerte (782 + 502 = 1.284 NFC-Taps, 262 + 164 = 426 QR-Scans),
 * die Zeitreihen werden aus denselben Summen abgeleitet.
 */
import { todayAt } from './utils'
import type { Card } from './types'

/**
 * Die Demo-Redirects (config/redirects.ts) führen auf eine simulierte Bewertungsseite.
 * Als Ziel-URL zeigt das Dashboard hier den Link, der in Produktion hinterlegt wäre
 * (identisch mit `googleReviewUrl` in config/redirects.ts; fiktiv, wird nie aufgerufen).
 *
 * Abbildung auf das DB-Schema (src/model/schema.ts): siehe src/demo/schemaMapping.ts.
 * Gespeichert werden nur Geschäftsdaten und aggregierte Zähler, keine Besucherdaten.
 */
export const SEED_CARDS: Card[] = [
  {
    id: 'card-001',
    cardNumber: 'YANQIVA-001',
    slug: 'demo-baeckerei',
    businessName: 'Bäckerei Müller',
    targetUrl: 'https://g.page/r/DEMO-BAECKEREI/review',
    status: 'active',
    scans: { nfc: 782, qr: 262 },
    lastScanAt: todayAt(14, 32),
  },
  {
    id: 'card-002',
    cardNumber: 'YANQIVA-002',
    slug: 'demo-barbershop',
    businessName: 'Barbershop Karlsruhe',
    targetUrl: 'https://g.page/r/DEMO-BARBERSHOP/review',
    status: 'active',
    scans: { nfc: 502, qr: 164 },
    lastScanAt: todayAt(11, 8),
  },
]

export const SEED_CARD_IDS: ReadonlySet<string> = new Set(SEED_CARDS.map((c) => c.id))
