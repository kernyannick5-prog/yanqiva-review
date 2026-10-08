import type { Plugin } from 'vite'
import { redirects } from '../src/config/redirects.ts'

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

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
<meta name="referrer" content="no-referrer">
<link rel="icon" href="data:,">
<!-- Datenschutz: Diese Seite erhebt, speichert und übermittelt keine Besucherdaten (kein Tracking, keine Cookies, keine externen Ressourcen). -->
<title>Weiterleitung – ${escapeHtml(business)}</title>
<meta http-equiv="refresh" content="0; url=${safe}">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070a1f;color:#cbd5f5;font:16px system-ui,sans-serif}a{color:#5eead4}a:focus-visible{outline:2px solid #5eead4;outline-offset:3px}</style>
</head>
<body>
<main>
<p>Weiterleitung zur Bewertung von ${escapeHtml(business)} … <a href="${safe}">Weiter zur Bewertungsseite</a></p>
</main>
<script>location.replace(${JSON.stringify(url)})</script>
</body>
</html>
`
}

/**
 * Erzeugt für jeden Eintrag in src/config/redirects.ts eine Seite unter
 * /r/<slug>/index.html (Build) und bedient /r/<slug> im Dev-Server.
 */
export function yanqivaRedirects(): Plugin {
  let base = '/'
  return {
    name: 'yanqiva-redirects',
    configResolved(config) {
      base = config.base
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        const m = path.match(/\/r\/([a-z0-9-]+)\/?$/)
        const entry = m && redirects.find((r) => r.slug === m[1] && r.active)
        if (!entry) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(redirectPage(base, entry.target, entry.business))
      })
    },
    generateBundle() {
      for (const r of redirects.filter((r) => r.active)) {
        this.emitFile({
          type: 'asset',
          fileName: `r/${r.slug}/index.html`,
          source: redirectPage(base, r.target, r.business),
        })
      }
    },
  }
}
