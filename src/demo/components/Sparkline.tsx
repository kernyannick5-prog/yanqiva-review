import { motion, useReducedMotion } from 'framer-motion'

interface SparklineProps {
  values: number[]
  className?: string
}

const W = 96
const H = 32

/** Mini-Trendlinie, die sich beim Sichtbarwerden einzeichnet. */
export function Sparkline({ values, className = 'h-8 w-24' }: SparklineProps) {
  const reduce = useReducedMotion()
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const d = values
    .map((v, i) => {
      const px = (i / Math.max(values.length - 1, 1)) * W
      const py = H - 3 - ((v - min) / range) * (H - 6)
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className={className} fill="none" preserveAspectRatio="none">
      <motion.path
        d={d}
        stroke="#5eead4"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 1.2, ease: 'easeOut', delay: 0.2 }}
      />
    </svg>
  )
}
