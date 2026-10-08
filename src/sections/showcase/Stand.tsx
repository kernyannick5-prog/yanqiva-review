import { motion, type MotionValue } from 'framer-motion'
import { Box } from './primitives'
import { P3D, STAR_GOLD } from './constants'

const PW = 220
const PH = 300
const PT = 8
const BW = 250
const BH = 28
const BD = 86

/** Dekoratives QR-Muster (kein echter Code). */
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
    <svg viewBox={`0 0 ${N} ${N}`} className="h-[46px] w-[46px] rounded-[5px] bg-text p-[3px]" aria-hidden>
      {FINDERS.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`} fill="var(--color-ink-950)">
          <rect x={fx + 0.5} y={fy + 0.5} width={3} height={3} fill="none" stroke="var(--color-ink-950)" strokeWidth={1} />
          <rect x={fx + 1.5} y={fy + 1.5} width={1} height={1} />
        </g>
      ))}
      <g fill="var(--color-ink-950)">
        {MODULES.map((m) => (
          <rect key={`${m.x}-${m.y}`} x={m.x} y={m.y} width={1} height={1} />
        ))}
      </g>
    </svg>
  )
}

export function NfcIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="var(--color-mint)" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
      <path d="M6 8.5a6 6 0 0 1 0 7" />
      <path d="M9.5 6a10 10 0 0 1 0 12" />
      <path d="M13 3.5a14 14 0 0 1 0 17" />
    </svg>
  )
}

interface StandProps {
  rotX: MotionValue<number>
  rotY: MotionValue<number>
  /** Horizontale Verschiebung des Lichtreflexes (px). */
  glareX: MotionValue<number>
}

const sideDark = { style: { background: 'linear-gradient(180deg, var(--color-ink-800), var(--color-ink-900))' } }

/** 3D-NFC-Aufsteller: Sockel (5 Flächen) + leicht nach hinten geneigte Glasplatte (5 Flächen). */
export function Stand({ rotX, rotY, glareX }: StandProps) {
  return (
    <div className="absolute left-0 top-[130px] h-0 w-0" style={{ perspective: 1100, perspectiveOrigin: '0px -150px' }}>
      <motion.div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ rotateX: rotX, rotateY: rotY }}>
        {/* Sockel */}
        <div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ transform: 'translateY(14px)' }}>
          <Box
            w={BW}
            h={BH}
            d={BD}
            front={{
              className: 'flex items-center justify-center gap-2 rounded-[3px] border-t border-white/25',
              style: { background: 'linear-gradient(180deg, var(--color-ink-700), var(--color-ink-800))' },
              children: (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                  <span className="font-display text-[10px] font-semibold tracking-[0.28em] text-muted">YANQIVA</span>
                </>
              ),
            }}
            back={sideDark}
            left={sideDark}
            right={sideDark}
            top={{
              style: { background: 'linear-gradient(180deg, var(--color-indigo-deep), var(--color-ink-700))' },
              children: <div className="absolute left-4 right-4 top-[39px] h-2 rounded-full bg-ink-950/90" />,
            }}
          />
        </div>

        {/* Glasplatte, leicht nach hinten geneigt */}
        <div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ transform: 'translateY(4px) rotateX(8deg)' }}>
          <div className={`absolute left-0 top-0 h-0 w-0 ${P3D}`} style={{ transform: `translateY(${-PH / 2}px)` }}>
            <Box
              w={PW}
              h={PH}
              d={PT}
              front={{
                className: 'overflow-hidden rounded-[10px] border border-white/30',
                style: {
                  background:
                    'linear-gradient(180deg, rgb(255 255 255 / 0.12), transparent 30%), linear-gradient(155deg, rgb(139 92 246 / 0.34) 0%, rgb(30 27 75 / 0.8) 42%, rgb(7 10 31 / 0.88) 100%)',
                },
                children: (
                  <>
                    <div className="flex h-full flex-col items-center px-[18px] py-[16px] text-center">
                      <div className="flex items-center gap-1.5 font-display text-[11px] font-semibold tracking-[0.22em] text-text">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                        YANQIVA <span className="text-mint">REVIEW</span>
                      </div>
                      <div className="mt-2 text-[17px] leading-none tracking-[0.12em]" style={{ color: STAR_GOLD }}>
                        ★★★★★
                      </div>
                      <p className="mt-1.5 font-display text-[13px] font-semibold leading-snug text-text">
                        Wir freuen uns über Ihre Bewertung
                      </p>
                      <div className="mt-3 grid h-16 w-16 place-items-center rounded-full border border-mint/50 bg-mint/10">
                        <NfcIcon className="h-8 w-8" />
                      </div>
                      <p className="mt-2 text-[11px] font-medium tracking-wide text-mint">Hier kontaktlos bewerten</p>
                      <div className="mt-auto flex items-center gap-2.5">
                        <DecorativeQr />
                        <span className="text-left text-[9px] leading-tight text-muted">
                          Oder QR-Code
                          <br />
                          scannen
                        </span>
                      </div>
                    </div>
                    {/* Lichtreflex: wandert mit der Rotation */}
                    <motion.div
                      className="pointer-events-none absolute -top-10 left-0 h-[400px] w-[64px]"
                      style={{
                        x: glareX,
                        skewX: -18,
                        background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.24), transparent)',
                      }}
                    />
                  </>
                ),
              }}
              back={{
                className: 'flex flex-col items-center justify-center gap-3 rounded-[10px] border border-white/15',
                style: { background: 'linear-gradient(200deg, rgb(46 16 101 / 0.75), rgb(7 10 31 / 0.94))' },
                children: (
                  <>
                    <NfcIcon className="h-9 w-9 opacity-60" />
                    <span className="font-display text-[10px] font-semibold tracking-[0.24em] text-faint">YANQIVA REVIEW</span>
                  </>
                ),
              }}
              left={{ style: { background: 'linear-gradient(180deg, rgb(255 255 255 / 0.55), rgb(165 180 255 / 0.25))' } }}
              right={{ style: { background: 'linear-gradient(180deg, rgb(255 255 255 / 0.4), rgb(165 180 255 / 0.18))' } }}
              top={{ style: { background: 'rgb(255 255 255 / 0.6)' } }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
