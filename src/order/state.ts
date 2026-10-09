import { isFormatId, isProductId, QTY_MAX, QTY_MIN, type FormatId, type ProductId } from './catalog'
import { inDeliveryArea, OUT_OF_AREA_MESSAGE } from './deliveryArea'

export type StepId = 1 | 2 | 3 | 4
export const STEPS: readonly { id: StepId; label: string; title: string }[] = [
  { id: 1, label: 'Produkt', title: 'Ihr Produkt' },
  { id: 2, label: 'Einrichtung', title: 'Damit wir Ihre Karte richtig einrichten' },
  { id: 3, label: 'Ihre Daten', title: 'Ihre Daten' },
  { id: 4, label: 'Prüfen & bestellen', title: 'Prüfen und bestellen' },
]

/** Alle Eingaben als Strings (Menge als Text, damit Tippen frei möglich bleibt). */
export interface OrderForm {
  /** Leer, bis die Kundin oder der Kunde aktiv eine Variante wählt (oder ?paket= gesetzt ist). */
  product: ProductId | ''
  format: FormatId
  quantity: string
  displayName: string
  reviewLink: string
  profileQuery: string
  notes: string
  company: string
  firstName: string
  lastName: string
  email: string
  phone: string
  billingStreet: string
  billingZip: string
  billingCity: string
  shipDifferent: boolean
  shipName: string
  shipStreet: string
  shipZip: string
  shipCity: string
  confirmB2B: boolean
  acceptAgb: boolean
  /** Zufälliger Schlüssel je Bestellung (Idempotenz): bleibt bei Wiederholungen gleich, neu erst nach Erfolg. */
  orderKey: string
}

export type FieldKey = keyof OrderForm
export type Errors = Partial<Record<FieldKey, string>>

/** Maximale Längen laut Spezifikation. */
export const MAX = {
  displayName: 60,
  reviewLink: 500,
  profileQuery: 200,
  notes: 600,
  company: 150,
  firstName: 60,
  lastName: 60,
  email: 254,
  phone: 50,
  billingStreet: 120,
  billingCity: 80,
  shipName: 150,
  shipStreet: 120,
  shipCity: 80,
} as const

const KEY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
const KEY_RE = /^[A-Za-z0-9_-]{32}$/

/** 32 Zeichen aus [A-Za-z0-9_-] über crypto.getRandomValues (64 Zeichen: kein Modulo-Bias). */
export function newOrderKey(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => KEY_CHARS[b & 63]).join('')
}

export const initialForm = (): OrderForm => ({
  product: '',
  format: 'karte',
  quantity: '1',
  displayName: '',
  reviewLink: '',
  profileQuery: '',
  notes: '',
  company: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  billingStreet: '',
  billingZip: '',
  billingCity: '',
  shipDifferent: false,
  shipName: '',
  shipStreet: '',
  shipZip: '',
  shipCity: '',
  confirmB2B: false,
  acceptAgb: false,
  orderKey: newOrderKey(),
})

/** Menge als gültige ganze Zahl 1 bis 10, sonst null. */
export function parseQuantity(raw: string): number | null {
  const t = raw.trim()
  if (!/^\d{1,3}$/.test(t)) return null
  const n = Number(t)
  return n >= QTY_MIN && n <= QTY_MAX ? n : null
}

/** Für die Preisanzeige: ungültige Menge fällt auf den nächstliegenden gültigen Wert. */
export const effectiveQuantity = (raw: string): number => {
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? Math.min(QTY_MAX, Math.max(QTY_MIN, n)) : QTY_MIN
}

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i
const PHONE_CHARS = /^[\d\s+()/-]+$/

const GOOGLE_EXACT = ['g.page', 'g.co', 'goo.gl', 'maps.app.goo.gl', 'share.google']
const GOOGLE_DOMAINS = [
  'google.com', 'google.de', 'google.at', 'google.ch', 'google.co.uk', 'google.fr', 'google.it', 'google.es',
  'google.nl', 'google.be', 'google.pl', 'google.lu', 'google.li', 'google.dk', 'google.se', 'google.com.tr',
]
const GOOGLE_PREFIXES = ['www.', 'maps.', 'search.']

/** Wie der Server: https, keine Zugangsdaten, keine Leerzeichen, Host exakt aus der Liste (optional mit genau einem Präfix www./maps./search.). */
export function isGoogleReviewUrl(value: string): boolean {
  if (/\s/.test(value)) return false
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' || url.username || url.password) return false
  const host = url.hostname.toLowerCase()
  if (GOOGLE_EXACT.includes(host) || GOOGLE_DOMAINS.includes(host)) return true
  return GOOGLE_PREFIXES.some((p) => host.startsWith(p) && GOOGLE_DOMAINS.includes(host.slice(p.length)))
}

/** Wie der Server: höchstens 254 Zeichen, Lokalteil höchstens 64, keine Steuerzeichen, ASCII-Domain. */
export function emailProblem(email: string): string | null {
  if (!email) return 'Bitte geben Sie Ihre E-Mail-Adresse ein.'
  const at = email.lastIndexOf('@')
  const domain = at >= 0 ? email.slice(at + 1) : ''
  const code = (c: string) => c.charCodeAt(0)
  const control = Array.from(email).some((c) => code(c) < 32 || code(c) === 127)
  if (!control && Array.from(domain).some((c) => code(c) > 127) && email.indexOf('@') === at && at > 0) {
    return 'Bitte geben Sie die Domain ohne Umlaute an (z. B. xn--…) oder eine andere E-Mail-Adresse.'
  }
  if (control || email.length > 254 || at > 64 || !EMAIL_RE.test(email)) return 'Bitte geben Sie eine gültige E-Mail-Adresse ein, z. B. name@firma.de.'
  return null
}

const v = (s: string) => s.trim()

function validateStep1(f: OrderForm, e: Errors) {
  if (!f.product) e.product = 'Bitte wählen Sie eine Variante (Klassik oder Dashboard).'
  if (v(f.quantity) === '') e.quantity = `Bitte geben Sie die Stückzahl an (${QTY_MIN} bis ${QTY_MAX}).`
  else if (parseQuantity(f.quantity) === null) {
    e.quantity = `Bitte geben Sie eine ganze Zahl von ${QTY_MIN} bis ${QTY_MAX} ein. Für mehr Stück schreiben Sie uns bitte an support@yanqiva.de.`
  }
}

function validateStep2(f: OrderForm, e: Errors) {
  if (!v(f.displayName)) e.displayName = 'Bitte geben Sie den Namen ein, der auf der Karte stehen soll.'
  else if (v(f.displayName).length > MAX.displayName) e.displayName = `Bitte kürzen Sie den Namen auf höchstens ${MAX.displayName} Zeichen.`
  const link = v(f.reviewLink)
  if (link && !isGoogleReviewUrl(link)) {
    e.reviewLink =
      'Bitte geben Sie einen Google-Link mit https:// ein (z. B. https://g.page/r/… oder von google.de, maps.app.goo.gl, goo.gl, g.co, share.google), ohne Leerzeichen. Oder lassen Sie das Feld leer und nennen Sie uns Name und Ort Ihres Unternehmens.'
  } else if (!link && !v(f.profileQuery)) {
    e.reviewLink = 'Bitte geben Sie entweder den Google-Bewertungslink oder Name und Ort Ihres Unternehmens an.'
  }
  if (v(f.notes).length > MAX.notes) e.notes = `Bitte kürzen Sie Ihre Hinweise auf höchstens ${MAX.notes} Zeichen.`
}

function validateZip(zip: string, who: string): string | undefined {
  if (!zip) return `Bitte geben Sie die Postleitzahl ${who} ein.`
  if (!/^\d{5}$/.test(zip)) return 'Bitte geben Sie eine fünfstellige Postleitzahl ein.'
  return undefined
}

function validateStep3(f: OrderForm, e: Errors) {
  if (!v(f.company)) e.company = 'Bitte geben Sie den Namen Ihres Unternehmens ein.'
  if (!v(f.firstName)) e.firstName = 'Bitte geben Sie Ihren Vornamen ein.'
  if (!v(f.lastName)) e.lastName = 'Bitte geben Sie Ihren Nachnamen ein.'
  const emailError = emailProblem(v(f.email))
  if (emailError) e.email = emailError
  const phone = v(f.phone)
  if (phone) {
    if (!PHONE_CHARS.test(phone)) e.phone = 'Bitte verwenden Sie in der Telefonnummer nur Ziffern, Leerzeichen und die Zeichen + ( ) / -.'
    else if (phone.replace(/\D/g, '').length < 6) e.phone = 'Bitte geben Sie eine Telefonnummer mit mindestens 6 Ziffern ein oder lassen Sie das Feld leer.'
  }
  if (!v(f.billingStreet)) e.billingStreet = 'Bitte geben Sie Straße und Hausnummer der Rechnungsadresse ein.'
  const zip = validateZip(v(f.billingZip), 'der Rechnungsadresse')
  if (zip) e.billingZip = zip
  else if (!f.shipDifferent && !inDeliveryArea(v(f.billingZip))) {
    e.billingZip = `${OUT_OF_AREA_MESSAGE} Liegt Ihre Lieferadresse im Liefergebiet, wählen Sie bitte „Die Lieferadresse weicht von der Rechnungsadresse ab“.`
  }
  if (!v(f.billingCity)) e.billingCity = 'Bitte geben Sie den Ort der Rechnungsadresse ein.'
  if (f.shipDifferent) {
    if (!v(f.shipStreet)) e.shipStreet = 'Bitte geben Sie Straße und Hausnummer der Lieferadresse ein.'
    const sz = validateZip(v(f.shipZip), 'der Lieferadresse')
    if (sz) e.shipZip = sz
    else if (!inDeliveryArea(v(f.shipZip))) e.shipZip = OUT_OF_AREA_MESSAGE
    if (!v(f.shipCity)) e.shipCity = 'Bitte geben Sie den Ort der Lieferadresse ein.'
  }
}

function validateStep4(f: OrderForm, e: Errors) {
  if (!f.confirmB2B) e.confirmB2B = 'Bitte bestätigen Sie, dass Sie als Unternehmer bestellen.'
  if (!f.acceptAgb) e.acceptAgb = 'Bitte akzeptieren Sie die AGB, um zahlungspflichtig zu bestellen.'
}

export function validateStep(step: StepId, f: OrderForm): Errors {
  const e: Errors = {}
  if (step === 1) validateStep1(f, e)
  else if (step === 2) validateStep2(f, e)
  else if (step === 3) validateStep3(f, e)
  else validateStep4(f, e)
  return e
}

/** Erster Schritt (1 bis 3) mit ungültigen Angaben, sonst 4. Verhindert Sprünge über unvollständige Schritte. */
export function firstIncompleteStep(f: OrderForm): StepId {
  for (const s of [1, 2, 3] as const) if (Object.keys(validateStep(s, f)).length > 0) return s
  return 4
}

/** Reihenfolge der Felder auf der Seite (für Fehlerzusammenfassung und Fokus). */
export const FIELD_ORDER: readonly FieldKey[] = [
  'product', 'quantity', 'displayName', 'reviewLink', 'profileQuery', 'notes',
  'company', 'firstName', 'lastName', 'email', 'phone',
  'billingStreet', 'billingZip', 'billingCity', 'shipName', 'shipStreet', 'shipZip', 'shipCity',
  'confirmB2B', 'acceptAgb',
]

export const FIELD_LABELS: Partial<Record<FieldKey, string>> = {
  product: 'Variante',
  quantity: 'Stückzahl',
  displayName: 'Name auf der Karte',
  reviewLink: 'Google-Bewertungslink',
  profileQuery: 'Name und Ort Ihres Unternehmens',
  notes: 'Hinweise',
  company: 'Unternehmen',
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail-Adresse',
  phone: 'Telefon',
  billingStreet: 'Straße und Hausnummer (Rechnung)',
  billingZip: 'Postleitzahl (Rechnung)',
  billingCity: 'Ort (Rechnung)',
  shipStreet: 'Straße und Hausnummer (Lieferung)',
  shipZip: 'Postleitzahl (Lieferung)',
  shipCity: 'Ort (Lieferung)',
  confirmB2B: 'Bestätigung als Unternehmer',
  acceptAgb: 'AGB akzeptieren',
}

/** Eingaben bereinigt (getrimmt) für Anzeige und Versand. */
export function trimmed(f: OrderForm): OrderForm {
  const t = { ...f }
  for (const k of Object.keys(MAX) as (keyof typeof MAX)[]) t[k] = f[k].trim()
  t.billingZip = f.billingZip.trim()
  t.shipZip = f.shipZip.trim()
  t.quantity = f.quantity.trim()
  return t
}

// ---- Zwischenstand (sessionStorage) und Schritt in der URL ----

const STORAGE_KEY = 'yq-review-order-v1'

/** Einwilligungen werden bewusst nicht gespeichert: sie müssen je Bestellung neu gesetzt werden. */
export function saveDraft(form: OrderForm, step: StepId): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form: { ...form, confirmB2B: false, acceptAgb: false }, step }))
  } catch {
    /* Speicher gesperrt: Bestellung bleibt trotzdem möglich */
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignorieren */
  }
}

export function toStep(value: unknown): StepId | null {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : typeof value === 'number' ? value : Number.NaN
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : null
}

export function loadDraft(): { form: OrderForm; step: StepId } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return null
    const rec = data as { form?: unknown; step?: unknown }
    if (typeof rec.form !== 'object' || rec.form === null) return null
    const base = initialForm()
    const src = rec.form as Record<string, unknown>
    const merged: Record<string, unknown> = { ...base }
    for (const key of Object.keys(base) as FieldKey[]) {
      if (typeof src[key] === typeof base[key]) merged[key] = src[key]
    }
    const form = merged as unknown as OrderForm
    if (form.product !== '' && !isProductId(form.product)) form.product = base.product
    if (!isFormatId(form.format)) form.format = base.format
    form.confirmB2B = false
    form.acceptAgb = false
    if (!KEY_RE.test(form.orderKey)) form.orderKey = newOrderKey()
    return { form, step: toStep(rec.step) ?? 1 }
  } catch {
    return null
  }
}

/** Gewählte Variante; nur nach erfolgreicher Prüfung von Schritt 1 aufrufen (Rückfall nur für die Typen). */
export const productOf = (f: OrderForm): ProductId => (f.product === '' ? 'review-klassik' : f.product)

export const stepFromUrl = (): StepId | null => toStep(new URLSearchParams(window.location.search).get('schritt'))
export const stepUrl = (step: StepId): string => `${window.location.pathname}?schritt=${step}`

// ---- Fehlercodes des Servers (400) einem Schritt und Feld zuordnen ----

const FIELD_STEP: Partial<Record<FieldKey, StepId>> = {
  product: 1,
  quantity: 1,
  displayName: 2, reviewLink: 2, profileQuery: 2, notes: 2,
  company: 3, firstName: 3, lastName: 3, email: 3, phone: 3,
  billingStreet: 3, billingZip: 3, billingCity: 3, shipName: 3, shipStreet: 3, shipZip: 3, shipCity: 3,
}

const CODE_FIELD: Record<string, FieldKey> = {
  invalid_email: 'email',
  invalid_review_link: 'reviewLink',
  missing_review_target: 'reviewLink',
  invalid_billing_zip: 'billingZip',
  invalid_ship_zip: 'shipZip',
  invalid_quantity: 'quantity',
  invalid_product: 'product',
  invalid_format: 'quantity',
}

/** Lieferadresse außerhalb des Liefergebiets (Worker, 400): je nach Formular die abweichende Lieferadresse oder die Rechnungsadresse. */
const OUT_OF_AREA_CODE = 'out_of_delivery_area'

/** Ordnet einen Fehlercode (z. B. invalid_email, missing_company) einem Feld und dem zugehörigen Schritt zu; null = nicht zuordenbar. */
export function mapServerCode(code: string | undefined, form?: Pick<OrderForm, 'shipDifferent'>): { step: StepId; field: FieldKey } | null {
  if (!code) return null
  if (code === OUT_OF_AREA_CODE) return { step: 3, field: form?.shipDifferent ? 'shipZip' : 'billingZip' }
  let field: FieldKey | undefined = CODE_FIELD[code]
  if (!field) {
    const m = /^(?:missing|invalid|field_too_long|too_long)_([A-Za-z]+)$/.exec(code)
    if (m && m[1] in FIELD_STEP) field = m[1] as FieldKey
  }
  const step = field ? FIELD_STEP[field] : undefined
  return field && step ? { step, field } : null
}
