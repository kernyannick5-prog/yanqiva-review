/**
 * Sitzung im localStorage (Schlüssel yq-dash-session, kein Cookie). Der Server speichert nur den Hash und lässt die Sitzung
 * nach 30 Tagen oder beim Abmelden ablaufen. Datenschutzerklärung Abschnitt 8 beschreibt genau das.
 */
export const SESSION_KEY = 'yq-dash-session'

export interface StoredSession {
  session: string
  expiresAt: string
  email: string
  name: string | null
  company: string
}

function valid(v: unknown): v is StoredSession {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (
    typeof o.session === 'string' &&
    /^[0-9a-f]{64}$/.test(o.session) &&
    typeof o.expiresAt === 'string' &&
    typeof o.email === 'string' &&
    typeof o.company === 'string' &&
    (o.name === null || typeof o.name === 'string')
  )
}

export function loadSession(now = Date.now()): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!valid(parsed) || Date.parse(parsed.expiresAt) <= now) {
      window.localStorage.removeItem(SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

/** false, wenn der Browser-Speicher nicht nutzbar ist (z. B. privater Modus mit gesperrtem Speicher). */
export function saveSession(s: StoredSession): boolean {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    return true
  } catch {
    return false
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    /* nichts zu tun */
  }
}
