import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { STEPS, STEP_WINDOWS } from './constants'

export type StepLayout = 'row' | 'column'

interface StepItemProps {
  p: MotionValue<number>
  index: number
  active: boolean
  layout: StepLayout
  onSelect: (index: number) => void
}

function StepItem({ p, index, active, layout, onSelect }: StepItemProps) {
  const [from, to] = STEP_WINDOWS[index]
  const column = layout === 'column'
  const first = index === 0
  const last = index === STEPS.length - 1
  const opacity = useTransform(
    p,
    [first ? 0 : from - 0.04, from, to, last ? to : to + 0.03],
    [first ? 1 : 0.85, 1, 1, last ? 1 : 0.85],
  )
  const bar = useTransform(p, [from, to], [0, 1], { clamp: true })
  const step = STEPS[index]
  return (
    <motion.li className={column ? '' : 'min-w-0 flex-1'} style={{ opacity }}>
      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-current={active ? 'step' : undefined}
        className={`group/step block w-full rounded-xl border text-left transition-[transform,background-color,border-color] duration-200 active:scale-[0.98] active:bg-wash ${
          active ? 'border-mint/35 bg-mint/[0.06]' : 'border-transparent hover:bg-wash-weak'
        } ${column ? 'px-3 py-3' : 'min-h-14 px-1.5 py-2 min-[400px]:px-2.5'}`}
      >
        <span className={`flex items-center ${column ? 'gap-3' : 'gap-1.5 min-[400px]:gap-2'}`}>
          <span
            className={`grid shrink-0 place-items-center rounded-full border border-mint/50 bg-mint/10 font-display font-semibold text-mint ${
              column ? 'h-8 w-8 text-sm' : 'h-6 w-6 text-xs max-[399px]:hidden min-[400px]:h-7 min-[400px]:w-7 min-[400px]:text-[13px]'
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`truncate font-display font-semibold text-text ${
              column ? 'text-lg' : 'text-[13px] min-[400px]:text-sm sm:text-base'
            }`}
          >
            {step.title}
          </span>
        </span>
        <span className={`mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-edge-weak ${column ? 'lg:ml-11 lg:w-[calc(100%-2.75rem)]' : ''}`}>
          <motion.span className="block h-full origin-left bg-mint" style={{ scaleX: bar }} />
        </span>
        {column && (
          <span className="mt-2 block pl-11 text-[15px] leading-relaxed text-muted [@media(max-height:800px)]:hidden">{step.text}</span>
        )}
      </button>
    </motion.li>
  )
}

interface StepListProps {
  p: MotionValue<number>
  /** Aktiver Schritt (React-State, wechselt nur bei Schrittwechsel). */
  active: number
  onSelect: (index: number) => void
  /** row: drei Spalten (Touch/Tablet), column: untereinander mit Text (Desktop). */
  layout?: StepLayout
}

/** Die drei Schritte als Buttons mit synchroner Hervorhebung und Fortschrittsbalken. */
export function StepList({ p, active, onSelect, layout = 'row' }: StepListProps) {
  return (
    <ol aria-label="So funktioniert es in drei Schritten" className={layout === 'column' ? 'flex flex-col gap-1' : 'flex gap-2 sm:gap-3'}>
      {STEPS.map((s, i) => (
        <StepItem key={s.title} p={p} index={i} active={active === i} layout={layout} onSelect={onSelect} />
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
export function Captions({ p, className = "" }: { p: MotionValue<number>; className?: string }) {
  return (
    <div className={`grid min-h-[3.1rem] font-display text-[1.0625rem] font-medium leading-snug text-text sm:min-h-[3.6rem] sm:text-xl ${className}`}>
      <Fade p={p} win={[0, 0.08, 0.1, 0.13]}>
        Ein Aufsteller aus Glas, mit deinem Branding.
      </Fade>
      <Fade p={p} win={[0.1, 0.15, 0.34, 0.38]}>
        NFC-Chip zum Antippen, QR-Code zum Scannen.
      </Fade>
      <Fade p={p} win={[0.38, 0.42, 0.64, 0.68]}>
        Ein Tipp mit dem Smartphone genügt.
      </Fade>
      <Fade p={p} win={[0.64, 0.7, 0.82, 0.86]}>
        Die Bewertungsseite öffnet sich sofort. Ohne App, ohne Suchen.
      </Fade>
      <Fade p={p} win={[0.84, 0.9, 1, 1]}>
        <span className="text-gradient">Fertig. In unter 10 Sekunden.</span>
      </Fade>
    </div>
  )
}
