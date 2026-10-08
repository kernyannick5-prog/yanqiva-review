import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { yanqivaRedirects } from './plugins/redirects.ts'

// GitHub Pages veröffentlicht unter /yanqiva-review/. Für eine eigene Domain BASE=/ setzen.
export default defineConfig({
  base: process.env.BASE ?? '/yanqiva-review/',
  plugins: [react(), tailwindcss(), yanqivaRedirects()],
  build: {
    // Multi-Page: Startseite plus eigenständige Rechtsseiten (dist/datenschutz/, dist/impressum/)
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz/index.html'),
        impressum: resolve(import.meta.dirname, 'impressum/index.html'),
      },
    },
  },
})
