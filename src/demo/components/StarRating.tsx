interface StarRatingProps {
  /** Wert 0–5 (auch Kommazahlen: wird gerundet dargestellt) */
  value: number
  className?: string
}

/** Sternzeile mit Screenreader-Text. */
export function StarRating({ value, className = 'text-base' }: StarRatingProps) {
  const filled = Math.round(value)
  return (
    <span role="img" aria-label={`${value.toLocaleString('de-DE')} von 5 Sternen`} className={`inline-flex gap-0.5 leading-none ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden className={n <= filled ? 'text-amber-300' : 'text-white/15'}>
          ★
        </span>
      ))}
    </span>
  )
}
