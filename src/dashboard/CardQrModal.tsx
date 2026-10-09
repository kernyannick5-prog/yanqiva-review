import { useEffect, useState } from 'react'
import { QrCode } from '../components/QrCode'
import { ActionButton } from '../demo/components/ActionButton'
import { CopyIcon } from '../demo/components/Icons'
import { Modal } from '../demo/components/Modal'
import type { DashCard } from './api'
import { cardTitle } from './format'

/** QR-Code der Karte (…?c=q, damit QR-Aufrufe getrennt von NFC-Taps gezählt werden) und die Karten-Adressen. */
export function CardQrModal({ card, onClose }: { card: DashCard; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(card.qrUrl)
      setCopied(true)
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  return (
    <Modal titleId="qr-title" title={`QR-Code – ${cardTitle(card)}`} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <QrCode value={card.qrUrl} size={208} className="shadow-[0_0_60px_-10px_rgb(94_234_212/0.45)]" />
        <dl className="w-full min-w-0 space-y-3 text-center">
          <div>
            <dt className="text-xs text-muted">Adresse für QR-Code (Druck)</dt>
            <dd className="mt-1 break-all font-mono text-sm text-mint">{card.qrUrl}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Adresse auf dem NFC-Chip</dt>
            <dd className="mt-1 break-all font-mono text-sm text-mint">{card.nfcUrl}</dd>
          </div>
        </dl>
        <p className="text-center text-xs leading-relaxed text-faint">Die Adressen auf Ihren Karten bleiben dauerhaft gleich. Ändern Sie nur das Ziel, nie die Karte.</p>
        <ActionButton onClick={copy} className="w-full">
          <CopyIcon className="h-4 w-4" />
          {copied ? 'Kopiert' : 'QR-Adresse kopieren'}
        </ActionButton>
        <span role="status" className="sr-only">
          {copied ? 'Adresse kopiert' : ''}
        </span>
      </div>
    </Modal>
  )
}
