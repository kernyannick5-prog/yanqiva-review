import { POSTER_TIME, VIDEO_DURATION } from './constants'

const DURATION_MS = VIDEO_DURATION * 1000

interface Entry {
  el: HTMLElement
  /** transform-Text zur Videozeit t (Sekunden) */
  f: (t: number) => string
  anim: Animation | null
}

/** Keyframes eines Elements, dessen transform aus der Videozeit abgeleitet wird. */
function sampleKeyframes(f: (t: number) => string, steps: number): Keyframe[] {
  const frames: Keyframe[] = []
  for (let i = 0; i <= steps; i++) frames.push({ offset: i / steps, transform: f((i / steps) * VIDEO_DURATION) })
  return frames
}

/**
 * Hält kleine Fortschrittsanzeigen (Balken) im Gleichlauf mit der Videozeit.
 * - Beim Abspielen laufen sie als Web-Animation auf dem Compositor; JavaScript synchronisiert nur bei Play, Pause, Sprung und Abweichung,
 *   nicht bei jedem Zeitupdate des Videos (ein React-Render oder Style-Schreiben pro Update kostete auf schwachen Geräten viel Hauptthread-Zeit).
 * - Im Stillstand gibt es keine Animation, nur einen festen transform-Wert (jede laufende oder pausierte Animation kostet pro Bild Style-Arbeit).
 * Gemessen wird bewusst sparsam: möglichst wenige gleichzeitig animierte Elemente anmelden.
 */
export class TimeSync {
  private entries = new Set<Entry>()
  private t = POSTER_TIME
  private playing = false
  private at = 0

  /** Aktuelle Videozeit (Sekunden), bei laufendem Video fortgeschrieben. */
  private now(): number {
    if (!this.playing) return this.t
    return (this.t + (performance.now() - this.at) / 1000) % VIDEO_DURATION
  }

  private apply(e: Entry, t: number, playing: boolean) {
    if (playing && typeof e.el.animate === 'function') {
      e.anim?.cancel()
      e.anim = e.el.animate(sampleKeyframes(e.f, 44), { duration: DURATION_MS, iterations: Infinity, easing: 'linear', fill: 'both' })
      e.anim.currentTime = t * 1000
    } else {
      e.anim?.cancel()
      e.anim = null
      e.el.style.transform = e.f(t)
    }
  }

  /** Meldet ein Element an (sofort im aktuellen Zustand); gibt eine Abmeldefunktion zurück. */
  add(el: HTMLElement | null, f: (t: number) => string): () => void {
    if (!el) return () => {}
    const e: Entry = { el, f, anim: null }
    this.entries.add(e)
    this.apply(e, this.now(), this.playing)
    return () => {
      e.anim?.cancel()
      this.entries.delete(e)
    }
  }

  /** Auf Videozeit t (Sekunden) stellen; playing: weiterlaufen lassen, sonst dort anhalten. */
  sync(t: number, playing: boolean) {
    this.t = t
    this.playing = playing
    this.at = performance.now()
    for (const e of this.entries) this.apply(e, t, playing)
  }

  /** Abweichung (Sekunden) zwischen laufenden Animationen und Videozeit; Video-Schleifen werden berücksichtigt. */
  drift(t: number): number {
    const d = Math.abs(this.now() - t)
    return Math.min(d, VIDEO_DURATION - d)
  }
}
