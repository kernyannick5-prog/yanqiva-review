import type { ReactNode } from 'react'
import { errId, fieldId, hintId } from './ids'
import { FIELD_LABELS, type Errors, type FieldKey, type OrderForm } from './state'

/** Gemeinsamer Kontext der Formularschritte. `errors` enthält nur die bereits sichtbaren Fehler. */
export interface FormCtx {
  form: OrderForm
  errors: Errors
  set: <K extends FieldKey>(key: K, value: OrderForm[K]) => void
}


const inputBase =
  'block min-h-12 w-full rounded-xl border bg-white/[0.05] px-4 py-3 text-base leading-snug text-text placeholder:text-faint transition-colors focus-visible:border-mint'
const inputOk = 'border-white/50'
const inputBad = 'border-red-300'

export function RequiredLegend() {
  return (
    <p className="text-sm text-muted">
      Mit <span className="font-semibold text-mint">*</span> markierte Felder sind Pflichtfelder. Alle anderen Angaben sind freiwillig.
    </p>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 flex gap-1.5 text-sm leading-snug text-red-300">
      <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor" aria-hidden>
        <path d="M10 1.8 19 17.5H1L10 1.8Zm-.9 5.9v4.6h1.8V7.7H9.1Zm0 5.9v1.8h1.8v-1.8H9.1Z" />
      </svg>
      <span>{message}</span>
    </p>
  )
}

function LabelText({ name, required, label }: { name: FieldKey; required?: boolean; label?: string }) {
  return (
    <>
      {label ?? FIELD_LABELS[name]}
      {required ? (
        <span aria-hidden className="ml-0.5 font-semibold text-mint"> *</span>
      ) : (
        <span className="ml-1.5 text-[13px] font-normal text-faint">(freiwillig)</span>
      )}
    </>
  )
}

type StringKey = {
  [K in FieldKey]: OrderForm[K] extends string ? K : never
}[FieldKey]

interface TextFieldProps {
  ctx: FormCtx
  name: StringKey
  required?: boolean
  label?: string
  hint?: ReactNode
  maxLength?: number
  type?: 'text' | 'email' | 'tel' | 'url'
  inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'url'
  autoComplete?: string
  placeholder?: string
  multiline?: boolean
  rows?: number
  className?: string
  pattern?: string
  /** Zusätzliche Beschreibung (z. B. gemeinsamer Fehler), die per aria-describedby verbunden wird. */
  describedBy?: string
}

export function TextField({
  ctx, name, required, label, hint, maxLength, type = 'text', inputMode, autoComplete, placeholder, multiline, rows = 4, className = '', pattern, describedBy,
}: TextFieldProps) {
  const error = ctx.errors[name]
  const described = [hint ? hintId(name) : '', error ? errId(name) : '', describedBy ?? ''].filter(Boolean).join(' ') || undefined
  const common = {
    id: fieldId(name),
    name,
    value: ctx.form[name],
    required,
    maxLength,
    placeholder,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': described,
    className: `${inputBase} ${error ? inputBad : inputOk}`,
  } as const
  return (
    <div className={className}>
      <label htmlFor={fieldId(name)} className="mb-1.5 block text-[15px] font-medium text-text">
        <LabelText name={name} required={required} label={label} />
      </label>
      {hint && (
        <p id={hintId(name)} className="mb-2 text-sm leading-snug text-muted">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...common} rows={rows} onChange={(e) => ctx.set(name, e.target.value as never)} />
      ) : (
        <input {...common} type={type} inputMode={inputMode} pattern={pattern} onChange={(e) => ctx.set(name, e.target.value as never)} />
      )}
      <FieldError id={errId(name)} message={error} />
    </div>
  )
}

interface CheckboxProps {
  ctx: FormCtx
  name: 'shipDifferent' | 'confirmB2B' | 'acceptAgb'
  required?: boolean
  children: ReactNode
  hint?: ReactNode
}

export function CheckboxField({ ctx, name, required, children, hint }: CheckboxProps) {
  const error = ctx.errors[name]
  const described = [hint ? hintId(name) : '', error ? errId(name) : ''].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label
        className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors has-[:checked]:border-mint/50 has-[:checked]:bg-mint/[0.07] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mint ${
          error ? 'border-red-300 bg-red-300/[0.06]' : 'border-white/50 bg-white/[0.03]'
        }`}
      >
        <input
          id={fieldId(name)}
          name={name}
          type="checkbox"
          checked={ctx.form[name]}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          onChange={(e) => ctx.set(name, e.target.checked)}
          className="mt-0.5 size-6 shrink-0 cursor-pointer accent-mint focus-visible:outline-none"
        />
        <span className="text-[15px] leading-snug text-text">
          {children}
          {required && <span aria-hidden className="ml-0.5 font-semibold text-mint"> *</span>}
        </span>
      </label>
      {hint && (
        <p id={hintId(name)} className="mt-1.5 px-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={errId(name)} message={error} />
    </div>
  )
}

export function Fieldset({ legend, children, className = '' }: { legend: ReactNode; children: ReactNode; className?: string }) {
  return (
    <fieldset className={`min-w-0 border-0 p-0 ${className}`}>
      <legend className="mb-3 p-0 font-display text-lg font-semibold text-text">{legend}</legend>
      {children}
    </fieldset>
  )
}

interface ErrorSummaryProps {
  errors: Errors
  keys: readonly FieldKey[]
  onJump: (key: FieldKey) => void
}

/** Fehlerzusammenfassung (role="alert") mit Sprunglinks zu den Feldern. */
export function ErrorSummary({ errors, keys, onJump }: ErrorSummaryProps) {
  const open = keys.filter((k) => errors[k])
  if (open.length === 0) return null
  return (
    <div role="alert" className="mb-6 rounded-2xl border border-red-300/60 bg-red-300/[0.08] p-4 sm:p-5">
      <p className="font-display text-base font-semibold text-red-200">
        {open.length === 1 ? 'Bitte korrigieren Sie 1 Angabe:' : `Bitte korrigieren Sie ${open.length} Angaben:`}
      </p>
      <ul className="mt-2 space-y-0.5">
        {open.map((k) => (
          <li key={k}>
            <a
              href={`#${fieldId(k)}`}
              onClick={(e) => {
                e.preventDefault()
                onJump(k)
              }}
              className="inline-flex min-h-11 items-center text-[15px] leading-snug text-red-100 underline underline-offset-2 hover:text-white"
            >
              {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
