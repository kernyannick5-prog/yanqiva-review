/**
 * Demo-Daten (ausschließlich erfunden).
 *
 * Später kommen diese Daten aus der YANQIVA-API (GET /cards, /stats, /reviews).
 * `Card.targetUrl` ist exakt das, was der Redirect-Worker unter /r/<slug> auflöst
 * (302 auf die Google-Bewertungsseite) – die Karte selbst trägt nur die Redirect-URL.
 *
 * Konsistenz: Alle Kennzahlen beziehen sich auf die letzten 30 Tage. Die
 * Übersicht summiert die Kartenwerte (782 + 502 = 1.284 NFC-Taps, 262 + 164 = 426 QR-Scans),
 * die Zeitreihen werden aus denselben Summen abgeleitet.
 */
import { daysAgoIso, todayAt } from './utils'
import type { Card, CompanyMeta, DemoSettings, Review, Stars } from './types'

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

export const DEFAULT_SETTINGS: DemoSettings = {
  weeklyReport: true,
  newReviewAlert: true,
  idleCardAlert: false,
}

/** Firmenprofile der Demo-Betriebe (fiktive Adressen). Review-Summen: 148 + 99 = 247. */
export const COMPANY_META: Record<string, CompanyMeta> = {
  'demo-baeckerei': {
    industry: 'Bäckerei & Konditorei',
    address: 'Musterweg 7, 69117 Heidelberg',
    placeId: 'DEMO_PLACE_BAECKEREI',
    reviewCount: 148,
    rating: 4.8,
  },
  'demo-barbershop': {
    industry: 'Friseur & Barbershop',
    address: 'Beispielallee 31, 76133 Karlsruhe',
    placeId: 'DEMO_PLACE_BARBERSHOP',
    reviewCount: 99,
    rating: 4.7,
  },
}

/* ---------- Bewertungen ---------- */

/** Sterneverteilung aller Google-Bewertungen (Summe 247, Schnitt 4,77 -> 4,8). */
export const RATING_DISTRIBUTION: Record<Stars, number> = { 5: 209, 4: 26, 3: 7, 2: 3, 1: 2 }
export const REVIEW_TOTAL = 247
export const REVIEWS_THIS_MONTH = 32
export const RATING_AVERAGE =
  (Object.entries(RATING_DISTRIBUTION) as [string, number][]).reduce((s, [stars, n]) => s + Number(stars) * n, 0) /
  REVIEW_TOTAL

export const KPI_TRENDS = {
  reviews: [3, 5, 4, 6, 7, 5, 8, 9, 7, 10, 9, 12, 11, 14],
  conversion: [16.4, 17.1, 16.8, 17.6, 18.0, 17.7, 18.3, 18.6, 18.4, 18.9, 19.0, 18.8, 19.1, 19.2],
}
export const CONVERSION_RATE = 19.2

export const REVIEWS: Review[] = [
  { id: 'r1', businessSlug: 'demo-baeckerei', stars: 5, createdAt: daysAgoIso(0), text: 'Die Brötchen sind jeden Morgen frisch und das Team ist immer freundlich. Mein Lieblingsladen im Viertel!' },
  { id: 'r2', businessSlug: 'demo-barbershop', stars: 5, createdAt: daysAgoIso(1), text: 'Sauberer Fade, ehrliche Beratung und null Wartezeit mit Termin. Komme gerne wieder.' },
  { id: 'r3', businessSlug: 'demo-baeckerei', stars: 5, createdAt: daysAgoIso(2), text: 'Der Butterkuchen am Samstag ist ein Traum. Hat uns beim Familienfrühstück alle begeistert.' },
  { id: 'r4', businessSlug: 'demo-barbershop', stars: 4, createdAt: daysAgoIso(3), text: 'Sehr guter Haarschnitt und entspannte Atmosphäre. Einen Stern Abzug, weil der Termin zehn Minuten später startete.' },
  { id: 'r5', businessSlug: 'demo-baeckerei', stars: 5, createdAt: daysAgoIso(4), text: 'Tolle Auswahl an Vollkornbrot, und der Kaffee dazu ist richtig gut. Schnell und unkompliziert bedient.' },
  { id: 'r6', businessSlug: 'demo-barbershop', stars: 5, createdAt: daysAgoIso(6), text: 'Bartpflege vom Feinsten. Man merkt, dass hier mit Leidenschaft gearbeitet wird.' },
  { id: 'r7', businessSlug: 'demo-baeckerei', stars: 3, createdAt: daysAgoIso(8), text: 'Geschmacklich top, aber nachmittags waren die Croissants schon ausverkauft. Gerne etwas mehr backen!' },
  { id: 'r8', businessSlug: 'demo-barbershop', stars: 4, createdAt: daysAgoIso(9), text: 'Faire Preise und freundliches Team. Der Laden ist modern eingerichtet.' },
  { id: 'r9', businessSlug: 'demo-baeckerei', stars: 5, createdAt: daysAgoIso(11), text: 'Die Torte zum Geburtstag war wunderschön und hat fantastisch geschmeckt. Danke für die liebevolle Beratung!' },
  { id: 'r10', businessSlug: 'demo-barbershop', stars: 2, createdAt: daysAgoIso(13), text: 'Der Schnitt war okay, aber ich hatte etwas anderes besprochen. Beim nächsten Mal bitte genauer nachfragen.' },
  { id: 'r11', businessSlug: 'demo-baeckerei', stars: 4, createdAt: daysAgoIso(16), text: 'Leckere Laugenstangen und nette Bedienung. Parken ist in der Umgebung allerdings schwierig.' },
  { id: 'r12', businessSlug: 'demo-barbershop', stars: 5, createdAt: daysAgoIso(20), text: 'Bester Barbershop der Gegend. Ich komme seit Monaten alle drei Wochen vorbei.' },
]

/* ---------- Statistik ---------- */

export const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const

export const DAY_PARTS = [
  { label: 'Morgens', range: '6–11 Uhr' },
  { label: 'Mittags', range: '11–15 Uhr' },
  { label: 'Nachmittags', range: '15–19 Uhr' },
  { label: 'Abends', range: '19–23 Uhr' },
] as const

/** Relative Scan-Häufigkeit je Tageszeit (Zeilen) und Wochentag Mo–So (Spalten). */
export const HEAT_WEIGHTS: number[][] = [
  [6, 7, 6, 7, 9, 12, 5],
  [9, 8, 9, 10, 12, 16, 7],
  [8, 9, 10, 11, 15, 19, 6],
  [3, 3, 4, 5, 8, 7, 2],
]
