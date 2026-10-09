import { useEffect, useRef, useState } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { ApiError, verifyLogin } from './api'
import type { StoredSession } from './session'

interface ConfirmViewProps {
  token: string
  onSignedIn: (s: StoredSession) => void
  onFailed: (message: string) => void
}

/**
 * Bestätigungsseite des Anmeldelinks. Bewusst ein Klick (kein automatisches Einlösen), damit Mail-Scanner, die den Link
 * abrufen, den Einmal-Link nicht verbrauchen; das Token steht nur im URL-Fragment und geht nie an einen Server oder Referrer.
 */
export function ConfirmView({ token, onSignedIn, onFailed }: ConfirmViewProps) {
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const confirm = async () => {
    if (busy) return
    setBusy(true)
    setProblem(null)
    try {
      const r = await verifyLogin(token)
      onSignedIn({ session: r.session, expiresAt: r.expiresAt, email: r.user.email, name: r.user.name, company: r.customer.company })
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        onFailed(e.message) // ungültig/abgelaufen/schon benutzt: zurück zum Login mit Hinweis
        return
      }
      setProblem(e instanceof ApiError ? e.message : 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.')
      setBusy(false)
    }
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold text-text outline-none">
        Anmeldung bestätigen
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Sie haben einen Anmeldelink für das YANQIVA REVIEW Dashboard geöffnet. Bestätigen Sie die Anmeldung mit einem Klick. Sie bleiben danach auf diesem Gerät 30 Tage angemeldet, außer Sie melden sich vorher ab.
      </p>
      {problem && (
        <p role="alert" className="mt-4 rounded-xl border border-red-300/60 bg-red-300/[0.08] p-3 text-sm leading-snug text-red-900">
          {problem}
        </p>
      )}
      <ActionButton variant="primary" className="mt-6 w-full hover:bg-[#115e59]! sm:w-auto" onClick={confirm} disabled={busy}>
        {busy ? 'Wird angemeldet …' : 'Jetzt anmelden'}
      </ActionButton>
      <p role="status" className="sr-only">
        {busy ? 'Anmeldung läuft …' : ''}
      </p>
      <p className="mt-6 text-[13px] leading-snug text-faint">Sie haben diese Anmeldung nicht angefordert? Schließen Sie diese Seite einfach, es passiert nichts.</p>
    </div>
  )
}
