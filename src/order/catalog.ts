/** Katalog und Preise der Bestellung: einzige Quelle für Preise im Frontend (der Server rechnet selbst nach). */

export type ProductId = 'review-klassik' | 'review-dashboard'
export type FormatId = 'karte' | 'aufsteller'

export interface Product {
  id: ProductId
  /** Wert für ?paket=… */
  param: 'klassik' | 'dashboard'
  name: string
  shortName: string
  tagline: string
  /** Einmaliger Endpreis je Stück in ganzen Euro. */
  unitPrice: number
  features: readonly string[]
  /** Laufende Kosten in Worten (für Übersicht und Bestätigung). */
  running: string
  /** Versandzeit ab Zahlungseingang (Richtwert, Werktage). */
  shipping: string
}

export interface FormatOption {
  id: FormatId
  name: string
  description: string
}

export const QTY_MIN = 1
export const QTY_MAX = 10
export const SHIPPING_EUR = 0
export const DASHBOARD_RENEWAL_EUR = 15
export const CONTACT_EMAIL = 'support@yanqiva.de'
/** Versandzeit als Satz, z. B. für Karten und Übersicht. */
export const shippingText = (p: Product): string => `Versand in der Regel innerhalb von ${p.shipping} nach Zahlungseingang`
export const VAT_NOTE = 'Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'

export const PRODUCTS: Record<ProductId, Product> = {
  'review-klassik': {
    id: 'review-klassik',
    param: 'klassik',
    name: 'YANQIVA REVIEW Klassik',
    shortName: 'Klassik',
    tagline: 'Der klassische Google-NFC-Tag',
    unitPrice: 60,
    features: ['NFC-Chip und QR-Code', 'Direkter Link zum Google-Bewertungsformular', 'Einrichtung inklusive'],
    running: 'Keine laufenden Kosten',
    shipping: '2–5 Werktagen',
  },
  'review-dashboard': {
    id: 'review-dashboard',
    param: 'dashboard',
    name: 'YANQIVA REVIEW Dashboard',
    shortName: 'Dashboard',
    tagline: 'Alles aus Klassik, plus Kontrolle',
    unitPrice: 99,
    features: [
      'NFC-Chip und QR-Code',
      'Direkter Link zum Google-Bewertungsformular',
      'Dashboard 12 Monate inklusive: Statistiken zu Taps und Scans',
      'Ziel-Link jederzeit änderbar',
      'Einrichtung inklusive',
    ],
    running: `12 Monate Dashboard inklusive. Danach optional ${DASHBOARD_RENEWAL_EUR} € pro Monat je Standort, monatlich kündbar, nur wenn Sie aktiv verlängern. Ohne Verlängerung funktioniert die Karte weiter und leitet direkt zur Google-Bewertung.`,
    shipping: '7 Werktagen',
  },
}

export const PRODUCT_LIST: readonly Product[] = [PRODUCTS['review-klassik'], PRODUCTS['review-dashboard']]

export const FORMATS: Record<FormatId, FormatOption> = {
  karte: { id: 'karte', name: 'NFC-Karte', description: 'Im Kartenformat, passt an Kasse und in jede Tasche' },
  aufsteller: { id: 'aufsteller', name: 'NFC-Aufsteller', description: 'Für Theke, Tisch oder Empfang' },
}

export const FORMAT_LIST: readonly FormatOption[] = [FORMATS.karte, FORMATS.aufsteller]

export const isProductId = (v: unknown): v is ProductId => v === 'review-klassik' || v === 'review-dashboard'
export const isFormatId = (v: unknown): v is FormatId => v === 'karte' || v === 'aufsteller'

/** Zwischensumme in ganzen Euro. */
export const subtotal = (id: ProductId, qty: number): number => PRODUCTS[id].unitPrice * qty
/** Gesamtbetrag in ganzen Euro (Versand innerhalb Deutschlands inklusive). */
export const total = (id: ProductId, qty: number): number => subtotal(id, qty) + SHIPPING_EUR

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0 })
/** "198 €" (mit geschütztem Leerzeichen, wie Intl es liefert). */
export const formatEuro = (n: number): string => euro.format(n)
