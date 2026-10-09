import { useCallback, useEffect, useState } from 'react'
import { SEED_CARDS, SEED_CARD_IDS } from './data'
import type { Card, NewCardInput } from './types'
import { randomSlug } from './utils'

const STORAGE_KEY = 'yanqiva-demo-cards-v1'

function isCard(value: unknown): value is Card {
  if (typeof value !== 'object' || value === null) return false
  const c = value as Record<string, unknown>
  const scans = c.scans as Record<string, unknown> | undefined
  return (
    typeof c.id === 'string' &&
    typeof c.cardNumber === 'string' &&
    typeof c.slug === 'string' &&
    typeof c.businessName === 'string' &&
    typeof c.targetUrl === 'string' &&
    (c.status === 'active' || c.status === 'paused') &&
    typeof scans?.nfc === 'number' &&
    typeof scans?.qr === 'number' &&
    (c.lastScanAt === null || typeof c.lastScanAt === 'string')
  )
}

function loadCreatedCards(): Card[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(isCard).filter((c) => !SEED_CARD_IDS.has(c.id)) : []
  } catch {
    return []
  }
}

function saveCreatedCards(cards: Card[]) {
  try {
    // Nichts schreiben, solange keine Karte angelegt wurde (kein leerer Eintrag, kein Speicher ohne Nutzeraktion).
    if (cards.length === 0) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  } catch {
    /* Speicher nicht verfügbar (z. B. privater Modus) – Demo läuft ohne Persistenz weiter. */
  }
}

/** Zustand der Demo: Karten (neu angelegte werden in sessionStorage gehalten (nur dieser Tab/Besuch)). */
export function useDemoStore() {
  const [cards, setCards] = useState<Card[]>(() => [...loadCreatedCards(), ...SEED_CARDS])

  useEffect(() => {
    saveCreatedCards(cards.filter((c) => !SEED_CARD_IDS.has(c.id)))
  }, [cards])

  const addCard = useCallback(
    (input: NewCardInput): Card => {
      const card: Card = {
        id: `card-${Date.now().toString(36)}`,
        cardNumber: input.cardNumber.trim(),
        slug: randomSlug(cards),
        businessName: input.businessName.trim(),
        targetUrl: input.targetUrl.trim(),
        status: 'active',
        scans: { nfc: 0, qr: 0 },
        lastScanAt: null,
      }
      setCards((prev) => [card, ...prev])
      return card
    },
    [cards],
  )

  const updateTargetUrl = useCallback((id: string, targetUrl: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, targetUrl: targetUrl.trim() } : c)))
  }, [])

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignorieren */
    }
    setCards(SEED_CARDS)
  }, [])

  return { cards, addCard, updateTargetUrl, reset }
}
