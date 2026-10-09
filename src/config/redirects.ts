/// <reference types="vite/client" />
/**
 * YANQIVA Redirect-Tabelle.
 *
 * Prinzip:  NFC-Karte / QR-Code  ->  YANQIVA Redirect-URL (/r/<slug>)  ->  Ziel-URL (Google-Bewertung)
 *
 * Auf der physischen Karte steht nur die Redirect-URL. Die Ziel-URL lebt hier
 * (später: in der Datenbank hinter dem Dashboard) und kann jederzeit geändert
 * werden, ohne die Karte neu zu beschreiben.
 *
 * In dieser Demo wird die Tabelle beim Build in statische Seiten unter /r/<slug>/
 * übersetzt (siehe plugins/redirects.ts). In Produktion übernimmt das ein
 * Edge-Worker, der den Slug nachschlägt, den Scan zählt und per 302 weiterleitet.
 */
export interface RedirectEntry {
  /** Teil der Redirect-URL: /r/<slug> */
  slug: string
  /** Kartennummer, die auf der NFC-Karte aufgedruckt ist */
  cardId: string
  /** Fiktiver Demo-Betrieb */
  business: string
  /** Ziel der Weiterleitung. Relativ = innerhalb dieser Demo-Site. */
  target: string
  /**
   * Beispiel der echten Geschäfts-Ziel-URL (Google-Bewertungslink), wie sie in
   * Produktion hinterlegt wäre. NUR Anzeige im Dashboard – wird in der Demo weder
   * verlinkt noch aufgerufen. Fiktiv (DEMO-…), verweist auf kein echtes Profil.
   */
  googleReviewUrl: string
  active: boolean
}

/**
 * Öffentliche Basis der Redirect-URLs in Produktion.
 * Konfigurierbar über VITE_REDIRECT_BASE (siehe .env.example). Diese Datei wird auch
 * im Node-Kontext der Vite-Config geladen, dort ist import.meta.env nicht gesetzt –
 * daher optional chaining und Fallback auf process.env.
 */
export const PRODUCTION_REDIRECT_BASE: string =
  import.meta.env?.VITE_REDIRECT_BASE || (typeof process !== 'undefined' ? process.env.VITE_REDIRECT_BASE : undefined) || 'https://yanqiva-bewertung.de/r/'

/**
 * Demo-Ziele zeigen auf eine simulierte Bewertungsseite innerhalb dieser Site,
 * damit kein echtes Google-Profil verlinkt wird. In Produktion steht hier z. B.
 * https://search.google.com/local/writereview?placeid=<PLACE_ID>
 */
export const redirects: RedirectEntry[] = [
  {
    slug: 'demo-baeckerei',
    cardId: 'YANQIVA-001',
    business: 'Bäckerei Müller',
    target: 'review-demo/?b=B%C3%A4ckerei%20M%C3%BCller',
    googleReviewUrl: 'https://g.page/r/DEMO-BAECKEREI/review',
    active: true,
  },
  {
    slug: 'demo-barbershop',
    cardId: 'YANQIVA-002',
    business: 'Barbershop Karlsruhe',
    target: 'review-demo/?b=Barbershop%20Karlsruhe',
    googleReviewUrl: 'https://g.page/r/DEMO-BARBERSHOP/review',
    active: true,
  },
]

/**
 * Snapshot-Fallback für Produktionskarten (optional).
 *
 * Der Build holt – nur wenn FALLBACK_EXPORT_URL und FALLBACK_EXPORT_TOKEN gesetzt sind (GitHub-Secrets, siehe
 * plugins/redirects.ts) – von der Dashboard-API eine Liste { "<slug>": "<google-url>" } und erzeugt daraus statische
 * Seiten /r/<slug>/. Sie sind das Notnetz, falls der Redirect-Worker ausfällt (Route „Fail open“): Die Karte führt dann
 * trotzdem zum Google-Bewertungsformular. Ohne Secrets entstehen nur die Demo-Einträge oben.
 * Hier steht bewusst keine Zuordnung Slug -> Kunde; der Export enthält nur Slug und Google-Link.
 */
export const SNAPSHOT_SLUG_RE = /^[a-z0-9]{8,12}$/

const GOOGLE_EXACT_HOSTS = new Set(['g.page', 'g.co', 'goo.gl', 'maps.app.goo.gl', 'share.google', 'search.google.com'])
const GOOGLE_HOST_RE = /^(?:(?:www|maps)\.)?google\.(?:com|de|at|ch|co\.uk|fr|it|es|nl|be|pl|lu|li|dk|se|com\.tr)$/

/** Nur https-Links auf Google-Hosts ohne Zugangsdaten und Leerraum (die Worker-Regeln sind enger; hier zweite Sicherung). */
export function isSnapshotTarget(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000 || /[\s\\]/.test(value) || [...value].some((c) => c.charCodeAt(0) < 32)) return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') && (GOOGLE_EXACT_HOSTS.has(u.hostname) || GOOGLE_HOST_RE.test(u.hostname))
  } catch {
    return false
  }
}

/**
 * Wandelt die Export-Antwort in Redirect-Einträge. Wirft bei falscher Grundform; einzelne ungültige Einträge werden
 * übersprungen (Anzahl in `skipped`, nie der Inhalt – der Build-Log ist öffentlich).
 */
export function snapshotEntries(data: unknown): { entries: RedirectEntry[]; skipped: number } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Fallback-Export: unerwartetes Format (Objekt {slug: url} erwartet)')
  const entries: RedirectEntry[] = []
  let skipped = 0
  for (const [slug, url] of Object.entries(data)) {
    if (!SNAPSHOT_SLUG_RE.test(slug) || !isSnapshotTarget(url)) {
      skipped++
      continue
    }
    entries.push({ slug, cardId: slug, business: '', target: url, googleReviewUrl: url, active: true })
  }
  return { entries, skipped }
}
