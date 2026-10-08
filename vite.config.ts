import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { yanqivaRedirects } from './plugins/redirects.ts'

// GitHub Pages veröffentlicht unter /yanqiva-review/. Für eine eigene Domain BASE=/ setzen.
export default defineConfig({
  base: process.env.BASE ?? '/yanqiva-review/',
  plugins: [react(), tailwindcss(), yanqivaRedirects()],
})
