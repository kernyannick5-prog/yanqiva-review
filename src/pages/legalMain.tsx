import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '../index.css'
import { LEGAL_DOCS, type LegalDocKey } from './legalDocs'
import { LegalPage } from './LegalPage'

// Eintrittspunkt der Rechtsseiten: data-doc am #root wählt den Text. Das HTML ist beim Build vorgerendert (scripts/prerender.mjs) und wird hydriert.
const root = document.getElementById('root')!
const key = (root.dataset.doc ?? 'datenschutz') as LegalDocKey
const app = (
  <StrictMode>
    <LegalPage doc={LEGAL_DOCS[key] ?? LEGAL_DOCS.datenschutz} />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
