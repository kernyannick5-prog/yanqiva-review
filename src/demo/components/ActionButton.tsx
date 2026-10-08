import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-[transform,background-color,border-color,box-shadow] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-mint text-ink-950 shadow-[0_0_0_1px_rgb(94_234_212/0.4),0_8px_24px_-10px_rgb(94_234_212/0.7)] hover:bg-mint-strong',
  ghost: 'border border-line bg-white/[0.04] text-text hover:border-mint/40 hover:bg-white/[0.08]',
}

interface CommonProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

export function ActionButton({
  variant = 'ghost',
  className = '',
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ActionLink({
  variant = 'ghost',
  className = '',
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
