import type { Plugin } from 'vite'
import { createHash } from 'node:crypto'
import { buildCsp } from './csp.ts'
import { redirects, snapshotEntries, type RedirectEntry } from '../src/config/redirects.ts'

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const REDIRECT_STYLE = 'body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b2c23;color:#cfe8dc;font:16px system-ui,sans-serif}a{color:#5eead4}a:focus-visible{outline:2px solid #5eead4;outline-offset:3px}'
const STYLE_HASH = `'sha256-${createHash('sha256').update(REDIRECT_STYLE).digest('base64')}'`

/** Statische Weiterleitungsseite für eine Redirect-Route. */
function redirectPage(base: string, target: string, business: string): string {
  const url = /^https?:\/\//.test(target) ? target : base + target
  const safe = escapeHtml(url)
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta http-equiv="Content-Security-Policy" content="${buildCsp({ styleHashes: [STYLE_HASH] })}">
<meta name="referrer" content="no-referrer">
<link rel="icon" href="data:,">
<!-- Datenschutz: Diese Seite erhebt, speichert und übermittelt keine Besucherdaten (kein Tracking, keine Cookies, keine externen Ressourcen). -->
<title>Weiterleitung${business ? ` – ${escapeHtml(business)}` : ''}</title>
<meta http-equiv="refresh" content="0; url=${safe}">
<style>${REDIRECT_STYLE}</style>
</head>
<body>
<main>
<p>Weiterleitung zur Bewertung${business ? ` von ${escapeHtml(business)}` : ''} … <a href="${safe}">Weiter zur Bewertungsseite</a></p>
</main>
</body>
</html>
`
}

/**
 * Holt optional den Snapshot der Produktionskarten (FALLBACK_EXPORT_URL + FALLBACK_EXPORT_TOKEN aus der Umgebung/den GitHub-Secrets).
 * Ohne beide Variablen: leer. Ist der Export konfiguriert, aber nicht abrufbar, schlägt der Build FEHL (die zuletzt veröffentlichte
 * Version bleibt dann online, statt Karten ohne Notnetz zu veröffentlichen). Geloggt wird nur die Anzahl, nie Slug oder Ziel
 * (öffentliches Repo, öffentliche Actions-Logs).
 */
export async function fetchSnapshot(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): Promise<RedirectEntry[]> {
  const url = env.FALLBACK_EXPORT_URL?.trim()
  const token = env.FALLBACK_EXPORT_TOKEN?.trim()
  if (!url && !token) return []
  if (!url || !token) throw new Error('Fallback-Export: FALLBACK_EXPORT_URL und FALLBACK_EXPORT_TOKEN müssen beide gesetzt sein')
  const u = new URL(url)
  if (u.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(u.hostname)) throw new Error('Fallback-Export: FALLBACK_EXPORT_URL muss https sein')
  let lastError = 'unbekannt'
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetchImpl(u, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, signal: AbortSignal.timeout(15_000), redirect: 'error' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { entries, skipped } = snapshotEntries(await res.json())
      console.log(`Fallback-Export: ${entries.length} Karten übernommen${skipped ? `, ${skipped} ungültige übersprungen` : ''}`)
      return entries
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e)
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 2000))
    }
  }
  throw new Error(`Fallback-Export nicht abrufbar (${lastError}). Build abgebrochen.`)
}

/**
 * Erzeugt für jeden Eintrag in src/config/redirects.ts eine Seite unter
 * /r/<slug>/index.html (Build) und bedient /r/<slug> im Dev-Server.
 */
export function yanqivaRedirects(): Plugin {
  let base = '/'
  const demo: RedirectEntry[] = redirects.filter((r) => r.active)
  let entries: RedirectEntry[] = demo
  return {
    name: 'yanqiva-redirects',
    configResolved(config) {
      base = config.base
    },
    async buildStart() {
      // Nur im Build (nicht im Dev-Server): Snapshot der Produktionskarten. Demo-Einträge haben Vorrang bei gleichem Slug.
      if (this.environment?.mode === 'dev') return
      const known = new Set(demo.map((r) => r.slug))
      entries = [...demo, ...(await fetchSnapshot()).filter((r) => !known.has(r.slug))]
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        const m = path.match(/\/r\/([a-z0-9-]+)\/?$/)
        const entry = m && entries.find((r) => r.slug === m[1])
        if (!entry) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(redirectPage(base, entry.target, entry.business))
      })
    },
    generateBundle() {
      for (const r of entries) {
        this.emitFile({
          type: 'asset',
          fileName: `r/${r.slug}/index.html`,
          source: redirectPage(base, r.target, r.business),
        })
      }
    },
  }
}
