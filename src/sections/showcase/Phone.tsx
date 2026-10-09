import { motion, useTransform, type MotionValue } from 'framer-motion'
import { Face } from './primitives'
import { NfcIcon } from './Stand'
import { P3D, STAR_GOLD } from './constants'

const PW = 160
const PH = 316
const PD = 10
const STAR_PATH = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z'

/** Einzelner Stern, der sich im Fenster [from, to] füllt (nur opacity/scale). */
function Star({ p, from, to }: { p: MotionValue<number>; from: number; to: number }) {
  const fill = useTransform(p, [from, to], [0, 1])
  const pop = useTransform(p, [from, (from + to) / 2, to], [0.85, 1.25, 1])
  return (
    <span className="relative block h-[26px] w-[26px]">
      <svg viewBox="0 0 24 24" className="absolute inset-0" fill="rgb(150 235 200 / 0.14)" stroke="rgb(150 235 200 / 0.35)" strokeWidth={1}>
        <path d={STAR_PATH} />
      </svg>
      <motion.svg viewBox="0 0 24 24" className="absolute inset-0" style={{ opacity: fill, scale: pop }} fill={STAR_GOLD}>
        <path d={STAR_PATH} />
      </motion.svg>
    </span>
  )
}

interface PhoneProps {
  /** Geglätteter Szenenfortschritt 0..1. */
  p: MotionValue<number>
  rotX: MotionValue<number>
  rotY: MotionValue<number>
  z: MotionValue<number>
}

/**
 * Neutrales CSS-Smartphone (4 Flächen, kein reales Modell): Sperrbildschirm -> NFC-Hinweis ->
 * generische Bewertungsmaske (Tipp auf den 5. Stern, Sterne füllen sich) -> Bestätigung.
 */
export function Phone({ p, rotX, rotY, z }: PhoneProps) {
  const bannerOpacity = useTransform(p, [0.595, 0.615], [0, 1])
  const bannerY = useTransform(p, [0.595, 0.62], [14, 0])
  const lockOpacity = useTransform(p, [0.63, 0.67], [1, 0])
  const formOpacity = useTransform(p, [0.63, 0.67, 0.805, 0.83], [0, 1, 1, 0])
  // Fingertipp auf den 5. Stern, danach füllen sich die Sterne nacheinander
  const touchOpacity = useTransform(p, [0.66, 0.672, 0.69, 0.71], [0, 0.9, 0.9, 0])
  const touchScale = useTransform(p, [0.66, 0.675], [1.5, 1])
  const rippleScale = useTransform(p, [0.672, 0.72], [1, 2.4])
  const rippleOpacity = useTransform(p, [0.672, 0.68, 0.72], [0, 0.6, 0])
  const textOpacity = useTransform(p, [0.74, 0.78], [0, 1])
  const sendScale = useTransform(p, [0.785, 0.8, 0.815], [1, 0.93, 1])
  const doneOpacity = useTransform(p, [0.825, 0.855], [0, 1])
  const doneScale = useTransform(p, [0.825, 0.87], [0.7, 1])
  const checkDraw = useTransform(p, [0.84, 0.89], [0, 1])
  const doneStars = useTransform(p, [0.87, 0.91], [0, 1])

  const edge = { style: { background: 'linear-gradient(90deg, rgb(120 200 170 / 0.6), rgb(18 64 52 / 0.9))' } }

  return (
    <div className="relative" style={{ width: PW, height: PH, perspective: 900 }}>
      <motion.div className={`absolute inset-0 ${P3D}`} style={{ rotateX: rotX, rotateY: rotY, z }}>
        <Face
          w={PW}
          h={PH}
          transform={`translateZ(${PD / 2}px)`}
          className="rounded-[28px] border border-white/25 bg-ink-950"
        >
          <div className="absolute inset-[6px] overflow-hidden rounded-[22px] bg-ink-900">
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(120% 70% at 50% 0%, rgb(52 211 153 / 0.3), transparent 60%)' }}
            />
            <div className="absolute left-1/2 top-[9px] z-10 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

            {/* Sperrbildschirm */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center px-4 pt-12 text-center"
              style={{ opacity: lockOpacity }}
            >
              <span className="font-display text-[44px] font-semibold leading-none tracking-tight text-text">12:30</span>
              <span className="mt-6 grid h-14 w-14 place-items-center rounded-full border border-mint/40 bg-mint/10">
                <NfcIcon className="h-7 w-7" />
              </span>
              <span className="mt-4 text-[13px] font-medium leading-snug text-muted">
                Halte dein Handy
                <br />
                an den Aufsteller
              </span>
              {/* Hinweis nach dem Antippen */}
              <motion.div
                className="absolute inset-x-2 bottom-3 rounded-2xl border border-mint/30 bg-ink-800/95 px-2 py-2.5"
                style={{ opacity: bannerOpacity, y: bannerY }}
              >
                <span className="flex items-center justify-center gap-1.5 font-display text-[11px] font-semibold leading-tight text-text">
                  <NfcIcon className="h-3.5 w-3.5" />
                  Link erkannt
                </span>
                <span className="mt-1.5 block whitespace-nowrap rounded-full bg-mint py-1 text-[10.5px] font-semibold leading-tight text-ink-950">
                  Jetzt bewerten
                </span>
              </motion.div>
            </motion.div>

            {/* Bewertungsmaske */}
            <motion.div className="absolute inset-0 flex flex-col px-3 pb-4 pt-9" style={{ opacity: formOpacity }}>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint to-violet-glow font-display text-[14px] font-bold text-ink-950">
                  B
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate font-display text-[11px] font-semibold leading-tight tracking-tight text-text">Bäckerei Müller</span>
                  <span className="block whitespace-nowrap text-[10.5px] leading-tight text-muted">Bewertungsseite</span>
                </span>
              </div>
              <p className="mt-4 text-center font-display text-[14.5px] font-semibold text-text">Wie war dein Besuch?</p>
              <div className="relative mt-3 flex justify-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} p={p} from={0.68 + i * 0.018} to={0.71 + i * 0.018} />
                ))}
                {/* Fingertipp (Mittelpunkt 5. Stern: 2 x 28 px rechts der Mitte) */}
                <motion.span
                  className="absolute top-[1px] h-6 w-6 rounded-full border border-white/70"
                  style={{ left: 'calc(50% + 44px)', scale: rippleScale, opacity: rippleOpacity }}
                />
                <motion.span
                  className="absolute top-[1px] h-6 w-6 rounded-full bg-white/45"
                  style={{ left: 'calc(50% + 44px)', scale: touchScale, opacity: touchOpacity }}
                />
              </div>
              <motion.div
                className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-left text-[12px] leading-snug text-text"
                style={{ opacity: textOpacity }}
              >
                Frische Brötchen und ein richtig nettes Team!
              </motion.div>
              <motion.div
                className="mt-auto grid h-10 place-items-center rounded-full bg-violet-glow/80 text-[13px] font-semibold text-white"
                style={{ scale: sendScale }}
              >
                Senden
              </motion.div>
            </motion.div>

            {/* Bestätigung */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-ink-900 px-4 text-center"
              style={{ opacity: doneOpacity }}
            >
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(90% 55% at 50% 38%, rgb(94 234 212 / 0.16), transparent 70%)' }}
              />
              <motion.span
                className="relative grid h-16 w-16 place-items-center rounded-full border border-mint/50 bg-mint/10"
                style={{ scale: doneScale }}
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="var(--color-mint)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" style={{ pathLength: checkDraw }} />
                </svg>
              </motion.span>
              <span className="relative mt-4 font-display text-[17px] font-semibold text-text">Danke!</span>
              <span className="relative mt-1 text-[12px] leading-snug text-muted">
                Deine Bewertung
                <br />
                wurde gesendet.
              </span>
              <motion.span className="relative mt-3 text-[15px] leading-none tracking-[0.14em]" style={{ color: STAR_GOLD, opacity: doneStars }}>
                ★★★★★
              </motion.span>
            </motion.div>
          </div>
        </Face>

        <Face
          w={PW}
          h={PH}
          transform={`rotateY(180deg) translateZ(${PD / 2}px)`}
          className="rounded-[28px] border border-white/15"
          style={{ background: 'linear-gradient(200deg, var(--color-indigo-deep), var(--color-ink-900))' }}
        >
          <div className="absolute left-1/2 top-4 flex h-[22px] w-[52px] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-white/15 bg-black/40">
            <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-ink-950" />
            <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-ink-950" />
          </div>
        </Face>
        <Face w={PD} h={PH - 40} transform={`rotateY(90deg) translateZ(${PW / 2}px)`} {...edge} />
        <Face w={PD} h={PH - 40} transform={`rotateY(-90deg) translateZ(${PW / 2}px)`} {...edge} />
      </motion.div>
    </div>
  )
}
