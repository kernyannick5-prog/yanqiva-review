import { useEffect, useState } from 'react'
import { ApiError, getStats, isSessionError, type Stats, type StatsRange } from './api'

export type StatsState = { status: 'loading' } | { status: 'ready'; data: Stats } | { status: 'error'; message: string; expired: boolean }

type Settled = { key: string; result: { status: 'ready'; data: Stats } | { status: 'error'; message: string; expired: boolean } }

/** Lädt die Statistik einer Karte (oder 'all'); Antworten veralteter Anfragen werden verworfen, bei neuen Parametern gilt 'loading'. */
export function useStats(token: string, card: number | 'all', range: StatsRange, enabled: boolean, onSessionExpired: () => void, reloadKey = 0): StatsState {
  const key = `${card}|${range}|${reloadKey}`
  const [settled, setSettled] = useState<Settled | null>(null)

  useEffect(() => {
    if (!enabled) return
    let alive = true
    getStats(token, card, range)
      .then((data) => alive && setSettled({ key, result: { status: 'ready', data } }))
      .catch((e: unknown) => {
        if (!alive) return
        if (isSessionError(e)) return onSessionExpired()
        const expired = e instanceof ApiError && e.code === 'access_expired'
        setSettled({ key, result: { status: 'error', expired, message: e instanceof ApiError ? e.message : 'Die Statistik konnte nicht geladen werden.' } })
      })
    return () => {
      alive = false
    }
  }, [token, card, range, enabled, onSessionExpired, key])

  return settled && settled.key === key ? settled.result : { status: 'loading' }
}
