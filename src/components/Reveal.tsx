import { m, type HTMLMotionProps } from 'framer-motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
}

/** Blendet Inhalte beim Scrollen sanft ein (einmalig). */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </m.div>
  )
}
