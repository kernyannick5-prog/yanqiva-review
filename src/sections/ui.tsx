import type { ReactNode } from 'react'

/** Kleines mint Label in Großbuchstaben über Section-Überschriften. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-mint">
      <span aria-hidden className="h-px w-6 bg-mint/60" />
      {children}
    </p>
  )
}

/** Einheitlicher Seiten-Container. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
}

export const sectionTitle =
  'font-display text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance'
