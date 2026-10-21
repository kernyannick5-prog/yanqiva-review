/**
 * Leistungswächter: Bleibt die Seite auf einem schwachen Gerät spürbar unter ca. 33 Bildern pro Sekunde, werden die rein dekorativen
 * Endlos-Animationen (Aurora, LED-Spirale, Kantenlicht, Schweben) dauerhaft abgeschaltet (data-lowpower, siehe index.css).
 * Inhalt, Video und Bedienung bleiben unverändert. Gemessen wird kurz per requestAnimationFrame, nie im Hintergrund-Tab.
 */

/** Median der Bildabstände in ms über `frames` Bilder, oder null, wenn der Tab währenddessen verborgen war. */
function sampleFrameTime(frames: number): Promise<number | null> {
  return new Promise((resolve) => {
    const dts: number[] = []
    let last = 0
    const step = (t: number) => {
      if (document.hidden) return resolve(null)
      if (last) dts.push(t - last)
      last = t
      if (dts.length >= frames) {
        dts.sort((a, b) => a - b)
        resolve(dts[dts.length >> 1])
      } else requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

/** Median-Bildabstand, ab dem als „zu langsam“ gilt (30 ms = ca. 33 Bilder pro Sekunde). */
const SLOW_MS = 30

/** Misst einmal kurz; ist die Seite zu langsam, wird der Low-Power-Modus gesetzt. */
export async function guardSmoothness(): Promise<void> {
  const root = document.documentElement
  if (root.hasAttribute('data-lowpower')) return
  const median = await sampleFrameTime(45)
  if (median !== null && median > SLOW_MS) root.dataset.lowpower = ''
}

/** Nach dem Laden (Hydration und Lazy-Chunks sind dann durch) einmal prüfen. */
export function guardAfterLoad(): void {
  const run = () => window.setTimeout(() => void guardSmoothness(), 2500)
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
}
