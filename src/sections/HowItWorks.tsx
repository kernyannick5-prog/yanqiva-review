import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useLoopVisible } from '../lib/useLoopVisible'
import { Reveal } from '../components/Reveal'
import { Container, SectionHead } from './ui'

/** Rahmen für eine Mini-Illustration; die CSS-Loops pausieren, solange sie offscreen ist. */
function Stage({ children }: { children: ReactNode }) {
  const loop = useLoopVisible()
  return (
    <div
      ref={loop}
      aria-hidden
      className="relative grid h-40 place-items-center overflow-hidden rounded-2xl border border-line bg-ink-900/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] sm:h-44 lg:h-48"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,rgb(139_92_246/0.28),transparent)]" />
      {/* Statisch skaliert (kein Animations-Einfluss): Illustration fuellt den Rahmen auch auf kleinen Displays */}
      <div className="relative grid w-full origin-center scale-[1.25] place-items-center sm:scale-[1.2] lg:scale-[1.1]">{children}</div>
    </div>
  )
}

function MiniCard({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex h-[68px] w-24 flex-col justify-between rounded-lg border border-white/15 bg-[linear-gradient(135deg,#1e1b4b,#2e1065)] p-2 ${className}`}>
      <span className="font-display text-[9px] font-bold tracking-[0.16em]">YANQIVA</span>
      <span className="text-[10px] leading-none tracking-wider text-amber-300">★★★★★</span>
    </div>
  )
}

/** 01: Aufsteller fährt hoch. */
function IllustrationStand() {
  return (
    <Stage>
      <div className="relative flex h-32 w-28 items-end justify-center">
        <div className="yq-stand absolute bottom-3">
          <MiniCard className="origin-bottom -rotate-6" />
        </div>
        <div className="relative z-10 h-5 w-28 rounded-md border border-white/15 bg-ink-700" />
        <div aria-hidden className="absolute -bottom-1 h-8 w-32 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.45),transparent)]" />
      </div>
    </Stage>
  )
}

/** 02: Smartphone nähert sich der Karte, Wellen pulsieren. */
function IllustrationTap() {
  return (
    <Stage>
      <div className="relative flex w-full max-w-[220px] items-center justify-between px-4">
        <div className="yq-phone relative z-10 h-24 w-12 rounded-xl border border-white/20 bg-ink-800 p-1">
          <div className="h-full w-full rounded-lg bg-gradient-to-b from-indigo-deep to-violet-dark" />
          <span className="absolute left-1/2 top-1.5 h-1 w-4 -translate-x-1/2 rounded-full bg-ink-950" />
        </div>
        {[0, 1].map((i) => (
          <span
            key={i}
            className="yq-ripple absolute right-[74px] top-1/2 size-14 -translate-y-1/2 rounded-full border border-mint"
            style={{ animationDelay: `${1.2 + i * 0.6}s` }}
          />
        ))}
        <MiniCard className="rotate-3" />
      </div>
    </Stage>
  )
}

/** 03: Sterne füllen sich nacheinander. */
function IllustrationStars() {
  return (
    <Stage>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="relative block size-8">
            <svg viewBox="0 0 24 24" className="absolute inset-0 text-white/15" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
            <span className="yq-star absolute inset-0" style={{ '--yq-star': `yq-star-${i}` } as CSSProperties}>
              <span aria-hidden className="absolute -inset-2 rounded-full bg-[radial-gradient(closest-side,rgb(252_211_77/0.45),transparent)]" />
              <svg viewBox="0 0 24 24" className="relative size-full text-amber-300" fill="currentColor">
                <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
              </svg>
            </span>
          </span>
        ))}
      </div>
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
    <section id="how" className="section-y section-sep section-tint relative overflow-hidden" aria-labelledby="how-title">
      <Container>
        <Reveal>
          <SectionHead eyebrow="So funktioniert’s" id="how-title">
            Drei Schritte. Keine Reibung.
          </SectionHead>
        </Reveal>

        <div ref={ref} className="relative mt-9 sm:mt-14">
          {/* Linie: mobil vertikal, ab lg horizontal */}
          <div aria-hidden className="absolute bottom-0 left-7 top-0 w-px -translate-x-1/2 bg-line lg:hidden">
            <motion.div className="h-full w-full origin-top bg-gradient-to-b from-mint to-violet-glow" style={{ scaleY: progress }} />
          </div>
          <div aria-hidden className="absolute left-7 right-0 top-7 hidden h-px -translate-y-1/2 bg-line lg:block">
            <motion.div className="h-full w-full origin-left bg-gradient-to-r from-mint to-violet-glow" style={{ scaleX: progress }} />
          </div>

          <ol className="grid gap-10 sm:gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map(({ n, title, text, Illustration }, i) => (
              <li key={n} className="relative pl-[68px] lg:pl-0">
                <span className="absolute left-0 top-0 block rounded-full bg-ink-900 lg:static lg:w-14">
                  <span className="glass grid size-14 place-items-center rounded-full font-display text-lg font-semibold text-mint">{n}</span>
                </span>
                <Reveal delay={i * 0.1}>
                  <h3 className="mt-2 font-display text-[1.375rem] font-semibold tracking-tight sm:text-2xl lg:mt-6">{title}</h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted sm:text-base">{text}</p>
                  <div className="mt-4 sm:mt-5">
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
