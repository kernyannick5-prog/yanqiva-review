const gridMask = 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 75%)'

/** Weiche Glow-Flächen als Radial-Gradients (kreisförmig, entsprechen den früheren Blobs). */
const glows = [
  'radial-gradient(circle 35vmax at 15% 25%, rgb(46 16 101 / 0.55), transparent)',
  'radial-gradient(circle 30vmax at 80% 45%, rgb(30 27 75 / 0.9), transparent)',
  'radial-gradient(circle 27.5vmax at 40% 95%, rgb(94 234 212 / 0.10), transparent)',
  'linear-gradient(180deg, #070a1f 0%, #0a0d2b 55%, #05071a 100%)',
].join(',')

/**
 * Fixierter Hintergrund. Bewusst vollständig statisch: ein einziger gerasterter Layer,
 * der beim Scrollen nur noch vom Compositor verschoben/gehalten wird (keine Dauer-Animation).
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-0" style={{ background: glows }} />
      <div className="bg-grid absolute inset-0" style={{ maskImage: gridMask, WebkitMaskImage: gridMask }} />
    </div>
  )
}
