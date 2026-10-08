import { useState, type FormEvent } from 'react'
import type { Card, NewCardInput } from '../types'
import { isHttpsUrl, nextCardNumber } from '../utils'
import { ActionButton } from './ActionButton'
import { Field } from './Field'
import { Modal } from './Modal'

interface NewCardModalProps {
  cards: Card[]
  onCreate: (input: NewCardInput) => void
  onClose: () => void
}

type Errors = Partial<Record<keyof NewCardInput, string>>

const FIELD_IDS: Record<keyof NewCardInput, string> = {
  businessName: 'new-card-name',
  targetUrl: 'new-card-url',
  cardNumber: 'new-card-number',
}

/** Neue Karte anlegen: Validierung inline, Kartennummer wird vorbefüllt. */
export function NewCardModal({ cards, onCreate, onClose }: NewCardModalProps) {
  const [values, setValues] = useState<NewCardInput>(() => ({
    businessName: '',
    targetUrl: '',
    cardNumber: nextCardNumber(cards),
  }))
  const [submitted, setSubmitted] = useState(false)

  const validate = (v: NewCardInput): Errors => {
    const errors: Errors = {}
    if (!v.businessName.trim()) errors.businessName = 'Bitte gib den Unternehmensnamen ein.'
    const url = v.targetUrl.trim()
    if (!url) errors.targetUrl = 'Bitte gib den Google-Bewertungslink ein.'
    else if (!isHttpsUrl(url)) errors.targetUrl = 'Der Link muss gültig sein und mit https:// beginnen.'
    const number = v.cardNumber.trim()
    if (!number) errors.cardNumber = 'Bitte gib eine Kartennummer ein.'
    else if (cards.some((c) => c.cardNumber.toLowerCase() === number.toLowerCase()))
      errors.cardNumber = 'Diese Kartennummer ist bereits vergeben.'
    return errors
  }

  const errors = submitted ? validate(values) : {}
  const set = (key: keyof NewCardInput) => (e: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(values)
    const firstInvalid = (Object.keys(FIELD_IDS) as (keyof NewCardInput)[]).find((k) => found[k])
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus()
      return
    }
    onCreate(values)
  }

  return (
    <Modal titleId="new-card-title" title="Neue Karte hinzufügen" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field
          id={FIELD_IDS.businessName}
          label="Unternehmensname"
          placeholder="z. B. Café Sonnenschein"
          autoComplete="off"
          value={values.businessName}
          error={errors.businessName}
          onChange={set('businessName')}
          data-autofocus
        />
        <Field
          id={FIELD_IDS.targetUrl}
          label="Google-Bewertungslink"
          type="url"
          inputMode="url"
          placeholder="https://…"
          autoComplete="off"
          spellCheck={false}
          value={values.targetUrl}
          error={errors.targetUrl}
          onChange={set('targetUrl')}
        />
        <Field
          id={FIELD_IDS.cardNumber}
          label="Kartennummer"
          autoComplete="off"
          spellCheck={false}
          value={values.cardNumber}
          error={errors.cardNumber}
          hint="Steht auf der Karte. Muss eindeutig sein."
          onChange={set('cardNumber')}
        />
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <ActionButton onClick={onClose}>Abbrechen</ActionButton>
          <ActionButton type="submit" variant="primary">
            Karte erstellen
          </ActionButton>
        </div>
      </form>
    </Modal>
  )
}
