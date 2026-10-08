import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../sections/ui'
import { useLoopVisible } from '../lib/useLoopVisible'
import { AccountChip } from './components/AccountChip'
import { LockIcon } from './components/Icons'
import { Toast, type ToastMessage } from './components/Toast'
import { NAV_ITEMS } from './navItems'
import { Sidebar } from './Sidebar'
import type { ViewId } from './types'
import { useDemoStore } from './useDemoStore'
import { Cards } from './views/Cards'
import { Company } from './views/Company'
import { Overview } from './views/Overview'
import { Reviews } from './views/Reviews'
import { Settings } from './views/Settings'
import { Statistics } from './views/Statistics'

/** Abschnitt „Interaktive Demo“: klickbares Dashboard mit ausschließlich erfundenen Daten. */
export function DashboardDemo() {
  const { cards, settings, addCard, updateTargetUrl, toggleSetting, reset } = useDemoStore()
  const [view, setView] = useState<ViewId>('overview')
  const [statsCard, setStatsCard] = useState('all')
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const loop = useLoopVisible<HTMLElement>()

  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), [])
  const dismissToast = useCallback(() => setToast(null), [])

  const navigate = (next: ViewId) => {
    if (next === 'statistics' && view !== 'statistics') setStatsCard('all')
    setView(next)
  }

  const openStats = (cardId: string) => {
    setStatsCard(cardId)
    setView('statistics')
  }

  const handleReset = () => {
    reset()
    setStatsCard('all')
    notify('Demo zurückgesetzt')
  }

  const meta = NAV_ITEMS.find((n) => n.id === view) ?? NAV_ITEMS[0]

  return (
    <MotionConfig reducedMotion="user">
      <section id="demo" ref={loop} aria-labelledby="demo-title" className="section-y section-sep relative overflow-x-clip">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <SectionHead
              center
              eyebrow="Interaktive Demo"
              id="demo-title"
              lead="Klick dich durch: Verwalte Karten und Links, lege eine neue Karte an und teste den QR-Code."
            >
              Dein YANQIVA <span className="text-gradient">Dashboard</span>
            </SectionHead>
            <p className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-line bg-white/[0.04] px-3.5 py-2 text-left text-[13px] leading-snug text-muted">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-violet-glow" />
              Demo-Daten – alle Firmen und Zahlen sind erfunden
            </p>
          </Reveal>

          <motion.div
            className="relative mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute -inset-x-10 -inset-y-24 sm:-inset-x-16 -z-10 bg-[radial-gradient(closest-side,rgb(139_92_246/0.17),transparent)]" />
            <div className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <div className="flex items-center gap-3 border-b border-line bg-ink-950/40 px-4 py-3">
                <div aria-hidden className="flex shrink-0 gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto flex min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-ink-950/60 px-3 py-1 text-xs text-muted">
                  <LockIcon className="h-3 w-3 shrink-0 text-faint" />
                  <span className="truncate">yanqiva-bewertung.de/dashboard</span>
                </div>
                <span className="shrink-0 rounded-md border border-mint/40 bg-mint/10 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-mint">
                  DEMO
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
                <Sidebar view={view} onChange={navigate} cardCount={cards.length} />

                <div className="min-w-0 p-4 sm:min-h-[34rem] sm:p-6 lg:min-h-[40rem] lg:p-7">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-semibold text-text sm:text-2xl">{meta.title}</h3>
                      <p className="mt-1 max-w-[65ch] text-sm leading-snug text-muted sm:text-[15px]">{meta.description}</p>
                    </div>
                    <AccountChip cardCount={cards.length} className="hidden shrink-0 sm:flex lg:hidden" />
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={view}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="min-w-0"
                    >
                      {view === 'overview' && <Overview cards={cards} onNavigate={navigate} />}
                      {view === 'cards' && (
                        <Cards cards={cards} onCreate={addCard} onUpdateTarget={updateTargetUrl} onOpenStats={openStats} notify={notify} />
                      )}
                      {view === 'statistics' && <Statistics cards={cards} selected={statsCard} onSelect={setStatsCard} />}
                      {view === 'reviews' && <Reviews cards={cards} />}
                      {view === 'company' && <Company cards={cards} />}
                      {view === 'settings' && <Settings settings={settings} onToggle={toggleSetting} onReset={handleReset} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <Toast toast={toast} onDismiss={dismissToast} />
      </section>
    </MotionConfig>
  )
}
