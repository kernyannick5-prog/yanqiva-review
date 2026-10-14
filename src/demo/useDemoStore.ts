import { useCallback, useState } from 'react'
import { SEED_CARDS } from './data'
import type { Card } from './types'

/**
 * Zustand der Demo: nur die zwei erfundenen Karten, Änderungen des Ziel-Links leben im Arbeitsspeicher der geöffneten Seite.
 * Es wird nichts im Browser gespeichert (kein sessionStorage, kein localStorage).
 */
export function useDemoStore() {
  const [cards, setCards] = useState<Card[]>(SEED_CARDS)

  const updateTargetUrl = useCallback((id: string, targetUrl: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, targetUrl: targetUrl.trim() } : c)))
  }, [])

  const reset = useCallback(() => setCards(SEED_CARDS), [])

  return { cards, updateTargetUrl, reset }
}
