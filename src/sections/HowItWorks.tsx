import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { Container, Eyebrow, sectionTitle } from './ui'

/** Rahmen für eine Mini-Illustration; startet Animationen nur im Sichtbereich. */
function Stage({ children }: { children: (active: boolean, reduce: boolean) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-40px' })
  const reduce = useReducedMotion() ?? false
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative grid h-44 place-items-center overflow-hidden rounded-2xl border border-line bg-ink-900/60"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgb(139_92_246/0.22),transparent)]" />
      {children(inView && !reduce, reduce)}
    </div>
  )
}

const loop = { repeat: Infinity, ease: 'easeInOut' as const }

function MiniCard({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex h-[68px] w-24 flex-col justify-between rounded-lg border border-white/15 bg-[linear-gradient(135deg,#1e1b4b,#2e1065)] p-2 ${className}`}>
      <span className="font-display text-[8px] font-bold tracking-[0.18em]">YANQIVA</span>
      <span className="text-[9px] leading-none tracking-wider text-amber-300">★★★★★</span>
    </div>
  )
}

/** 01: Aufsteller fährt hoch. */
function IllustrationStand() {
  return (
    <Stage>
      {(active, reduce) => (
        <div className="relative flex h-32 w-28 items-end justify-center">
          <motion.div
            className="absolute bottom-3"
            animate={active ? { y: [40, 0, 0, 40], opacity: [0, 1, 1, 0] } : reduce ? { y: 0, opacity: 1 } : undefined}
            initial={{ y: reduce ? 0 : 40, opacity: reduce ? 1 : 0 }}
            transition={{ ...loop, duration: 4.5, times: [0, 0.3, 0.85, 1] }}
          >
            <MiniCard className="origin-bottom -rotate-6" />
          </motion.div>
          <div className="relative z-10 h-5 w-28 rounded-md border border-white/15 bg-ink-700" />
          <div aria-hidden className="absolute -bottom-1 h-4 w-24 rounded-full bg-violet-glow/40 blur-md" />
        </div>
      )}
    </Stage>
  )
}

/** 02: Smartphone nähert sich der Karte, Wellen pulsieren. */
function IllustrationTap() {
  return (
    <Stage>
      {(active, reduce) => (
        <div className="relative flex w-full max-w-[220px] items-center justify-between px-4">
          <motion.div
            className="relative z-10 h-24 w-12 rounded-xl border border-white/20 bg-ink-800 p-1"
            initial={{ x: reduce ? 50 : 0 }}
            animate={active ? { x: [0, 56, 56, 0] } : undefined}
            transition={{ ...loop, duration: 4.5, times: [0, 0.35, 0.8, 1] }}
          >
            <div className="h-full w-full rounded-lg bg-gradient-to-b from-indigo-deep to-violet-dark" />
            <span className="absolute left-1/2 top-1.5 h-1 w-4 -translate-x-1/2 rounded-full bg-ink-950" />
          </motion.div>
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute right-[74px] top-1/2 size-14 -translate-y-1/2 rounded-full border border-mint"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={active ? { opacity: [0, 0.9, 0], scale: [0.4, 1.6, 1.9] } : undefined}
              transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 + i * 0.6, repeatDelay: 1.2 }}
            />
          ))}
          <MiniCard className="rotate-3" />
        </div>
      )}
    </Stage>
  )
}

/** 03: Sterne füllen sich nacheinander. */
function IllustrationStars() {
  return (
    <Stage>
      {(active, reduce) => (
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="relative block size-8">
              <svg viewBox="0 0 24 24" className="absolute inset-0 text-white/15" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
              <motion.svg
                viewBox="0 0 24 24"
                className="absolute inset-0 text-amber-300 drop-shadow-[0_0_8px_rgb(252_211_77/0.6)]"
                fill="currentColor"
                initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.5 }}
                animate={active ? { opacity: [0, 0, 1, 1, 0], scale: [0.5, 0.5, 1.15, 1, 0.5] } : undefined}
                transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.08 + i * 0.1, 0.18 + i * 0.1, 0.9, 1] }}
              >
                <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
              </motion.svg>
            </span>
          ))}
        </div>
      )}
    </Stage>
  )
}

const steps = [
  { n: '01', title: 'Karte aufstellen', text: 'Platziere die NFC-Karte am Tresen, an der Kasse oder auf dem Tisch. Mehr Einrichtung braucht es nicht.', Illustration: IllustrationStand },
  { n: '02', title: 'Kunde tippt', text: 'Smartphone an die Karte halten oder den QR-Code scannen. Keine App, kein Login.', Illustration: IllustrationTap },
  { n: '03', title: 'Bewertung abgeben', text: 'Die Bewertungsseite öffnet sich direkt. Sterne wählen, ein paar Worte, fertig.', Illustration: IllustrationStars },
]

/** Drei Schritte mit Scroll-gefüllter Verbindungslinie. */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="how" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="how-title">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>So funktioniert’s</Eyebrow>
          <h2 id="how-title" className={`${sectionTitle} mt-4`}>
            Drei Schritte. Keine Reibung.
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-14">
          {/* Linie: mobil vertikal, ab lg horizontal */}
          <div aria-hidden className="absolute bottom-0 left-7 top-0 w-px -translate-x-1/2 bg-line lg:hidden">
            <motion.div className="h-full w-full origin-top bg-gradient-to-b from-mint to-violet-glow" style={{ scaleY: progress }} />
          </div>
          <div aria-hidden className="absolute left-7 right-0 top-7 hidden h-px -translate-y-1/2 bg-line lg:block">
            <motion.div className="h-full w-full origin-left bg-gradient-to-r from-mint to-violet-glow" style={{ scaleX: progress }} />
          </div>

          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map(({ n, title, text, Illustration }, i) => (
              <li key={n} className="relative pl-[72px] lg:pl-0">
                <span className="absolute left-0 top-0 block rounded-full bg-ink-900 lg:static lg:w-14">
                  <span className="glass grid size-14 place-items-center rounded-full font-display text-lg font-semibold text-mint">{n}</span>
                </span>
                <Reveal delay={i * 0.1}>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight lg:mt-6">{title}</h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{text}</p>
                  <div className="mt-5">
                    <Illustration />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
