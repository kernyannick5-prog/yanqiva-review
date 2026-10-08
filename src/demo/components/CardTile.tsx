import { motion } from 'framer-motion'
import type { Card } from '../types'
import { cardLabel, formatInt, formatLastScan, redirectDisplay, totalScans } from '../utils'
import { ActionButton } from './ActionButton'
import { NfcIcon, PencilIcon, ChartIcon, QrIcon } from './Icons'
import { staggerProps } from './staggerProps'
import { StatusBadge } from './StatusBadge'

interface CardTileProps {
  card: Card
  onEdit: (card: Card) => void
  onStats: (card: Card) => void
  onQr: (card: Card) => void
  index: number
}

/** „Meine Karten“-Eintrag: NFC-Karten-Optik links, Kennzahlen und Aktionen rechts. */
export function CardTile({ card, index, onEdit, onStats, onQr }: CardTileProps) {
  return (
    <motion.article
      layout
      {...staggerProps(index)}
      exit={{ opacity: 0, scale: 0.96 }}
      aria-label={`${card.businessName}, ${cardLabel(card.cardNumber)}`}
      className="group grid min-w-0 gap-5 rounded-2xl border border-line bg-white/[0.03] p-4 transition-colors duration-300 hover:border-mint/30 hover:bg-white/[0.05] sm:p-5 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
    >
      <motion.div
        whileHover={{ y: -4, rotate: -0.6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="relative aspect-[1.586/1] w-full max-w-[340px] self-start overflow-hidden rounded-2xl bg-gradient-to-br from-violet-dark via-indigo-deep to-ink-800 p-4 shadow-[0_20px_40px_-20px_rgb(139_92_246/0.6)] ring-1 ring-white/15 md:max-w-none"
      >
        <div aria-hidden className="pointer-events-none absolute -right-[4.5rem] -top-24 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.4),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-52 w-52 rounded-full bg-[radial-gradient(closest-side,rgb(94_234_212/0.2),transparent)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-text/80">{cardLabel(card.cardNumber)}</span>
            <NfcIcon className="h-6 w-6 text-mint" />
          </div>
          <div aria-hidden className="h-6 w-9 rounded-md bg-gradient-to-br from-mint/70 to-mint/20 ring-1 ring-white/20" />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-tight text-text">{card.businessName}</p>
            <StatusBadge status={card.status} className="mt-1" />
          </div>
        </div>
      </motion.div>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted">Scans (30 Tage)</p>
            <p className="mt-1 font-display text-3xl font-semibold leading-none tabular-nums text-text">{formatInt(totalScans(card))}</p>
            <p className="mt-1.5 text-xs tabular-nums text-faint">
              {formatInt(card.scans.nfc)} NFC · {formatInt(card.scans.qr)} QR
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted">Letzter Scan</p>
            <p className="mt-1 text-sm font-medium text-text">{formatLastScan(card.lastScanAt)}</p>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-line bg-ink-950/50 px-3.5 py-2.5">
          <p className="text-xs text-muted">Google Review Link</p>
          <p className="mt-0.5 truncate font-mono text-[13px] text-mint" title={card.targetUrl}>
            {redirectDisplay(card.slug)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={() => onEdit(card)}>
            <PencilIcon className="h-4 w-4" />
            Link bearbeiten
          </ActionButton>
          <ActionButton onClick={() => onStats(card)}>
            <ChartIcon className="h-4 w-4" />
            Statistik
          </ActionButton>
          <ActionButton onClick={() => onQr(card)}>
            <QrIcon className="h-4 w-4" />
            QR-Code
          </ActionButton>
        </div>
      </div>
    </motion.article>
  )
}
