import { m, useTransform, type MotionValue } from 'framer-motion'
import { Box } from './primitives'
import { P3D } from './constants'

const PW = 260
const PH = 260
/** 12 x 12 cm, 0,3 cm dick -> 260 px Kantenlänge ergeben ca. 6,5 px Dicke. */
const PT = 6

/** Dekoratives QR-Muster (kein echter Code), nur zur Veranschaulichung der QR-Scan-Phase. */
const N = 11
const FINDERS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [N - 4, 0],
  [0, N - 4],
]
const inFinder = (x: number, y: number) => FINDERS.some(([fx, fy]) => x >= fx && x < fx + 4 && y >= fy && y < fy + 4)
const MODULES: Array<{ x: number; y: number }> = []
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    if (!inFinder(x, y) && (x * 7 + y * 13 + x * y * 5) % 5 < 2) MODULES.push({ x, y })
  }
}

function DecorativeQr() {
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="h-[56px] w-[56px] rounded-[5px] border border-indigo-deep/25 bg-white p-[3px]" aria-hidden>
      {FINDERS.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`} fill="var(--color-indigo-deep)">
          <rect x={fx + 0.5} y={fy + 0.5} width={3} height={3} fill="none" stroke="var(--color-indigo-deep)" strokeWidth={1} />
          <rect x={fx + 1.5} y={fy + 1.5} width={1} height={1} />
        </g>
      ))}
      <g fill="var(--color-indigo-deep)">
        {MODULES.map((q) => (
          <rect key={`${q.x}-${q.y}`} x={q.x} y={q.y} width={1} height={1} />
        ))}
      </g>
    </svg>
  )
}

const CORNERS = ['left-0 top-0 border-l-2 border-t-2 rounded-tl-[4px]', 'right-0 top-0 border-r-2 border-t-2 rounded-tr-[4px]', 'left-0 bottom-0 border-l-2 border-b-2 rounded-bl-[4px]', 'right-0 bottom-0 border-r-2 border-b-2 rounded-br-[4px]']

/** QR-Code auf der Vorderseite: Scanrahmen und Scanlinie in der QR-Scan-Phase der Timeline. */
function QrBadge({ p }: { p: MotionValue<number> }) {
  const frame = useTransform(p, [0.2, 0.25, 0.36, 0.42], [0, 1, 1, 0])
  const frameScale = useTransform(p, [0.2, 0.25], [1.18, 1])
  const scanY = useTransform(p, [0.22, 0.32], [0, 54])
  const scanOpacity = useTransform(p, [0.22, 0.24, 0.3, 0.32], [0, 1, 1, 0])
  return (
    <span className="relative block">
      <DecorativeQr />
      <m.span className="absolute -inset-[5px]" style={{ opacity: frame, scale: frameScale }}>
        {CORNERS.map((c) => (
          <span key={c} className={`absolute h-3 w-3 border-mint-strong ${c}`} />
        ))}
      </m.span>
      <m.span
        className="absolute left-[-3px] right-[-3px] top-0 h-[2px] rounded-full bg-mint-strong"
        style={{ y: scanY, opacity: scanOpacity, boxShadow: '0 0 6px 1px rgb(94 234 212 / 0.7)' }}
      />
    </span>
  )
}

const STAR_PATH = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z'

export function NfcIcon({ className = '', color = 'var(--color-mint)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" aria-hidden>
      <path d="M6 8.5a6 6 0 0 1 0 7" />
      <path d="M9.5 6a10 10 0 0 1 0 12" />
      <path d="M13 3.5a14 14 0 0 1 0 17" />
    </svg>
  )
}

/** Nachgebautes NFC-Symbol: Smartphone mit Funkwellen (neutral, eigene Zeichnung). */
function NfcPhoneSymbol({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="var(--color-indigo-deep)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="12" width="17" height="30" rx="3.5" />
      <path d="M15.5 38h4" />
      <path d="M31 18.5a8 8 0 0 1 0 11" />
      <path d="M35.5 14.5a14 14 0 0 1 0 19" />
      <path d="M40 10.5a20 20 0 0 1 0 27" />
    </svg>
  )
}

/** Neutrales Bewertungssymbol (Stern im Kreis) anstelle eines Markenlogos. */
function StarMark() {
  return (
    <span className="grid h-[56px] w-[56px] place-items-center rounded-full bg-indigo-deep">
      <svg viewBox="0 0 24 24" className="h-[34px] w-[34px]" fill="#ffffff" aria-hidden>
        <path d={STAR_PATH} />
      </svg>
    </span>
  )
}

/** Dezente Hervorhebung von NFC (Puls) im Frontsymbol. */
function NfcBadge({ p }: { p: MotionValue<number> }) {
  const glow = useTransform(p, [0.1, 0.16, 0.26, 0.32], [0, 1, 1, 0])
  const r0Scale = useTransform(p, [0.12, 0.22], [1, 1.6])
  const r0Opacity = useTransform(p, [0.12, 0.14, 0.22], [0, 0.7, 0])
  const r1Scale = useTransform(p, [0.17, 0.27], [1, 1.6])
  const r1Opacity = useTransform(p, [0.17, 0.19, 0.27], [0, 0.6, 0])
  return (
    <div className="relative h-[58px] w-[58px]">
      <m.div
        className="absolute -inset-4 rounded-full"
        style={{ opacity: glow, background: 'radial-gradient(closest-side, rgb(94 234 212 / 0.45), rgb(94 234 212 / 0))' }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <NfcPhoneSymbol className="h-[54px] w-[54px]" />
      </div>
      <m.div className="absolute inset-0 rounded-full border-2 border-mint-strong" style={{ scale: r0Scale, opacity: r0Opacity }} />
      <m.div className="absolute inset-0 rounded-full border-2 border-mint-strong" style={{ scale: r1Scale, opacity: r1Opacity }} />
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
}

const edgeAcryl = { style: { background: 'linear-gradient(180deg, rgb(255 255 255 / 0.9), rgb(190 200 245 / 0.7))' } }

/**
 * 3D-Karte nach dem Produktfoto: quadratische Acrylkarte (12 x 12 cm, 3 mm), abgerundete Ecken,
 * Band oben (Hinweistext), weiße Mitte (Sternsymbol, NFC-Symbol und QR-Code), Band unten. Kein Fuß: die Platte
 * steht leicht nach hinten geneigt. Es wird bewusst kein Name/Firmenname aufgedruckt.
 */
export function Stand({ p, rotX, rotY, glareX }: StandProps) {
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
                className: 'overflow-hidden rounded-[22px] bg-white',
                children: (
                  <>
                    <div className="flex h-full flex-col items-center text-center">
                      <div className="flex h-[62px] w-full flex-col items-center justify-center bg-indigo-deep px-3 font-display font-bold uppercase leading-tight text-white">
                        <span className="text-[10.5px] tracking-[0.04em]">Wir freuen uns über Ihre</span>
                        <span className="text-[13px] tracking-[0.03em]">Google-Bewertung!</span>
                      </div>
                      <div className="mt-3">
                        <StarMark />
                      </div>
                      <div className="mt-3 flex items-center gap-6">
                        <NfcBadge p={p} />
                        <QrBadge p={p} />
                      </div>
                      <div className="mt-auto flex h-[40px] w-full items-center justify-center bg-indigo-deep font-display text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                        Hier kontaktlos bewerten
                      </div>
                    </div>
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
                className: 'rounded-[22px]',
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
