import { useEffect, useRef } from 'react'

/**
 * Endlos-Animationen nur laufen lassen, solange der Container sichtbar ist.
 * Ref auf den Container setzen: der Hook schreibt data-loop="on|off" direkt ins DOM (ohne React-Re-Render),
 * CSS pausiert alle Animationen darin, solange data-loop="off" gesetzt ist (siehe index.css).
 */
export function useLoopVisible<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.dataset.loop = 'off'
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.loop = entry.isIntersecting ? 'on' : 'off'
    }, { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
