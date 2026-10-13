import { m, type HTMLMotionProps } from 'framer-motion'
import { staggerProps } from './staggerProps'

/** Block, der beim Sichtbarwerden gestaffelt erscheint (siehe staggerProps). */
export function StaggerItem({ index = 0, ...rest }: HTMLMotionProps<'div'> & { index?: number }) {
  return <m.div {...staggerProps(index)} {...rest} />
}
