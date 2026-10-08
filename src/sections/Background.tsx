import { motion, useReducedMotion } from 'framer-motion'

interface Blob {
  className: string
  color: string
  x: number[]
  y: number[]
  duration: number
}

const blobs: Blob[] = [
  { className: 'left-[-20%] top-[-10%] h-[70vmax] w-[70vmax]', color: 'rgb(46 16 101 / 0.55)', x: [0, 60, -20, 0], y: [0, 40, 70, 0], duration: 60 },
  { className: 'right-[-25%] top-[15%] h-[60vmax] w-[60vmax]', color: 'rgb(30 27 75 / 0.9)', x: [0, -70, 20, 0], y: [0, 50, -30, 0], duration: 70 },
  { className: 'bottom-[-25%] left-[10%] h-[55vmax] w-[55vmax]', color: 'rgb(94 234 212 / 0.10)', x: [0, 50, -40, 0], y: [0, -50, 20, 0], duration: 80 },
]

const gridMask = 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 75%)'

/** Fixierter Hintergrund: Gradients, langsame Glow-Blobs (nur transform), Grid mit Masken-Fade. */
export function Background() {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#070a1f_0%,#0a0d2b_55%,#05071a_100%)]" />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full will-change-transform ${b.className}`}
          style={{ background: `radial-gradient(closest-side, ${b.color}, transparent)` }}
          animate={reduce ? undefined : { x: b.x, y: b.y }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="bg-grid absolute inset-0" style={{ maskImage: gridMask, WebkitMaskImage: gridMask }} />
    </div>
  )
}
