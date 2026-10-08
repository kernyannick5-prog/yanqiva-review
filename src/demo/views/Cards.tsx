import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ActionButton } from '../components/ActionButton'
import { CardTile } from '../components/CardTile'
import { EditLinkModal } from '../components/EditLinkModal'
import { PlusIcon } from '../components/Icons'
import { NewCardModal } from '../components/NewCardModal'
import { QrModal } from '../components/QrModal'
import { StaggerItem } from '../components/Stagger'
import type { Card, NewCardInput } from '../types'

interface CardsProps {
  cards: Card[]
  onCreate: (input: NewCardInput) => void
  onUpdateTarget: (id: string, targetUrl: string) => void
  onOpenStats: (cardId: string) => void
  notify: (text: string) => void
}

export function Cards({ cards, onCreate, onUpdateTarget, onOpenStats, notify }: CardsProps) {
  const [newOpen, setNewOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [qrId, setQrId] = useState<string | null>(null)

  const editCard = cards.find((c) => c.id === editId)
  const qrCard = cards.find((c) => c.id === qrId)

  return (
    <div className="space-y-4">
      <StaggerItem index={0} className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {cards.length === 1 ? '1 Karte' : `${cards.length} Karten`} · Scans der letzten 30 Tage (NFC + QR)
        </p>
        <ActionButton variant="primary" onClick={() => setNewOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Neue Karte hinzufügen
        </ActionButton>
      </StaggerItem>

      <div className="space-y-4">
        <AnimatePresence>
          {cards.map((card, i) => (
            <CardTile
              key={card.id}
              index={i + 1}
              card={card}
              onEdit={(c) => setEditId(c.id)}
              onStats={(c) => onOpenStats(c.id)}
              onQr={(c) => setQrId(c.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {newOpen && (
          <NewCardModal
            key="new"
            cards={cards}
            onClose={() => setNewOpen(false)}
            onCreate={(input) => {
              onCreate(input)
              setNewOpen(false)
              notify('Karte erstellt')
            }}
          />
        )}
        {editCard && (
          <EditLinkModal
            key="edit"
            card={editCard}
            onClose={() => setEditId(null)}
            onSave={(id, url) => {
              onUpdateTarget(id, url)
              setEditId(null)
              notify('Link gespeichert')
            }}
          />
        )}
        {qrCard && <QrModal key="qr" card={qrCard} onClose={() => setQrId(null)} />}
      </AnimatePresence>
    </div>
  )
}
