/**
 * Struktur der Rechtstexte (Datenschutz, Impressum).
 * Inhalte liegen in datenschutz.ts / impressum.ts, gerendert von src/pages/LegalPage.tsx.
 *
 * Platzhalter wie „[Anschrift]“ werden im Fließtext in eckigen Klammern geschrieben;
 * der Renderer hebt jede [..]-Stelle automatisch als Platzhalter hervor.
 */
export interface LegalBlock {
  /** Absatz */
  p?: string
  /** Aufzählung */
  list?: string[]
  /** Zweispaltige Tabelle, z. B. „Daten | Zweck“ */
  table?: { head: [string, string]; rows: [string, string][] }
}

export interface LegalSection {
  id: string
  heading: string
  blocks: LegalBlock[]
}

export interface LegalCallout {
  tone: 'warning' | 'info'
  title: string
  text: string
  /** optionaler Link im Hinweis */
  link?: { label: string; href: string }
}

export interface LegalDoc {
  title: string
  /** Kurzer Untertitel, z. B. „Demo / Mustertext“ */
  badge: string
  updated: string
  /** Dateiname der PDF-Fassung unter /dokumente/ (erzeugt von scripts/build-pdfs.mjs), z. B. „agb.pdf“ */
  pdf?: string
  /** Pfad der Übersicht früherer Fassungen (PDF-Archiv, Dateien unter public/dokumente/archiv/), z. B. „dokumente/archiv/“. Erzeugt von scripts/archive-legal.mjs */
  archive?: string
  /** Hinweise ganz oben (Demo-Hinweis, tatsächliche Verarbeitung der Demo …) */
  callouts: LegalCallout[]
  sections: LegalSection[]
}
