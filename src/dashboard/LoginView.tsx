import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { Field } from '../demo/components/Field'
import { emailProblem } from '../order/state'
import { ApiError, PowSession, guard, requestLogin } from './api'

/** Anmeldung: E-Mail eingeben, Anmeldelink per Mail. Die Antwort ist immer dieselbe (keine Konto-Aufzählung). */
export function LoginView({ notice }: { notice?: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [problem, setProblem] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [pow] = useState(() => new PowSession())
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Fokus auf die neue Überschrift, wenn sich die Ansicht ändert (nicht beim ersten Laden der Seite)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [sentTo])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const value = email.trim()
    const invalid = emailProblem(value)
    if (invalid) {
      setError(invalid)
      document.getElementById('login-email')?.focus()
      return
    }
    setError(undefined)
    setProblem(null)
    setBusy(true)
    try {
      const solution = await pow.take()
      if (!solution) {
        setProblem('Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.')
        return
      }
      await requestLogin({ email: value, pow: solution, ...guard(formRef.current, startedAt) })
      setSentTo(value)
    } catch (err) {
      setProblem(err instanceof ApiError ? err.message : 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.')
    } finally {
      setBusy(false)
    }
  }

  if (sentTo) {
    return (
      <div className="glass rounded-3xl p-6 sm:p-8">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold text-text outline-none">
          Bitte prüfen Sie Ihr Postfach
        </h1>
        <p role="status" className="mt-4 text-[15px] leading-relaxed text-text">
          Falls zu <strong className="break-all">{sentTo}</strong> ein Zugang besteht, haben wir Ihnen einen Anmeldelink gesendet.
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-snug text-muted">
          <li>Der Link ist 15 Minuten gültig und kann nur einmal verwendet werden.</li>
          <li>Prüfen Sie auch den Spam-Ordner.</li>
          <li>Öffnen Sie den Link im selben Browser, in dem Sie das Dashboard nutzen möchten.</li>
        </ul>
        <ActionButton
          className="mt-6"
          onClick={() => {
            setSentTo(null)
            setStartedAt(Date.now())
          }}
        >
          Anderen Link anfordern
        </ActionButton>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold text-text outline-none">
        Anmelden
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        Kunden-Dashboard von YANQIVA REVIEW. Es gibt kein Passwort: Wir senden Ihnen einen Anmeldelink per E-Mail.
      </p>
      {notice && (
        <p role="status" className="mt-4 rounded-xl border border-mint/30 bg-mint/[0.06] p-3 text-sm leading-snug text-text">
          {notice}
        </p>
      )}
      <form ref={formRef} onSubmit={submit} onFocus={() => pow.start()} noValidate className="mt-6 space-y-4" autoComplete="on">
        <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label>
            Bitte leer lassen
            <input type="text" name="homepage" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
        <Field
          id="login-email"
          label="E-Mail-Adresse"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={email}
          error={error}
          hint="Die Adresse, an die Ihr Zugang vergeben wurde."
          onChange={(e) => setEmail(e.target.value)}
        />
        {problem && (
          <p role="alert" className="rounded-xl border border-red-300/60 bg-red-300/[0.08] p-3 text-sm leading-snug text-red-900">
            {problem}
          </p>
        )}
        <ActionButton type="submit" variant="primary" disabled={busy} className="w-full hover:bg-[#115e59]! sm:w-auto">
          {busy ? 'Wird gesendet …' : 'Anmeldelink senden'}
        </ActionButton>
        <p role="status" className="sr-only">
          {busy ? 'Anmeldelink wird angefordert …' : ''}
        </p>
      </form>
      <p className="mt-6 text-[13px] leading-snug text-faint">
        Sie haben noch keinen Zugang? Das Dashboard gehört zur Variante Dashboard von YANQIVA REVIEW. Fragen: <a href="mailto:support@yanqiva.de" className="underline underline-offset-2">support@yanqiva.de</a>
      </p>
    </div>
  )
}
