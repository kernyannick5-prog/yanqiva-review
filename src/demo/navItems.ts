import type { ComponentType } from 'react'
import { CardsIcon, ChartIcon, OverviewIcon, SettingsIcon } from './components/Icons'
import type { ViewId } from './types'

export const NAV_ITEMS: { id: ViewId; label: string; title: string; description: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Übersicht', title: 'Übersicht', description: 'Aufrufe Ihrer Karten der letzten 30 Tage.', Icon: OverviewIcon },
  { id: 'cards', label: 'Karten', title: 'Meine Karten', description: 'Ziel-Links ändern und QR-Codes ansehen.', Icon: CardsIcon },
  { id: 'statistics', label: 'Statistiken', title: 'Statistiken', description: 'Wie oft Ihre Karten per NFC und QR-Code aufgerufen werden.', Icon: ChartIcon },
  { id: 'settings', label: 'Einstellungen', title: 'Einstellungen', description: 'Weiterleitungs-Adresse und Datenschutz.', Icon: SettingsIcon },
]

