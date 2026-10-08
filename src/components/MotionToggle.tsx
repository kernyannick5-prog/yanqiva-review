import { setMotionPaused, useMotionPaused } from '../lib/motionPause'

/** Schalter im Seitenfuß: stoppt alle automatisch laufenden Animationen und die simulierte Live-Aktivität. */
export function MotionToggle({ className = '' }: { className?: string }) {
  const paused = useMotionPaused()
  return (
    <button type="button" aria-pressed={paused} onClick={() => setMotionPaused(!paused)} className={className}>
      Animationen anhalten
    </button>
  )
}
