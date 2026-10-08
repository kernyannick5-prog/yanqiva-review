import { useLayoutEffect, useEffect, useRef } from 'react'
import {
  easeInOut,
  motion,
  transform,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
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

const MAP = { ease: easeInOut } as const
const map = (v: number, input: number[], output: number[]) => transform(v, input, output, MAP)

/** Verknüpft zwei MotionValues zu einer abgeleiteten (kein React-State). */
function useCombine(a: MotionValue<number>, b: MotionValue<number>, fn: (a: number, b: number) => number) {
  return useTransform<number, number>([a, b], (v) => fn(v[0], v[1]))
}

/**
 * Komplette 3D-Szene. Alle Bewegungen laufen über MotionValues (transform/opacity),
 * es gibt keine React-State-Updates pro Frame. Rein dekorativ (aria-hidden).
 */
export function Scene({ p, lite = false }: SceneProps) {
  const areaRef = useRef<HTMLDivElement>(null)
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
  }, [k, scale])

  // Maus-Neigung (±6°), nur bei feinem Zeiger und nicht im Lite-Modus.
  const rawMx = useMotionValue(0)
  const rawMy = useMotionValue(0)
  const mx = useSpring(rawMx, { stiffness: 70, damping: 18, mass: 0.5 })
  const my = useSpring(rawMy, { stiffness: 70, damping: 18, mass: 0.5 })
  useEffect(() => {
    if (lite || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      rawMx.set((e.clientX / window.innerWidth) * 2 - 1)
      rawMy.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [lite, rawMx, rawMy])

  const endRotY = lite ? -18 : 5
  const baseRotY = useTransform(p, (v) => map(v, [0, 0.35, 0.6, 1], [-35, 0, 0, endRotY]))
  const baseRotX = useTransform(p, (v) => map(v, [0, 0.35, 1], [8, 4, 4]))
  const standRotY = useCombine(baseRotY, mx, (a, b) => a + b * 6)
  const standRotX = useCombine(baseRotX, my, (a, b) => a - b * 6)
  const glareX = useTransform(standRotY, [-45, 0, 14], [-110, 70, 200], { clamp: true })

  const standX = useCombine(p, k, (pv, kv) => map(pv, [0, 0.3, 0.6, 1], [0, 0, -(78 + 42 * kv), -(78 + 42 * kv)]))

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
  const phoneEndX = useTransform(k, (kv) => 123 + 7 * kv + 4 + 6 * kv)
  const phoneWrapX = useCombine(p, k, (pv, kv) =>
    map(pv, [0, 0.33, 0.6, 1], [330 + 250 * kv, 330 + 250 * kv, 123 + 7 * kv, 127 + 13 * kv]),
  )
  const phoneWrapY = useTransform(p, (v) => map(v, [0, 0.33, 0.6], [240, 240, -10]))
  const phoneOpacity = useTransform(p, [0.33, 0.42], [0, 1])
  const phoneBaseRotY = useTransform(p, (v) => map(v, [0.33, 0.6, 1], [-32, -14, lite ? -8 : -6]))
  const phoneBaseRotX = useTransform(p, (v) => map(v, [0.33, 0.6], [14, 6]))
  const phoneRotY = useCombine(phoneBaseRotY, mx, (a, b) => a + b * 6)
  const phoneRotX = useCombine(phoneBaseRotX, my, (a, b) => a - b * 6)
  const phoneZ = useTransform(p, [0.33, 0.6], [0, 40])

  // Ergebnis-Chip (85–100 %)
  const chipOpacity = useTransform(p, [0.85, 0.92], [0, 1])
  const chipY = useTransform(p, [0.85, 0.93], [12, 0])
  const chipScale = useTransform(p, [0.85, 0.93], [0.9, 1])

  return (
    <div ref={areaRef} aria-hidden className="absolute inset-0">
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ width: SCENE_W_WIDE, height: SCENE_H, marginLeft: -SCENE_W_WIDE / 2, marginTop: -SCENE_H / 2, scale }}
      >
        {/* Stand-Ebene: wandert beim Annähern des Phones nach links */}
        <motion.div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ x: standX }}>
          {/* mint Glow-Puls hinter dem Aufsteller */}
          <motion.div
            className="absolute h-[320px] w-[320px] rounded-full"
            style={{
              left: -160,
              top: NFC_CENTER_Y - 160,
              opacity: glowOpacity,
              scale: glowScale,
              background: 'radial-gradient(circle, rgb(94 234 212 / 0.5), rgb(94 234 212 / 0) 65%)',
            }}
          />
          {/* Bodenschatten + dezenter Violett-Schimmer */}
          <motion.div
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
          <Stand rotX={standRotX} rotY={standRotY} glareX={glareX} />
          {/* NFC-Wellen */}
          {rings.map((r, i) => (
            <motion.div
              key={i}
              className="absolute h-[120px] w-[120px] rounded-full border-2 border-mint"
              style={{ left: -60, top: NFC_CENTER_Y - 60, scale: r.scale, opacity: r.opacity }}
            />
          ))}
        </motion.div>

        {/* Smartphone */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ x: phoneWrapX, y: phoneWrapY, opacity: phoneOpacity }}
        >
          <div className="absolute" style={{ left: -80, top: -158 }}>
            <Phone p={p} rotX={phoneRotX} rotY={phoneRotY} z={phoneZ} />
          </div>
        </motion.div>

        {/* Ergebnis-Chip */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ x: phoneEndX, y: -196, opacity: chipOpacity, scale: chipScale }}
        >
          <motion.div
            className="absolute flex h-9 w-[150px] items-center justify-center gap-1.5 rounded-full border border-mint/50 bg-ink-800 font-display text-[14px] font-semibold text-mint"
            style={{ left: -75, top: -18, y: chipY, boxShadow: '0 0 0 1px rgb(94 234 212 / 0.2)' }}
          >
            <span aria-hidden>+1</span> Bewertung
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
