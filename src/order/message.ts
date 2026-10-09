import { FORMATS, formatEuro, PRODUCTS, SHIPPING_EUR, subtotal, total, shippingText, VAT_NOTE } from './catalog'
import { effectiveQuantity, productOf, trimmed, type OrderForm } from './state'

export const MESSAGE_MAX = 3500

/** Kürzt nach Unicode-Codepoints (nicht UTF-16-Einheiten), damit kein Zeichenpaar zerschnitten wird. */
export function truncateCodePoints(text: string, max: number): string {
  const chars = Array.from(text)
  return chars.length > max ? `${chars.slice(0, max - 1).join('')}…` : text
}

/** Lesbare deutsche Zusammenfassung der Bestellung (höchstens 3500 Zeichen) für `message` und den mailto-Rückfall. */
export function buildMessage(input: OrderForm): string {
  const f = trimmed(input)
  const qty = effectiveQuantity(f.quantity)
  const pid = productOf(f)
  const p = PRODUCTS[pid]
  const lines: string[] = [
    'Verbindliche Bestellung YANQIVA REVIEW',
    '',
    'BESTELLUNG',
    `Produkt: ${p.name}`,
    `Ausführung: ${FORMATS[f.format].name}`,
    `Menge: ${qty}`,
    `Einzelpreis: ${formatEuro(p.unitPrice)}`,
    `Zwischensumme: ${formatEuro(subtotal(pid, qty))}`,
    `Lieferung und Übergabe vor Ort (Raum Speyer, Ludwigshafen, Mannheim, Karlsruhe): ${formatEuro(SHIPPING_EUR)} (inklusive)`,
    `Gesamtbetrag einmalig: ${formatEuro(total(pid, qty))}`,
    `Laufende Kosten: ${p.running}`,
    `Lieferzeit: ${shippingText(p)}`,
    `Zahlungsart: Rechnung (Überweisung). ${VAT_NOTE}`,
    '',
    'EINRICHTUNG',
    `Name auf der Karte: ${f.displayName}`,
    `Google-Bewertungslink: ${f.reviewLink || '(nicht angegeben)'}`,
    `Name und Ort bei Google: ${f.profileQuery || '(nicht angegeben)'}`,
  ]
  if (f.notes) lines.push(`Hinweise: ${f.notes}`)
  lines.push(
    '',
    'KONTAKT UND RECHNUNGSADRESSE',
    `Unternehmen: ${f.company}`,
    `Ansprechpartner: ${f.firstName} ${f.lastName}`,
    `E-Mail: ${f.email}`,
    `Telefon: ${f.phone || '(nicht angegeben)'}`,
    `Rechnungsadresse: ${f.billingStreet}, ${f.billingZip} ${f.billingCity}, Deutschland`,
  )
  if (f.shipDifferent) {
    lines.push(`Lieferadresse: ${f.shipName || f.company}, ${f.shipStreet}, ${f.shipZip} ${f.shipCity}, Deutschland`)
  } else {
    lines.push('Lieferadresse: wie Rechnungsadresse')
  }
  lines.push('', 'Bestätigt: Bestellung als Unternehmer (§ 14 BGB); AGB akzeptiert.')
  const text = lines.join('\n')
  return truncateCodePoints(text, MESSAGE_MAX)
}

/** Alle Felder als Strings; leere optionale Felder entfallen. */
export function buildFields(input: OrderForm): Record<string, string> {
  const f = trimmed(input)
  const out: Record<string, string> = {
    product: f.product,
    format: f.format,
    quantity: String(effectiveQuantity(f.quantity)),
    company: f.company,
    firstName: f.firstName,
    lastName: f.lastName,
    phone: f.phone,
    billingStreet: f.billingStreet,
    billingZip: f.billingZip,
    billingCity: f.billingCity,
    shipDifferent: f.shipDifferent ? 'ja' : '',
    shipName: f.shipDifferent ? f.shipName : '',
    shipStreet: f.shipDifferent ? f.shipStreet : '',
    shipZip: f.shipDifferent ? f.shipZip : '',
    shipCity: f.shipDifferent ? f.shipCity : '',
    displayName: f.displayName,
    reviewLink: f.reviewLink,
    profileQuery: f.profileQuery,
    notes: f.notes,
    orderKey: f.orderKey,
  }
  for (const k of Object.keys(out)) if (out[k] === '') delete out[k]
  return out
}

export const mailSubject = (company: string): string => `Bestellung YANQIVA REVIEW – ${company.trim()}`

const MAIL_BUDGET = 1200

/** Kompakter Text für den mailto-Rückfall: nur die wichtigsten Angaben, höchstens ca. 1200 Zeichen nach dem Kodieren. */
export function buildMailBody(input: OrderForm): string {
  const f = trimmed(input)
  const qty = effectiveQuantity(f.quantity)
  const pid = productOf(f)
  const p = PRODUCTS[pid]
  const lines = [
    `Bestellung: ${qty} x ${p.shortName}, ${FORMATS[f.format].name}, gesamt ${formatEuro(total(pid, qty))}`,
    'Bestätigt: Unternehmer (§ 14 BGB), AGB (yanqiva-bewertung.de/agb/) akzeptiert.',
    `Firma: ${f.company}`,
    `Kontakt: ${f.firstName} ${f.lastName}, ${f.email}${f.phone ? `, ${f.phone}` : ''}`,
    `Rechnung: ${f.billingStreet}, ${f.billingZip} ${f.billingCity}`,
    f.shipDifferent ? `Lieferung: ${f.shipName ? `${f.shipName}, ` : ''}${f.shipStreet}, ${f.shipZip} ${f.shipCity}` : 'Lieferung: wie Rechnung',
    `Name auf Karte: ${f.displayName}`,
    f.reviewLink ? `Google-Link: ${f.reviewLink}` : `Google-Profil: ${f.profileQuery}`,
    `Bestellschlüssel: ${f.orderKey}`,
  ]
  let body = lines.join('\n')
  if (f.notes) body += `\nHinweise: ${f.notes}`
  // über das Budget: Zeichen (Codepoints) von hinten abschneiden, bis die kodierte Länge passt
  const chars = Array.from(body)
  while (chars.length > 0 && encodeURIComponent(chars.join('')).length > MAIL_BUDGET) chars.length = Math.max(0, chars.length - 20)
  return chars.join('')
}
