import { CountUp } from '../../components/CountUp'
import { Sparkline } from './Sparkline'

interface StatCardProps {
  label: string
  value: number
  decimals?: number
  suffix?: string
  /** z. B. "+12 %" */
  delta: string
  hint: string
  trend: number[]
}

/** KPI-Kachel: große Zahl (CountUp), Delta-Badge und Mini-Trend. */
export function StatCard({ label, value, decimals = 0, suffix = '', delta, hint, trend }: StatCardProps) {
  return (
    <div className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-line bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-mint/30 hover:bg-white/[0.05]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.2),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <p className="text-[13px] font-medium leading-snug text-muted">{label}</p>
      <p className="mt-2 font-display text-[28px] font-semibold leading-none tabular-nums text-text sm:text-3xl">
        <CountUp to={value} decimals={decimals} suffix={suffix} />
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-2 gap-y-2.5">
        <span className="rounded-full bg-mint/10 px-2 py-0.5 text-xs font-medium text-mint">{delta}</span>
        <Sparkline values={trend} className="h-7 w-20" />
      </div>
      <p className="mt-2 text-xs leading-snug text-faint">{hint}</p>
    </div>
  )
}
