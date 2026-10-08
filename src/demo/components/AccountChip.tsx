interface AccountChipProps {
  cardCount: number
  className?: string
}

/** Firmenprofil-Chip des Demo-Kontos (display über className steuern, z. B. "flex"). */
export function AccountChip({ cardCount, className = '' }: AccountChipProps) {
  return (
    <div className={`min-w-0 items-center gap-3 rounded-xl border border-line bg-white/[0.04] p-2.5 ${className}`}>
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-glow to-mint-strong font-display text-sm font-semibold text-ink-950"
      >
        DK
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text">Demo-Konto</p>
        <p className="truncate text-xs text-faint">{cardCount === 1 ? '1 Karte' : `${cardCount} Karten`} · Demo</p>
      </div>
    </div>
  )
}
