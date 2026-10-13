/**
 * Zentrale Fristen für das Laufzeitende des Dashboards (YANQIVA REVIEW). Eine Stelle für Frontend und Rechtstexte.
 *
 * Gegenstück im Worker (Repo zugangsklar, worker/src/reviewrules.js): REMINDER_DAYS = [14, 3], RENEWAL_HINT_DAYS = REMINDER_DAYS[0].
 * Beim Ändern beide Seiten gemeinsam anpassen und die Rechtstexte (AGB Ziffer 8, Datenschutz Abschnitt 8) vorher archivieren
 * (`npm run archive-legal`, siehe README).
 */
/** Erinnerungs-E-Mails: so viele Tage vor Ablauf des Dashboard-Zugangs (früh, letzte). */
export const REMINDER_DAYS = [14, 3] as const
/** Verlängerungsfenster im Dashboard: ab so vielen Tagen vor Ablauf erscheinen Hinweis und „Verlängerung anfragen“ (= frühe Erinnerung). */
export const RENEWAL_WINDOW_DAYS: number = REMINDER_DAYS[0]
/** „14 und 3 Tage“ für Texte. */
export const REMINDER_DAYS_TEXT = `${REMINDER_DAYS[0]} und ${REMINDER_DAYS[1]} Tage`
