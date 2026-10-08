import { useEffect, useState } from 'react'
import { QrCode } from '../../components/QrCode'
import { demoRedirectUrl, productionRedirectUrl } from '../../lib/redirectUrl'
import type { Card } from '../types'
import { isLiveDemoSlug } from '../utils'
import { ActionButton, ActionLink } from './ActionButton'
import { CopyIcon, ExternalIcon } from './Icons'
import { Modal } from './Modal'

interface QrModalProps {
  card: Card
  onClose: () => void
}

/**
 * QR-Code einer Karte. Demo-Karten zeigen auf die live funktionierende Demo-Weiterleitung,
 * neu angelegte Karten auf die Produktions-URL (noch nicht erreichbar).
 */
export function QrModal({ card, onClose }: QrModalProps) {
  const live = isLiveDemoSlug(card.slug)
  const productionUrl = productionRedirectUrl(card.slug)
  const qrValue = live ? demoRedirectUrl(card.slug) : productionUrl
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(productionUrl)
      setCopied(true)
    } catch {
      /* Zwischenablage nicht verfügbar – keine Aktion nötig */
    }
  }

  return (
    <Modal titleId="qr-title" title={`QR-Code – ${card.businessName}`} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <QrCode value={qrValue} size={208} className="shadow-[0_0_60px_-10px_rgb(94_234_212/0.45)]" />
        <div className="w-full min-w-0 text-center">
          <p className="text-xs text-muted">Redirect-URL auf der Karte</p>
          <p className="mt-1 break-all font-mono text-sm text-mint">{productionUrl}</p>
        </div>
        {live ? (
          <p className="text-center text-xs leading-relaxed text-faint">
            Dieser Demo-QR-Code funktioniert wirklich: Scanne ihn oder teste die Weiterleitung.
          </p>
        ) : (
          <p className="w-full rounded-xl border border-violet-glow/30 bg-violet-glow/10 p-3 text-center text-xs leading-relaxed text-text">
            Wird nach Aktivierung erreichbar (Demo)
          </p>
        )}
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          {live && (
            <ActionLink href={demoRedirectUrl(card.slug)} target="_blank" rel="noopener noreferrer" variant="primary" className="flex-1">
              Weiterleitung testen
              <ExternalIcon className="h-4 w-4" />
            </ActionLink>
          )}
          <ActionButton onClick={copy} className="flex-1">
            <CopyIcon className="h-4 w-4" />
            {copied ? 'Kopiert' : 'Link kopieren'}
          </ActionButton>
        </div>
      </div>
    </Modal>
  )
}
