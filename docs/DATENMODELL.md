# Datenmodell und Redirect-Worker (Privacy by Design)

Dieses Dokument beschreibt das Datenbankschema, das später hinter dem Dashboard und dem Redirect-Worker liegt. Die TypeScript-Typen dazu stehen in `src/model/schema.ts`, die Abbildung der Demo-Typen darauf in `src/demo/schemaMapping.ts`.

## Grundsatz

Gespeichert werden **nur Geschäftsdaten** (Kunde, Karte, Ziel-URL) und **aggregierte Tageszähler** pro Karte. Einzelne Aufrufe werden nie als Ereignis gespeichert.

### Was NIE gespeichert wird

- IP-Adressen (auch nicht gekürzt oder gehasht)
- User-Agent, Browser-/Geräteinformationen
- Fingerprints
- Standortdaten
- Besucher-, Geräte- oder Sitzungs-IDs
- Cookies oder vergleichbare Speicher
- Google-Konten bzw. Zugangsdaten
- Daten von Bewertenden (Name, Text, Zeitpunkt einzelner Aufrufe, Referrer)

## SQL-Beispiel-Schema (PostgreSQL / SQLite-nah)

```sql
CREATE TABLE customers (
  id                TEXT PRIMARY KEY,                 -- zufällig (UUID), ohne Personenbezug
  business_name     TEXT NOT NULL,
  google_review_url TEXT NOT NULL
                    CHECK (google_review_url LIKE 'https://%'),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nfc_cards (
  id            TEXT PRIMARY KEY,
  card_code     TEXT NOT NULL UNIQUE
                CHECK (card_code ~ '^[A-Z0-9_-]{1,24}$'),   -- keine Namen/Geburtsdaten
  customer_id   TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  redirect_slug TEXT NOT NULL UNIQUE,                       -- zufällig, z. B. card_7f82k4
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Einzige Nutzungsdaten: ein Zeilenpaar pro Karte und Tag.
CREATE TABLE card_stats_daily (
  card_id   TEXT NOT NULL REFERENCES nfc_cards(id) ON DELETE CASCADE,
  date      DATE NOT NULL,                                  -- YYYY-MM-DD, keine Uhrzeit
  nfc_count INTEGER NOT NULL DEFAULT 0 CHECK (nfc_count >= 0),
  qr_count  INTEGER NOT NULL DEFAULT 0 CHECK (qr_count  >= 0),
  PRIMARY KEY (card_id, date)
);
```

Es gibt bewusst keine Tabelle für Einzelaufrufe, Sitzungen oder Besucher.

## Redirect-Worker (Pseudocode)

Läuft am Rand (z. B. Cloudflare Worker unter `https://yanqiva.de/r/*`). Der Kanal (NFC oder QR) steckt in der Karten-URL (z. B. `?c=n` bzw. `?c=q`) und nicht in Besucherdaten.

```text
handle(request):
  slug    = letzter Pfadteil von request.url
  channel = request.url.query["c"] == "q" ? "qr" : "nfc"

  row = SELECT c.id, cu.google_review_url
        FROM nfc_cards c JOIN customers cu ON cu.id = c.customer_id
        WHERE c.redirect_slug = :slug AND c.active

  if row ist leer:
      return 404                       # nichts zählen, nichts loggen

  # Tageszähler +1 per UPSERT (atomar, nur Aggregat)
  INSERT INTO card_stats_daily (card_id, date, nfc_count, qr_count)
  VALUES (:row.id, CURRENT_DATE,
          :channel = 'nfc' ? 1 : 0,
          :channel = 'qr'  ? 1 : 0)
  ON CONFLICT (card_id, date) DO UPDATE
    SET nfc_count = card_stats_daily.nfc_count + EXCLUDED.nfc_count,
        qr_count  = card_stats_daily.qr_count  + EXCLUDED.qr_count

  return 302 Location: row.google_review_url
         Referrer-Policy: no-referrer
         Cache-Control: no-store
```

Vorgaben für den Betrieb:

- **Keine Logs mit IP.** Zugriffs- und Debug-Logs des Workers/Proxys ohne IP, User-Agent und Referrer konfigurieren (bzw. abschalten); kein Logpush mit Request-Metadaten.
- Keine Cookies setzen (`Set-Cookie` nie), keine Weiterleitung über Dritt-Domains.
- Kein Bot-/Analytics-Produkt des Proxys aktivieren, das Skripte oder Cookies einschleust.
- Zähler auf Tagesebene belassen; keine Stundenwerte, wenn dadurch Einzelaufrufe rekonstruierbar würden.
- Das Dashboard liest nur `card_stats_daily` und die Geschäftsdaten.

## Abbildung der Demo-Typen

| Demo (`src/demo/types.ts`) | Schema (`src/model/schema.ts`) |
| --- | --- |
| `Card.id` | `NfcCard.id` |
| `Card.cardNumber` | `NfcCard.cardCode` |
| `Card.slug` | `NfcCard.redirectSlug` |
| `Card.status` (`active`/`paused`) | `NfcCard.active` |
| `Card.businessName` | `Customer.businessName` |
| `Card.targetUrl` | `Customer.googleReviewUrl` |
| `DailyPoint` (`nfc`, `qr`) | `CardStatsDaily` (`nfcCount`, `qrCount`) |

## Karten-IDs und Slugs

- Neue Slugs sind zufällig (`card_` + 6 Zeichen base32, ohne 0/1/i/l/o) und kollisionsfrei, nie aus dem Firmennamen abgeleitet.
- Kartennummern: nur `A–Z`, `0–9`, `-`, `_`, maximal 24 Zeichen. Keine Personennamen oder Geburtsdaten.
- Die Demo-Slugs `demo-baeckerei` und `demo-barbershop` enthalten Firmennamen (keine Personennamen) und bleiben bestehen.
