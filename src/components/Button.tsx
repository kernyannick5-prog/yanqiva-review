import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

const base =
  'group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-[15px] sm:px-6 font-medium transition-[transform,box-shadow,background-color,border-color] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-[#7ff0dc] to-mint text-ink-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.55),0_0_0_1px_rgb(94_234_212/0.4),0_8px_30px_-8px_rgb(94_234_212/0.6)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.55),0_0_0_1px_rgb(94_234_212/0.6),0_14px_40px_-8px_rgb(94_234_212/0.75)]',
  ghost:
    'border border-white/15 bg-white/[0.04] text-text shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] hover:-translate-y-0.5 hover:border-mint/40 hover:bg-white/[0.07]',
}

/** Glanz-Sweep, der beim Hover über den Button läuft. */
const Sheen = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
  />
)

interface CommonProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

export function Button({ variant = 'primary', className = '', children, ...rest }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Sheen />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  )
}

export function LinkButton({ variant = 'primary', className = '', children, ...rest }: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Sheen />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </a>
  )
}
