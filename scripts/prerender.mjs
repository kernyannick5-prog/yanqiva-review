// Befüllt nach dem Build dist/**/index.html mit vorgerendertem Markup (SSR-Bundle aus dist-ssr, siehe `npm run build`).
// Ergebnis: Inhalt (h1, main, Footer-Links) steht im ausgelieferten HTML; der Client hydriert (hydrateRoot).
import { createHash } from 'node:crypto'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

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
}
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
