import { useSyncExternalStore } from 'react'

/** Touch-Layout: grober Zeiger ODER schmaler Viewport (< lg). Reagiert auf Änderungen (Rotation, Resize). */
const QUERY = '(pointer: coarse), (max-width: 1023.98px)'

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useTouchLayout(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}
