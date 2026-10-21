import { m, type MotionStyle } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLoopVisible } from '../lib/useLoopVisible'

/**
 * Premium-Lichteffekte (reines CSS/SVG, keine Bibliothek). Alle Endlos-Loops nutzen nur transform/opacity und tragen die
 * Klasse .yq-loop (Low-Power, reduzierte Bewegung und „Animationen anhalten“ schalten sie auf einen statischen Zustand).
 */

/** Langsam wandernder Farbverlauf (Aurora): drei driftende Farbflächen + ein träge rotierender Kegelverlauf. Nur Verläufe, kein Blur-Filter. */
export function Aurora({ className = '', intensity = 1 }: { className?: string; intensity?: number }) {
  const ref = useLoopVisible<HTMLDivElement>()
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity: intensity }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="yq-loop yq-spin-slow aspect-square h-[150%] shrink-0 will-change-transform"
          style={{
            background:
              'conic-gradient(from 0deg, rgb(44 91 217 / 0), rgb(44 91 217 / 0.11), rgb(20 184 166 / 0.12), rgb(124 58 237 / 0.1), rgb(44 91 217 / 0))',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 25%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, #000 25%, transparent 100%)',
          }}
        />
      </div>
      <div
        className="yq-loop yq-aurora-a absolute -left-[12%] -top-[22%] h-[75%] w-[62%] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, rgb(44 91 217 / 0.17), transparent)' }}
      />
      <div
        className="yq-loop yq-aurora-b absolute -right-[10%] top-[8%] h-[70%] w-[58%] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, rgb(20 184 166 / 0.17), transparent)' }}
      />
      <div
        className="yq-loop yq-aurora-c absolute bottom-[-25%] left-[22%] h-[70%] w-[60%] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, rgb(124 58 237 / 0.13), transparent)' }}
      />
    </div>
  )
}

/** Spiral-Punktmaske als SVG-Data-URI (einmalig berechnet, SSR-sicher). 600 x 600 Einheiten, Punkte wachsen nach außen. */
const SPIRAL_MASK = (() => {
  const n = 210
  const turns = 3
  const c = 300
  let d = ''
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const a = t * turns * Math.PI * 2 - Math.PI / 2
    const r = 128 + 160 * t
    const x = (c + r * Math.cos(a)).toFixed(1)
    const y = (c + r * Math.sin(a)).toFixed(1)
    const rad = (1.7 + 2.4 * t).toFixed(2)
    d += `<circle cx='${x}' cy='${y}' r='${rad}'/>`
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><g fill='black'>${d}</g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()

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
 * LED-Spirale: 210 Punkte auf einer dreiwindigen Spirale (eine Maske, ein Layer). Ein umlaufender Farbverlauf-Komet bringt
 * die Punkte nacheinander zum Leuchten, eine Welle wickelt sich periodisch von innen nach außen. Muss quadratisch dimensioniert werden.
 */
export function LedSpiral({ className = '', style, waveStyle, extra, dark = false }: LedSpiralProps) {
  return (
    <m.div aria-hidden className={`pointer-events-none ${dark ? 'yq-led-dark' : ''} ${className}`} style={style}>
      <div className="yq-led-dots" style={{ WebkitMaskImage: SPIRAL_MASK, maskImage: SPIRAL_MASK }}>
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
