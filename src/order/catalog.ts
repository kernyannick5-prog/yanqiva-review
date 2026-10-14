/** Katalog und Preise der Bestellung: einzige Quelle für Preise im Frontend (der Server rechnet selbst nach). */

export type ProductId = 'review-klassik' | 'review-dashboard'

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
  /** Zeit bis zur Übergabe ab Zahlungseingang (Richtwert, Werktage). */
  shipping: string
  /** Hinweis zur Weiterleitung (Abhängigkeit von der YANQIVA-Weiterleitung, AGB Ziffer 9). */
  redirectNote: string
}

export const QTY_MIN = 1
export const QTY_MAX = 10
export const SHIPPING_EUR = 0
/** Im Paketpreis enthaltene Dashboard-Laufzeit in Monaten. Muss zu AGB Ziffer 8 und zum Worker (zugangsklar: DASHBOARD_INCLUDED_MONTHS) passen. */
export const DASHBOARD_INCLUDED_MONTHS = 2
/** Verlängerung nur auf Wunsch: Euro je Monat und Standort, monatlich kündbar, keine automatische Verlängerung. */
export const DASHBOARD_RENEWAL_EUR = 15
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

export const PRODUCTS: Record<ProductId, Product> = {
  'review-klassik': {
    id: 'review-klassik',
    param: 'klassik',
    name: 'YANQIVA REVIEW Klassik',
    shortName: 'Klassik',
    tagline: 'Die klassische NFC-Bewertungskarte für Google-Bewertungen',
    unitPrice: 60,
    features: ['NFC-Chip und QR-Code', 'Weiterleitung direkt zum Google-Bewertungsformular', 'Einrichtung inklusive'],
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
    unitPrice: 99,
    features: [
      'NFC-Chip und QR-Code',
      'Weiterleitung direkt zum Google-Bewertungsformular',
      `Dashboard ${DASHBOARD_INCLUDED_MONTHS} Monate inklusive: Statistiken zu Taps und Scans`,
      'Einrichtung inklusive',
    ],
    running: `${DASHBOARD_INCLUDED_MONTHS} Monate Dashboard inklusive. Danach optional ${DASHBOARD_RENEWAL_EUR} € pro Monat je Standort, monatlich kündbar, nur wenn Sie aktiv verlängern. Ohne Verlängerung funktioniert die Karte weiter und leitet direkt zur Google-Bewertung.`,
    shipping: '7 Werktagen',
    redirectNote: REDIRECT_NOTE,
  },
}

export const PRODUCT_LIST: readonly Product[] = [PRODUCTS['review-klassik'], PRODUCTS['review-dashboard']]

/** Die einzige Ausführung: quadratische Acrylkarte im Standarddesign (keine Auswahl im Formular). */
export const PRODUCT_LABEL = 'NFC-Bewertungskarte (Acryl, 12 × 12 cm)'

export const isProductId = (v: unknown): v is ProductId => v === 'review-klassik' || v === 'review-dashboard'

/** Zwischensumme in ganzen Euro. */
export const subtotal = (id: ProductId, qty: number): number => PRODUCTS[id].unitPrice * qty
/** Gesamtbetrag in ganzen Euro (Lieferung und Übergabe vor Ort inklusive). */
export const total = (id: ProductId, qty: number): number => subtotal(id, qty) + SHIPPING_EUR

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0 })
/** "198 €" (mit geschütztem Leerzeichen, wie Intl es liefert). */
export const formatEuro = (n: number): string => euro.format(n)
