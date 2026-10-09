import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Card } from '../types'
import { totalScans } from '../utils'
import { useMotionPaused } from '../../lib/motionPause'
import { NfcIcon, QrIcon } from './Icons'

interface FeedEvent {
  id: number
  channel: 'nfc' | 'qr'
  business: string
  at: number
}

const MAX_EVENTS = 5

function ago(at: number, now: number) {
  const s = Math.max(0, Math.round((now - at) / 1000))
  if (s < 5) return 'gerade eben'
  if (s < 60) return `vor ${s} Sek.`
  return `vor ${Math.round(s / 60)} Min.`
}

/**
 * Simulierter Live-Feed: neue Scans erscheinen alle paar Sekunden – aber nur, solange
 * der Feed sichtbar ist (useInView), der Tab im Vordergrund liegt und keine reduzierte Bewegung gewünscht ist.
 */
export function LiveFeed({ cards }: { cards: Card[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const nextId = useRef(100)
  const inView = useInView(ref, { amount: 0.2 })
  const reduce = useReducedMotion()
  const paused = useMotionPaused()
  const active = useMemo(() => cards.filter((c) => c.status === 'active' && totalScans(c) > 0), [cards])
  const [now, setNow] = useState(() => Date.now())
  const [events, setEvents] = useState<FeedEvent[]>(() =>
    cards
      .filter((c) => c.status === 'active' && totalScans(c) > 0)
      .slice(0, 3)
      .map((c, i) => ({ id: i, channel: i % 2 === 0 ? 'nfc' : 'qr', business: c.businessName, at: Date.now() - (i + 1) * 47_000 })),
  )

  useEffect(() => {
    if (!inView || reduce || paused || active.length === 0) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          const card = active[Math.floor(Math.random() * active.length)]
          const t = Date.now()
          setNow(t)
          setEvents((prev) =>
            [{ id: nextId.current++, channel: Math.random() < 0.7 ? ('nfc' as const) : ('qr' as const), business: card.businessName, at: t }, ...prev].slice(0, MAX_EVENTS),
          )
        }
        schedule()
      }, 2600 + Math.random() * 2600)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [inView, reduce, paused, active])

  return (
    <div ref={ref}>
      {events.length === 0 ? (
        <p className="py-6 text-center text-sm text-faint">Sobald deine Karten gescannt werden, erscheinen sie hier.</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.li
                key={e.id}
                layout={!reduce}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-ink-950/40 px-3 py-2.5"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${e.channel === 'nfc' ? 'bg-mint/10 text-mint' : 'bg-violet-glow/15 text-[#c4b5fd]'}`}>
                  {e.channel === 'nfc' ? <NfcIcon className="h-4 w-4" /> : <QrIcon className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-text">{e.channel === 'nfc' ? 'Neuer NFC-Tap' : 'Neuer QR-Scan'}</span>
                  <span className="flex gap-1.5 text-xs text-muted">
                    <span className="truncate">{e.business}</span>
                    <span className="shrink-0 tabular-nums">· {ago(e.at, now)}</span>
                  </span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
