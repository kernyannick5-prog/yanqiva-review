/**
 * Analytics-Schnittstelle (vorbereitet, NICHT aktiv, nirgends aufgerufen).
 *
 * track() ist ein No-op. Es delegiert nur dann an einen Adapter, wenn
 *  - hasConsent('analytics') true ist UND
 *  - das Feature-Flag VITE_ANALYTICS_ENABLED === 'true' gesetzt ist (Standard: aus) UND
 *  - ein Adapter per setAnalyticsAdapter() registriert wurde.
 * Es gibt bewusst keine Adapter-Implementierung und keinen Drittanbieter.
 *
 * VOR AKTIVIERUNG: Consent-Banner einbauen, hasConsent() umsetzen und die
 * Datenschutzerklärung sowie das Privacy-Center anpassen.
 */
import { hasConsent } from './consent'

export interface AnalyticsEvent {
  /** Ereignisname, z. B. 'demo_card_created' – niemals personenbezogene Werte */
  name: string
  props?: Record<string, string | number | boolean>
}

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void
}

let adapter: AnalyticsAdapter | null = null

export function setAnalyticsAdapter(next: AnalyticsAdapter | null) {
  adapter = next
}

const flagEnabled = () => import.meta.env.VITE_ANALYTICS_ENABLED === 'true'

export function track(event: AnalyticsEvent): void {
  if (!flagEnabled() || !hasConsent('analytics') || !adapter) return
  adapter.track(event)
}
