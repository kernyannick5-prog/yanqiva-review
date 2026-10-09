import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { CardsIcon, ChartIcon, OverviewIcon } from '../demo/components/Icons'
import { Toast, type ToastMessage } from '../demo/components/Toast'
import { ApiError, getMe, isSessionError, type DashCard, type Me } from './api'
import { CardQrModal } from './CardQrModal'
import { ClockIcon, LogoutIcon } from './DashIcons'
import { ErrorPanel, LoadingPanel } from './parts'
import { SiteBrand, SiteFooter, SkipLink } from './PageFrame'
import { RenewalModal } from './RenewalModal'
import type { StoredSession } from './session'
import { TargetModal } from './TargetModal'
import { CardsView, OverviewView, StatsView, TermView, type ViewId } from './views'

const NAV: { id: ViewId; label: string; title: string; description: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Übersicht', title: 'Übersicht', description: 'Aufrufe Ihrer Karten der letzten 30 Tage.', Icon: OverviewIcon },
  { id: 'cards', label: 'Karten', title: 'Meine Karten', description: 'Ziel ändern und QR-Codes ansehen.', Icon: CardsIcon },
  { id: 'stats', label: 'Statistik', title: 'Statistik', description: 'Wie oft Ihre Karten per NFC und QR-Code aufgerufen werden.', Icon: ChartIcon },
  { id: 'term', label: 'Laufzeit', title: 'Laufzeit', description: 'Dauer Ihres Dashboard-Zugangs und Verlängerung.', Icon: ClockIcon },
]

interface AppShellProps {
  stored: StoredSession
  onSignOut: () => void
  onExpired: () => void
}

type Modal = { kind: 'target'; card: DashCard } | { kind: 'qr'; card: DashCard } | { kind: 'renew' } | null

/** Angemeldeter Bereich: lädt /me, zeigt Navigation und Ansichten. Eine abgelaufene Sitzung führt zurück zum Login. */
export function AppShell({ stored, onSignOut, onExpired }: AppShellProps) {
  const token = stored.session
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadN, setReloadN] = useState(0)
  const [view, setView] = useState<ViewId>('overview')
  const [statsCard, setStatsCard] = useState<number | 'all'>('all')
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstView = useRef(true)

  useEffect(() => {
    let alive = true
    getMe(token)
      .then((m) => {
        if (!alive) return
        setMe(m)
        setError(null)
      })
      .catch((e: unknown) => {
        if (!alive) return
        if (isSessionError(e)) return onExpired()
        setError(e instanceof ApiError ? e.message : 'Das Dashboard konnte nicht geladen werden.')
      })
    return () => {
      alive = false
    }
  }, [token, reloadN, onExpired])

  // Fokus auf die Ansichts-Überschrift beim Wechsel (nicht beim ersten Laden)
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: false })
  }, [view])

  const reload = useCallback(() => setReloadN((n) => n + 1), [])
  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), [])
  const dismissToast = useCallback(() => setToast(null), [])
  const closeModal = () => setModal(null)
  const meta = NAV.find((n) => n.id === view) ?? NAV[0]

  return (
    <MotionConfig reducedMotion="user">
      <div className="section-light flex min-h-dvh flex-col">
        <SkipLink />
        <header className="border-b border-line">
          <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1 sm:px-6">
            <SiteBrand />
            <div className="flex min-w-0 items-center gap-3">
              <p className="hidden min-w-0 text-right text-[13px] leading-tight sm:block">
                <span className="block truncate font-medium text-text">{me?.customer.company ?? stored.company}</span>
                <span className="block truncate text-faint">{me?.user.email ?? stored.email}</span>
              </p>
              <ActionButton onClick={onSignOut}>
                <LogoutIcon className="h-4 w-4" />
                Abmelden
              </ActionButton>
            </div>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none sm:px-6 sm:py-10">
          <h1 className="font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] font-semibold tracking-tight text-text">Kunden-Dashboard</h1>
          <p className="mb-5 mt-1 text-[15px] text-muted sm:hidden">
            {me?.customer.company ?? stored.company} · {me?.user.email ?? stored.email}
          </p>

          <div className="section-dark mt-4 rounded-2xl bg-ink-950 shadow-[0_40px_80px_-40px_rgb(11_44_35/0.55)] sm:rounded-3xl">
            <div className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div className="min-w-0 border-b border-line bg-ink-950/30 p-2 lg:border-b-0 lg:border-r lg:p-4">
                  <nav aria-label="Dashboard-Navigation" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                    {NAV.map(({ id, label, Icon }) => {
                      const on = id === view
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-current={on ? 'page' : undefined}
                          onClick={() => {
                            if (id === 'stats' && view !== 'stats') setStatsCard('all')
                            setView(id)
                          }}
                          onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' })}
                          className={`flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition-colors focus-visible:outline-offset-[-2px] lg:w-full ${
                            on ? 'bg-white/[0.08] text-text shadow-[inset_0_0_0_1px_rgb(94_234_212/0.3)]' : 'text-muted hover:bg-white/[0.04] hover:text-text'
                          }`}
                        >
                          <Icon className={`h-[18px] w-[18px] ${on ? 'text-mint' : ''}`} />
                          {label}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                <div className="min-w-0 p-4 sm:min-h-[30rem] sm:p-6 lg:p-7">
                  <div className="mb-5">
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-semibold text-text outline-none sm:text-2xl">
                      {meta.title}
                    </h2>
                    <p className="mt-1 max-w-[65ch] text-sm leading-snug text-muted sm:text-[15px]">{meta.description}</p>
                  </div>

                  {!me && !error && <LoadingPanel label="Dashboard wird geladen …" />}
                  {!me && error && <ErrorPanel message={error} onRetry={reload} />}
                  {me && (
                    <>
                      {error && <ErrorPanel message={error} onRetry={reload} />}
                      {view === 'overview' && <OverviewView me={me} token={token} onExpired={onExpired} onNavigate={setView} onRenew={() => setModal({ kind: 'renew' })} />}
                      {view === 'cards' && (
                        <CardsView
                          me={me}
                          onEdit={(card) => setModal({ kind: 'target', card })}
                          onQr={(card) => setModal({ kind: 'qr', card })}
                          onStats={(card) => {
                            setStatsCard(card.id)
                            setView('stats')
                          }}
                        />
                      )}
                      {view === 'stats' && <StatsView me={me} token={token} onExpired={onExpired} initialCard={statsCard} />}
                      {view === 'term' && <TermView me={me} onRenew={() => setModal({ kind: 'renew' })} />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />

        <AnimatePresence>
          {modal?.kind === 'target' && (
            <TargetModal
              key="target"
              card={modal.card}
              token={token}
              onClose={closeModal}
              onExpired={onExpired}
              onDone={(msg) => {
                closeModal()
                notify(msg)
                reload()
              }}
            />
          )}
          {modal?.kind === 'qr' && <CardQrModal key="qr" card={modal.card} onClose={closeModal} />}
          {modal?.kind === 'renew' && me && (
            <RenewalModal
              key="renew"
              token={token}
              accessUntil={me.access.accessUntil}
              expired={me.access.status === 'expired'}
              onClose={closeModal}
              onExpired={onExpired}
              onDone={(already) => {
                closeModal()
                notify(already ? 'Ihre Anfrage liegt uns bereits vor.' : 'Anfrage gesendet. Wir melden uns bei Ihnen.')
                reload()
              }}
            />
          )}
        </AnimatePresence>
        <Toast toast={toast} onDismiss={dismissToast} />
      </div>
    </MotionConfig>
  )
}
