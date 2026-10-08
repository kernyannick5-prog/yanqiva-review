import { motion, useReducedMotion } from 'framer-motion'
import { LinkButton } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { Container, Eyebrow } from './ui'

/** Abschluss-CTA mit starkem Glow. */
export function FinalCta() {
  const reduce = useReducedMotion()
  return (
    <section id="cta" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="cta-title">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.45),rgb(46_16_101/0.2)_55%,transparent)]"
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute left-1/2 top-1/2 h-[30vmax] w-[40vmax] max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(94_234_212/0.22),transparent)]" />
      </div>

      <Container>
        <Reveal className="glass relative mx-auto max-w-3xl rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <Eyebrow>Los geht’s</Eyebrow>
          <h2 id="cta-title" className="mt-5 font-display text-[clamp(2.1rem,6vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-balance">
            Bereit für mehr Bewertungen?
            <span className="text-gradient block">Mach es deinen Kunden einfach.</span>
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="#qr">YANQIVA REVIEW testen</LinkButton>
            <LinkButton href="#demo" variant="ghost">Demo öffnen</LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
