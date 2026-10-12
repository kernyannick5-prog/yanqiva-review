/**
 * Saubere Pfade für Startseiten-Sektionen (/preise/ statt /#preise), wie auf yanqiva.de.
 * Die Startseite bleibt eine Seite: Der Build liefert unter jedem Pfad dasselbe vorgerenderte HTML (scripts/prerender.mjs),
 * die App scrollt beim Laden bzw. beim Klick zur Sektion.
 */

/** Pfadsegment -> Element-ID der Sektion. Die Startseite selbst ("/") steht für #start. */
export const SECTION_IDS = {
  ablauf: 'ablauf',
  demo: 'demo',
  qr: 'qr',
  preise: 'preise',
  loslegen: 'loslegen',
} as const

export type SectionName = keyof typeof SECTION_IDS | 'start'

const BASE = import.meta.env.BASE_URL

/** Alte Sprungmarken -> Sektion. Die englischen stammen aus der Zeit vor Commit 18dfad4. */
const LEGACY_HASHES: Record<string, SectionName> = {
  '#start': 'start',
  '#top': 'start',
  '#ablauf': 'ablauf',
  '#how': 'ablauf',
  '#demo': 'demo',
  '#qr': 'qr',
  '#preise': 'preise',
  '#pricing': 'preise',
  '#loslegen': 'loslegen',
  '#cta': 'loslegen',
}

/** Link auf eine Sektion, z. B. sectionHref('preise') -> "/preise/"; 'start' -> Startseite. */
export function sectionHref(name: SectionName, base: string = BASE): string {
  return name === 'start' ? base : `${base}${name}/`
}

/** Sektion zu einem Pfad (mit oder ohne Slash am Ende), sonst null. Die Startseite ergibt 'start'. */
export function sectionFromPath(pathname: string, base: string = BASE): SectionName | null {
  if (!pathname.startsWith(base)) return null
  const rest = pathname.slice(base.length).replace(/\/+$/, '')
  if (rest === '') return 'start'
  return Object.hasOwn(SECTION_IDS, rest) ? (rest as SectionName) : null
}

/** Sektion zu einer alten Sprungmarke ("#preise", "#pricing", ...), sonst null. */
export function sectionFromLegacyHash(hash: string): SectionName | null {
  return Object.hasOwn(LEGACY_HASHES, hash) ? LEGACY_HASHES[hash] : null
}

export function sectionElementId(name: SectionName): string {
  return name === 'start' ? 'start' : SECTION_IDS[name]
}
