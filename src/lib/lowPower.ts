/**
 * Schwache Geräte / Nutzerpräferenz -> Low-Power-Modus (keine Endlos-Loops, kein Parallax,
 * Lite-Variante der 3D-Szene). Einmalig beim Start ermittelt (reine Client-App).
 */
export function detectLowPower(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = nav.hardwareConcurrency
  const memory = nav.deviceMemory
  return reduced || (typeof cores === 'number' && cores > 0 && cores <= 2) || (typeof memory === 'number' && memory <= 2)
}

export const lowPower = detectLowPower()

/** Setzt data-lowpower auf <html>; CSS schaltet damit alle Endlos-Animationen ab. */
export function applyLowPowerAttribute() {
  if (lowPower) document.documentElement.dataset.lowpower = ''
}
