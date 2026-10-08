import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { datenschutz } from '../legal/datenschutz'
import { impressum } from '../legal/impressum'
import { LegalPage } from './LegalPage'

const DOCS = { datenschutz, impressum } as const
type DocKey = keyof typeof DOCS

// Eintrittspunkt der Rechtsseiten: data-doc am #root wählt den Text.
const root = document.getElementById('root')!
const key = (root.dataset.doc ?? 'datenschutz') as DocKey

createRoot(root).render(
  <StrictMode>
    <LegalPage doc={DOCS[key] ?? datenschutz} />
  </StrictMode>,
)
