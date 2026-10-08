import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  /** Optionaler Zusatz rechts neben dem Titel (Filter, Link …) */
  action?: ReactNode
  description?: string
  className?: string
  children: ReactNode
}

/** Dunkle Glas-Kachel mit Titelzeile – Grundbaustein aller Dashboard-Views. */
export function Panel({ title, action, description, className = '', children }: PanelProps) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-line bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[border-color,background-color] duration-300 hover:border-mint/25 hover:bg-white/[0.045] sm:p-5 ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h4 className="font-display text-base font-semibold text-text">{title}</h4>
          {description && <p className="mt-0.5 text-[13px] text-faint">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
