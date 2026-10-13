// Erzeugt dist/dokumente/agb.pdf und dist/dokumente/datenschutz.pdf (A4) direkt aus den Rechtstexten in src/legal/*.ts,
// also aus derselben Quelle wie die Seiten /agb/ und /datenschutz/ (kein zweiter Text). Reine Node-Lösung (pdfkit, Standardschrift
// Helvetica/WinAnsi): kein Browser, keine Schriftdateien, keine externen Ressourcen, durchsuchbarer Text, wenige zehn KB je PDF.
// Aufruf: node scripts/build-pdfs.mjs (Teil von `npm run build`, nach dem Vite-Build). Die Bestellbestätigung (worker/src/ordermail.js
// im Repo zugangsklar) hängt die PDFs per URL an: Dateinamen und Pfad nicht ändern.
import { createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { finished } from 'node:stream/promises'
import PDFDocument from 'pdfkit'
import { agb } from '../src/legal/agb.ts'
import { datenschutz } from '../src/legal/datenschutz.ts'

const root = resolve(import.meta.dirname, '..')
const OUT = resolve(root, 'dist', 'dokumente')
const SITE = 'yanqiva-bewertung.de'
const PROVIDER = 'Yannick Kern (Einzelunternehmen „Yanqiva“), Waldstr. 3, 67361 Freisbach · E-Mail: support@yanqiva.de · Kleinunternehmer nach § 19 UStG'

const DOCS = [
  { file: 'agb', page: 'agb', doc: agb },
  { file: 'datenschutz', page: 'datenschutz', doc: datenschutz },
]

const M = { left: 56, right: 56, top: 64, bottom: 60 }
const INK = '#111111'
const MUTED = '#444444'
const ACCENT = '#0b3d91'
const FONT = 'Helvetica'
const BOLD = 'Helvetica-Bold'

// Standardschrift = WinAnsi (Windows-1252). Zeichen außerhalb würden als Müll erscheinen: lieber Build-Abbruch.
const WIN_ANSI_EXTRA = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ')
const normalize = (s) => s.replace(/[  ]/g, ' ').replace(/[‐‑]/g, '-').replace(/→/g, '->')
function assertEncodable(s, where) {
  for (const ch of s) {
    const c = ch.codePointAt(0)
    if (c < 0x20 && ch !== '\n') throw new Error(`${where}: Steuerzeichen U+${c.toString(16)}`)
    if (c > 0xff && !WIN_ANSI_EXTRA.has(ch)) throw new Error(`${where}: Zeichen "${ch}" (U+${c.toString(16)}) nicht in WinAnsi darstellbar`)
  }
}
const t = (s, where) => {
  const n = normalize(s)
  assertEncodable(n, where)
  return n
}

async function render({ file, page, doc }) {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: M,
    bufferPages: true,
    compress: true,
    info: {
      Title: `${doc.title} – YANQIVA REVIEW`,
      Author: 'Yannick Kern (Yanqiva)',
      Subject: `${doc.title}, ${doc.updated}`,
      Producer: 'YANQIVA REVIEW Build (pdfkit)',
      Creator: SITE,
    },
  })
  const target = resolve(OUT, `${file}.pdf`)
  const stream = pdf.pipe(createWriteStream(target))
  const W = pdf.page.width - M.left - M.right
  const bottomLimit = () => pdf.page.height - M.bottom
  const need = (h) => {
    if (pdf.y + h > bottomLimit()) pdf.addPage()
  }
  const where = `${file}.pdf`

  // Kopf der ersten Seite
  pdf.font(BOLD).fontSize(15).fillColor(ACCENT).text('YANQIVA', M.left, M.top, { lineBreak: false })
  const brandW = pdf.widthOfString('YANQIVA')
  pdf.font(BOLD).fontSize(9).text('REVIEW', M.left + brandW + 6, M.top + 4, { lineBreak: false })
  pdf.font(FONT).fontSize(8.5).fillColor(MUTED).text(t(PROVIDER, where), M.left, M.top + 24, { width: W })
  pdf.moveDown(0.5)
  pdf.moveTo(M.left, pdf.y).lineTo(M.left + W, pdf.y).lineWidth(1.5).strokeColor(ACCENT).stroke()
  pdf.moveDown(1.2)
  pdf.font(BOLD).fontSize(22).fillColor(INK).text(t(doc.title, where), M.left, pdf.y, { width: W, lineGap: 2 })
  pdf.moveDown(0.3)
  pdf.font(BOLD).fontSize(10.5).fillColor(MUTED).text(t(`${doc.updated} · ${SITE}`, where))
  pdf.moveDown(1)

  for (const c of doc.callouts) {
    const pad = 9
    pdf.font(BOLD).fontSize(10)
    const hTitle = pdf.heightOfString(t(c.title, where), { width: W - 2 * pad - 3 })
    pdf.font(FONT).fontSize(10)
    const hText = pdf.heightOfString(t(c.text, where), { width: W - 2 * pad - 3, lineGap: 2 })
    const h = hTitle + hText + 2 * pad + 4
    need(h + 6)
    const y = pdf.y
    pdf.rect(M.left, y, W, h).fill('#eef2fa')
    pdf.rect(M.left, y, 3, h).fill(ACCENT)
    pdf.font(BOLD).fontSize(10).fillColor(ACCENT).text(t(c.title, where), M.left + pad + 3, y + pad, { width: W - 2 * pad - 3 })
    pdf.font(FONT).fontSize(10).fillColor(INK).text(t(c.text, where), M.left + pad + 3, pdf.y + 4, { width: W - 2 * pad - 3, lineGap: 2 })
    pdf.x = M.left
    pdf.y = y + h + 10
  }

  for (const s of doc.sections) {
    pdf.font(BOLD).fontSize(13)
    const hh = pdf.heightOfString(t(s.heading, where), { width: W })
    need(hh + 60) // Überschrift nie allein am Seitenende
    pdf.moveDown(0.6)
    pdf.font(BOLD).fontSize(13).fillColor(ACCENT).text(t(s.heading, where), M.left, pdf.y, { width: W })
    pdf.moveDown(0.35)
    for (const b of s.blocks) {
      if (b.p) {
        pdf.font(FONT).fontSize(10).fillColor(INK).text(t(b.p, where), M.left, pdf.y, { width: W, lineGap: 2.2, align: 'left' })
        pdf.moveDown(0.6)
      }
      if (b.list) {
        for (const item of b.list) {
          const txt = t(item, where)
          pdf.font(FONT).fontSize(10)
          need(pdf.heightOfString(txt, { width: W - 16, lineGap: 2.2 }) + 2)
          const y = pdf.y
          pdf.fillColor(ACCENT).circle(M.left + 5, y + 5.2, 1.6).fill()
          pdf.fillColor(INK).text(txt, M.left + 16, y, { width: W - 16, lineGap: 2.2 })
          pdf.moveDown(0.25)
        }
        pdf.moveDown(0.4)
      }
      if (b.table) {
        const c1 = Math.round(W * 0.34)
        const c2 = W - c1
        const pad = 5
        const row = (cells, head) => {
          const fnt = (i) => (head || i === 0 ? BOLD : FONT)
          const hs = cells.map((x, i) => {
            pdf.font(fnt(i)).fontSize(9.5)
            return pdf.heightOfString(t(x, where), { width: (i ? c2 : c1) - 2 * pad, lineGap: 1.5 })
          })
          const h = Math.max(...hs) + 2 * pad
          need(h)
          const y = pdf.y
          if (head) pdf.rect(M.left, y, W, h).fill('#eef2fa')
          pdf.lineWidth(0.5).strokeColor('#999999').rect(M.left, y, c1, h).stroke().rect(M.left + c1, y, c2, h).stroke()
          cells.forEach((x, i) => {
            pdf.font(fnt(i)).fontSize(9.5).fillColor(INK)
            pdf.text(t(x, where), M.left + (i ? c1 : 0) + pad, y + pad, { width: (i ? c2 : c1) - 2 * pad, lineGap: 1.5 })
          })
          pdf.x = M.left
          pdf.y = y + h
        }
        row(b.table.head, true)
        for (const r of b.table.rows) row(r, false)
        pdf.moveDown(0.8)
      }
    }
  }

  // Fußzeile und Seitenzahlen auf allen Seiten (nachträglich, damit „Seite x von y“ stimmt)
  const range = pdf.bufferedPageRange()
  for (let i = range.start; i < range.start + range.count; i++) {
    pdf.switchToPage(i)
    const bm = pdf.page.margins.bottom
    pdf.page.margins.bottom = 0 // sonst löst Text unterhalb der Satzfläche einen Seitenumbruch aus
    const fy = pdf.page.height - 40
    pdf.moveTo(M.left, fy - 6).lineTo(M.left + W, fy - 6).lineWidth(0.5).strokeColor('#999999').stroke()
    pdf.font(FONT).fontSize(8).fillColor(MUTED)
    pdf.text(t(`YANQIVA REVIEW · ${doc.title} · ${doc.updated} · ${SITE}/${page}/`, where), M.left, fy, { width: W - 80, lineBreak: false })
    pdf.text(`Seite ${i + 1} von ${range.count}`, M.left + W - 80, fy, { width: 80, align: 'right', lineBreak: false })
    pdf.page.margins.bottom = bm
  }
  pdf.end()
  await finished(stream)
  return { file: `${file}.pdf`, pages: range.count }
}

await mkdir(OUT, { recursive: true })
for (const d of DOCS) {
  const r = await render(d)
  console.log(`pdfs: dokumente/${r.file} (${r.pages} Seiten)`)
}
