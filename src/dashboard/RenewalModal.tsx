import { useState, type FormEvent } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { Modal } from '../demo/components/Modal'
import { ApiError, isSessionError, requestRenewal } from './api'
import { formatDay } from './format'

interface RenewalModalProps {
  token: string
  accessUntil: string | null
  expired: boolean
  onClose: () => void
  onDone: (alreadyRequested: boolean) => void
  onExpired: () => void
}

const NOTE_MAX = 500

/** „Verlängerung anfragen“: sendet nur eine Anfrage an YANQIVA. Es wird nichts automatisch gebucht oder verlängert. */
export function RenewalModal({ token, accessUntil, expired, onClose, onDone, onExpired }: RenewalModalProps) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setProblem(null)
    try {
      const r = await requestRenewal(token, note.trim())
      onDone(r.alreadyRequested)
    } catch (err) {
      if (isSessionError(err)) return onExpired()
      setProblem(err instanceof ApiError ? err.message : 'Die Anfrage konnte nicht gesendet werden.')
      setBusy(false)
    }
  }

  return (
    <Modal titleId="renewal-title" title="Verlängerung anfragen" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-[14px] leading-relaxed text-muted">
          {expired ? 'Ihr Dashboard-Zugang ist beendet.' : `Ihr Dashboard-Zugang endet am ${accessUntil ? formatDay(accessUntil) : ''}.`} Mit Ihrer Anfrage informieren Sie YANQIVA, dass Sie das Dashboard verlängern möchten.
        </p>
        <p className="rounded-xl border border-line bg-white/[0.03] p-3 text-[13px] leading-relaxed text-muted">
          Mit Ihrer Anfrage wird <strong className="text-text">noch nichts gebucht</strong> und nichts automatisch verlängert. Wir melden uns per E-Mail; erst mit unserer Bestätigung kommt die Verlängerung zustande. Sie kostet 15 € pro Monat je Standort (keine Umsatzsteuer nach § 19 UStG), wird monatlich im Voraus berechnet und ist jederzeit zum Monatsende kündbar. Einzelheiten:{' '}
          <a href="/agb/#dashboard" className="font-medium text-text underline underline-offset-2">Ziffer 8 unserer AGB</a>.
          {expired ? ' Ihre Karten leiten weiterhin zum Google-Bewertungsformular weiter.' : ' Ihre Karten leiten in jedem Fall weiter zum Google-Bewertungsformular.'}
        </p>
        <div>
          <label htmlFor="renewal-note" className="mb-1.5 block text-sm font-medium text-text">
            Nachricht an uns (optional)
          </label>
          <textarea
            id="renewal-note"
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            data-autofocus
            aria-describedby="renewal-note-count"
            className="min-h-24 w-full rounded-xl border border-faint/70 bg-ink-950/60 px-3.5 py-2.5 text-[16px] text-text placeholder:text-faint hover:border-mint/60 focus:border-mint/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm"
          />
          <p id="renewal-note-count" className="mt-1.5 text-xs text-faint">
            {note.length} von {NOTE_MAX} Zeichen
          </p>
        </div>
        {problem && (
          <p role="alert" className="rounded-xl border border-red-300/60 bg-red-300/[0.08] p-3 text-sm leading-snug text-red-100">
            {problem}
          </p>
        )}
        <p role="status" className="sr-only">
          {busy ? 'Anfrage wird gesendet …' : ''}
        </p>
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <ActionButton onClick={onClose}>Abbrechen</ActionButton>
          <ActionButton type="submit" variant="primary" disabled={busy}>
            {busy ? 'Wird gesendet …' : 'Anfrage senden'}
          </ActionButton>
        </div>
      </form>
    </Modal>
  )
}
