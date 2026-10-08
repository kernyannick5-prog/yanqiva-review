import { Panel } from '../components/Panel'
import { ActionButton } from '../components/ActionButton'
import { StaggerItem } from '../components/Stagger'
import { CheckIcon, ShieldIcon } from '../components/Icons'
import { Toggle } from '../components/Toggle'
import { PRODUCTION_REDIRECT_BASE } from '../../config/redirects'
import type { DemoSettings } from '../types'

interface SettingsProps {
  settings: DemoSettings
  onToggle: (key: keyof DemoSettings) => void
  onReset: () => void
}

const TOGGLES: { key: keyof DemoSettings; label: string; description: string }[] = [
  { key: 'weeklyReport', label: 'E-Mail-Bericht wöchentlich', description: 'Jeden Montag eine Zusammenfassung deiner Scans und Bewertungen.' },
  { key: 'newReviewAlert', label: 'Benachrichtigung bei neuer Bewertung', description: 'Sofort informiert, sobald ein Kunde bewertet hat.' },
  { key: 'idleCardAlert', label: 'Hinweis bei Karten ohne Scan', description: 'Erinnerung, wenn eine Karte 7 Tage lang nicht genutzt wurde.' },
]

/** Feste Systemeigenschaften – bewusst nicht umschaltbar. */
const PRIVACY_ROWS: { label: string; state: 'Aktiv' | 'Deaktiviert'; text: string }[] = [
  { label: 'Datensparsamkeit', state: 'Aktiv', text: 'Es werden nur Firmendaten und je Karte und Tag zwei Zähler (NFC, QR) gespeichert.' },
  { label: 'IP-Speicherung', state: 'Deaktiviert', text: 'YANQIVA speichert und protokolliert keine IP-Adressen (technische Server-Logs des Hosters ausgenommen, siehe Datenschutzerklärung).' },
  { label: 'Personenbezogenes Tracking', state: 'Deaktiviert', text: 'Kein Geräte-Fingerprint, keine Standortdaten, keine Besucher-IDs.' },
  { label: 'Marketing-Tracking', state: 'Deaktiviert', text: 'Keine Werbe-Pixel, keine Cookies, keine Drittanbieter-Skripte.' },
  { label: 'Besucherprofile', state: 'Deaktiviert', text: 'Bewertende werden nicht wiedererkannt oder zu Profilen verknüpft.' },
]

function PrivacyCenter() {
  return (
    <section aria-labelledby="privacy-center-title" className="min-w-0 rounded-2xl border border-mint/20 bg-gradient-to-b from-mint/[0.05] to-white/[0.02] p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] sm:p-5">
      <header className="flex items-center gap-3">
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mint/30 bg-mint/10 text-mint">
          <ShieldIcon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h4 id="privacy-center-title" className="font-display text-base font-semibold text-text">Datenschutz</h4>
          <p className="text-[13px] text-mint">Privacy by Design</p>
        </div>
      </header>

      <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-ink-950/40">
        {PRIVACY_ROWS.map((row) => (
          <li key={row.label} className="flex flex-col gap-1.5 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-text">{row.label}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-faint">{row.text}</p>
            </div>
            {row.state === 'Aktiv' ? (
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 px-2.5 py-1 text-xs font-medium text-mint">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-mint" />
                Aktiv
              </span>
            ) : (
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-line bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-muted">
                <CheckIcon className="h-3.5 w-3.5 text-mint" />
                Deaktiviert
              </span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        Feste Systemeigenschaften – nicht umschaltbar. Die Demo setzt keine Cookies und lädt keine externen Ressourcen.{' '}
        <a href={`${import.meta.env.BASE_URL}datenschutz/`} className="inline-flex min-h-11 items-center text-mint underline-offset-2 hover:underline sm:min-h-0">
          Datenschutzerklärung lesen
        </a>
      </p>
    </section>
  )
}

export function Settings({ settings, onToggle, onReset }: SettingsProps) {
  return (
    <div className="space-y-4">
      <StaggerItem index={0}>
        <Panel title="Benachrichtigungen">
          <div className="divide-y divide-line">
            {TOGGLES.map((t) => (
              <Toggle key={t.key} id={`setting-${t.key}`} checked={settings[t.key]} onChange={() => onToggle(t.key)} label={t.label} description={t.description} />
            ))}
          </div>
        </Panel>
      </StaggerItem>

      <StaggerItem index={1}>
        <Panel title="Redirect-Domain" description="Auf jeder Karte steht ausschließlich diese Adresse.">
          <div className="flex flex-wrap items-center gap-3">
            <p className="min-w-0 flex-1 truncate rounded-xl border border-line bg-ink-950/50 px-3.5 py-2.5 font-mono text-sm text-mint" aria-label="Redirect-Domain">
              {PRODUCTION_REDIRECT_BASE}&lt;slug&gt;
            </p>
            <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-medium text-mint">Von YANQIVA verwaltet</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Die Ziel-URL änderst du jederzeit unter „Karten“ – die Karte selbst muss dafür nie neu beschrieben werden.
          </p>
        </Panel>
      </StaggerItem>

      <StaggerItem index={2}>
        <PrivacyCenter />
      </StaggerItem>

      <StaggerItem index={3}>
        <Panel title="Demo zurücksetzen" description="Entfernt neu angelegte Karten und stellt alle Einstellungen wieder her.">
          <ActionButton onClick={onReset}>Demo zurücksetzen</ActionButton>
        </Panel>
      </StaggerItem>
    </div>
  )
}
