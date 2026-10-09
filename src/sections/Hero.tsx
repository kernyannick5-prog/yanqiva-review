import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect } from 'react'
import { LinkButton } from '../components/Button'
import { lowPower } from '../lib/lowPower'
import { useLoopVisible } from '../lib/useLoopVisible'
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
    <h1 className="font-display text-[clamp(2.35rem,1.2rem+7.2vw,5.75rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.words.map((w, wi) => {
            const i = n++
            const spaced = !w.endsWith('-') && wi < line.words.length - 1
            return (
              <span key={w} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${line.gradient ? 'text-gradient' : ''}`}
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: 0 }}
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
function NfcWaves({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      {[5, 9, 13].map((r, i) => (
        <path
          key={r}
          d={`M${5 + r * 0.45} ${12 - r * 0.8}a${r} ${r} 0 0 1 0 ${r * 1.6}`}
          className="yq-wave"
          style={{ animationDelay: `${i * 0.35}s` }}
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
  const sx = useSpring(mx, { stiffness: 90, damping: 18 })
  const sy = useSpring(my, { stiffness: 90, damping: 18 })
  const rotateX = useTransform(sy, (v) => 6 - v)

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
    <div className="legacy-palette [perspective:1200px]">
      <div className={reduce ? '' : 'yq-card-float'} style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          style={{ rotateX, rotateY: sx, transformStyle: 'preserve-3d' }}
          className="relative mx-auto aspect-[1.586/1] w-full max-w-[420px] overflow-hidden rounded-[22px] border border-white/15 bg-[linear-gradient(135deg,#1e1b4b_0%,#2e1065_55%,#0d1233_100%)] p-4 shadow-[0_40px_80px_-30px_rgb(139_92_246/0.6),0_0_0_1px_rgb(94_234_212/0.12)] sm:p-6"
        >
          <div aria-hidden className="absolute -right-10 -top-16 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(94_234_212/0.35),transparent)]" />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold tracking-[0.18em] sm:text-base">YANQIVA</span>
                <span className="rounded-full border border-mint/40 px-1.5 py-px text-[10px] font-semibold uppercase tracking-widest text-mint">Review</span>
              </div>
              <NfcWaves className="size-7 text-mint sm:size-8" />
            </div>

            <div>
              <Stars className="text-xl sm:text-2xl" />
              <p className="mt-1 font-display text-base font-medium leading-snug tracking-tight sm:text-xl">
                Wir freuen uns über
                <br />
                Ihre Bewertung
              </p>
            </div>

            <p className="flex items-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-mint">
              <span aria-hidden className="size-1.5 rounded-full bg-mint" />
              Hier kontaktlos bewerten
            </p>
          </div>

          {!reduce && (
            <span
              aria-hidden
              className="yq-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

/** Hero-Abschnitt mit Headline, CTAs und virtueller NFC-Karte. */
export function Hero() {
  const reduce = useReducedMotion() ?? false
  const loop = useLoopVisible<HTMLElement>()
  const parallax = !reduce && !lowPower && window.innerWidth >= 640
  const { scrollYProgress } = useScroll({ target: loop, offset: ['start start', 'end start'] })
  const cardY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -50 : 0])
  const chipA = useTransform(scrollYProgress, [0, 1], [0, parallax ? -110 : 0])
  const chipB = useTransform(scrollYProgress, [0, 1], [0, parallax ? 70 : 0])

  return (
    <section id="top" ref={loop} className="section-light relative overflow-x-clip pb-14 pt-24 sm:pb-20 sm:pt-36 lg:pb-32 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_40%,rgb(124_58_237/0.07),transparent),radial-gradient(ellipse_40%_50%_at_10%_20%,rgb(15_118_110/0.06),transparent)]" />
      <Container className="relative grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="chip mb-5 sm:mb-6"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-mint" />
            NFC + QR · Für Unternehmen
          </motion.p>

          <Headline reduce={reduce} />

          {/* Kein opacity-Fade: der Absatz ist das LCP-Element und soll sofort sichtbar sein */}
          <motion.p
            initial={reduce ? false : { y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:mt-6 sm:text-xl"
          >
            YANQIVA REVIEW verbindet NFC und QR-Code zu einem einfachen Bewertungssystem für Unternehmen.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="mt-7 flex gap-3 sm:mt-9 [&>a]:min-w-0 [&>a]:flex-1 [&>a]:px-3 [&>a]:text-sm sm:[&>a]:flex-none sm:[&>a]:px-6 sm:[&>a]:text-[15px]"
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
          className="relative mx-auto w-full max-w-[440px] px-1 py-2 sm:py-8 lg:mx-0 lg:ml-auto"
        >
          <div aria-hidden className="absolute inset-x-6 bottom-0 h-24 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.4),transparent)] opacity-80" />
          <NfcCard reduce={reduce} />

          {/* Mobil: Chips in einer Zeile unter der Karte (nichts überdeckt die Karte); ab sm als schwebende Chips */}
          <div className="relative mt-4 flex flex-wrap justify-center gap-2 sm:contents">
            <motion.div
              style={{ y: chipA }}
              className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm sm:absolute sm:-top-1 sm:-right-4 sm:py-2.5"
            >
              <span aria-hidden className="size-2 rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]" />
              <span className="font-medium">Beispiel: +32 Bewertungen</span>
            </motion.div>
            <motion.div
              style={{ y: chipB }}
              className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm sm:absolute sm:-bottom-1 sm:-left-4 sm:py-2.5"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-amber-500" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
              <span className="text-muted">Beispiel:</span>
              <span className="font-medium">4,8</span>
              <span className="text-muted">Ø Bewertung</span>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
