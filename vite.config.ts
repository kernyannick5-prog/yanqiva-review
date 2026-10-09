import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { yanqivaCsp } from './plugins/csp.ts'
import { yanqivaRedirects } from './plugins/redirects.ts'

/** Preload der latin-Schriften auf der Startseite: Text wird mit der Webfont gelayoutet statt zweimal (Fallback -> Swap). */
function preloadFonts(): Plugin {
  return {
    name: 'yanqiva-preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle || !ctx.filename.endsWith('index.html') || /datenschutz|impressum|barrierefreiheit|bestellen|agb|dashboard/.test(ctx.filename)) return
        const base = process.env.BASE ?? '/yanqiva-review/'
        return Object.keys(ctx.bundle)
          .filter((f) => /(inter|space-grotesk)-latin-wght-normal-.*\.woff2$/.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: base + f },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

// GitHub Pages veröffentlicht unter /yanqiva-review/. Für eine eigene Domain BASE=/ setzen.
export default defineConfig({
  base: process.env.BASE ?? '/yanqiva-review/',
  plugins: [react(), tailwindcss(), yanqivaRedirects(), preloadFonts(), yanqivaCsp()],
  build: {
    // Multi-Page: Startseite plus eigenständige Rechtsseiten (dist/datenschutz/, dist/impressum/)
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz/index.html'),
        impressum: resolve(import.meta.dirname, 'impressum/index.html'),
        barrierefreiheit: resolve(import.meta.dirname, 'barrierefreiheit/index.html'),
        bestellen: resolve(import.meta.dirname, 'bestellen/index.html'),
        agb: resolve(import.meta.dirname, 'agb/index.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard/index.html'),
      },
    },
  },
})
