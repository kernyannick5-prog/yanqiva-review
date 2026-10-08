import { useLayoutEffect, useState, type RefObject } from 'react'

/** Misst die Breite eines Elements (ResizeObserver) – damit SVG-Diagramme 1:1 in Pixeln zeichnen und lesbar bleiben. */
export function useElementWidth(ref: RefObject<HTMLElement | null>, fallback: number) {
  const [width, setWidth] = useState(fallback)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(Math.round(el.clientWidth) || fallback)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, fallback])

  return width
}
