import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { AccountChip } from './components/AccountChip'
import { NAV_ITEMS } from './navItems'
import type { ViewId } from './types'

interface SidebarProps {
  view: ViewId
  onChange: (view: ViewId) => void
  cardCount: number
}

/** Desktop: vertikale Sidebar. <1024 px: horizontal scrollbare Tab-Leiste (nur die Leiste scrollt). */
export function Sidebar({ view, onChange, cardCount }: SidebarProps) {
  const navRef = useRef<HTMLElement>(null)

  // Fade-Kanten als Scroll-Hinweis: Zustand wird direkt ins DOM geschrieben (kein Re-Render).
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const update = () => {
      const max = nav.scrollWidth - nav.clientWidth
      const start = nav.scrollLeft > 4
      const end = nav.scrollLeft < max - 4
      nav.dataset.fade = max <= 4 ? 'none' : start && end ? 'both' : end ? 'end' : start ? 'start' : 'none'
    }
    update()
    nav.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(nav)
    return () => {
      nav.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  // Aktiven Tab in der mobilen Leiste zentrieren, ohne die Seite zu scrollen.
  useEffect(() => {
    const nav = navRef.current
    const btn = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !btn || nav.scrollWidth <= nav.clientWidth) return
    nav.scrollTo({ left: btn.offsetLeft - (nav.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' })
  }, [view])

  return (
    <aside className="flex min-w-0 flex-col border-b border-line bg-ink-950/30 py-2 pl-2 pr-0 sm:px-3 lg:border-b-0 lg:border-r lg:p-4">
      <nav
        ref={navRef}
        aria-label="Dashboard-Navigation"
        className="yq-fade relative flex gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
      >
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = id === view
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-offset-[-2px] lg:w-full ${
                active ? 'text-text' : 'text-muted hover:bg-white/[0.04] hover:text-text'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="demo-nav-indicator"
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgb(94_234_212/0.3)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative flex items-center gap-2.5">
                <Icon className={`h-[18px] w-[18px] transition-colors ${active ? 'text-mint' : ''}`} />
                {label}
              </span>
            </button>
          )
        })}
      </nav>
      <AccountChip cardCount={cardCount} className="mt-auto hidden lg:flex" />
    </aside>
  )
}
