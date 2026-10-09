/**
 * Startdatum der Tätigkeit: YANQIVA REVIEW nimmt Bestellungen verbindlich erst ab diesem Tag an.
 * Bis dahin zeigt der Checkout einen Hinweis; ab dem Datum (Europe/Berlin) verschwindet er automatisch.
 * Identische Konstante im Worker (zugangsklar/worker/src/review.js: ORDER_START).
 */
export const ORDER_START = '2026-10-15'
export const ORDER_START_LONG = '15. Oktober 2026'

const berlinDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })

/** Kalendertag in Europe/Berlin als YYYY-MM-DD. */
export const berlinToday = (now: Date = new Date()): string => berlinDay.format(now)

/** true, solange das Startdatum noch nicht erreicht ist (Europe/Berlin). */
export const beforeOrderStart = (now: Date = new Date()): boolean => berlinToday(now) < ORDER_START
