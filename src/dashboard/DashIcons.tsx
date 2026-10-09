import type { ReactNode } from 'react'

function Svg({ children, className = 'h-5 w-5' }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" className={className}>
      {children}
    </svg>
  )
}

export const ClockIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)

export const LogoutIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M14 4.5h4.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </Svg>
)

export const AlertIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M12 4l9 15.5H3z" />
    <path d="M12 10v4M12 17v.01" />
  </Svg>
)
