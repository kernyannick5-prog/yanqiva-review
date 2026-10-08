import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckIcon } from './Icons'

export interface ToastMessage {
  id: number
  text: string
}

interface ToastProps {
  toast: ToastMessage | null
  onDismiss: () => void
}

/** Kurze Statusmeldung (aria-live), verschwindet nach ca. 2,8 s. */
export function Toast({ toast, onDismiss }: ToastProps) {
  const id = toast?.id
  useEffect(() => {
    if (id === undefined) return
    const timer = window.setTimeout(onDismiss, 2800)
    return () => window.clearTimeout(timer)
  }, [id, onDismiss])

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[110] flex justify-center px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 rounded-full border border-mint/30 bg-ink-800 px-4 py-2.5 text-sm font-medium text-text shadow-[0_12px_40px_-10px_rgb(94_234_212/0.45)]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-ink-950">
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
