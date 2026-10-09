import { useState } from 'react'
import { ActionButton } from '../demo/components/ActionButton'
import { ChartIcon, CheckIcon, NfcIcon, PencilIcon, QrIcon, ShieldIcon } from '../demo/components/Icons'
import { LineChart } from '../demo/components/LineChart'
import { Panel } from '../demo/components/Panel'
import { type DashCard, type Me, type StatsRange } from './api'
import { cardTitle, daysText, formatDay, formatInt, shortUrl, toChartPoints } from './format'
import { Banner, EmptyState, ErrorPanel, Kpi, LoadingPanel } from './parts'
import { useStats } from './useStats'

export type ViewId = 'overview' | 'cards' | 'stats' | 'term'

interface Common {
  me: Me
  token: string
  onExpired: () => void
}

/** Zustand des Ziels einer Karte als Text (immer mit Text, nie nur Farbe). */
function targetStatus(c: DashCard): { label: string; tone: 'ok' | 'wait' | 'off' } {
  if (!c.dashboardActive) return { label: 'Dashboard beendet: Weiterleitung zu Google', tone: 'off' }
  if (c.customStatus === 'pending') return { label: 'Eigenes Ziel wartet auf Freigabe', tone: 'wait' }
  if (c.customStatus === 'rejected') return { label: 'Eigenes Ziel nicht freigegeben', tone: 'off' }
  if (c.usingCustom) return { label: 'Eigenes Ziel aktiv', tone: 'ok' }
  return { label: 'Google-Bewertungslink aktiv', tone: 'ok' }
}

const toneClass = { ok: 'text-mint', wait: 'text-amber-300', off: 'text-muted' } as const

function StatusLine({ card }: { card: DashCard }) {
  const s = targetStatus(card)
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${toneClass[s.tone]}`}>
      {s.tone === 'ok' ? <CheckIcon className="h-3.5 w-3.5" /> : <span aria-hidden className="size-2 rounded-full bg-current" />}
      {s.label}
    </span>
  )
}

function RenewalBanner({ me, onRenew }: { me: Me; onRenew: () => void }) {
  const a = me.access
  if (!a.renewalHint || !a.accessUntil) return null
  const expired = a.status === 'expired'
  const button = a.renewalRequestedAt ? (
    <p className="shrink-0 text-sm text-muted">Anfrage gesendet am {formatDay(a.renewalRequestedAt.slice(0, 10))}</p>
  ) : (
    <ActionButton variant="primary" className="shrink-0" onClick={onRenew}>
      Verlängerung anfragen
    </ActionButton>
  )
  return (
    <Banner tone="warn" title={expired ? 'Ihr Dashboard-Zugang ist beendet' : `Ihr Dashboard-Zugang endet am ${formatDay(a.accessUntil)} (${daysText(a.daysLeft ?? 0)})`} action={button}>
      {expired
        ? 'Ihre Karten funktionieren weiter und leiten zum zuletzt eingestellten Google-Bewertungsformular. Statistik und Zieländerung stehen nicht mehr zur Verfügung.'
        : 'Danach leiten Ihre Karten weiter zum zuletzt eingestellten Google-Bewertungsformular; Statistik und Zieländerung entfallen. Verlängert wird nur auf Ihre Anfrage, nie automatisch.'}
    </Banner>
  )
}

// ---- Übersicht

export function OverviewView({ me, token, onExpired, onNavigate, onRenew }: Common & { onNavigate: (v: ViewId) => void; onRenew: () => void }) {
  const active = me.access.status === 'active'
  const stats = useStats(token, 'all', '30', active && me.cards.length > 0, onExpired)
  const totals = me.cards.reduce((a, c) => ({ nfc: a.nfc + (c.last30?.nfc ?? 0), qr: a.qr + (c.last30?.qr ?? 0) }), { nfc: 0, qr: 0 })
  return (
    <div className="space-y-4">
      <RenewalBanner me={me} onRenew={onRenew} />
      {me.cards.length === 0 ? (
        <EmptyState title="Noch keine Karten">Für Ihr Konto sind noch keine Karten hinterlegt. Sobald Ihre Karten eingerichtet sind, erscheinen sie hier. Fragen: support@yanqiva.de</EmptyState>
      ) : (
        <>
          {active ? (
            <section aria-labelledby="ov-kpi" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              <h3 id="ov-kpi" className="sr-only">
                Aufrufe der letzten 30 Tage
              </h3>
              <Kpi label="NFC-Taps (30 Tage)" value={formatInt(totals.nfc)} />
              <Kpi label="QR-Scans (30 Tage)" value={formatInt(totals.qr)} />
              <div className="col-span-2 md:col-span-1">
                <Kpi label="Aufrufe gesamt" value={formatInt(totals.nfc + totals.qr)} hint="NFC und QR zusammen" />
              </div>
            </section>
          ) : (
            <EmptyState title="Statistik nicht mehr verfügbar">Nach dem Ende des Dashboard-Zugangs werden keine Aufrufe mehr gezählt oder angezeigt.</EmptyState>
          )}
          {active && (
            <Panel headingLevel={3} title="Aufrufe der letzten 30 Tage" description="Alle Karten, NFC und QR zusammen">
              {stats.status === 'loading' && <LoadingPanel label="Statistik wird geladen …" />}
              {stats.status === 'error' && <ErrorPanel message={stats.message} />}
              {stats.status === 'ready' && <LineChart points={toChartPoints(stats.data.points, 'day')} valueLabel="Aufrufe" ariaLabel="Liniendiagramm: Aufrufe der letzten 30 Tage" />}
            </Panel>
          )}
          <Panel
            headingLevel={3}
            title="Meine Karten"
            action={
              <ActionButton onClick={() => onNavigate('cards')} className="-mt-1">
                Alle Karten
              </ActionButton>
            }
          >
            <ul className="space-y-3">
              {me.cards.slice(0, 3).map((c) => (
                <li key={c.id} className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-ink-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">{cardTitle(c)}</p>
                    <p className="mt-1">
                      <StatusLine card={c} />
                    </p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-muted">{c.last30 ? `${formatInt(c.last30.nfc)} NFC · ${formatInt(c.last30.qr)} QR` : 'Keine Zähler'}</p>
                </li>
              ))}
            </ul>
            {me.cards.length > 3 && <p className="mt-3 text-[13px] text-faint">+ {me.cards.length - 3} weitere Karten</p>}
          </Panel>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-faint">
            <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
            Gezählt werden nur Aufrufe je Karte und Tag (NFC und QR). Es gibt keine Besucherdaten und keine Bewertungsdaten von Google.
          </p>
        </>
      )}
    </div>
  )
}

// ---- Karten

export function CardsView({ me, onEdit, onQr, onStats }: { me: Me; onEdit: (c: DashCard) => void; onQr: (c: DashCard) => void; onStats: (c: DashCard) => void }) {
  if (me.cards.length === 0) return <EmptyState title="Noch keine Karten">Für Ihr Konto sind noch keine Karten hinterlegt.</EmptyState>
  return (
    <ul className="space-y-4">
      {me.cards.map((c) => {
        const canEdit = c.dashboardActive
        return (
          <li key={c.id}>
            <article aria-label={`Karte ${cardTitle(c)}`} className="grid min-w-0 gap-5 rounded-2xl border border-line bg-white/[0.03] p-4 sm:p-5 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
              <div className="relative aspect-[1.586/1] w-full max-w-[300px] self-start overflow-hidden rounded-2xl bg-gradient-to-br from-violet-dark via-indigo-deep to-ink-800 p-4 ring-1 ring-white/15 md:max-w-none">
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-text/80">YANQIVA REVIEW</span>
                    <NfcIcon className="h-6 w-6 text-mint" />
                  </div>
                  <div aria-hidden className="h-6 w-9 rounded-md bg-gradient-to-br from-mint/70 to-mint/20 ring-1 ring-white/20" />
                  <p className="truncate font-display text-lg font-semibold leading-tight text-text">{cardTitle(c)}</p>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Aufrufe (30 Tage)</p>
                    <p className="mt-1 font-display text-3xl font-semibold leading-none tabular-nums text-text">{c.last30 ? formatInt(c.last30.nfc + c.last30.qr) : '–'}</p>
                    {c.last30 && (
                      <p className="mt-1.5 text-xs tabular-nums text-faint">
                        {formatInt(c.last30.nfc)} NFC · {formatInt(c.last30.qr)} QR
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Letzter Aufruf</p>
                    <p className="mt-1 text-sm font-medium text-text">{c.lastDay ? formatDay(c.lastDay) : c.dashboardActive ? 'Noch kein Aufruf' : '–'}</p>
                  </div>
                </div>
                <div className="min-w-0 rounded-xl border border-line bg-ink-950/50 px-3.5 py-2.5">
                  <p className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span>Aktuelles Ziel</span>
                    <StatusLine card={c} />
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[13px] text-mint" title={c.effectiveTarget ?? ''}>
                    {c.effectiveTarget ? shortUrl(c.effectiveTarget) : '–'}
                  </p>
                  {c.customStatus === 'pending' && c.customUrl && <p className="mt-1.5 break-all text-xs text-amber-300">Beantragt: {c.customUrl}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <ActionButton onClick={() => onEdit(c)} disabled={!canEdit} aria-describedby={canEdit ? undefined : `off-${c.id}`}>
                    <PencilIcon className="h-4 w-4" />
                    Ziel ändern
                  </ActionButton>
                  <ActionButton onClick={() => onStats(c)} disabled={!canEdit}>
                    <ChartIcon className="h-4 w-4" />
                    Statistik
                  </ActionButton>
                  <ActionButton onClick={() => onQr(c)}>
                    <QrIcon className="h-4 w-4" />
                    QR-Code
                  </ActionButton>
                </div>
                {!canEdit && (
                  <p id={`off-${c.id}`} className="text-xs leading-snug text-faint">
                    Ziel ändern und Statistik stehen nach dem Ende des Dashboard-Zugangs nicht mehr zur Verfügung.
                  </p>
                )}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

// ---- Statistik

const RANGES: { id: StatsRange; label: string; long: string }[] = [
  { id: '7', label: '7 Tage', long: 'der letzten 7 Tage' },
  { id: '30', label: '30 Tage', long: 'der letzten 30 Tage' },
  { id: '90', label: '90 Tage', long: 'der letzten 90 Tage' },
  { id: '12m', label: '12 Monate', long: 'der letzten 12 Monate' },
]

export function StatsView({ me, token, onExpired, initialCard }: Common & { initialCard: number | 'all' }) {
  const active = me.access.status === 'active'
  const [card, setCard] = useState<number | 'all'>(initialCard)
  const [range, setRange] = useState<StatsRange>('30')
  const [retry, setRetry] = useState(0)
  const stats = useStats(token, card, range, active && me.cards.length > 0, onExpired, retry)
  const rangeInfo = RANGES.find((r) => r.id === range) ?? RANGES[1]
  const options = [{ id: 'all' as const, label: 'Alle Karten' }, ...me.cards.filter((c) => c.dashboardActive).map((c) => ({ id: c.id, label: cardTitle(c) }))]

  if (me.cards.length === 0) return <EmptyState title="Noch keine Karten">Sobald Karten für Ihr Konto eingerichtet sind, sehen Sie hier die Aufrufe.</EmptyState>
  if (!active) return <EmptyState title="Statistik nicht mehr verfügbar">Nach dem Ende des Dashboard-Zugangs werden keine Aufrufe mehr gezählt oder angezeigt.</EmptyState>

  const pill = (on: boolean) =>
    `min-h-11 max-w-full truncate rounded-full border px-4 text-sm font-medium transition-[color,background-color,border-color] ${on ? 'border-mint/50 bg-mint/15 text-mint' : 'border-line bg-white/[0.03] text-muted hover:border-mint/30 hover:text-text'}`

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div role="group" aria-label="Karte filtern" className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button key={o.id} type="button" aria-pressed={card === o.id} onClick={() => setCard(o.id)} className={pill(card === o.id)}>
              {o.label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Zeitraum" className="flex shrink-0 rounded-xl border border-line bg-ink-950/50 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={range === r.id}
              onClick={() => setRange(r.id)}
              className={`min-h-11 min-w-14 rounded-[10px] px-3 text-xs font-medium transition-colors ${range === r.id ? 'bg-white/[0.1] text-text' : 'text-muted hover:text-text'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" aria-busy={stats.status === 'loading'}>
        {stats.status === 'loading' && <LoadingPanel label="Statistik wird geladen …" />}
        {stats.status === 'error' && <ErrorPanel message={stats.message} onRetry={stats.expired ? undefined : () => setRetry((n) => n + 1)} />}
        {stats.status === 'ready' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Kpi label="Gesamt" value={formatInt(stats.data.totals.nfc + stats.data.totals.qr)} />
              <Kpi label="NFC-Taps" value={formatInt(stats.data.totals.nfc)} />
              <Kpi label="QR-Scans" value={formatInt(stats.data.totals.qr)} />
            </div>
            <Panel
            headingLevel={3}
              title={stats.data.granularity === 'month' ? 'Aufrufe pro Monat' : 'Aufrufe pro Tag'}
              description={`${rangeInfo.long.charAt(0).toUpperCase() + rangeInfo.long.slice(1)} · NFC und QR zusammen · ${formatDay(stats.data.from)} bis ${formatDay(stats.data.to)}`}
            >
              {stats.data.totals.nfc + stats.data.totals.qr === 0 && <p className="mb-3 text-sm text-muted">In diesem Zeitraum gab es noch keine Aufrufe.</p>}
              <LineChart
                points={toChartPoints(stats.data.points, stats.data.granularity)}
                valueLabel="Aufrufe"
                unit={stats.data.granularity}
                ariaLabel={`Liniendiagramm: Aufrufe ${rangeInfo.long}`}
              />
            </Panel>
          </div>
        )}
      </div>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-faint">
        <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
        Tage nach deutscher Zeit. Es werden nur Aufrufe der Karten gezählt (aggregiert je Karte und Tag), keine Besucherdaten und keine Bewertungsdaten von Google. Zähler sind Näherungswerte.
      </p>
    </div>
  )
}

// ---- Laufzeit

export function TermView({ me, onRenew }: { me: Me; onRenew: () => void }) {
  const a = me.access
  const dash = me.cards.filter((c) => c.plan === 'dashboard' && c.dashboardUntil)
  if (!a.accessUntil) return <EmptyState title="Kein Dashboard">Zu Ihrem Konto gehört kein Dashboard-Zugang. Fragen: support@yanqiva.de</EmptyState>
  return (
    <div className="space-y-4">
      <RenewalBanner me={me} onRenew={onRenew} />
      <Panel headingLevel={3} title="Ihr Dashboard-Zugang">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted">Status</dt>
            <dd className="mt-1 font-display text-lg font-semibold text-text">{a.status === 'active' ? 'Aktiv' : 'Beendet'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{a.status === 'active' ? 'Läuft bis' : 'Beendet am'}</dt>
            <dd className="mt-1 font-display text-lg font-semibold tabular-nums text-text">{formatDay(a.accessUntil)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Verbleibend</dt>
            <dd className="mt-1 font-display text-lg font-semibold text-text">{a.status === 'active' && a.daysLeft !== null ? daysText(a.daysLeft) : '–'}</dd>
          </div>
        </dl>
        {dash.length > 1 && (
          <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-ink-950/40 text-sm">
            {dash.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5">
                <span className="min-w-0 truncate text-text">{cardTitle(c)}</span>
                <span className="text-xs tabular-nums text-muted">bis {formatDay(c.dashboardUntil as string)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel headingLevel={3} title="Was passiert nach dem Ende?">
        <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-muted">
          <li>Ihre Karten funktionieren weiter und leiten zum zuletzt eingestellten Google-Bewertungsformular.</li>
          <li>Statistik und Zieländerung im Dashboard stehen nicht mehr zur Verfügung.</li>
          <li>Eine Verlängerung gibt es nur auf Ihren ausdrücklichen Wunsch, nie automatisch.</li>
        </ul>
      </Panel>
      <Panel headingLevel={3} title="Verlängerung" description="Ab 30 Tage vor dem Ende können Sie die Verlängerung anfragen.">
        {a.renewalRequestedAt ? (
          <p role="status" className="text-sm text-text">
            Ihre Anfrage vom {formatDay(a.renewalRequestedAt.slice(0, 10))} liegt uns vor. Wir melden uns bei Ihnen.
          </p>
        ) : a.renewalHint ? (
          <ActionButton variant="primary" onClick={onRenew}>
            Verlängerung anfragen
          </ActionButton>
        ) : (
          <p className="text-sm text-muted">Die Schaltfläche erscheint hier und in der Übersicht, sobald Ihr Zugang in 30 Tagen oder weniger endet.</p>
        )}
      </Panel>
    </div>
  )
}
