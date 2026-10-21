import { STEP_WINDOWS, TIMELINE } from './constants'

/** Weiche Kurve pro Teilstück (gleiche Werte wie beim Rendern des Videos): sanfter Anlauf, lange Ausklingphase. */
const BEZIER: readonly [number, number, number, number] = [0.45, 0, 0.15, 1]

function bezier(x: number): number {
  const [x1, y1, x2, y2] = BEZIER
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  let t = x
  for (let i = 0; i < 8; i++) {
    const err = ((ax * t + bx) * t + cx) * t - x
    if (Math.abs(err) < 1e-6) break
    const d = (3 * ax * t + 2 * bx) * t + cx
    if (Math.abs(d) < 1e-6) break
    t -= err / d
  }
  return ((ay * t + by) * t + cy) * t
}

/** Gesamtdauer der Szene in Sekunden (ohne Ein-/Ausblendung am Schleifenrand). */
export const SCENE_END = TIMELINE[TIMELINE.length - 1][1]

/** Szenenfortschritt (0..1) zum Zeitpunkt t (Sekunden). Identisch zur früheren Live-Animation. */
export function progressAt(t: number): number {
  if (t <= 0) return 0
  if (t >= SCENE_END) return 1
  for (let i = 1; i < TIMELINE.length; i++) {
    const [v1, t1] = TIMELINE[i]
    if (t <= t1) {
      const [v0, t0] = TIMELINE[i - 1]
      if (t1 === t0) return v1
      return v0 + (v1 - v0) * bezier((t - t0) / (t1 - t0))
    }
  }
  return 1
}

/** Frühester Zeitpunkt (s), an dem der Fortschritt v erreicht ist (für Sprung zu einem Schritt). */
export function timeAt(v: number): number {
  for (let i = 0; i < TIMELINE.length; i++) {
    const [pv, pt] = TIMELINE[i]
    if (pv >= v) {
      if (i === 0 || pv === v) return pt
      const [lv, lt] = TIMELINE[i - 1]
      return lt + ((v - lv) / (pv - lv)) * (pt - lt)
    }
  }
  return SCENE_END
}

/** Aktiver Kurztext (0..4) zum Fortschritt, deckungsgleich mit den früheren Überblendfenstern. */
export function captionAt(p: number): number {
  return p < 0.11 ? 0 : p < 0.36 ? 1 : p < 0.66 ? 2 : p < 0.85 ? 3 : 4
}

/** Fortschritt (0..1) eines Schritts bei Szenenfortschritt p. */
export const stepBar = (p: number, index: number) => {
  const [from, to] = STEP_WINDOWS[index]
  return Math.min(1, Math.max(0, (p - from) / (to - from)))
}
