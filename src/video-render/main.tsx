/**
 * Nur Entwicklung (kein Teil des Site-Bundles): Rendert die 3D-Produktszene deterministisch zu einem beliebigen Zeitpunkt.
 * Wird von scripts/render-showcase-video.mjs aufgerufen: window.__setT(sekunden) setzt Fortschritt, pausiert alle CSS-Animationen
 * auf denselben Zeitpunkt und blendet am Schleifenrand weiß über, damit das Video nahtlos wiederholt.
 */
import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import { LazyMotion, domAnimation, motionValue } from 'framer-motion'
import '../index.css'
import { Aurora } from '../components/Led'
import { Scene } from '../sections/showcase/Scene'
import { progressAt } from '../sections/showcase/timeline'

declare global {
  interface Window {
    __setT: (t: number, total: number) => Promise<void>
    __ready: boolean
  }
}

const p = motionValue(0)
const FADE = 0.4

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()))

export function Stage() {
  useEffect(() => {
    window.__setT = async (t, total) => {
      p.set(progressAt(t))
      // Endlos-Loops (Aurora, LED, Kantenlicht) auf denselben Zeitpunkt setzen, statt sie laufen zu lassen
      for (const a of document.getAnimations()) {
        a.pause()
        a.currentTime = t * 1000
      }
      const fade = document.getElementById('fade')!
      const alpha = Math.max(0, 1 - t / FADE, 1 - (total - t) / FADE)
      fade.style.opacity = String(Math.min(1, alpha))
      await nextFrame()
      await nextFrame()
    }
    window.__ready = true
  }, [])
  return (
    <div className="section-light overflow-hidden" style={{ position: 'absolute', inset: 0 }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Aurora />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>
      {/* Innenabstand: Spirale, Smartphone und Chip sind größer als die logische Szene und sollen nicht am Rand abgeschnitten werden */}
      <div className="absolute" style={{ inset: new URLSearchParams(location.search).get('inset') ?? '3% 6%' }}>
        <Scene p={p} />
      </div>
      <div id="fade" className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: 1 }} />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <LazyMotion features={domAnimation} strict>
    <Stage />
  </LazyMotion>,
)
