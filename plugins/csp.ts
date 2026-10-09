import type { Plugin } from 'vite'

/** Exakte Origin der Bestell-API (siehe src/order/api.ts, API_BASE). */
const API_ORIGIN = 'https://yanqiva-api.yanqiva-api.workers.dev'

/**
 * Meta-CSP für alle Seiten. frame-ancestors, report-uri und sandbox wirken in Meta-CSP nicht;
 * frame-ancestors gehört in die Cloudflare-Header-Regel (siehe CLOUDFLARE_HEADER_REVIEW.md).
 */
export function buildCsp(opts: { connect?: string[]; styleHashes?: string[] } = {}): string {
  const connect = ["'self'", ...(opts.connect ?? [])].join(' ')
  const style = ["'self'", ...(opts.styleHashes ?? [])].join(' ')
  return [
    "default-src 'self'",
    "script-src 'self'",
    `style-src ${style}`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connect}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export const cspMetaTags = (csp: string) =>
  `<meta http-equiv="Content-Security-Policy" content="${csp}">\n<meta name="referrer" content="strict-origin-when-cross-origin">`

/**
 * Fügt die Meta-CSP beim Build in alle HTML-Einstiege ein. Im Dev-Server bewusst nicht:
 * Vite/React-Refresh nutzen dort Inline-Skripte und WebSockets.
 */
export function yanqivaCsp(): Plugin {
  return {
    name: 'yanqiva-csp',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const csp = buildCsp({ connect: [API_ORIGIN] })
        return html.replace(/<head>/i, `<head>\n    ${cspMetaTags(csp).replace('\n', '\n    ')}`)
      },
    },
  }
}
