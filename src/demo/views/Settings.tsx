import { Panel } from '../components/Panel'
import { ActionButton } from '../components/ActionButton'
import { StaggerItem } from '../components/Stagger'
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
        <Panel title="Demo zurücksetzen" description="Entfernt neu angelegte Karten und stellt alle Einstellungen wieder her.">
          <ActionButton onClick={onReset}>Demo zurücksetzen</ActionButton>
        </Panel>
      </StaggerItem>
    </div>
  )
}
