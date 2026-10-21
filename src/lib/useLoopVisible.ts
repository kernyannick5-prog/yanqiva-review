import { useEffect, useRef } from 'react'

/**
 * Endlos-Animationen nur laufen lassen, solange der Container sichtbar ist (und der Tab im Vordergrund liegt).
 * Ref auf den Container setzen: der Hook schreibt data-loop="on|off" direkt ins DOM (ohne React-Re-Render),
 * CSS pausiert alle Animationen darin, solange data-loop="off" gesetzt ist (siehe index.css).
 */
export function useLoopVisible<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let inView = false
    const apply = () => {
      el.dataset.loop = inView && !document.hidden ? 'on' : 'off'
    }
    apply()
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      apply()
    }, { rootMargin: '80px' })
    io.observe(el)
    document.addEventListener('visibilitychange', apply)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', apply)
    }
  }, [])
  return ref
}
