import { sectionHref } from '../lib/sectionRoutes'
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { LinkButton } from '../components/Button'
import { Aurora, EdgeLight, LedSpiral } from '../components/Led'
import { MotionToggle } from '../components/MotionToggle'
import { ReviewCardFace } from '../components/ReviewCardFace'
import { CARD_IMAGE_NOTE } from '../order/catalog'
import { useLowPower } from '../lib/lowPower'
import { useReduceMotion } from '../lib/useReduceMotion'
import { useLoopVisible } from '../lib/useLoopVisible'
import { useMotionPaused } from '../lib/motionPause'
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

/** NFC-Bewertungskarte (Produktdesign, ohne Google-Logo): Schweben, Maus-Neigung mit Glanz, Kantenlicht, LED-Spirale; Tippen löst eine NFC-Lichtwelle aus. */
function NfcCard({ reduce }: { reduce: boolean }) {
  const paused = useMotionPaused()
  const lowPower = useLowPower()
  const still = reduce || paused
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 16, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 70, damping: 16, mass: 0.6 })
  const rotateX = useTransform(sy, (v) => 6 - v)
  const glare = useTransform(sx, [-9, 9], ['-60%', '120%'])
  const spiralX = useTransform(sx, (v) => v * -2.2)
  const spiralY = useTransform(sy, (v) => v * -2.2)
  const [shot, setShot] = useState(0)

  useEffect(() => {
    if (still || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      mx.set(0)
      my.set(0)
      return
    }
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 18)
      my.set((e.clientY / window.innerHeight - 0.5) * 14)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, still])

  return (
    <div className="legacy-palette relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[380px]" onPointerDown={still || lowPower ? undefined : () => setShot((n) => n + 1)}>
      {/* LED-Spirale hinter der Karte (150 % der Kartenbreite, mittig) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[124%] -translate-x-1/2 sm:w-[150%] -translate-y-1/2">
        <LedSpiral
          className="absolute inset-0"
          style={{ x: spiralX, y: spiralY }}
          extra={shot > 0 ? <span key={shot} className="yq-loop yq-led-wave yq-led-shot" /> : undefined}
        />
      </div>
      <div className="h-full w-full [perspective:1200px]">
        <div className={`h-full w-full ${still ? '' : 'yq-card-float'}`} style={{ transformStyle: 'preserve-3d' }}>
          <m.div
            style={{ rotateX, rotateY: sx, transformStyle: 'preserve-3d' }}
            className="relative h-full w-full overflow-hidden rounded-[22px] shadow-[0_40px_80px_-30px_rgb(11_44_35/0.55),0_0_0_1px_rgb(255_255_255/0.6),0_0_46px_-8px_rgb(44_91_217/0.35)]"
          >
            <ReviewCardFace className="block h-full w-full" />
            {/* Acrylkante: feiner heller Rand + umlaufendes Kantenlicht */}
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_2px_rgb(255_255_255/0.55)]" />
            <EdgeLight className="rounded-[22px]" />
            {!still && (
              <>
                <span
                  aria-hidden
                  className="yq-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <m.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ x: glare }}
                />
              </>
            )}
          </m.div>
        </div>
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
      <Aurora />
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
          {/* Ab lg in der Textspalte: dort kann kein schwebender Chip darüber wandern */}
          <p className="mt-6 hidden max-w-md text-[13px] leading-snug text-faint lg:block">{CARD_IMAGE_NOTE}</p>
        </div>

        <m.div
          style={{ y: cardY }}
          className="yq-in-pop relative mx-auto w-full max-w-[440px] px-1 py-2 sm:py-8 lg:mx-0 lg:ml-auto"
        >
          <div aria-hidden className="yq-loop yq-glow-pulse absolute inset-x-6 bottom-0 h-24 rounded-full bg-[radial-gradient(closest-side,rgb(44_91_217/0.4),transparent)] opacity-80" />
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

        {/* Hinweis zur Kartenabbildung: unter lg im Fluss unter der Karte, mit Abstand zu den Parallax-Chips */}
        <p className="-mt-2 text-center text-[13px] leading-snug text-faint sm:mt-6 lg:hidden">{CARD_IMAGE_NOTE}</p>
      </Container>
    </section>
  )
}
