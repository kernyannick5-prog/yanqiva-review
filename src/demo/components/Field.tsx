import type { InputHTMLAttributes, Ref } from 'react'

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'aria-invalid'> {
  id: string
  label: string
  error?: string
  hint?: string
  /** Pflichtfeld: aria-required (Validierung läuft per JS, nicht nativ) */
  required?: boolean
  ref?: Ref<HTMLInputElement>
}

/** Beschriftetes Eingabefeld mit Inline-Fehlermeldung (aria-invalid / aria-describedby). */
export function Field({ id, label, error, hint, required, className = '', ref, ...rest }: FieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-11 w-full rounded-xl border bg-ink-950/60 px-3.5 text-[16px] text-text placeholder:text-faint transition-colors focus:border-mint/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm ${
          error ? 'border-rose-400' : 'border-faint/70 hover:border-mint/60'
        } ${className}`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  )
}
