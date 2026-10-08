import { useSyncExternalStore } from 'react'

/**
 * Nutzerschalter „Animationen anhalten“ (WCAG 2.2.2). Der Zustand liegt als data-motion="paused"
 * auf <html>; CSS schaltet damit alle Endlos-Animationen ab, JS-Simulationen (Live-Feed) lesen ihn hier.
 * Wird bewusst nicht gespeichert (keine Cookies/kein Storage) und gilt nur für den aktuellen Besuch.
 */
const isPaused = () => typeof document !== 'undefined' && document.documentElement.dataset.motion === 'paused'

export function setMotionPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.motion = 'paused'
  else delete document.documentElement.dataset.motion
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
  return () => mo.disconnect()
}

export function useMotionPaused() {
  return useSyncExternalStore(subscribe, isPaused, () => false)
}
