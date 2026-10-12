// Befüllt nach dem Build dist/**/index.html mit vorgerendertem Markup (SSR-Bundle aus dist-ssr, siehe `npm run build`).
// Ergebnis: Inhalt (h1, main, Footer-Links) steht im ausgelieferten HTML; der Client hydriert (hydrateRoot).
import { createHash } from 'node:crypto'
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const PAGES = [
  ['index.html', 'home'],
  ['datenschutz/index.html', 'datenschutz'],
  ['impressum/index.html', 'impressum'],
  ['barrierefreiheit/index.html', 'barrierefreiheit'],
  ['agb/index.html', 'agb'],
]

const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

let homeHtml = ''
for (const [file, page] of PAGES) {
  const path = resolve(root, 'dist', file)
  let html = await readFile(path, 'utf8')
  const marker = /<div id="root"([^>]*)><\/div>/
  if (!marker.test(html)) throw new Error(`${file}: leeres #root nicht gefunden`)
  const markup = await render(page)
  html = html.replace(marker, (_m, attrs) => `<div id="root"${attrs}>${markup}</div>`)

  // Die Meta-CSP erlaubt kein 'unsafe-inline'. style="..." im vorgerenderten HTML (Startwerte der Animationen) wird daher
  // per 'unsafe-hashes' + SHA-256 des exakten Attributwerts freigegeben, nicht pauschal.
  const hashes = new Set()
  for (const m of markup.matchAll(/\sstyle="([^"]*)"/g)) hashes.add(`'sha256-${createHash('sha256').update(unescape(m[1])).digest('base64')}'`)
  if (hashes.size) {
    html = html.replace(/(style-src [^;"]*)/, `$1 'unsafe-hashes' ${[...hashes].join(' ')}`)
  }
  await writeFile(path, html)
  console.log(`prerender: ${file} (${(markup.length / 1024).toFixed(0)} KB, ${hashes.size} Style-Hashes)`)
  if (page === 'home') homeHtml = html
}

// Saubere Pfade für Startseiten-Sektionen (/preise/ usw., siehe src/lib/sectionRoutes.ts): dieselbe vorgerenderte Startseite mit eigenem
// <title> und eigener Meta-Description. Das canonical bleibt bewusst auf der Startseite (gleicher Inhalt = kein Duplicate Content);
// die Pfade stehen deshalb nicht in der Sitemap. Die App scrollt beim Laden zur Sektion.
const SECTION_PAGES = {
  ablauf: ['So funktioniert’s – YANQIVA REVIEW', 'So funktioniert YANQIVA REVIEW: NFC-Karte oder QR-Code antippen und Kunden landen direkt auf Ihrer Google-Bewertungsseite.'],
  demo: ['Dashboard-Demo – YANQIVA REVIEW', 'Klicken Sie sich durch die Dashboard-Demo: Aufrufe Ihrer NFC-Karten und QR-Codes ansehen, Ziel-Link ändern, Karten verwalten.'],
  qr: ['QR-Code und NFC ausprobieren – YANQIVA REVIEW', 'Scannen Sie den QR-Code oder tippen Sie mit dem Smartphone auf die NFC-Karte und sehen Sie, wie die Weiterleitung zu Google funktioniert.'],
  preise: ['Preise – YANQIVA REVIEW', 'YANQIVA REVIEW Klassik ab 60 € oder mit Dashboard für 99 €. Endpreise, Einrichtung inklusive, Lieferung im Raum Speyer bis Karlsruhe.'],
  loslegen: ['Jetzt loslegen – YANQIVA REVIEW', 'Jetzt YANQIVA REVIEW bestellen: mehr Google-Bewertungen per NFC-Karte und QR-Code, mit Einrichtung vor Ort im Raum Speyer bis Karlsruhe.'],
}
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const swap = (html, re, value) => {
  if (!re.test(html)) throw new Error(`Section-Seite: ${re} nicht gefunden`)
  return html.replace(re, (_m, a, b) => `${a}${value}${b ?? ''}`)
}
for (const [name, [title, description]] of Object.entries(SECTION_PAGES)) {
  if (description.length > 160) throw new Error(`${name}: Meta-Description zu lang (${description.length})`)
  let html = homeHtml
  html = swap(html, /(<title>)[^<]*(<\/title>)/, attr(title))
  html = swap(html, /(<meta name="description" content=")[^"]*(")/, attr(description))
  html = swap(html, /(<meta property="og:title" content=")[^"]*(")/, attr(title))
  html = swap(html, /(<meta property="og:description" content=")[^"]*(")/, attr(description))
  html = swap(html, /(<meta name="twitter:title" content=")[^"]*(")/, attr(title))
  html = swap(html, /(<meta name="twitter:description" content=")[^"]*(")/, attr(description))
  if (!html.includes('<link rel="canonical" href="https://yanqiva-bewertung.de/"')) throw new Error('canonical der Startseite fehlt')
  const out = resolve(root, 'dist', name, 'index.html')
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html)
  console.log(`prerender: ${name}/index.html (Startseite, canonical /)`)
}
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
