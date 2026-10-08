import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useMotionValue, useMotionValueEvent, type AnimationPlaybackControls, type MotionValue } from 'framer-motion'
import { STEP_TARGETS, TIMELINE, stepAt } from './constants'

export type PlayStatus = 'idle' | 'playing' | 'paused' | 'done'

const END = TIMELINE[TIMELINE.length - 1][1]

/** Zeitpunkt (s) im Zeitplan, an dem der Fortschritt `v` erreicht wird. */
function timeAt(v: number): number {
  for (let i = 0; i < TIMELINE.length; i++) {
    const [pv, pt] = TIMELINE[i]
    if (pv >= v) {
      if (i === 0 || pv === v) return pt
      const [lv, lt] = TIMELINE[i - 1]
      return lt + ((v - lv) / (pv - lv)) * (pt - lt)
    }
  }
  return END
}

/** Aktiver Schritt als React-State (wechselt nur bei Schrittwechsel, nicht pro Frame). */
export function useActiveStep(p: MotionValue<number>): number {
  const [step, setStep] = useState(() => stepAt(p.get()))
  const last = useRef(step)
  useMotionValueEvent(p, 'change', (v) => {
    const s = stepAt(v)
    if (s !== last.current) {
      last.current = s
      setStep(s)
    }
  })
  return step
}

/**
 * Zeitbasiertes Abspielen des Szenenfortschritts (0..1) per animate().
 * Der Fortschritt ist eine MotionValue; React-State nur für den Abspiel-Status.
 */
export function usePlayback() {
  const p = useMotionValue(0)
  const ctrl = useRef<AnimationPlaybackControls | null>(null)
  const [status, setStatusState] = useState<PlayStatus>('idle')
  const statusRef = useRef<PlayStatus>('idle')
  const [touched, setTouched] = useState(false)

  const setStatus = useCallback((s: PlayStatus) => {
    statusRef.current = s
    setStatusState(s)
  }, [])

  const playFrom = useCallback(
    (from: number) => {
      ctrl.current?.stop()
      const t0 = timeAt(from)
      const rest = TIMELINE.filter(([, t]) => t > t0 + 1e-6)
      const total = END - t0
      if (!rest.length || total <= 0) {
        setStatus('done')
        return
      }
      setStatus('playing')
      ctrl.current = animate(p, [from, ...rest.map(([v]) => v)], {
        duration: total,
        times: [0, ...rest.map(([, t]) => (t - t0) / total)],
        ease: 'easeInOut',
        onComplete: () => setStatus('done'),
      })
    },
    [p, setStatus],
  )

  /** Von vorn abspielen. */
  const restart = useCallback(() => {
    setTouched(true)
    p.set(0)
    playFrom(0)
  }, [p, playFrom])

  /** Button: Play / Pause / Weiter / Nochmal. */
  const toggle = useCallback(() => {
    setTouched(true)
    const s = statusRef.current
    if (s === 'playing') {
      ctrl.current?.pause()
      setStatus('paused')
    } else if (s === 'paused') {
      ctrl.current?.play()
      setStatus('playing')
    } else if (s === 'done' || p.get() >= 0.999) {
      p.set(0)
      playFrom(0)
    } else {
      playFrom(p.get())
    }
  }, [p, playFrom, setStatus])

  /** Automatisch (Autoplay), zählt nicht als Nutzerinteraktion. */
  const autoplay = useCallback(() => {
    if (statusRef.current === 'idle' && p.get() < 0.001) playFrom(0)
  }, [p, playFrom])

  /** Pausiert, falls gerade abgespielt wird (true = es wurde pausiert). */
  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return false
    ctrl.current?.pause()
    setStatus('paused')
    return true
  }, [setStatus])

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return
    ctrl.current?.play()
    setStatus('playing')
  }, [setStatus])

  /** Zum Schlüsselmoment eines Schritts animieren und dort halten. */
  const goStep = useCallback(
    (i: number) => {
      setTouched(true)
      ctrl.current?.stop()
      const target = STEP_TARGETS[i]
      const dist = Math.abs(target - p.get())
      const end = () => setStatus(target >= 1 ? 'done' : 'idle')
      if (dist < 0.004) {
        p.set(target)
        end()
        return
      }
      setStatus('idle')
      ctrl.current = animate(p, target, {
        duration: Math.min(1.8, Math.max(0.5, dist * 3.2)),
        ease: 'easeInOut',
        onComplete: end,
      })
    },
    [p, setStatus],
  )

  useEffect(() => () => ctrl.current?.stop(), [])

  return { p, status, touched, restart, toggle, autoplay, pause, resume, goStep }
}
