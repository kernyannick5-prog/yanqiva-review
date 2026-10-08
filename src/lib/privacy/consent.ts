/**
 * Consent-Architektur (vorbereitet, NICHT aktiv).
 *
 * Die Demo setzt keine Cookies und erhebt keine Besucherdaten; es gibt daher weder
 * ein Consent-Banner noch einen gespeicherten Consent-Zustand. hasConsent() liefert
 * für alles außer 'necessary' fest false.
 *
 * Vor jeder Aktivierung von Analytics/Marketing sind zwingend nötig:
 *  1. ein Consent-Banner mit echter Wahlmöglichkeit (Ablehnen so einfach wie Zustimmen),
 *  2. Anpassung der Datenschutzerklärung (src/legal/datenschutz.ts) und des Privacy-Centers,
 *  3. eine Implementierung von hasConsent(), die den gespeicherten Consent liest.
 */
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

/** 'necessary' benötigt keine Einwilligung (keine Speicherung/Übermittlung). Alles andere: aus. */
export function hasConsent(category: ConsentCategory): boolean {
  return category === 'necessary'
}
