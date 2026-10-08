import type { HTMLMotionProps } from 'framer-motion'

type RevealMotionProps = Pick<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition'>

/**
 * Erscheint beim Sichtbarwerden (einmalig); `index` staffelt Elemente, die gleichzeitig
 * ins Bild kommen. Die Verzögerung ist gedeckelt, damit weiter unten nichts „hängt“.
 */
export function staggerProps(index = 0): RevealMotionProps {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.5, delay: Math.min(index, 6) * 0.07, ease: [0.22, 1, 0.36, 1] },
  }
}
