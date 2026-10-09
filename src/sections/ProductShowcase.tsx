import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { lowPower } from '../lib/lowPower'
import { useTouchLayout } from '../lib/useTouchLayout'
import { Container, Eyebrow } from './ui'
import { Scene } from './showcase/Scene'
import { Captions, StepList } from './showcase/Steps'
import { STEP_TARGETS } from './showcase/constants'
import { useActiveStep, usePlayback, type PlayStatus } from './showcase/usePlayback'


const titleClass =
  'font-display text-[clamp(1.75rem,1.1rem+3vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-balance'

/** Auf niedrigen Desktop-Fenstern: Titel zusätzlich an die Höhe koppeln, damit die Spalte in den Sticky-Bereich passt. */
const shortTitle = '[@media(max-height:860px)]:text-[clamp(1.75rem,6.2svh,3.4rem)] [@media(max-height:860px)]:lg:mt-3'

function Heading({ fitHeight = false }: { fitHeight?: boolean }) {
  return (
    <>
      <Eyebrow>Das Produkt</Eyebrow>
      <h2 id="produkt-title" className={`mt-2.5 lg:mt-5 ${titleClass} ${fitHeight ? shortTitle : ''}`}>
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
        style={{ background: 'radial-gradient(closest-side, rgb(46 16 101 / 0.5), rgb(46 16 101 / 0))' }}
      />
      <div
        className="absolute right-[8%] top-[30%] h-[50vmin] w-[50vmin] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(94 234 212 / 0.08), rgb(94 234 212 / 0))' }}
      />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    </div>
  )
}

/** Desktop: Scroll-gesteuerte Sticky-Szene. Klick auf einen Schritt scrollt zu dessen Position. */
function FullShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  // Szene nur mounten, wenn die Sektion nahe am Viewport ist.
  const near = useInView(sectionRef, { margin: '100% 0px 100% 0px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4, restDelta: 0.0005 })
  const active = useActiveStep(p)

  const scrollToStep = (i: number) => {
    const el = sectionRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + range * Math.min(STEP_TARGETS[i], 0.98), behavior: 'smooth' })
  }

  return (
    <section id="produkt" ref={sectionRef} aria-labelledby="produkt-title" className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <StageBackdrop />
        <Container className="relative grid h-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-10 pb-8 pt-24">
          <div className="flex flex-col gap-8 [@media(max-height:860px)]:gap-5">
            <div>
              <Heading fitHeight />
            </div>
            <StepList p={p} active={active} onSelect={scrollToStep} layout="column" />
            <Captions p={p} className="lg:min-h-[4.5rem]" />
          </div>
          <div className="relative h-[min(680px,78svh)]">{near && <Scene p={p} />}</div>
        </Container>
      </div>
    </section>
  )
}

const iconProps = { viewBox: '0 0 24 24', className: 'size-[18px] shrink-0', fill: 'currentColor', 'aria-hidden': true } as const

function PlayIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  )
}
function ReplayIcon() {
  return (
    <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 1 0 2.6-5.9" />
      <path d="M4 4.5V8.8h4.3" />
    </svg>
  )
}

const PLAY_LABEL: Record<PlayStatus, string> = {
  idle: 'Abspielen',
  playing: 'Pause',
  paused: 'Weiter',
  done: 'Nochmal ansehen',
}

function PlayButton({ status, onClick }: { status: PlayStatus; onClick: () => void }) {
  const icon = status === 'playing' ? <PauseIcon /> : status === 'done' ? <ReplayIcon /> : <PlayIcon />
  return (
    <Button variant="ghost" onClick={onClick} className="min-w-[11.5rem]">
      {icon}
      {PLAY_LABEL[status]}
    </Button>
  )
}

/**
 * Touch/Tablet/schmal: keine Sticky-Choreografie. Zeitbasiert abgespielter Fortschritt (MotionValue),
 * Autoplay einmal bei ~50 % Sichtbarkeit, Tippen auf die Szene = von vorn, Schritte springen zum Schlüsselmoment.
 */
function TouchShowcase() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const near = useInView(sectionRef, { margin: '60% 0px 60% 0px' })
  const half = useInView(sceneRef, { amount: 0.5, once: true })
  const visible = useInView(sceneRef, { amount: 0.1 })
  const pb = usePlayback()
  const step = useActiveStep(pb.p)
  const { autoplay, pause, resume } = pb
  const autoPaused = useRef(false)

  // Einmal automatisch abspielen (~50 % sichtbar); verlässt die Szene den Viewport, pausieren.
  useEffect(() => {
    if (half) autoplay()
  }, [half, autoplay])
  useEffect(() => {
    if (!visible) autoPaused.current = pause()
    else if (autoPaused.current) {
      autoPaused.current = false
      resume()
    }
  }, [visible, pause, resume])

  return (
    <section id="produkt" ref={sectionRef} aria-labelledby="produkt-title" className="relative overflow-hidden py-10 sm:py-14">
      <StageBackdrop />
      <Container className="relative flex flex-col gap-3 sm:gap-4">
        <div>
          <Heading />
        </div>
        <div
          ref={sceneRef}
          onClick={pb.restart}
          className="relative -mx-5 h-[min(400px,47svh)] cursor-pointer select-none rounded-3xl focus-visible:outline-offset-[-3px] sm:-mx-8 sm:h-[min(520px,50svh)] lg:mx-auto lg:w-full lg:max-w-3xl"
        >
          {near && <Scene p={pb.p} />}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <PlayButton status={pb.status} onClick={pb.toggle} />
          <p className="text-center text-[13px] leading-snug text-faint">Tippe auf die Szene, um es nochmal zu sehen.</p>
        </div>
        <Captions p={pb.p} />
        <StepList p={pb.p} active={step} onSelect={pb.goStep} />
      </Container>
    </section>
  )
}

/** Lite: normale Sektion, statische Schrägansicht, fertiger Bewertungs-Screen. Schritte springen ohne Animation. */
function LiteShowcase() {
  const p = useMotionValue(1)
  const active = useActiveStep(p)
  const jump = (i: number) => p.set(STEP_TARGETS[i])
  return (
    <section id="produkt" aria-labelledby="produkt-title" className="section-y relative overflow-hidden">
      <StageBackdrop />
      <Container className="relative grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          <Reveal>
            <Heading />
          </Reveal>
          <Reveal delay={0.1}>
            <StepList p={p} active={active} onSelect={jump} />
          </Reveal>
          <Reveal delay={0.15}>
            <Captions p={p} />
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative -mx-5 h-[min(480px,112vw)] sm:-mx-8 lg:mx-0 lg:h-[560px]">
          <Scene p={p} lite />
        </Reveal>
      </Container>
    </section>
  )
}

export function ProductShowcase() {
  const [lite] = useState(lowPower)
  const touch = useTouchLayout()
  if (lite) return <LiteShowcase />
  return touch ? <TouchShowcase /> : <FullShowcase />
}
