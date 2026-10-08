import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LinkButton } from '../components/Button'

const links = [
  { href: '#how', label: 'Produkt' },
  { href: '#demo', label: 'Demo' },
  { href: '#qr', label: 'QR' },
  { href: '#pricing', label: 'Preise' },
] as const

/** Sticky Glas-Navbar mit Scroll-Verdichtung und Mobile-Overlay. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        aria-label="Hauptnavigation"
        className={`relative z-10 mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 transition-[background-color,border-color,box-shadow,height] duration-300 sm:px-6 ${
          scrolled || open
            ? 'h-14 border-line bg-ink-900/85 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_10px_40px_-15px_rgb(0_0_0/0.8)] backdrop-blur-xl'
            : 'h-16 border-transparent bg-transparent'
        }`}
      >
        <a href="#top" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-2.5 transition-opacity active:opacity-70" aria-label="YANQIVA REVIEW – zum Seitenanfang">
          <span className="font-display text-lg font-bold tracking-[0.12em] text-text">YANQIVA</span>
          <span className="rounded-full border border-mint/40 bg-mint/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-mint">Review</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-muted transition-colors hover:text-text active:bg-white/[0.08] active:text-text">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <LinkButton href="#demo" className="!min-h-11 !px-5 !text-sm">Demo ansehen</LinkButton>
        </div>

        <button
          type="button"
          className="relative flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] transition-[transform,background-color] active:scale-95 active:bg-white/[0.12] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden className="relative block h-3.5 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-text transition-transform duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-[6px] h-0.5 w-5 rounded bg-text transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-[12px] h-0.5 w-5 rounded bg-text transition-transform duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 flex flex-col bg-ink-950/95 px-6 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          >
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.06 * i + 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center font-display text-3xl font-semibold tracking-tight transition-colors active:text-mint">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8" onClick={() => setOpen(false)}>
              <LinkButton href="#demo" className="w-full">Demo ansehen</LinkButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
