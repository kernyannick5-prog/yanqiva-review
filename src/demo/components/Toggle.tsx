import { motion, useReducedMotion } from 'framer-motion'

interface ToggleProps {
  id: string
  checked: boolean
  onChange: () => void
  label: string
  description: string
}

/** Switch-Zeile (role="switch"), Touch-Ziel ≥ 44 px. */
export function Toggle({ id, checked, onChange, label, description }: ToggleProps) {
  const reduce = useReducedMotion()
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p id={`${id}-label`} className="text-sm font-medium text-text">
          {label}
        </p>
        <p id={`${id}-desc`} className="mt-0.5 text-xs text-faint">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        onClick={onChange}
        className="group relative flex h-11 w-[60px] shrink-0 items-center justify-center"
      >
        <span
          aria-hidden
          className={`relative h-7 w-12 rounded-full border transition-[color,background-color,border-color,transform] duration-200 group-active:scale-95 ${
            checked ? 'border-mint/60 bg-mint/30' : 'border-faint bg-white/[0.06]'
          }`}
        >
          <motion.span
            className={`absolute left-0.5 top-0.5 h-[22px] w-[22px] rounded-full ${checked ? 'bg-mint' : 'bg-muted'}`}
            animate={{ x: checked ? 20 : 0 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 32 }}
          />
        </span>
      </button>
    </div>
  )
}
