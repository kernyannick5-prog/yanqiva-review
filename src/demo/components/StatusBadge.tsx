import type { CardStatus } from '../types'

interface StatusBadgeProps {
  status: CardStatus
  /** Großbuchstaben (AKTIV) statt Fließtext (Aktiv) */
  uppercase?: boolean
  className?: string
}

/** Statuspunkt (pulsierend, solange aktiv) mit Beschriftung. */
export function StatusBadge({ status, uppercase = false, className = '' }: StatusBadgeProps) {
  const active = status === 'active'
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium ${uppercase ? 'uppercase tracking-wider' : ''} ${
        active ? 'text-mint' : 'text-muted'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {active && <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />}
        <span aria-hidden className={`relative inline-flex h-2 w-2 rounded-full ${active ? 'bg-mint' : 'bg-faint'}`} />
      </span>
      {active ? 'Aktiv' : 'Pausiert'}
    </span>
  )
}
