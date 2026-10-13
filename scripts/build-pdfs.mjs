// Erzeugt dist/dokumente/agb.pdf und dist/dokumente/datenschutz.pdf (A4) direkt aus den Rechtstexten in src/legal/*.ts,
// also aus derselben Quelle wie die Seiten /agb/ und /datenschutz/ (kein zweiter Text). Der Renderer liegt in scripts/lib/legal-pdf.mjs
// (pdfkit, Standardschrift Helvetica/WinAnsi: kein Browser, keine Schriftdateien, keine externen Ressourcen, durchsuchbarer Text).
// Aufruf: node scripts/build-pdfs.mjs (Teil von `npm run build`, nach dem Vite-Build). Die Bestellbestätigung (worker/src/ordermail.js
// im Repo zugangsklar) hängt die PDFs per URL an: Dateinamen und Pfad nicht ändern.
// Frühere Fassungen liegen als feste PDFs unter public/dokumente/archiv/ (kommen per Vite-Kopie nach dist/dokumente/archiv/),
// siehe scripts/archive-legal.mjs und README.
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { agb } from '../src/legal/agb.ts'
import { datenschutz } from '../src/legal/datenschutz.ts'
import { renderLegalPdf } from './lib/legal-pdf.mjs'

const root = resolve(import.meta.dirname, '..')
const OUT = resolve(root, 'dist', 'dokumente')

const DOCS = [
  { file: 'agb', page: 'agb', doc: agb },
  { file: 'datenschutz', page: 'datenschutz', doc: datenschutz },
]

await mkdir(OUT, { recursive: true })
for (const { file, page, doc } of DOCS) {
  const r = await renderLegalPdf({ doc, page, target: resolve(OUT, `${file}.pdf`) })
  console.log(`pdfs: dokumente/${file}.pdf (${r.pages} Seiten)`)
}
