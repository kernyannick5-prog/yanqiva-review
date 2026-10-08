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
      <svg viewBox="0 0 24 24" className="absolute inset-0" fill="rgb(148 163 255 / 0.14)" stroke="rgb(148 163 255 / 0.35)" strokeWidth={1}>
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

/** CSS-Smartphone (4 Flächen): Sperrbildschirm -> Bewertungsmaske -> "Bewertung gesendet". */
export function Phone({ p, rotX, rotY, z }: PhoneProps) {
  const lockOpacity = useTransform(p, [0.58, 0.64], [1, 0])
  const formOpacity = useTransform(p, [0.58, 0.64], [0, 1])
  const textOpacity = useTransform(p, [0.7, 0.75], [0, 1])
  const sendOpacity = useTransform(p, [0.76, 0.79], [1, 0])
  const sentOpacity = useTransform(p, [0.78, 0.84], [0, 1])
  const sentScale = useTransform(p, [0.78, 0.84], [0.92, 1])

  const edge = { style: { background: 'linear-gradient(90deg, rgb(120 130 200 / 0.6), rgb(30 27 75 / 0.9))' } }

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
              style={{ background: 'radial-gradient(120% 70% at 50% 0%, rgb(139 92 246 / 0.35), transparent 60%)' }}
            />
            <div className="absolute left-1/2 top-2 z-10 h-[14px] w-[48px] -translate-x-1/2 rounded-full bg-black" />

            {/* Sperrbildschirm */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center px-4 pt-12 text-center"
              style={{ opacity: lockOpacity }}
            >
              <span className="font-display text-[44px] font-semibold leading-none tracking-tight text-text">9:41</span>
              <span className="mt-6 grid h-14 w-14 place-items-center rounded-full border border-mint/40 bg-mint/10">
                <NfcIcon className="h-7 w-7" />
              </span>
              <span className="mt-4 text-[13px] font-medium leading-snug text-muted">
                Halte dein Handy
                <br />
                an den Aufsteller
              </span>
            </motion.div>

            {/* Bewertungsmaske */}
            <motion.div className="absolute inset-0 flex flex-col px-3 pb-4 pt-9" style={{ opacity: formOpacity }}>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint to-violet-glow font-display text-[14px] font-bold text-ink-950">
                  B
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate font-display text-[11px] font-semibold leading-tight tracking-tight text-text">Bäckerei Müller</span>
                  <span className="block whitespace-nowrap text-[10.5px] leading-tight text-muted">Google Bewertung</span>
                </span>
              </div>
              <p className="mt-4 text-center font-display text-[14.5px] font-semibold text-text">Wie war dein Besuch?</p>
              <div className="mt-3 flex justify-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} p={p} from={0.64 + i * 0.02} to={0.68 + i * 0.02} />
                ))}
              </div>
              <motion.div
                className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-left text-[12px] leading-snug text-text"
                style={{ opacity: textOpacity }}
              >
                Frische Brötchen und ein richtig nettes Team!
              </motion.div>
              <div className="relative mt-auto h-10">
                <motion.div
                  className="absolute inset-0 grid place-items-center rounded-full bg-violet-glow/80 text-[13px] font-semibold text-white"
                  style={{ opacity: sendOpacity }}
                >
                  Senden
                </motion.div>
                <motion.div
                  className="absolute inset-0 grid place-items-center whitespace-nowrap rounded-full bg-mint text-[10.5px] font-semibold tracking-tight text-ink-950"
                  style={{ opacity: sentOpacity, scale: sentScale }}
                >
                  Bewertung gesendet ✓
                </motion.div>
              </div>
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
          <div className="absolute left-3 top-3 h-[52px] w-[52px] rounded-2xl border border-white/15 bg-black/40" />
        </Face>
        <Face w={PD} h={PH - 40} transform={`rotateY(90deg) translateZ(${PW / 2}px)`} {...edge} />
        <Face w={PD} h={PH - 40} transform={`rotateY(-90deg) translateZ(${PW / 2}px)`} {...edge} />
      </motion.div>
    </div>
  )
}
