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
