/**
 * YANQIVA REVIEW – Datenmodell für die spätere Datenbank (nur Geschäftsdaten).
 *
 * Privacy by Design: Das System kennt Kunden (= Unternehmen, die Bewertungen sammeln),
 * deren Karten und pro Karte und Tag zwei aggregierte Zähler. Es gibt keine Tabelle,
 * keine Spalte und kein Log mit Daten einzelner Besucher.
 *
 * SQL-Beispiel, Redirect-Worker-Ablauf und Hinweise: docs/DATENMODELL.md
 * Abbildung der Demo-Typen (src/demo/types.ts) auf dieses Schema: src/demo/schemaMapping.ts
 *
 * ---------------------------------------------------------------------------
 * WAS NIE GESPEICHERT WIRD
 * ---------------------------------------------------------------------------
 *  - IP-Adressen (auch nicht gekürzt oder gehasht)
 *  - User-Agent, Browser-/Geräteinformationen, Sprache, Bildschirmgröße
 *  - Fingerprints jeder Art
 *  - Standortdaten (auch kein Geo-IP-Lookup)
 *  - Besucher-, Geräte- oder Sitzungs-IDs
 *  - Cookies oder vergleichbare Speicher (localStorage, ETags als Kennung)
 *  - Google-Konten oder Zugangsdaten des Kunden bei Google
 *  - Daten von Bewertenden (Name, Text, Zeitpunkt einzelner Scans/Bewertungen)
 *  - Referrer und Zeitstempel einzelner Aufrufe
 *
 * Konsequenz: Ein einzelner Scan ist nach dem Zählen nicht mehr rekonstruierbar;
 * es bleibt nur „Karte X hat am Tag Y insgesamt n Aufrufe“.
 * ---------------------------------------------------------------------------
 */

/** ISO-Kalendertag im Format YYYY-MM-DD (UTC-Tag des Servers, keine Uhrzeit). */
export type IsoDate = string

/** Kunde = Unternehmen, das Bewertungen sammeln möchte. Enthält ausschließlich Geschäftsdaten. */
export interface Customer {
  /** Interne ID (UUID oder zufälliger Schlüssel), ohne Personenbezug */
  id: string
  /** Name des Unternehmens (kein Personenname einer Privatperson als Pflicht) */
  businessName: string
  /** Ziel der Weiterleitung, z. B. https://g.page/r/<ID>/review – nur https */
  googleReviewUrl: string
  /** ISO-Zeitstempel der Anlage */
  createdAt: string
}

/** Eine physische NFC-Karte bzw. ein QR-Code. Verweist nie direkt auf Google, sondern auf einen Slug. */
export interface NfcCard {
  /** Interne ID, ohne Personenbezug */
  id: string
  /**
   * Aufgedruckte Kartennummer, z. B. YANQIVA-001.
   * Erlaubt: nur A–Z, 0–9, „-“ und „_“, max. 24 Zeichen. Keine Namen, keine Geburtsdaten.
   */
  cardCode: string
  customerId: Customer['id']
  /**
   * Teil der Redirect-URL (https://yanqiva.de/r/<redirectSlug>).
   * Neue Slugs sind zufällig (z. B. card_7f82k), nie aus Namen abgeleitet.
   */
  redirectSlug: string
  /** false = Weiterleitung pausiert, es wird nicht gezählt */
  active: boolean
  createdAt: string
}

/**
 * Aggregierte Tageszähler pro Karte. Das ist die EINZIGE Form von Nutzungsdaten.
 * Primärschlüssel: (cardId, date). Gezählt wird per UPSERT „+1“, nie pro Ereignis gespeichert.
 */
export interface CardStatsDaily {
  cardId: NfcCard['id']
  date: IsoDate
  /** Aufrufe über NFC-Tap (Kanal-Kennung steckt in der URL, nicht im Besucher) */
  nfcCount: number
  /** Aufrufe über QR-Code */
  qrCount: number
}

/** Kanal eines Aufrufs; wird nur zum Wählen des Zählers genutzt und nicht gespeichert. */
export type ScanChannel = 'nfc' | 'qr'
