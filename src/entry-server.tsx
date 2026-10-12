import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import App from './App.tsx'
import { LegalPage } from './pages/LegalPage'
import { LEGAL_DOCS, type LegalDocKey } from './pages/legalDocs'

async function toHtml(node: React.ReactNode): Promise<string> {
  const { prelude } = await prerender(<StrictMode>{node}</StrictMode>, {
    // Große Suspense-Grenzen (lazy ProductShowcase) nicht auslagern: sonst entstehen Inline-Skripte ($RC), die die Meta-CSP (script-src 'self') blockiert.
    progressiveChunkSize: Infinity,
  })
  const reader = prelude.getReader()
  const decoder = new TextDecoder()
  let html = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return html + decoder.decode()
    html += decoder.decode(value, { stream: true })
  }
}

/** Vorgerendertes Markup für #root. 'home' = Startseite, sonst ein Schlüssel aus LEGAL_DOCS. */
export function render(page: 'home' | LegalDocKey): Promise<string> {
  return toHtml(page === 'home' ? <App /> : <LegalPage doc={LEGAL_DOCS[page]} />)
}
