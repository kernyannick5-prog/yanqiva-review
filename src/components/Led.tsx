import { m, type MotionStyle } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLoopVisible } from '../lib/useLoopVisible'

/**
 * Premium-Lichteffekte (reines CSS/SVG, keine Bibliothek). Alle Endlos-Loops nutzen nur transform/opacity und tragen die
 * Klasse .yq-loop (Low-Power, reduzierte Bewegung und „Animationen anhalten“ schalten sie auf einen statischen Zustand).
 */

/** Langsam wandernder Farbverlauf (Aurora): drei driftende Farbflächen + ein statischer Kegelverlauf (die frühere Dauerrotation kostete Bildrate, ohne sichtbar zu sein). Nur Verläufe, kein Blur-Filter. */
export function Aurora({ className = '', intensity = 1, still = false }: { className?: string; intensity?: number; still?: boolean }) {
  const ref = useLoopVisible<HTMLDivElement>()
  // still: statischer Verlauf ohne Animationen (z. B. hinter dem Video, das selbst bewegt ist)
  const anim = (names: string) => (still ? '' : `yq-loop ${names} `)
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity: intensity }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="aspect-square h-[150%] shrink-0"
          style={{
            background:
              'conic-gradient(from 0deg, rgb(44 91 217 / 0), rgb(44 91 217 / 0.11), rgb(20 184 166 / 0.12), rgb(124 58 237 / 0.1), rgb(44 91 217 / 0))',
            WebkitMaskImage: 'radial-gradient(closest-side, transparent 8%, #000 45%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, transparent 8%, #000 45%, transparent 100%)',
          }}
        />
      </div>
      <div
        className={`${anim('yq-aurora-a')}absolute -left-[12%] -top-[22%] h-[75%] w-[62%] rounded-full will-change-transform`}
        style={{ background: 'radial-gradient(closest-side, rgb(44 91 217 / 0.17), transparent)' }}
      />
      <div
        className={`${anim('yq-aurora-b')}absolute -right-[10%] top-[8%] h-[70%] w-[58%] rounded-full will-change-transform`}
        style={{ background: 'radial-gradient(closest-side, rgb(20 184 166 / 0.17), transparent)' }}
      />
      <div
        className={`${anim('yq-aurora-c')}absolute bottom-[-25%] left-[22%] h-[70%] w-[60%] rounded-full will-change-transform`}
        style={{ background: 'radial-gradient(closest-side, rgb(124 58 237 / 0.13), transparent)' }}
      />
    </div>
  )
}

interface LedSpiralProps {
  className?: string
  style?: MotionStyle
  /** Stil der Welle (z. B. von Szenenfortschritt gesteuert); ohne Angabe läuft die CSS-Endlos-Welle. */
  waveStyle?: MotionStyle
  /** Zusätzliche Elemente in der Punktmaske (z. B. einmalige Tap-Welle). */
  extra?: ReactNode
  dark?: boolean
}

/**
 * LED-Spirale: 210 Punkte auf einer dreiwindigen Spirale (Maske aus CSS-Verläufen, siehe led-mask.css; ein Layer). Ein umlaufender Farbverlauf-Komet bringt
 * die Punkte nacheinander zum Leuchten, eine Welle wickelt sich periodisch von innen nach außen. Muss quadratisch dimensioniert werden.
 */
export function LedSpiral({ className = '', style, waveStyle, extra, dark = false }: LedSpiralProps) {
  return (
    <m.div aria-hidden className={`pointer-events-none ${dark ? 'yq-led-dark' : ''} ${className}`} style={style}>
      <div className="yq-led-dots">
        <span className="yq-loop yq-spin-led yq-led-sweep will-change-transform" />
        <m.span className={`yq-led-wave ${waveStyle ? '' : 'yq-loop yq-led-wave-loop'}`} style={waveStyle} />
        {extra}
      </div>
    </m.div>
  )
}

/** Umlaufendes Kantenlicht als Ring über der Kartenkante. Eltern: position relative, border-radius, overflow hidden. */
export function EdgeLight({ className = '', style, dark = false }: { className?: string; style?: MotionStyle; dark?: boolean }) {
  return <m.span aria-hidden className={`yq-edge ${dark ? 'yq-edge-dark' : ''} ${className}`} style={style} />
}
