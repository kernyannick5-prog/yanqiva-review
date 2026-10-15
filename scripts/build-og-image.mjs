// Erzeugt public/og-image.png (1200 x 630) für Link-Vorschauen (Open Graph / Twitter).
// Aufruf: npm run og-image  (nach Text- oder Designänderung; das PNG wird eingecheckt und mit veröffentlicht).
// Rendert HTML mit der echten Kartenfront (src/components/ReviewCardFace.tsx) und den lokalen Schriften, Screenshot per
// playwright-core mit dem installierten Chrome (Pfad per CHROME_PATH überschreibbar). Kein Google-Logo.
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { chromium } from 'playwright-core'

const root = resolve(import.meta.dirname, '..')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const font = (pkg) => readFileSync(resolve(root, `node_modules/@fontsource-variable/${pkg}/files/${pkg}-latin-wght-normal.woff2`)).toString('base64')

const vite = await createServer({ root, configFile: false, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom', esbuild: { jsx: 'automatic' } })
let card
try {
  const mod = await vite.ssrLoadModule('/src/components/ReviewCardFace.tsx')
  card = renderToStaticMarkup(createElement(mod.ReviewCardFace, { variant: 'weiss' }))
} finally {
  await vite.close()
}
const mark = readFileSync(resolve(root, 'public/favicon.svg'), 'utf8')

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:"Inter";src:url(data:font/woff2;base64,${font('inter')}) format("woff2");font-weight:100 900}
@font-face{font-family:"Space Grotesk";src:url(data:font/woff2;base64,${font('space-grotesk')}) format("woff2");font-weight:300 700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;background:#fff;font-family:Inter,sans-serif;color:#0b2c23}
.bar{position:absolute;left:0;top:0;bottom:0;width:14px;background:#0b2c23}
.brand{position:absolute;left:84px;top:89px;display:flex;align-items:center;gap:16px;font:700 24px "Space Grotesk";letter-spacing:.17em}
.brand svg{width:56px;height:56px}
h1{position:absolute;left:84px;top:196px;white-space:nowrap;font:700 54px/1.12 "Space Grotesk";letter-spacing:-.01em}
.sub{position:absolute;left:84px;top:344px;width:560px;font:400 26px/1.4 Inter;color:#3f5a50}
.pill{position:absolute;left:84px;top:510px;padding:12px 24px;border:2px solid #0b2c23;border-radius:999px;font:600 21px Inter}
.card{position:absolute;left:716px;top:112px;width:400px;height:400px;transform:rotate(6deg);filter:drop-shadow(0 28px 30px rgba(11,44,35,.22))}
.card svg{width:100%;height:100%;display:block}
.font-display{font-family:"Space Grotesk",Inter,sans-serif}.font-sans{font-family:Inter,sans-serif}
</style></head><body>
<div class="bar"></div>
<div class="brand">${mark}<span>YANQIVA REVIEW</span></div>
<h1>Google-Bewertungen<br>einfacher sammeln.</h1>
<p class="sub">NFC-Bewertungskarte mit QR-Code \u2013 pers\u00f6nlich \u00fcbergeben</p>
<div class="pill">NFC + QR \u00b7 F\u00fcr Unternehmen</div>
<div class="card">${card}</div>
</body></html>`

const browser = await chromium.launch({ executablePath: CHROME })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  const out = resolve(root, 'public/og-image.png')
  writeFileSync(out, png)
  console.log(`og-image.png: ${statSync(out).size} Bytes`)
} finally {
  await browser.close()
}
