import { POSTER_TIME, VIDEO_DURATION } from './constants'

const DURATION_MS = VIDEO_DURATION * 1000

/**
 * Hält kleine Fortschrittsanzeigen (Balken, Griff) als Web-Animationen im Gleichlauf mit der Videozeit.
 * Die Animationen laufen auf dem Compositor; JavaScript synchronisiert nur bei Play, Pause, Sprung und Abweichung,
 * nicht bei jedem Zeitupdate des Videos (das kostete auf schwachen Geräten spürbar Hauptthread-Zeit durch Style-Neuberechnung).
 */
export class TimeSync {
  private anims = new Set<Animation>()

  /** Meldet ein Element an; gibt eine Abmeldefunktion zurück. Ohne Web-Animations-API bleibt das Element statisch. */
  add(el: Element | null, keyframes: Keyframe[]): () => void {
    if (!el || typeof el.animate !== 'function') return () => {}
    const a = el.animate(keyframes, { duration: DURATION_MS, iterations: Infinity, easing: 'linear', fill: 'both' })
    a.pause()
    a.currentTime = POSTER_TIME * 1000
    this.anims.add(a)
    return () => {
      a.cancel()
      this.anims.delete(a)
    }
  }

  /** Auf Videozeit t (Sekunden) stellen; playing: weiterlaufen lassen, sonst dort anhalten. */
  sync(t: number, playing: boolean) {
    for (const a of this.anims) {
      a.currentTime = t * 1000
      if (playing) a.play()
      else a.pause()
    }
  }

  /** Abweichung (Sekunden) zwischen Animationen und Videozeit; Video-Schleifen werden berücksichtigt. */
  drift(t: number): number {
    for (const a of this.anims) {
      const cur = Number(a.currentTime ?? 0) % DURATION_MS
      const d = Math.abs(cur - t * 1000)
      return Math.min(d, DURATION_MS - d) / 1000
    }
    return 0
  }
}

/** Keyframes für ein Element, dessen transform aus der Videozeit abgeleitet wird (f: Zeit in s → transform-Text). */
export function sampleKeyframes(f: (t: number) => string, steps = 44): Keyframe[] {
  const frames: Keyframe[] = []
  for (let i = 0; i <= steps; i++) frames.push({ offset: i / steps, transform: f((i / steps) * VIDEO_DURATION) })
  return frames
}
