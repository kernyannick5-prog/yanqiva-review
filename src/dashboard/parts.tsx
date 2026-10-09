import type { ReactNode } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { AlertIcon } from './DashIcons'

/** Kennzahl-Kachel (statische Zahl, keine Zählanimation). */
export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] sm:p-4">
      <p className="text-[13px] font-medium leading-snug text-muted">{label}</p>
      <p className="mt-2 font-display text-[28px] font-semibold leading-none tabular-nums text-text sm:text-3xl">{value}</p>
      {hint && <p className="mt-2 text-xs leading-snug text-faint">{hint}</p>}
    </div>
  )
}

/** Hinweisleiste. tone "warn" = Handlungsbedarf (Laufzeit), "info" = neutrale Information. */
export function Banner({ tone = 'info', title, children, action }: { tone?: 'warn' | 'info'; title: string; children: ReactNode; action?: ReactNode }) {
  const warn = tone === 'warn'
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${warn ? 'border-amber-300/35 bg-amber-300/[0.07]' : 'border-mint/30 bg-mint/[0.06]'}`}>
      <div className="min-w-0">
        <p className={`flex items-center gap-2 font-display text-sm font-semibold ${warn ? 'text-amber-300' : 'text-mint'}`}>
          {warn && <AlertIcon className="h-4 w-4 shrink-0" />}
          {title}
        </p>
        <div className="mt-1.5 text-[14px] leading-relaxed text-text">{children}</div>
      </div>
      {action}
    </div>
  )
}

export function LoadingPanel({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-5 text-sm text-muted">
      <span aria-hidden className="size-4 shrink-0 animate-spin rounded-full border-2 border-mint/30 border-t-mint" />
      {label}
    </div>
  )
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-300/60 bg-red-300/[0.08] p-4 sm:p-5">
      <p className="text-[15px] leading-snug text-red-100">{message}</p>
      {onRetry && (
        <ActionButton className="mt-3" onClick={onRetry}>
          Erneut versuchen
        </ActionButton>
      )}
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/[0.02] p-6 text-center">
      <p className="font-display text-base font-semibold text-text">{title}</p>
      <div className="mx-auto mt-1.5 max-w-[48ch] text-[14px] leading-relaxed text-muted">{children}</div>
    </div>
  )
}
