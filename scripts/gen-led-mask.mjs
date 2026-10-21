// Erzeugt src/led-mask.css: die Punktmaske der LED-Spirale (.yq-led-dots) als CSS-Verlaufsebenen statt als SVG-Bild.
// Aufruf: node scripts/gen-led-mask.mjs
//
// Warum: Ein mask-image mit SVG-Bild (data-URI) zählt für Chrome als LCP-Kandidat und wird auf schwachen Geräten erst
// Sekunden nach dem ersten Bild gemalt (gemessen bei 6x CPU-Drosselung und Slow 4G: LCP 4,7 s statt 2,3 s). Verläufe sind
// keine Bildressource, die Punkte sehen identisch aus. Jede Ebene ist ein kleines Kästchen um einen Punkt (mask-size/-position),
// es wird also nie die ganze Fläche pro Punkt gefüllt.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const N = 210 // Punkte
const TURNS = 3 // Windungen
const C = 300 // Mitte der 600 x 600 Einheiten

const sizes = []
const positions = []
for (let i = 0; i < N; i++) {
  const t = i / (N - 1)
  const a = t * TURNS * Math.PI * 2 - Math.PI / 2
  const r = 128 + 160 * t // Radius auf der Spirale: Punkte wachsen nach außen
  const x = C + r * Math.cos(a)
  const y = C + r * Math.sin(a)
  const rad = 1.7 + 2.4 * t // Punktradius
  const box = rad * 2 + 2
  sizes.push(`${(box / 6).toFixed(2)}% ${(box / 6).toFixed(2)}%`)
  // mask-position in % bezieht sich auf (Fläche minus Bildgröße)
  positions.push(`${(((x - box / 2) / (600 - box)) * 100).toFixed(2)}% ${(((y - box / 2) / (600 - box)) * 100).toFixed(2)}%`)
}

const images = Array(N).fill('var(--yq-dot)').join(',')
const sz = sizes.join(',')
const pos = positions.join(',')
const css = `/* Generiert von scripts/gen-led-mask.mjs, nicht von Hand ändern. */
.yq-led-dots {
  --yq-dot: radial-gradient(closest-side, #000 70%, transparent);
  -webkit-mask-image: ${images};
  mask-image: ${images};
  -webkit-mask-size: ${sz};
  mask-size: ${sz};
  -webkit-mask-position: ${pos};
  mask-position: ${pos};
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
`
writeFileSync(resolve(import.meta.dirname, '..', 'src', 'led-mask.css'), css)
console.log(`src/led-mask.css: ${(css.length / 1024).toFixed(1)} KB`)
