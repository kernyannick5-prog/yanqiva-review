import type { RefObject } from 'react'
import { STEPS } from './constants'
import { stepBar } from './timeline'

interface StepListProps {
  /** Anfangsfortschritt der Balken (Standbild). Danach übernimmt der Aufrufer die Balken (Web-Animation). */
  initialP: number
  /** Die drei Fortschrittsbalken; werden vom Aufrufer als Web-Animation angetrieben. */
  bars: RefObject<(HTMLSpanElement | null)[]>
  /** Aktiver Schritt. */
  active: number
  onSelect: (index: number) => void
}

/** Die drei Schritte als Buttons; Hervorhebung und Fortschrittsbalken folgen der Videozeit. Klick springt zum Schlüsselmoment im Video. */
export function StepList({ initialP, bars, active, onSelect }: StepListProps) {
  return (
    <ol aria-label="So funktioniert es in drei Schritten" className="flex gap-2 sm:gap-3 lg:flex-col lg:gap-1">
      {STEPS.map((step, index) => {
        const isActive = active === index
        return (
          <li key={step.title} className={`min-w-0 flex-1 transition-opacity duration-300 lg:flex-none ${isActive ? 'opacity-100' : 'opacity-85'}`}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={isActive ? 'step' : undefined}
              className={`group/step block w-full rounded-xl border text-left transition-[transform,background-color,border-color] duration-200 active:scale-[0.98] active:bg-wash ${
                isActive ? 'border-mint/35 bg-mint/[0.06]' : 'border-transparent hover:bg-wash-weak'
              } min-h-14 px-1.5 py-2 min-[400px]:px-2.5 lg:px-3 lg:py-3`}
            >
              <span className="flex items-center gap-1.5 min-[400px]:gap-2 lg:gap-3">
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-mint/50 bg-mint/10 font-display text-xs font-semibold text-mint max-[399px]:hidden min-[400px]:h-7 min-[400px]:w-7 min-[400px]:text-[13px] lg:h-8 lg:w-8 lg:text-sm"
                >
                  {index + 1}
                </span>
                <span className="truncate font-display text-[13px] font-semibold text-text min-[400px]:text-sm sm:text-base lg:text-lg">
                  {step.title}
                </span>
              </span>
              <span className="mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-edge-weak lg:ml-11 lg:w-[calc(100%-2.75rem)]">
                <span
                  ref={(el) => {
                    bars.current[index] = el
                  }}
                  className="block h-full origin-left bg-mint"
                  style={{ transform: `scaleX(${stepBar(initialP, index)})` }}
                />
              </span>
              <span className="mt-2 hidden pl-11 text-[15px] leading-relaxed text-muted lg:block">{step.text}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

const CAPTIONS = [
  'Eine stabile Acrylkarte, 12 × 12 cm.',
  'NFC-Chip zum Antippen, QR-Code zum Scannen.',
  'Ein Tipp mit dem Smartphone genügt.',
  'Die Bewertungsseite öffnet sich direkt. Ohne App, ohne Suchen.',
  'Fertig. In wenigen Sekunden.',
] as const

/** Gestapelte Kurztexte (alle echter Text; sichtbar ist jeweils einer, passend zur Videozeit). */
export function Captions({ index, className = '' }: { index: number; className?: string }) {
  return (
    <div className={`grid min-h-[3.1rem] font-display text-[1.0625rem] font-medium leading-snug text-text sm:min-h-[3.6rem] sm:text-xl ${className}`}>
      {CAPTIONS.map((text, i) => (
        <p
          key={text}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 transition-[opacity,transform] duration-300 ${i === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
          {i === CAPTIONS.length - 1 ? <span className="text-gradient">{text}</span> : text}
        </p>
      ))}
    </div>
  )
}
