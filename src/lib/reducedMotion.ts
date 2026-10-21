import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** Betriebssystem-Einstellung „Bewegung reduzieren“. Server und erster Client-Render liefern false (kein Hydration-Mismatch). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}

/** Datensparmodus des Browsers (Network Information API, nicht überall verfügbar). */
export function saveDataEnabled(): boolean {
  // navigator.connection ist nicht in den DOM-Typen enthalten (nur Chromium)
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return c?.saveData === true
}
