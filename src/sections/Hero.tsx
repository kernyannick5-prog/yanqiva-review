import { sectionHref } from '../lib/sectionRoutes'
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect } from 'react'
import { LinkButton } from '../components/Button'
import { MotionToggle } from '../components/MotionToggle'
import { ReviewCardFace } from '../components/ReviewCardFace'
import { useLowPower } from '../lib/lowPower'
import { useReduceMotion } from '../lib/useReduceMotion'
import { useLoopVisible } from '../lib/useLoopVisible'
import { Container } from './ui'

// Einblend-Animationen laufen als CSS (yq-in-*, siehe index.css) statt über framer-motion-Startwerte: Das vorgerenderte HTML ist damit
// sofort sichtbar und animiert ab dem ersten Frame, ohne auf JS und Hydration zu warten.

const lines: { words: string[]; gradient?: boolean }[] = [
  { words: ['Google-', 'Bewertungen.'] },
  { words: ['Ein', 'Tap', 'entfernt.'], gradient: true },
]

/** Zweizeilige Headline, Wörter fahren einzeln aus einer Maske hoch. */
function Headline() {
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
                <span className={`yq-in-word inline-block ${line.gradient ? 'text-gradient' : ''}`} style={{ animationDelay: `${(0.05 + i * 0.05).toFixed(2)}s` }}>
                  {w}
                </span>
                {spaced && <span className="inline-block w-[0.25em]" />}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

/** NFC-Bewertungskarte (Produktdesign, ohne Google-Logo) mit Schweben, Maus-Neigung und Glanz-Sweep. */
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
        <m.div
          style={{ rotateX, rotateY: sx, transformStyle: 'preserve-3d' }}
          className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-[22px] shadow-[0_40px_80px_-30px_rgb(11_44_35/0.55),0_0_0_1px_rgb(255_255_255/0.6)] sm:max-w-[380px]"
        >
          <ReviewCardFace className="block h-full w-full" />
          {/* Acrylkante: feiner heller Rand */}
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_2px_rgb(255_255_255/0.55)]" />
          {!reduce && (
            <span
              aria-hidden
              className="yq-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
        </m.div>
      </div>
    </div>
  )
}

/** Hero-Abschnitt mit Headline, CTAs und virtueller NFC-Karte. */
export function Hero() {
  const reduce = useReduceMotion()
  const lowPower = useLowPower()
  const loop = useLoopVisible<HTMLElement>()
  const parallax = !reduce && !lowPower && (typeof window === 'undefined' || window.innerWidth >= 640)
  const { scrollYProgress } = useScroll({ target: loop, offset: ['start start', 'end start'] })
  const cardY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -50 : 0])
  const chipA = useTransform(scrollYProgress, [0, 1], [0, parallax ? -110 : 0])
  const chipB = useTransform(scrollYProgress, [0, 1], [0, parallax ? 70 : 0])

  return (
    <section id="start" ref={loop} className="section-light relative overflow-x-clip pb-14 pt-24 sm:pb-20 sm:pt-36 lg:pb-32 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_40%,rgb(124_58_237/0.07),transparent),radial-gradient(ellipse_40%_50%_at_10%_20%,rgb(15_118_110/0.06),transparent)]" />
      <Container className="relative grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <p className="yq-in-fade chip mb-5 sm:mb-6">
            <span aria-hidden className="size-1.5 rounded-full bg-mint" />
            NFC + QR · Für Unternehmen
          </p>

          <Headline />

          {/* Kein opacity-Fade: der Absatz ist das LCP-Element und soll sofort sichtbar sein */}
          <p className="yq-in-rise mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:mt-6 sm:text-xl">
            YANQIVA REVIEW verbindet NFC und QR-Code zu einem einfachen Bewertungssystem für Unternehmen.
          </p>

          <div
            className="yq-in-fade yq-in-cta mt-7 flex gap-3 sm:mt-9 [&>a]:min-w-0 [&>a]:flex-1 [&>a]:px-3 [&>a]:text-sm sm:[&>a]:flex-none sm:[&>a]:px-6 sm:[&>a]:text-[15px]"
          >
            <LinkButton href={`${import.meta.env.BASE_URL}bestellen/`}>Jetzt bestellen</LinkButton>
            <LinkButton href={sectionHref('demo')} variant="ghost">Demo ansehen</LinkButton>
          </div>

          {/* WCAG 2.2.2: Pause-Schalter direkt bei den animierten Bereichen (zusätzlich zum Seitenfuß) */}
          <MotionToggle className="mt-4 min-h-6 rounded text-[13px] text-faint underline underline-offset-2 hover:text-text aria-pressed:text-mint" />
        </div>

        <m.div
          style={{ y: cardY }}
          className="yq-in-pop relative mx-auto w-full max-w-[440px] px-1 py-2 sm:py-8 lg:mx-0 lg:ml-auto"
        >
          <div aria-hidden className="absolute inset-x-6 bottom-0 h-24 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.4),transparent)] opacity-80" />
          <NfcCard reduce={reduce} />

          {/* Mobil: Chips in einer Zeile unter der Karte (nichts überdeckt die Karte); ab sm als schwebende Chips */}
          <div className="relative mt-4 flex flex-wrap justify-center gap-2 sm:contents">
            <m.div
              style={{ y: chipA }}
              className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm sm:absolute sm:-top-1 sm:-right-4 sm:py-2.5"
            >
              <span aria-hidden className="size-2 rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]" />
              <span className="font-medium">Beispiel (fiktiv): +32 Bewertungen</span>
            </m.div>
            <m.div
              style={{ y: chipB }}
              className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm sm:absolute sm:-bottom-1 sm:-left-4 sm:py-2.5"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-amber-500" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
              <span className="text-muted">Beispiel (fiktiv):</span>
              <span className="font-medium">4,8</span>
              <span className="text-muted">Ø Bewertung</span>
            </m.div>
          </div>
        </m.div>
      </Container>
    </section>
  )
}
