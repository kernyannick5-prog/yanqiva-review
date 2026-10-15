/** Katalog und Preise der Bestellung: einzige Quelle für Preise im Frontend (der Server rechnet selbst nach). */

export type ProductId = 'review-klassik' | 'review-dashboard' | 'review-kombi' | 'review-kombi-dashboard'

/** Farben der Acrylkarte. Die IDs sind zugleich die Werte auf dem Draht (Worker: REVIEW_COLORS). */
export type ColorId = 'schwarz' | 'weiss'
export const COLORS: readonly { id: ColorId; label: string }[] = [
  { id: 'schwarz', label: 'Schwarz' },
  { id: 'weiss', label: 'Weiß' },
]
export const colorLabel = (c: ColorId): string => (c === 'schwarz' ? 'Schwarz' : 'Weiß')
export const isColorId = (v: unknown): v is ColorId => v === 'schwarz' || v === 'weiss'

export interface Product {
  id: ProductId
  /** Wert für ?paket=… */
  param: 'klassik' | 'dashboard' | 'kombi' | 'kombi-dashboard'
  name: string
  shortName: string
  tagline: string
  /** Preis der ersten Einheit in ganzen Euro (Einheit = Karte, bei Kombi = ein Kombi-Paar). */
  unitPrice: number
  /** Preis jeder weiteren Einheit (Staffel im Dashboard-Paket: 40 € je weiterer Karte). */
  additionalPrice: number
  /** Kombi: je eine schwarze und eine weiße Karte. */
  combo: boolean
  /** Enthält Dashboard. */
  dashboard: boolean
  /** Karten je Einheit (Kombi = 2). */
  cardsPerUnit: number
  /** Höchstmenge in Einheiten (insgesamt höchstens QTY_MAX Karten). */
  qtyMax: number
  features: readonly string[]
  /** Laufende Kosten in Worten (für Übersicht und Bestätigung). */
  running: string
  /** Zeit bis zur Übergabe ab Zahlungseingang (Richtwert, Werktage). */
  shipping: string
  /** Hinweis zur Weiterleitung (Abhängigkeit von der YANQIVA-Weiterleitung, AGB Ziffer 9). */
  redirectNote: string
}

/** Höchstzahl Karten je Bestellung (Kombi: 5 Kombis = 10 Karten). */
export const QTY_MIN = 1
export const QTY_MAX = 10
export const SHIPPING_EUR = 0
/** Im Paketpreis enthaltene Dashboard-Laufzeit in Monaten. Muss zu AGB Ziffer 8 und zum Worker (zugangsklar: DASHBOARD_INCLUDED_MONTHS) passen. */
export const DASHBOARD_INCLUDED_MONTHS = 6
/** Verlängerung nur auf Wunsch: Euro je Monat und Standort, monatlich kündbar, keine automatische Verlängerung. */
export const DASHBOARD_RENEWAL_EUR = 15
/** Dashboard-Paket: erste Karte und jede weitere Karte. Muss zum Worker passen (zugangsklar: DASHBOARD_FIRST_CARD_EUR / DASHBOARD_EXTRA_CARD_EUR; Sync-Test). */
export const DASHBOARD_FIRST_CARD_EUR = 99
export const DASHBOARD_EXTRA_CARD_EUR = 40
export const KLASSIK_CARD_EUR = 60
/** Kombi ohne Dashboard (eine schwarze und eine weiße Karte). */
export const KOMBI_EUR = 75
/** Vergleich: zwei einzelne Klassik-Karten (wahrer Vergleichspreis der Kombi). */
export const KOMBI_SINGLE_EUR = 2 * KLASSIK_CARD_EUR
/** Kombi mit Dashboard: Dashboard-Paket (erste Karte) plus zweite Karte. */
export const KOMBI_DASHBOARD_EUR = DASHBOARD_FIRST_CARD_EUR + DASHBOARD_EXTRA_CARD_EUR
export const CONTACT_EMAIL = 'support@yanqiva.de'
/** Lieferzeit als Satz, z. B. für Karten und Übersicht (persönliche Übergabe vor Ort, kein Postversand). */
export const shippingText = (p: Product): string => `Übergabe vor Ort in der Regel innerhalb von ${p.shipping} nach Zahlungseingang`
/** Weiterleitungs-Hinweis (R-11). */
export const REDIRECT_NOTE =
  'Karte und QR-Code führen über unsere Weiterleitung (yanqiva-bewertung.de/r/…). Wir betreiben sie ohne laufende Kosten, mindestens 24 Monate ab Lieferung (AGB Ziffer 9).'
/** Zahlungsweise (Kurzform) für Preisbereich, Übersicht und Mails. */
export const PAYMENT_SHORT = 'Zahlung per Vorkasse (Zahlungsaufforderung bzw. Rechnung)'
/** Zahlungsweise (Langform) vor dem Absenden. */
export const PAYMENT_NOTE =
  'Vorkasse per Überweisung innerhalb von 14 Tagen. Mit der Auftragsbestätigung erhalten Sie eine Rechnung oder eine Zahlungsaufforderung. Eine Zahlungsaufforderung ist keine Rechnung; die Rechnung stellen wir dann gesondert aus. Einrichtung und Übergabe erfolgen nach Zahlungseingang.'
export const VAT_NOTE = 'Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'

const dashboardRunning = `${DASHBOARD_INCLUDED_MONTHS} Monate Dashboard inklusive. Danach optional ${DASHBOARD_RENEWAL_EUR} € pro Monat je Standort, monatlich kündbar, nur wenn Sie aktiv verlängern. Ohne Verlängerung funktioniert die Karte weiter und leitet direkt zur Google-Bewertung.`

export const PRODUCTS: Record<ProductId, Product> = {
  'review-klassik': {
    id: 'review-klassik',
    param: 'klassik',
    name: 'YANQIVA REVIEW Klassik',
    shortName: 'Klassik',
    tagline: 'Die klassische NFC-Bewertungskarte für Google-Bewertungen',
    unitPrice: KLASSIK_CARD_EUR,
    additionalPrice: KLASSIK_CARD_EUR,
    combo: false,
    dashboard: false,
    cardsPerUnit: 1,
    qtyMax: QTY_MAX,
    features: ['NFC-Chip und QR-Code', 'Farbe nach Wahl: Schwarz oder Weiß', 'Weiterleitung direkt zum Google-Bewertungsformular', 'Einrichtung inklusive'],
    running: 'Keine laufenden Kosten',
    shipping: '2–5 Werktagen',
    redirectNote: REDIRECT_NOTE,
  },
  'review-dashboard': {
    id: 'review-dashboard',
    param: 'dashboard',
    name: 'YANQIVA REVIEW Dashboard',
    shortName: 'Dashboard',
    tagline: 'Alles aus Klassik, plus Kontrolle',
    unitPrice: DASHBOARD_FIRST_CARD_EUR,
    additionalPrice: DASHBOARD_EXTRA_CARD_EUR,
    combo: false,
    dashboard: true,
    cardsPerUnit: 1,
    qtyMax: QTY_MAX,
    features: [
      'NFC-Chip und QR-Code',
      'Farbe nach Wahl: Schwarz oder Weiß',
      'Weiterleitung direkt zum Google-Bewertungsformular',
      `Dashboard ${DASHBOARD_INCLUDED_MONTHS} Monate inklusive: Statistiken zu Taps und Scans`,
      `${DASHBOARD_FIRST_CARD_EUR} € für die erste Karte, jede weitere Karte ${DASHBOARD_EXTRA_CARD_EUR} €`,
      'Einrichtung inklusive',
    ],
    running: dashboardRunning,
    shipping: '7 Werktagen',
    redirectNote: REDIRECT_NOTE,
  },
  'review-kombi': {
    id: 'review-kombi',
    param: 'kombi',
    name: 'YANQIVA REVIEW Kombi',
    shortName: 'Kombi',
    tagline: 'Eine schwarze und eine weiße Karte zusammen',
    unitPrice: KOMBI_EUR,
    additionalPrice: KOMBI_EUR,
    combo: true,
    dashboard: false,
    cardsPerUnit: 2,
    qtyMax: QTY_MAX / 2,
    features: ['1 schwarze und 1 weiße NFC-Bewertungskarte', 'NFC-Chip und QR-Code', 'Weiterleitung direkt zum Google-Bewertungsformular', 'Einrichtung inklusive'],
    running: 'Keine laufenden Kosten',
    shipping: '2–5 Werktagen',
    redirectNote: REDIRECT_NOTE,
  },
  'review-kombi-dashboard': {
    id: 'review-kombi-dashboard',
    param: 'kombi-dashboard',
    name: 'YANQIVA REVIEW Kombi mit Dashboard',
    shortName: 'Kombi mit Dashboard',
    tagline: 'Eine schwarze und eine weiße Karte, plus Kontrolle',
    unitPrice: KOMBI_DASHBOARD_EUR,
    additionalPrice: 2 * DASHBOARD_EXTRA_CARD_EUR,
    combo: true,
    dashboard: true,
    cardsPerUnit: 2,
    qtyMax: QTY_MAX / 2,
    features: [
      '1 schwarze und 1 weiße NFC-Bewertungskarte',
      'NFC-Chip und QR-Code',
      `Dashboard ${DASHBOARD_INCLUDED_MONTHS} Monate inklusive: Statistiken zu Taps und Scans`,
      `${DASHBOARD_FIRST_CARD_EUR} € Dashboard-Paket plus ${DASHBOARD_EXTRA_CARD_EUR} € für die zweite Karte`,
      'Einrichtung inklusive',
    ],
    running: dashboardRunning,
    shipping: '7 Werktagen',
    redirectNote: REDIRECT_NOTE,
  },
}

export const PRODUCT_LIST: readonly Product[] = [PRODUCTS['review-klassik'], PRODUCTS['review-dashboard'], PRODUCTS['review-kombi'], PRODUCTS['review-kombi-dashboard']]

/** Die einzige Ausführung: quadratische Acrylkarte im Standarddesign (Farbe Schwarz oder Weiß). */
export const PRODUCT_LABEL = 'NFC-Bewertungskarte (Acryl, 12 × 12 cm)'

export const isProductId = (v: unknown): v is ProductId => typeof v === 'string' && Object.prototype.hasOwnProperty.call(PRODUCTS, v)

/** Höchstmenge (in Einheiten) für ein Paket; ohne Paket die Kartenzahl. */
export const qtyMaxFor = (id: ProductId | ''): number => (id ? PRODUCTS[id].qtyMax : QTY_MAX)
/** Einheit in Worten: "Karte(n)" bzw. "Kombi(s)". */
export const unitWord = (id: ProductId | '', n: number): string => (id && PRODUCTS[id].combo ? (n === 1 ? 'Kombi' : 'Kombis') : n === 1 ? 'Karte' : 'Karten')
/** Zahl der Karten für Menge n (Kombi: 2 je Kombi). */
export const cardCount = (id: ProductId, qty: number): number => qty * PRODUCTS[id].cardsPerUnit

/** Zwischensumme in ganzen Euro: erste Einheit zum Einstiegspreis, jede weitere zum Staffelpreis. */
export const subtotal = (id: ProductId, qty: number): number => PRODUCTS[id].unitPrice + PRODUCTS[id].additionalPrice * (qty - 1)
/** Gesamtbetrag in ganzen Euro (Lieferung und Übergabe vor Ort inklusive). */
export const total = (id: ProductId, qty: number): number => subtotal(id, qty) + SHIPPING_EUR

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0 })
/** "198 €" (mit geschütztem Leerzeichen, wie Intl es liefert). */
export const formatEuro = (n: number): string => euro.format(n)

/** Preiszeilen der Übersicht: transparent mit Staffel (erste Karte, weitere Karten). */
export function priceLines(id: ProductId, qty: number): { label: string; amount: number }[] {
  const p = PRODUCTS[id]
  const more = qty - 1
  if (!p.combo && !p.dashboard) return [{ label: `${qty} × ${PRODUCT_LABEL.split(' (')[0]} à ${formatEuro(p.unitPrice)}`, amount: subtotal(id, qty) }]
  if (!p.combo) {
    const lines = [{ label: '1. Karte', amount: p.unitPrice }]
    if (more > 0) lines.push({ label: `${more} weitere ${more === 1 ? 'Karte' : 'Karten'} × ${formatEuro(p.additionalPrice)}`, amount: p.additionalPrice * more })
    return lines
  }
  if (!p.dashboard) return [{ label: `${qty} × Kombi (${qty * 2} Karten) à ${formatEuro(p.unitPrice)}`, amount: subtotal(id, qty) }]
  const lines = [{ label: `1. Kombi (2 Karten: ${formatEuro(DASHBOARD_FIRST_CARD_EUR)} + ${formatEuro(DASHBOARD_EXTRA_CARD_EUR)})`, amount: p.unitPrice }]
  if (more > 0) lines.push({ label: `${more} weitere ${more === 1 ? 'Kombi' : 'Kombis'} × ${formatEuro(p.additionalPrice)}`, amount: p.additionalPrice * more })
  return lines
}

/** Kompakte Beschreibung der Menge, z. B. "3 Karten" oder "2 Kombis (4 Karten)". */
export function quantityText(id: ProductId, qty: number): string {
  return PRODUCTS[id].combo ? `${qty} ${unitWord(id, qty)} (${cardCount(id, qty)} Karten)` : `${qty} ${unitWord(id, qty)}`
}

/** Farbverteilung als Text: "1 × Schwarz, 2 × Weiß". Kombi: je Kombi eine schwarze und eine weiße. */
export function colorSummary(counts: Record<ColorId, number>): string {
  return COLORS.filter((c) => counts[c.id] > 0).map((c) => `${counts[c.id]} × ${c.label}`).join(', ')
}
