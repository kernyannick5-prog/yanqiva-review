import type { FieldKey } from './state'

/** DOM-IDs der Felder, Hinweise und Fehlermeldungen (für Labels, aria-describedby und Fokus). */
export const fieldId = (key: FieldKey) => `f-${key}`
export const errId = (key: FieldKey) => `f-${key}-err`
export const hintId = (key: FieldKey) => `f-${key}-hint`
