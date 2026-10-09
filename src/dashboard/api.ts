/**
 * Client der Kunden-API (Worker yanqiva-api, Pfad /api/review/*). Authentifizierung per Bearer-Session (localStorage, kein Cookie).
 * Fehler: ApiError ('network' = nicht erreichbar/ungültige Antwort, 'api' = Server hat abgelehnt, Meldung auf Deutsch).
 */
import { API_BASE, ApiError, PowSession, guard } from '../order/api'

export { ApiError, PowSession, guard }

export type CustomStatus = 'pending' | 'approved' | 'rejected' | null

export interface DashCard {
  id: number
  slug: string
  label: string | null
  nfcUrl: string
  qrUrl: string
  googleUrl: string
  customUrl: string | null
  customStatus: CustomStatus
  effectiveTarget: string | null
  usingCustom: boolean
  plan: 'klassik' | 'dashboard'
  dashboardUntil: string | null
  dashboardActive: boolean
  last30: { nfc: number; qr: number } | null
  lastDay: string | null
}

export interface Access {
  status: 'active' | 'expired'
  accessUntil: string | null
  daysLeft: number | null
  renewalHint: boolean
  renewalRequestedAt: string | null
}

export interface Me {
  user: { email: string; name: string | null }
  customer: { company: string }
  today: string
  access: Access
  cards: DashCard[]
}

export interface StatsPoint {
  key: string
  nfc: number
  qr: number
}

export type StatsRange = '7' | '30' | '90' | '12m'

export interface Stats {
  cardId: number | 'all'
  range: StatsRange
  granularity: 'day' | 'month'
  from: string
  to: string
  points: StatsPoint[]
  totals: { nfc: number; qr: number }
}

export interface VerifyResult {
  session: string
  expiresAt: string
  user: { email: string; name: string | null }
  customer: { company: string }
}

export interface TargetResult {
  status: 'live' | 'pending_review'
  changed: boolean
  card: DashCard
}

interface ErrorBody {
  error?: unknown
  code?: unknown
}

async function call<T>(method: string, path: string, opts: { token?: string; body?: unknown; timeoutMs?: number } = {}): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 30000)
  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (opts.token) headers.Authorization = `Bearer ${opts.token}`
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
    let res: Response
    try {
      res = await fetch(`${API_BASE}/api/review${path}`, { method, headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body), signal: controller.signal })
    } catch {
      throw new ApiError('network', 'Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.')
    }
    let data: unknown = null
    try {
      data = await res.json()
    } catch {
      /* keine JSON-Antwort */
    }
    if (!res.ok) {
      const b = (typeof data === 'object' && data !== null ? data : {}) as ErrorBody
      const message = typeof b.error === 'string' && b.error ? b.error : `Die Anfrage konnte nicht verarbeitet werden (Status ${res.status}).`
      throw new ApiError(res.status >= 500 && typeof b.error !== 'string' ? 'network' : 'api', message, { code: typeof b.code === 'string' ? b.code : undefined, status: res.status })
    }
    if (data === null) throw new ApiError('network', 'Keine gültige Antwort vom Server.')
    return data as T
  } finally {
    clearTimeout(timer)
  }
}

export const requestLogin = (payload: { email: string; pow: unknown; hp: string; ts: number }) => call<{ ok: boolean; message: string }>('POST', '/auth/request', { body: payload, timeoutMs: 20000 })
export const verifyLogin = (token: string) => call<VerifyResult>('POST', '/auth/verify', { body: { token } })
export const logout = (token: string) => call<{ ok: boolean }>('POST', '/auth/logout', { token, timeoutMs: 8000 })
export const getMe = (token: string) => call<Me>('GET', '/me', { token })
export const getStats = (token: string, card: number | 'all', range: StatsRange) => call<Stats>('GET', `/cards/${card}/stats?range=${range}`, { token })
export const putTarget = (token: string, card: number, url: string) => call<TargetResult>('PUT', `/cards/${card}/target`, { token, body: { url } })
export const deleteTarget = (token: string, card: number) => call<{ changed: boolean; card: DashCard }>('DELETE', `/cards/${card}/target`, { token })
export const requestRenewal = (token: string, note: string) =>
  call<{ ok: boolean; alreadyRequested: boolean; requestedAt: string }>('POST', '/renewal-request', { token, body: note ? { note } : {} })

/** 401 mit abgelaufener/ungültiger Sitzung: zurück zum Login. */
export const isSessionError = (e: unknown) => e instanceof ApiError && e.status === 401 && e.code === 'session_expired'
