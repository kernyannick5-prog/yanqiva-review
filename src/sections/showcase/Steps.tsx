import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { STEPS, STEP_WINDOWS } from './constants'

interface StepItemProps {
  p: MotionValue<number>
  index: number
  /** Lite: alle Schritte dauerhaft hervorgehoben. */
  allActive: boolean
}

function StepItem({ p, index, from, to, allActive }: StepItemProps & { from: number; to: number }) {
  const first = index === 0
  const last = index === STEPS.length - 1
  const opacity = useTransform(
    p,
    [first ? 0 : from - 0.04, from, to, last ? to : to + 0.03],
    [first ? 1 : 0.4, 1, 1, last ? 1 : 0.4],
  )
  const bar = useTransform(p, [from, to], [0, 1], { clamp: true })
  const step = STEPS[index]
  return (
    <motion.li
      className="min-w-0 flex-1 lg:flex-none"
      style={allActive ? undefined : { opacity }}
    >
      <div className="flex items-center gap-2 lg:gap-3">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-mint/50 bg-mint/10 font-display text-xs font-semibold text-mint lg:h-8 lg:w-8 lg:text-sm">
          {index + 1}
        </span>
        <span className="truncate font-display text-[13px] font-semibold text-text lg:text-lg">{step.title}</span>
      </div>
      <div className="mt-2 h-px w-full overflow-hidden bg-line lg:ml-11 lg:mt-3 lg:w-[calc(100%-2.75rem)]">
        <motion.div
          className="h-full origin-left bg-mint"
          style={allActive ? { transform: 'scaleX(1)' } : { scaleX: bar }}
        />
      </div>
      <p className="mt-2 hidden text-sm leading-relaxed text-muted lg:ml-11 lg:block">{step.text}</p>
    </motion.li>
  )
}

/** Die drei Schritte mit synchroner Hervorhebung (Fortschrittsanzeige). */
export function StepList({ p, allActive = false }: { p: MotionValue<number>; allActive?: boolean }) {
  return (
    <ol aria-label="So funktioniert es in drei Schritten" className="flex gap-3 lg:flex-col lg:gap-5">
      {STEPS.map((s, i) => (
        <StepItem key={s.title} p={p} index={i} from={STEP_WINDOWS[i][0]} to={STEP_WINDOWS[i][1]} allActive={allActive} />
      ))}
    </ol>
  )
}

interface FadeProps {
  p: MotionValue<number>
  /** [einblenden ab, voll sichtbar, ausblenden ab, ausgeblendet]; letzte beiden gleich = bleibt. */
  win: [number, number, number, number]
  children: ReactNode
}

/** Kurztext, der abhängig vom Fortschritt ein- und ausblendet. */
function Fade({ p, win, children }: FadeProps) {
  const [a, b, c, d] = win
  const opacity = useTransform(p, [a, b, c, d], [a === 0 ? 1 : 0, 1, 1, d >= 1 ? 1 : 0])
  const y = useTransform(p, [a, b, c, d], [a === 0 ? 0 : 10, 0, 0, d >= 1 ? 0 : -10])
  return (
    <motion.p className="col-start-1 row-start-1" style={{ opacity, y }}>
      {children}
    </motion.p>
  )
}

/** Gestapelte Kurztexte (alle echter Text; sichtbar ist jeweils einer). */
export function Captions({ p }: { p: MotionValue<number> }) {
  return (
    <div className="grid min-h-[3.25rem] font-display text-base font-medium leading-snug text-text sm:text-lg lg:min-h-[4.5rem] lg:text-xl">
      <Fade p={p} win={[0, 0.1, 0.14, 0.18]}>
        Glas, NFC-Chip und QR-Code in einem Aufsteller.
      </Fade>
      <Fade p={p} win={[0.14, 0.2, 0.31, 0.36]}>
        Dein Branding, dein Google-Link, sofort einsatzbereit.
      </Fade>
      <Fade p={p} win={[0.36, 0.42, 0.57, 0.62]}>
        Ein Tipp mit dem Smartphone genügt.
      </Fade>
      <Fade p={p} win={[0.62, 0.68, 0.82, 0.87]}>
        Die Bewertungsseite öffnet sich sofort. Ohne App, ohne Suchen.
      </Fade>
      <Fade p={p} win={[0.85, 0.9, 1, 1]}>
        <span className="text-gradient">Fertig. In unter 10 Sekunden.</span>
      </Fade>
    </div>
  )
}
