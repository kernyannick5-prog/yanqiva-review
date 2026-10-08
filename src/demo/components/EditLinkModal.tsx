import { useState, type FormEvent } from 'react'
import { productionRedirectUrl } from '../../lib/redirectUrl'
import type { Card } from '../types'
import { isHttpsUrl } from '../utils'
import { ActionButton } from './ActionButton'
import { Field } from './Field'
import { Modal } from './Modal'

interface EditLinkModalProps {
  card: Card
  onSave: (id: string, targetUrl: string) => void
  onClose: () => void
}

/** Ziel-URL einer Karte ändern – die Redirect-URL auf der Karte bleibt unverändert. */
export function EditLinkModal({ card, onSave, onClose }: EditLinkModalProps) {
  const [value, setValue] = useState(card.targetUrl)
  const [submitted, setSubmitted] = useState(false)

  const validate = (v: string) => {
    const trimmed = v.trim()
    if (!trimmed) return 'Bitte gib die Ziel-URL ein.'
    if (!isHttpsUrl(trimmed)) return 'Der Link muss gültig sein und mit https:// beginnen.'
    return undefined
  }
  const error = submitted ? validate(value) : undefined

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (validate(value)) {
      document.getElementById('edit-target-url')?.focus()
      return
    }
    onSave(card.id, value)
  }

  return (
    <Modal titleId="edit-link-title" title={`Link bearbeiten – ${card.businessName}`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field
          id="edit-target-url"
          label="Ziel-URL"
          required
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={value}
          error={error}
          onChange={(e) => setValue(e.target.value)}
          data-autofocus
        />
        <p className="rounded-xl border border-line bg-white/[0.03] p-3 text-xs leading-relaxed text-muted">
          Die Karte selbst bleibt unverändert – sie zeigt immer auf{' '}
          <span className="break-all font-mono text-mint">{productionRedirectUrl(card.slug)}</span>.
        </p>
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <ActionButton onClick={onClose}>Abbrechen</ActionButton>
          <ActionButton type="submit" variant="primary">
            Speichern
          </ActionButton>
        </div>
      </form>
    </Modal>
  )
}
