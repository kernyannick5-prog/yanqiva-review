// Rendert die Produktszene (src/video-render) deterministisch Bild für Bild und kodiert daraus die Showcase-Videos in public/media/.
// Aufruf:  node scripts/render-showcase-video.mjs [--skip-render] [--posters-only] [--only=desktop|mobile]
// Voraussetzungen: Chrome (CHROME_PATH, Standard: Windows-Installation) und ffmpeg (FFMPEG, sonst "ffmpeg" im PATH).
// Frames landen in FRAMES_DIR (Standard: <tmp>/yq-showcase-frames), das Ergebnis in public/media/ (wird mit dem Build ausgeliefert).
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname, '..')
const out = join(root, 'public', 'media')
const framesRoot = process.env.FRAMES_DIR ?? join(tmpdir(), 'yq-showcase-frames')
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg'
const chromePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const FPS = 30
const POSTER_T = 2.3 // Standbild: Frontansicht der Karte (siehe POSTER_TIME in src/sections/showcase/constants.ts)
const TOTAL = 8.8 // 8 s Szene + Halten + Überblendung am Schleifenrand

// Ansichtsfenster (CSS-px) und Pixeldichte ergeben die Videogröße. Mobil: schmales Layout (< 560 px), Desktop: breites Layout.
const VARIANTS = {
  desktop: { w: 800, h: 500, dpr: 1.6, crf: 22, size: '1280x800', inset: '3% 6%' },
  mobile: { w: 400, h: 320, dpr: 2, crf: 22, size: '800x640', inset: '4% 11%' },
}

const args = process.argv.slice(2)
const skipRender = args.includes('--skip-render')
const postersOnly = args.includes('--posters-only')
const only = args.find((a) => a.startsWith('--only='))?.slice(7)

const run = (cmd, a) => {
  const r = spawnSync(cmd, a, { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' })
  if (r.status !== 0) throw new Error(`${cmd} ${a.join(' ')}\n${r.stderr}`)
}

mkdirSync(out, { recursive: true })
const names = only ? [only] : Object.keys(VARIANTS)

if (!skipRender) {
  const server = await createServer({ root, base: '/', server: { port: 5199, strictPort: true }, logLevel: 'error' })
  await server.listen()
  const browser = await chromium.launch({ executablePath: chromePath, headless: true })
  for (const name of names) {
    const v = VARIANTS[name]
    const dir = join(framesRoot, name)
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.dpr })
    const page = await ctx.newPage()
    await page.goto('http://localhost:5199/video-render/index.html?inset=' + encodeURIComponent(v.inset))
    await page.waitForFunction(() => window.__ready === true)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    const n = postersOnly ? 0 : Math.round(TOTAL * FPS)
    for (let i = 0; i < n; i++) {
      await page.evaluate(([t, total]) => window.__setT(t, total), [i / FPS, TOTAL])
      await page.screenshot({ path: join(dir, `f${String(i).padStart(4, '0')}.png`) })
    }
    // Standbild für Poster und Reduced-Motion
    await page.evaluate(([t, total]) => window.__setT(t, total), [POSTER_T, TOTAL])
    await page.screenshot({ path: join(framesRoot, `poster-${name}.png`) })
    await ctx.close()
    console.log(`frames ${name}: ${n}`)
  }
  // Poster als WebP (Chrome kodiert über Canvas, ffmpeg hat hier keinen WebP-Muxer)
  const conv = await browser.newPage()
  for (const name of names) {
    const png = readFileSync(join(framesRoot, `poster-${name}.png`)).toString('base64')
    const b64 = await conv.evaluate(async (src) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      c.getContext('2d').drawImage(img, 0, 0)
      const blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.86))
      const buf = new Uint8Array(await blob.arrayBuffer())
      let s = ''
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000))
      return btoa(s)
    }, 'data:image/png;base64,' + png)
    writeFileSync(join(out, `showcase-${name}-poster.webp`), Buffer.from(b64, 'base64'))
  }
  await browser.close()
  await server.close()
}

for (const name of postersOnly ? [] : names) {
  const v = VARIANTS[name]
  const input = ['-y', '-framerate', String(FPS), '-i', join(framesRoot, name, 'f%04d.png')]
  // H.264 (überall abspielbar): faststart, yuv420p, ohne Ton
  run(ffmpeg, [...input, '-vf', `scale=${v.size.replace('x', ':')}:flags=lanczos`, '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'animation', '-crf', String(v.crf),
    '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', join(out, `showcase-${name}.mp4`)])
}
for (const f of readdirSync(out)) console.log(f, (statSync(join(out, f)).size / 1024).toFixed(0) + ' KB')
