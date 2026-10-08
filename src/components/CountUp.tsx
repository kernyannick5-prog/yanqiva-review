import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const fmt = (n: number, decimals: number) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/** Zählt beim Sichtbarwerden von 0 auf `to` hoch (deutsches Zahlenformat). */
export function CountUp({ to, decimals = 0, duration = 1.6, suffix = '' }: { to: number; decimals?: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setValue })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(value, decimals)}
      {suffix}
    </span>
  )
}
