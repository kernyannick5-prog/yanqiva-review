import { useCallback, useEffect, useState } from 'react'
import { logout } from './api'
import { AppShell } from './AppShell'
import { ConfirmView } from './ConfirmView'
import { LoginView } from './LoginView'
import { PageFrame } from './PageFrame'
import { clearSession, loadSession, saveSession, type StoredSession } from './session'

type Phase =
  | { kind: 'confirm'; token: string }
  | { kind: 'login'; notice?: string }
  | { kind: 'app'; stored: StoredSession }

const TOKEN_FRAGMENT = /^#lt=([0-9a-f]{64})$/

/** Liest nur (rein, auch unter StrictMode unbedenklich); das Fragment wird danach per Effekt entfernt. */
function initialPhase(): Phase {
  const m = TOKEN_FRAGMENT.exec(window.location.hash)
  if (m) return { kind: 'confirm', token: m[1] }
  if (window.location.hash.startsWith('#lt=')) return { kind: 'login', notice: 'Der Anmeldelink ist unvollständig. Bitte fordern Sie unten einen neuen Link an.' }
  const stored = loadSession()
  return stored ? { kind: 'app', stored } : { kind: 'login' }
}

/** Kunden-Dashboard: Anmeldung per Magic-Link (Token im URL-Fragment, Bestätigung per Klick), danach die Ansichten. */
export function DashboardApp() {
  const [phase, setPhase] = useState<Phase>(initialPhase)

  // Das Token verschwindet sofort aus der Adresszeile (Verlauf, Lesezeichen, Referrer). Auch ein Link, der in einem bereits
  // geöffneten Dashboard-Tab eingefügt wird (nur Fragment-Wechsel, kein Neuladen), führt zur Bestätigungsseite.
  useEffect(() => {
    const strip = () => window.history.replaceState(null, '', window.location.pathname + window.location.search)
    const onHash = () => {
      const m = TOKEN_FRAGMENT.exec(window.location.hash)
      if (m) setPhase({ kind: 'confirm', token: m[1] })
      if (window.location.hash.startsWith('#lt=')) strip()
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const signedIn = useCallback((s: StoredSession) => {
    saveSession(s)
    setPhase({ kind: 'app', stored: s })
  }, [])

  const toLogin = useCallback((notice?: string) => {
    clearSession()
    setPhase({ kind: 'login', notice })
  }, [])

  const signOut = useCallback(
    async (token: string) => {
      clearSession()
      setPhase({ kind: 'login', notice: 'Sie wurden abgemeldet.' })
      try {
        await logout(token) // serverseitig invalidieren; ein Fehler ändert nichts am lokalen Abmelden
      } catch {
        /* Sitzung läuft spätestens nach 30 Tagen serverseitig ab */
      }
    },
    [],
  )

  if (phase.kind === 'app') {
    return <AppShell stored={phase.stored} onSignOut={() => signOut(phase.stored.session)} onExpired={() => toLogin('Ihre Anmeldung ist abgelaufen. Bitte melden Sie sich erneut an.')} />
  }
  return (
    <PageFrame>
      {phase.kind === 'confirm' ? (
        <ConfirmView token={phase.token} onSignedIn={signedIn} onFailed={(msg) => toLogin(msg)} />
      ) : (
        <LoginView notice={phase.notice} />
      )}
    </PageFrame>
  )
}
