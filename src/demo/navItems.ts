import type { ComponentType } from 'react'
import { BuildingIcon, CardsIcon, ChartIcon, OverviewIcon, SettingsIcon, StarIcon } from './components/Icons'
import type { ViewId } from './types'

export const NAV_ITEMS: { id: ViewId; label: string; title: string; description: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Übersicht', title: 'Übersicht', description: 'Alle Kennzahlen deiner Karten der letzten 30 Tage.', Icon: OverviewIcon },
  { id: 'cards', label: 'Karten', title: 'Meine Karten', description: 'Verwalte Karten, Links und QR-Codes.', Icon: CardsIcon },
  { id: 'statistics', label: 'Statistiken', title: 'Statistiken', description: 'Wann und worüber deine Kunden scannen.', Icon: ChartIcon },
  { id: 'reviews', label: 'Bewertungen', title: 'Bewertungen', description: 'Das sagen deine Kunden auf Google.', Icon: StarIcon },
  { id: 'company', label: 'Unternehmen', title: 'Unternehmen', description: 'Profile und Google-Verbindung.', Icon: BuildingIcon },
  { id: 'settings', label: 'Einstellungen', title: 'Einstellungen', description: 'Benachrichtigungen und Redirect-Domain.', Icon: SettingsIcon },
]

