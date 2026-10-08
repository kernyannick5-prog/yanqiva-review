import { useRef, useState } from 'react'
import { useInView, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { Reveal } from '../components/Reveal'
import { lowPower } from '../lib/lowPower'
import { Container, Eyebrow } from './ui'
import { Scene } from './showcase/Scene'
import { Captions, StepList } from './showcase/Steps'

const titleClass =
  'font-display text-[clamp(1.6rem,6.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance'

function Heading() {
  return (
    <>
      <Eyebrow>Das Produkt</Eyebrow>
      <h2 id="produkt-title" className={`mt-3 lg:mt-5 ${titleClass}`}>
        <span className="block">Ein Aufsteller.</span>
        <span className="text-gradient block">Unzählige Bewertungen.</span>
      </h2>
    </>
  )
}

/** Weiche Hintergrund-Glows (statisch, ohne Blur-Filter). */
function StageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute left-1/2 top-[55%] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(46 16 101 / 0.55), rgb(46 16 101 / 0))' }}
      />
      <div
        className="absolute right-[8%] top-[30%] h-[50vmin] w-[50vmin] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(94 234 212 / 0.08), rgb(94 234 212 / 0))' }}
      />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    </div>
  )
}

/** Scroll-gesteuerte Sticky-Szene. */
function FullShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  // Szene nur mounten, wenn die Sektion nahe am Viewport ist.
  const near = useInView(sectionRef, { margin: '100% 0px 100% 0px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4, restDelta: 0.0005 })

  return (
    <section
      id="produkt"
      ref={sectionRef}
      aria-labelledby="produkt-title"
      className="relative h-[200vh] lg:h-[260vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <StageBackdrop />
        <Container className="relative flex h-full flex-col gap-3 pb-3 pt-[4.5rem] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10 lg:py-24">
          <div className="flex shrink-0 flex-col gap-3 lg:gap-8">
            <div>
              <Heading />
            </div>
            <StepList p={p} />
            <Captions p={p} />
          </div>
          <div className="relative min-h-0 flex-1 lg:h-[min(680px,78svh)] lg:flex-none">{near && <Scene p={p} />}</div>
        </Container>
      </div>
    </section>
  )
}

/** Lite: normale Sektion, statische Schrägansicht, fertiger Bewertungs-Screen. */
function LiteShowcase() {
  const p = useMotionValue(1)
  return (
    <section id="produkt" aria-labelledby="produkt-title" className="relative overflow-hidden py-20 sm:py-28">
      <StageBackdrop />
      <Container className="relative grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10">
        <div className="flex flex-col gap-8">
          <Reveal>
            <Heading />
          </Reveal>
          <Reveal delay={0.1}>
            <StepList p={p} allActive />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-display text-lg font-medium text-text sm:text-xl">
              <span className="text-gradient">Fertig. In unter 10 Sekunden.</span>
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative h-[min(460px,120vw)] lg:h-[560px]">
          <Scene p={p} lite />
        </Reveal>
      </Container>
    </section>
  )
}

export function ProductShowcase() {
  const [lite] = useState(lowPower)
  return lite ? <LiteShowcase /> : <FullShowcase />
}
