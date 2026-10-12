import { agb } from '../legal/agb'
import { barrierefreiheit } from '../legal/barrierefreiheit'
import { datenschutz } from '../legal/datenschutz'
import { impressum } from '../legal/impressum'

/** Rechtstexte je Seite; Schlüssel = data-doc am #root der jeweiligen index.html. */
export const LEGAL_DOCS = { datenschutz, impressum, barrierefreiheit, agb } as const
export type LegalDocKey = keyof typeof LEGAL_DOCS
