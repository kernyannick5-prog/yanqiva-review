import { useLayoutEffect, useEffect } from 'react'
import {
  cubicBezier,
  m,
  transform,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { LedSpiral } from '../../components/Led'
import { useLoopVisible } from '../../lib/useLoopVisible'
import { useMotionPaused } from '../../lib/motionPause'
import { Stand } from './Stand'
import { Phone } from './Phone'
import {
  NFC_CENTER_Y,
  SCENE_H,
  SCENE_H_USED,
  SCENE_W_NARROW,
  SCENE_W_WIDE,
  WIDE_BREAKPOINT,
} from './constants'

interface SceneProps {
  /** Szenenfortschritt 0..1 (bei lite konstant 1). */
  p: MotionValue<number>
  /** Lite: statische Schrägansicht, keine Maus-Neigung. */
  lite?: boolean
}

/** Weiche Standard-Kurve (sanfter Anlauf, lange Ausklingphase), Anfahrt mit starkem Ausklingen, Chip mit leichtem Überschwingen. */
const EASE = cubicBezier(0.45, 0, 0.15, 1)
const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1)
const EASE_POP = cubicBezier(0.34, 1.45, 0.64, 1)
const map = (v: number, input: number[], output: number[], ease = EASE) => transform(v, input, output, { ease })

/** Verknüpft zwei MotionValues zu einer abgeleiteten (kein React-State). */
function useCombine(a: MotionValue<number>, b: MotionValue<number>, fn: (a: number, b: number) => number) {
  return useTransform<number, number>([a, b], (v) => fn(v[0], v[1]))
}

/**
 * Komplette 3D-Szene. Alle Bewegungen laufen über MotionValues (transform/opacity),
 * es gibt keine React-State-Updates pro Frame. Rein dekorativ (aria-hidden).
 */
export function Scene({ p, lite = false }: SceneProps) {
  const areaRef = useLoopVisible<HTMLDivElement>()
  const paused = useMotionPaused()
  const scale = useMotionValue(0.6)
  /** 1 = breites Layout, 0 = schmal. */
  const k = useMotionValue(1)

  // Skalierung an die verfügbare Fläche anpassen (nur bei Größenänderung).
  useLayoutEffect(() => {
    const el = areaRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      const wide = w >= WIDE_BREAKPOINT ? 1 : 0
      k.set(wide)
      scale.set(Math.min(1.3, w / (wide ? SCENE_W_WIDE : SCENE_W_NARROW), h / SCENE_H_USED))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [k, scale, areaRef])

  // Maus-Neigung (±6°), nur bei feinem Zeiger und nicht im Lite-Modus.
  const rawMx = useMotionValue(0)
  const rawMy = useMotionValue(0)
  const mx = useSpring(rawMx, { stiffness: 60, damping: 17, mass: 0.6 })
  const my = useSpring(rawMy, { stiffness: 60, damping: 17, mass: 0.6 })
  useEffect(() => {
    // „Animationen anhalten“ und Lite: keine Maus-Neigung
    if (lite || paused || !window.matchMedia('(pointer: fine)').matches) {
      rawMx.set(0)
      rawMy.set(0)
      return
    }
    const onMove = (e: PointerEvent) => {
      rawMx.set((e.clientX / window.innerWidth) * 2 - 1)
      rawMy.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [lite, paused, rawMx, rawMy])

  const endRotY = lite ? -18 : 5
  const baseRotY = useTransform(p, (v) => map(v, [0, 0.35, 0.6, 1], [-35, 0, 0, endRotY]))
  const baseRotX = useTransform(p, (v) => map(v, [0, 0.35, 1], [8, 4, 4]))
  const standRotY = useCombine(baseRotY, mx, (a, b) => a + b * 6)
  const standRotX = useCombine(baseRotX, my, (a, b) => a - b * 6)
  const rotGlareX = useTransform(standRotY, [-45, 0, 14], [-110, 70, 200], { clamp: true })
  // Zum Schluss ein ruhiger Lichtreflex über die Platte (nicht im Lite-Modus, dort statisch).
  const glareX = useCombine(rotGlareX, p, (g, pv) => (lite ? g : map(pv, [0.88, 1], [g, 260])))

  const standX = useCombine(p, k, (pv, kv) => map(pv, [0, 0.3, 0.6, 1], [0, 0, -(88 + 42 * kv), -(88 + 42 * kv)]))

  // Boden: weicher Schatten, scale/opacity folgen der Rotation
  const shadowScale = useTransform(standRotY, [-40, 0, 40], [1.14, 1, 1.14], { clamp: true })
  const shadowOpacity = useTransform(standRotY, [-40, 0, 40], [0.75, 1, 0.75], { clamp: true })

  // Glow + NFC-Ringe um den Tap bei ~60 %
  const glowOpacity = useTransform(p, [0.56, 0.62, 0.74], [0, 0.95, 0])
  const glowScale = useTransform(p, [0.56, 0.62, 0.74], [0.6, 1, 1.5])
  const ring0Scale = useTransform(p, [0.6, 0.74], [0.5, 3])
  const ring0Opacity = useTransform(p, [0.6, 0.62, 0.74], [0, 0.8, 0])
  const ring1Scale = useTransform(p, [0.635, 0.775], [0.5, 3])
  const ring1Opacity = useTransform(p, [0.635, 0.655, 0.775], [0, 0.7, 0])
  const ring2Scale = useTransform(p, [0.67, 0.81], [0.5, 3])
  const ring2Opacity = useTransform(p, [0.67, 0.69, 0.81], [0, 0.6, 0])
  const rings = [
    { scale: ring0Scale, opacity: ring0Opacity },
    { scale: ring1Scale, opacity: ring1Opacity },
    { scale: ring2Scale, opacity: ring2Opacity },
  ]

  // Smartphone fährt von rechts/unten heran (35–60 %)
  const phoneEndX = useTransform(k, (kv) => 143 + 7 * kv + 4 + 6 * kv)
  const phoneWrapX = useCombine(p, k, (pv, kv) =>
    map(pv, [0, 0.33, 0.6, 1], [350 + 250 * kv, 350 + 250 * kv, 143 + 7 * kv, 147 + 13 * kv], EASE_OUT),
  )
  const phoneWrapY = useTransform(p, (v) => map(v, [0, 0.33, 0.6], [240, 240, -10], EASE_OUT))
  const phoneOpacity = useTransform(p, [0.33, 0.42], [0, 1])
  const phoneBaseRotY = useTransform(p, (v) => map(v, [0.33, 0.6, 1], [-32, -14, lite ? -8 : -6]))
  const phoneBaseRotX = useTransform(p, (v) => map(v, [0.33, 0.6], [14, 6]))
  const phoneRotY = useCombine(phoneBaseRotY, mx, (a, b) => a + b * 6)
  const phoneRotX = useCombine(phoneBaseRotX, my, (a, b) => a - b * 6)
  // Nach der Bestätigung tritt das Smartphone leicht zurück, die Karte bleibt im Fokus.
  const phoneZ = useTransform(p, (v) => map(v, [0.33, 0.6, 0.88, 1], [0, 40, 40, lite ? 40 : 8]))

  // Ergebnis-Chip (86–100 %)
  const chipOpacity = useTransform(p, [0.86, 0.92], [0, 1])
  const chipY = useTransform(p, [0.86, 0.93], [12, 0])
  const chipScale = useTransform(p, [0.86, 0.94], [0.8, 1], { ease: EASE_POP })

  // LED-Spirale hinter der Karte: leuchtet ab der Frontansicht auf, beim Tap (60 %) von innen nach außen gesteigert, am Ende ruhig
  const ledOpacity = useTransform(p, (pv) => (lite ? 0.8 : map(pv, [0, 0.12, 0.33, 0.56, 0.64, 0.8, 1], [0, 0.35, 0.6, 0.7, 1, 0.8, 0.7])))
  const ledScale = useTransform(p, [0, 0.35, 0.62, 0.8], [0.82, 1, 1.03, 1], { ease: EASE })
  const ledX = useTransform(mx, (v) => v * -14)
  const ledY = useTransform(my, (v) => v * -10)
  // Welle: Tap (60–78 %) und ein zweiter, sanfterer Durchlauf zur Bestätigung (86–98 %)
  const waveScale = useTransform(p, [0.58, 0.8, 0.86, 0.99], [0.46, 1.14, 0.5, 1.1], { ease: EASE })
  const waveRotate = useTransform(p, [0.58, 0.8, 0.86, 0.99], [0, 260, 260, 480], { ease: EASE })
  const waveOpacity = useTransform(p, [0.58, 0.63, 0.77, 0.8, 0.86, 0.89, 0.97, 0.99], [0, 1, 0.9, 0, 0, 0.8, 0.6, 0])
  // Kantenlicht der Karte wird beim Tap heller
  const edgeOpacity = useTransform(p, [0, 0.2, 0.56, 0.64, 0.82, 1], [0.35, 0.8, 0.9, 1, 0.9, 0.8])

  // Ruhige Schluss-Produktansicht: weicher Schein hinter der Karte
  const heroGlow = useTransform(p, [0.86, 1], [0, 1])

  return (
    <div ref={areaRef} aria-hidden className="legacy-palette absolute inset-0">
      <m.div
        className="absolute left-1/2 top-1/2"
        style={{ width: SCENE_W_WIDE, height: SCENE_H, marginLeft: -SCENE_W_WIDE / 2, marginTop: -SCENE_H / 2, scale }}
      >
        {/* Stand-Ebene: wandert beim Annähern des Phones nach links */}
        <m.div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ x: standX }}>
          {/* mint Glow-Puls hinter der Karte */}
          <m.div
            className="absolute h-[320px] w-[320px] rounded-full"
            style={{
              left: -160,
              top: NFC_CENTER_Y - 160,
              opacity: glowOpacity,
              scale: glowScale,
              background: 'radial-gradient(circle, rgb(94 234 212 / 0.5), rgb(94 234 212 / 0) 65%)',
            }}
          />
          {/* Schluss-Schein hinter der Karte */}
          <m.div
            className="absolute h-[380px] w-[340px] rounded-full"
            style={{
              left: -170,
              top: -220,
              opacity: heroGlow,
              background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.32), rgb(94 234 212 / 0.06) 60%, rgb(94 234 212 / 0))',
            }}
          />
          {/* Bodenschatten + dezenter Violett-Schimmer */}
          <m.div
            className="absolute h-[64px] w-[380px] rounded-[50%]"
            style={{
              left: -190,
              top: 130 + 14,
              scale: shadowScale,
              opacity: shadowOpacity,
              background: 'radial-gradient(closest-side, rgb(0 0 0 / 0.65), rgb(0 0 0 / 0))',
            }}
          />
          <div
            className="absolute h-[90px] w-[420px] rounded-[50%]"
            style={{
              left: -210,
              top: 130 + 4,
              background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.22), rgb(139 92 246 / 0))',
            }}
          />
          <div aria-hidden className="absolute" style={{ left: -220, top: 4 - 220, width: 440, height: 440 }}>
            <LedSpiral
              className="absolute inset-0"
              style={{ opacity: ledOpacity, scale: ledScale, x: ledX, y: ledY }}
              waveStyle={lite ? { opacity: 0 } : { scale: waveScale, rotate: waveRotate, opacity: waveOpacity }}
            />
          </div>
          <Stand p={p} rotX={standRotX} rotY={standRotY} glareX={glareX} edgeOpacity={edgeOpacity} />
          {/* NFC-Wellen */}
          {rings.map((r, i) => (
            <m.div
              key={i}
              className="absolute h-[120px] w-[120px] rounded-full border-2 border-mint"
              style={{ left: -60, top: NFC_CENTER_Y - 60, scale: r.scale, opacity: r.opacity }}
            />
          ))}
        </m.div>

        {/* Smartphone */}
        <m.div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ x: phoneWrapX, y: phoneWrapY, opacity: phoneOpacity }}
        >
          <div className="absolute" style={{ left: -80, top: -158 }}>
            <Phone p={p} rotX={phoneRotX} rotY={phoneRotY} z={phoneZ} />
          </div>
        </m.div>

        {/* Ergebnis-Chip */}
        <m.div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ x: phoneEndX, y: -196, opacity: chipOpacity, scale: chipScale }}
        >
          <m.div
            className="absolute flex h-9 w-[150px] items-center justify-center gap-1.5 rounded-full border border-mint/50 bg-ink-800 font-display text-[14px] font-semibold text-mint"
            style={{ left: -75, top: -18, y: chipY, boxShadow: '0 0 0 1px rgb(94 234 212 / 0.2)' }}
          >
            <span aria-hidden>+1</span> Bewertung
          </m.div>
        </m.div>
      </m.div>
    </div>
  )
}
