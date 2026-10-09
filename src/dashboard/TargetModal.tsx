import { useState, type FormEvent } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { Field } from '../demo/components/Field'
import { Modal } from '../demo/components/Modal'
import { isGoogleReviewUrl } from '../order/state'
import { ApiError, deleteTarget, isSessionError, putTarget, type DashCard } from './api'
import { cardTitle } from './format'

interface TargetModalProps {
  card: DashCard
  token: string
  onClose: () => void
  /** Meldung für die Statusanzeige; danach lädt die Übersicht neu */
  onDone: (message: string) => void
  onExpired: () => void
}

const isHttps = (v: string) => {
  try {
    const u = new URL(v)
    return u.protocol === 'https:' && u.hostname.length > 0
  } catch {
    return false
  }
}

/** Ziel einer Karte ändern: Google-Links sofort, andere https-Ziele nach Freigabe (Status „pending“). */
export function TargetModal({ card, token, onClose, onDone, onExpired }: TargetModalProps) {
  const [value, setValue] = useState(card.customStatus === 'pending' && card.customUrl ? card.customUrl : (card.effectiveTarget ?? card.googleUrl))
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  const trimmed = value.trim()
  const validate = (v: string) => (!v ? 'Bitte geben Sie die Ziel-Adresse ein.' : !isHttps(v) ? 'Die Adresse muss gültig sein und mit https:// beginnen.' : undefined)
  const error = submitted ? validate(trimmed) : undefined
  const google = trimmed !== '' && isGoogleReviewUrl(trimmed)
  const hint = !trimmed
    ? 'Zum Beispiel der Google-Bewertungslink Ihres Unternehmens.'
    : google
      ? 'Google-Bewertungslink erkannt: wird sofort aktiv (in der Regel innerhalb einer Minute).'
      : isHttps(trimmed)
        ? 'Kein Google-Bewertungslink: YANQIVA prüft das Ziel zuerst. Bis zur Freigabe bleibt das bisherige Ziel aktiv.'
        : undefined

  const fail = (e: unknown) => {
    if (isSessionError(e)) return onExpired()
    setProblem(e instanceof ApiError ? e.message : 'Die Änderung konnte nicht gespeichert werden.')
    setBusy(false)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setSubmitted(true)
    if (validate(trimmed)) {
      document.getElementById('target-url')?.focus()
      return
    }
    setBusy(true)
    setProblem(null)
    try {
      const r = await putTarget(token, card.id, trimmed)
      onDone(
        !r.changed
          ? 'Das Ziel war bereits so eingestellt.'
          : r.status === 'live'
            ? 'Ziel gespeichert. Es wirkt in der Regel innerhalb einer Minute.'
            : 'Ziel eingereicht. Es wartet auf Freigabe, bis dahin bleibt das bisherige Ziel aktiv.',
      )
    } catch (err) {
      fail(err)
    }
  }

  const remove = async () => {
    if (busy) return
    setBusy(true)
    setProblem(null)
    try {
      await deleteTarget(token, card.id)
      onDone('Eigenes Ziel entfernt. Die Karte leitet jetzt zum Google-Bewertungsformular weiter.')
    } catch (err) {
      fail(err)
    }
  }

  return (
    <Modal titleId="target-title" title={`Ziel ändern – ${cardTitle(card)}`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="rounded-xl border border-line bg-white/[0.03] p-3 text-[13px] leading-relaxed text-muted">
          <p>
            <strong className="text-text">Google-Bewertungslinks</strong> sind sofort aktiv.
          </p>
          <p className="mt-1.5">
            <strong className="text-text">Andere https-Adressen</strong> (z. B. eine eigene Seite Ihres Unternehmens) prüft YANQIVA zuerst. Bis zur Freigabe bleibt das bisherige Ziel aktiv (Status „wartet auf Freigabe“).
          </p>
          <p className="mt-1.5">Jede Änderung wird protokolliert, und alle Nutzer Ihres Kontos erhalten eine E-Mail.</p>
        </div>

        {card.customStatus === 'pending' && card.customUrl && (
          <p className="break-all rounded-xl border border-amber-300/35 bg-amber-300/[0.07] p-3 text-[13px] leading-snug text-text">
            <strong>Wartet auf Freigabe:</strong> {card.customUrl}
          </p>
        )}
        {card.customStatus === 'rejected' && card.customUrl && (
          <p className="break-all rounded-xl border border-red-300/50 bg-red-300/[0.08] p-3 text-[13px] leading-snug text-text">
            <strong>Nicht freigegeben:</strong> {card.customUrl}
          </p>
        )}

        <Field
          id="target-url"
          label="Ziel-Adresse"
          required
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={value}
          error={error}
          hint={hint}
          onChange={(e) => setValue(e.target.value)}
          data-autofocus
        />

        {problem && (
          <p role="alert" className="rounded-xl border border-red-300/60 bg-red-300/[0.08] p-3 text-sm leading-snug text-red-100">
            {problem}
          </p>
        )}
        <p role="status" className="sr-only">
          {busy ? 'Wird gespeichert …' : ''}
        </p>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <ActionButton onClick={onClose}>Abbrechen</ActionButton>
          {card.customUrl && (
            <ActionButton onClick={remove} disabled={busy}>
              Eigenes Ziel entfernen
            </ActionButton>
          )}
          <ActionButton type="submit" variant="primary" disabled={busy}>
            {busy ? 'Wird gespeichert …' : 'Speichern'}
          </ActionButton>
        </div>
      </form>
    </Modal>
  )
}
