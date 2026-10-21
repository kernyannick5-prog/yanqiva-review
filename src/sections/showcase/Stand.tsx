import { m, useTransform, type MotionValue } from 'framer-motion'
import { EdgeLight } from '../../components/Led'
import { Box } from './primitives'
import { P3D } from './constants'
import { ReviewCardFace } from '../../components/ReviewCardFace'
import { CARD_NFC, CARD_QR } from '../../components/reviewCardGeometry'

const PW = 260
const PH = 260
/** 12 x 12 cm, 0,3 cm dick -> 260 px Kantenlänge ergeben ca. 6,5 px Dicke. */
const PT = 6

export function NfcIcon({ className = '', color = 'var(--color-mint)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" aria-hidden>
      <path d="M6 8.5a6 6 0 0 1 0 7" />
      <path d="M9.5 6a10 10 0 0 1 0 12" />
      <path d="M13 3.5a14 14 0 0 1 0 17" />
    </svg>
  )
}

const CORNERS = ['left-0 top-0 border-l-2 border-t-2 rounded-tl-[4px]', 'right-0 top-0 border-r-2 border-t-2 rounded-tr-[4px]', 'left-0 bottom-0 border-l-2 border-b-2 rounded-bl-[4px]', 'right-0 bottom-0 border-r-2 border-b-2 rounded-br-[4px]']

/** NFC-Puls über dem NFC-Piktogramm der Kartenfront (NFC-Phase der Timeline). */
function NfcPulse({ p }: { p: MotionValue<number> }) {
  const glow = useTransform(p, [0.1, 0.16, 0.26, 0.32], [0, 1, 1, 0])
  const r0Scale = useTransform(p, [0.12, 0.22], [1, 1.7])
  const r0Opacity = useTransform(p, [0.12, 0.14, 0.22], [0, 0.75, 0])
  const r1Scale = useTransform(p, [0.17, 0.27], [1, 1.7])
  const r1Opacity = useTransform(p, [0.17, 0.19, 0.27], [0, 0.65, 0])
  const S = 58
  return (
    <div className="pointer-events-none absolute" style={{ left: CARD_NFC.x * PW - S / 2, top: CARD_NFC.y * PH - S / 2, width: S, height: S }}>
      <m.div
        className="absolute -inset-4 rounded-full"
        style={{ opacity: glow, background: 'radial-gradient(closest-side, rgb(94 234 212 / 0.5), rgb(94 234 212 / 0))' }}
      />
      <m.div className="absolute inset-0 rounded-full border-2 border-mint-strong" style={{ scale: r0Scale, opacity: r0Opacity }} />
      <m.div className="absolute inset-0 rounded-full border-2 border-mint-strong" style={{ scale: r1Scale, opacity: r1Opacity }} />
    </div>
  )
}

/** Scanrahmen und Scanlinie über dem QR-Feld der Kartenfront (QR-Phase der Timeline). */
function QrScan({ p }: { p: MotionValue<number> }) {
  const S = CARD_QR.size * PW
  const frame = useTransform(p, [0.2, 0.25, 0.36, 0.42], [0, 1, 1, 0])
  const frameScale = useTransform(p, [0.2, 0.25], [1.18, 1])
  const scanY = useTransform(p, [0.22, 0.32], [0, S])
  const scanOpacity = useTransform(p, [0.22, 0.24, 0.3, 0.32], [0, 1, 1, 0])
  return (
    <div className="pointer-events-none absolute" style={{ left: CARD_QR.x * PW - S / 2, top: CARD_QR.y * PH - S / 2, width: S, height: S }}>
      <m.span className="absolute -inset-[7px]" style={{ opacity: frame, scale: frameScale }}>
        {CORNERS.map((c) => (
          <span key={c} className={`absolute h-3 w-3 border-mint-strong ${c}`} />
        ))}
      </m.span>
      <m.span
        className="absolute left-[-3px] right-[-3px] top-0 h-[2px] rounded-full bg-mint-strong"
        style={{ y: scanY, opacity: scanOpacity, boxShadow: '0 0 6px 1px rgb(94 234 212 / 0.7)' }}
      />
    </div>
  )
}

interface StandProps {
  /** Szenenfortschritt 0..1 (für die NFC-/QR-Hervorhebung). */
  p: MotionValue<number>
  rotX: MotionValue<number>
  rotY: MotionValue<number>
  /** Horizontale Verschiebung des Lichtreflexes (px). */
  glareX: MotionValue<number>
  /** Deckkraft des umlaufenden Kantenlichts. */
  edgeOpacity: MotionValue<number>
}

const edgeAcryl = { style: { background: 'linear-gradient(180deg, rgb(255 255 255 / 0.9), rgb(190 200 245 / 0.7))' } }

/**
 * 3D-Karte nach dem Produkt: quadratische Acrylkarte (12 x 12 cm, 3 mm), abgerundete Ecken. Vorderseite = ReviewCardFace
 * (blauer Kopf mit Welle, Sterne, NFC-Piktogramm, QR-Feld; markenrechtlich neutral ohne Google-Logo). Kein Fuß: die Platte
 * steht leicht nach hinten geneigt. Es wird bewusst kein Name/Firmenname aufgedruckt.
 */
export function Stand({ p, rotX, rotY, glareX, edgeOpacity }: StandProps) {
  return (
    <div className="absolute left-0 top-[130px] h-0 w-0" style={{ perspective: 1100, perspectiveOrigin: '0px -150px' }}>
      <m.div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ rotateX: rotX, rotateY: rotY }}>
        <div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ transform: 'translateY(4px) rotateX(10deg)' }}>
          <div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ transform: `translateY(${-PH / 2}px)` }}>
            <Box
              w={PW}
              h={PH}
              d={PT}
              front={{
                className: 'overflow-hidden rounded-[14px] bg-white',
                children: (
                  <>
                    <ReviewCardFace className="block h-full w-full" />
                    <EdgeLight className="rounded-[14px]" style={{ opacity: edgeOpacity }} />
                    <NfcPulse p={p} />
                    <QrScan p={p} />
                    {/* Lichtreflex: wandert mit der Rotation */}
                    <m.div
                      className="pointer-events-none absolute -top-10 left-0 h-[400px] w-[64px]"
                      style={{
                        x: glareX,
                        skewX: -18,
                        background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.28), transparent)',
                      }}
                    />
                  </>
                ),
              }}
              back={{
                className: 'rounded-[14px]',
                style: { background: 'linear-gradient(200deg, rgb(238 241 255), rgb(196 204 240))' },
              }}
              left={edgeAcryl}
              right={edgeAcryl}
              top={{ style: { background: 'rgb(255 255 255 / 0.85)' } }}
            />
          </div>
        </div>
      </m.div>
    </div>
  )
}
