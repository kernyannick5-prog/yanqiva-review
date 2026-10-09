import type { ReactNode } from 'react'

/** Kleines mint Label in Großbuchstaben über Section-Überschriften. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c4b5fd] ${className}`}>
      <span aria-hidden className="h-px w-6 bg-gradient-to-r from-violet-glow/0 to-violet-glow" />
      {children}
    </p>
  )
}

/** Einheitlicher Seiten-Container. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
}

/** Einheitliche Section-Headline (clamp pro Breakpoint). */
export const sectionTitle =
  'font-display text-[clamp(1.85rem,1.2rem+2.9vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance'

/** Lead-Text unter der Headline (max. ~65 Zeichen pro Zeile). */
export const sectionLead = 'mt-4 max-w-[65ch] text-pretty text-base leading-relaxed text-muted sm:text-lg'

interface SectionHeadProps {
  eyebrow: string
  id: string
  children: ReactNode
  lead?: ReactNode
  /** Zentrierter Kopf (z. B. Demo-Sektion). */
  center?: boolean
}

/** Einheitlicher Sektionskopf: Eyebrow, Headline, optionaler Lead. */
export function SectionHead({ eyebrow, id, children, lead, center = false }: SectionHeadProps) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className={`${sectionTitle} mt-3 sm:mt-4`}>
        {children}
      </h2>
      {lead && <p className={`${sectionLead} ${center ? 'mx-auto' : ''}`}>{lead}</p>}
    </div>
  )
}
