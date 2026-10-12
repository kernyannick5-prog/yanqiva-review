import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyLowPowerAttribute } from './lib/lowPower'

applyLowPowerAttribute()

// Beim Build vorgerendertes HTML (scripts/prerender.mjs) wird hydriert; im Dev-Server ist #root leer.
const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
