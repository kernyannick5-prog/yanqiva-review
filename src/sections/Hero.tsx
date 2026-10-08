import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'
import { LinkButton } from '../components/Button'
import { Container } from './ui'

const ease = [0.22, 1, 0.36, 1] as const

const lines: { words: string[]; gradient?: boolean }[] = [
  { words: ['Google-', 'Bewertungen.'] },
  { words: ['Ein', 'Tap', 'entfernt.'], gradient: true },
]

/** Zweizeilige Headline, Wörter fahren einzeln aus einer Maske hoch. */
function Headline({ reduce }: { reduce: boolean }) {
  let n = 0
  return (
    <h1 className="font-display text-[clamp(2.5rem,9.5vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.words.map((w, wi) => {
            const i = n++
            const spaced = !w.endsWith('-') && wi < line.words.length - 1
            return (
              <span key={w} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${line.gradient ? 'text-gradient' : ''}`}
                  initial={reduce ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease }}
                >
                  {w}
                </motion.span>
                {spaced && <span className="inline-block w-[0.25em]" />}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

/** NFC-Wellen-Symbol mit pulsierenden Bögen. */
function NfcWaves({ reduce, className = '' }: { reduce: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      {[5, 9, 13].map((r, i) => (
        <motion.path
          key={r}
          d={`M${5 + r * 0.45} ${12 - r * 0.8}a${r} ${r} 0 0 1 0 ${r * 1.6}`}
          animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

function Stars({ className = '' }: { className?: string }) {
  return (
    <span className={`tracking-[0.15em] text-amber-300 ${className}`} role="img" aria-label="5 von 5 Sternen">
      ★★★★★
    </span>
  )
}

/** Virtuelle NFC-Karte mit Schweben, Maus-Neigung und Glanz-Sweep. */
function NfcCard({ reduce }: { reduce: boolean }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const idle = useMotionValue(-7)
  const sx = useSpring(mx, { stiffness: 90, damping: 18 })
  const sy = useSpring(my, { stiffness: 90, damping: 18 })
  const rotateY = useTransform([sx, idle], ([a, b]: number[]) => a + b)
  const rotateX = useTransform(sy, (v) => 6 - v)

  useEffect(() => {
    if (reduce) return
    const controls = animate(idle, 7, { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    return () => controls.stop()
  }, [idle, reduce])

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 18)
      my.set((e.clientY / window.innerHeight - 0.5) * 14)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  return (
    <div className="[perspective:1200px]">
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative mx-auto aspect-[1.586/1] w-full max-w-[420px] overflow-hidden rounded-[22px] border border-white/15 bg-[linear-gradient(135deg,#1e1b4b_0%,#2e1065_55%,#0d1233_100%)] p-4 shadow-[0_40px_80px_-30px_rgb(139_92_246/0.6),0_0_0_1px_rgb(94_234_212/0.12)] sm:p-6"
        >
          <div aria-hidden className="absolute -right-10 -top-16 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(94_234_212/0.35),transparent)]" />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold tracking-[0.18em] sm:text-base">YANQIVA</span>
                <span className="rounded-full border border-mint/40 px-1.5 py-px text-[8px] font-semibold uppercase tracking-widest text-mint sm:text-[9px]">Review</span>
              </div>
              <NfcWaves reduce={reduce} className="size-7 text-mint sm:size-8" />
            </div>

            <div>
              <Stars className="text-xl sm:text-2xl" />
              <p className="mt-1 font-display text-[15px] font-medium leading-snug tracking-tight sm:text-xl">
                Wir freuen uns über
                <br />
                Ihre Bewertung
              </p>
            </div>

            <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-mint sm:text-xs">
              <span aria-hidden className="size-1.5 rounded-full bg-mint" />
              Hier kontaktlos bewerten
            </p>
          </div>

          {!reduce && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ x: '-150%' }}
              animate={{ x: '400%' }}
              transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3.5 }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Hero-Abschnitt mit Headline, CTAs und virtueller NFC-Karte. */
export function Hero() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50])
  const chipA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110])
  const chipB = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])

  return (
    <section id="top" ref={ref} className="relative overflow-x-clip pb-20 pt-32 sm:pt-40 lg:pb-32">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-mint"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-mint" />
            Demo · Prototyp
          </motion.p>

          <Headline reduce={reduce} />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl"
          >
            YANQIVA REVIEW verbindet NFC und QR-Code zu einem einfachen Bewertungssystem für Unternehmen.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <LinkButton href="#demo">Demo ansehen</LinkButton>
            <LinkButton href="#how" variant="ghost">So funktioniert’s</LinkButton>
          </motion.div>
        </div>

        <motion.div
          style={{ y: cardY }}
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="relative mx-auto w-full max-w-[440px] px-1 py-8 lg:mx-0 lg:ml-auto"
        >
          <div aria-hidden className="absolute inset-x-6 bottom-0 h-24 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.55),transparent)] opacity-80" />
          <NfcCard reduce={reduce} />

          <motion.div
            style={{ y: chipA }}
            className="glass absolute -top-1 right-0 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm sm:-right-4"
          >
            <span aria-hidden className="size-2 rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]" />
            <span className="font-medium">+32 Bewertungen</span>
          </motion.div>
          <motion.div
            style={{ y: chipB }}
            className="glass absolute -bottom-1 left-0 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm sm:-left-4"
          >
            <span aria-hidden className="text-amber-300">★</span>
            <span className="font-medium">4,8</span>
            <span className="text-faint">Ø Bewertung</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
