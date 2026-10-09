/**
 * Liefergebiet: YANQIVA REVIEW wird nur lokal an Unternehmen geliefert und persönlich übergeben.
 * Die PLZ-Liste (deliveryArea.json) existiert identisch im Worker (zugangsklar/worker/src/deliveryArea.json);
 * der Worker prüft die Lieferadresse zusätzlich serverseitig. Herleitung und Ortsliste: docs/LIEFERGEBIET.md.
 */
import area from './deliveryArea.json'

const ZIPS: Readonly<Record<string, string>> = area.zips

/** Kurzbeschreibung des Gebiets für Texte. */
export const DELIVERY_REGION = 'im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe'
export const DELIVERY_SHORT = 'Lieferung und Übergabe vor Ort im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe inklusive'

/** true, wenn die fünfstellige PLZ zum Liefergebiet gehört. */
export const inDeliveryArea = (zip: string): boolean => Object.prototype.hasOwnProperty.call(ZIPS, zip.trim())

/** Ortsname zur PLZ (nur Liefergebiet), sonst null. */
export const deliveryPlace = (zip: string): string | null => (inDeliveryArea(zip) ? ZIPS[zip.trim()] : null)

export const OUT_OF_AREA_MESSAGE =
  'Wir liefern derzeit nur im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe persönlich aus. Für andere Orte schreiben Sie uns bitte an support@yanqiva.de, wir prüfen gern, ob eine Lieferung möglich ist.'
