import { useId } from 'react'

/**
 * Vorderseite der NFC-Bewertungskarte (12 x 12 cm) als eigene Zeichnung, angelehnt an das Produktlayout:
 * farbiger Kopf mit Welle, Symbol im weißen Kreis, "Bewerte uns auf Google", fünf Sterne, NFC-Piktogramm, "oder", QR-Feld.
 * Markenrechtlich bewusst neutral: kein Google-Logo, keine Google-Markenfarben; "Google" nur als beschreibender Text.
 * Der QR-Code ist ein dekoratives Muster (kein echter Code).
 */

type Variant = 'weiss' | 'schwarz'

const BLUE = '#2c5bd9'
const GOLD = '#f6c33b'
const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z'
const WAVE = 'C1160 596 1100 603 1000 602 C820 600 640 542 470 545 C300 548 150 640 0 662'
const HEADER = `M0 64 A64 64 0 0 1 64 0 H1136 A64 64 0 0 1 1200 64 V594 ${WAVE} Z`

// Dekoratives QR-Muster: 25 x 25 Module, drei Finder, deterministisch "zufällig" gefüllt
const QN = 25
const finder = (x: number, y: number) => [[0, 0], [QN - 7, 0], [0, QN - 7]].some(([fx, fy]) => x >= fx - 1 && x < fx + 8 && y >= fy - 1 && y < fy + 8)
const QR_MODULES: Array<[number, number]> = []
for (let y = 0; y < QN; y++) {
  for (let x = 0; x < QN; x++) {
    if (finder(x, y)) continue
    if (x >= 16 && x <= 20 && y >= 16 && y <= 20) continue
    const h = (x * 73 + y * 151 + x * y * 37 + ((x ^ y) * 11)) % 100
    if (h < 47) QR_MODULES.push([x, y])
  }
}

function DecorativeQr({ x, y, size, ink, bg }: { x: number; y: number; size: number; ink: string; bg: string }) {
  const u = size / QN
  const fp = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={x + fx * u} y={y + fy * u} width={7 * u} height={7 * u} fill={ink} />
      <rect x={x + (fx + 1) * u} y={y + (fy + 1) * u} width={5 * u} height={5 * u} fill={bg} />
      <rect x={x + (fx + 2) * u} y={y + (fy + 2) * u} width={3 * u} height={3 * u} fill={ink} />
    </g>
  )
  return (
    <g>
      {fp(0, 0)}
      {fp(QN - 7, 0)}
      {fp(0, QN - 7)}
      <rect x={x + 16 * u} y={y + 16 * u} width={5 * u} height={5 * u} fill={ink} />
      <rect x={x + 17 * u} y={y + 17 * u} width={3 * u} height={3 * u} fill={bg} />
      <rect x={x + 18 * u} y={y + 18 * u} width={u} height={u} fill={ink} />
      <path fill={ink} d={QR_MODULES.map(([mx, my]) => `M${x + mx * u} ${y + my * u}h${u}v${u}h${-u}z`).join('')} />
    </g>
  )
}

/** Eigenes NFC-Piktogramm: Lesefeld mit Funkwellen, Hand hält ein Smartphone daran (Finger rechts, Daumen links). */
function NfcPictogram({ ink, bg }: { ink: string; bg: string }) {
  return (
    <g fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={205} cy={935} rx={122} ry={100} />
      <path d="M168 892q20 43 0 86" strokeWidth={10} />
      <path d="M203 872q30 63 0 126" strokeWidth={10} />
      <path d="M238 852q40 83 0 166" strokeWidth={10} />
      {/* Handfläche mit vier Fingern, die um die rechte Kante greifen (hinter dem Gerät) */}
      <path
        d="M388 1108C380 1078 352 1052 344 1014V900H440V890H452a14 14 0 0 1 0 28H440H458a15 15 0 0 1 0 30H440H458a15 15 0 0 1 0 30H440H452a13 13 0 0 1 0 26H440C462 1016 460 1066 452 1108Z"
        fill={bg}
      />
      {/* Smartphone */}
      <rect x={340} y={822} width={100} height={188} rx={20} fill={bg} />
      <path d="M374 840h32" />
      <text x={390} y={890} textAnchor="middle" fontSize={27} fontWeight={700} fill={ink} stroke="none" className="font-display">
        NFC
      </text>
      {/* Daumen vor dem Gerät an der linken Kante */}
      <path d="M355 1045C346 1022 346 990 354 966a14 14 0 0 1 27 6C376 994 378 1018 388 1040" fill={bg} />
      {/* Ärmelbündchen */}
      <rect x={378} y={1106} width={84} height={30} rx={6} fill={bg} />
    </g>
  )
}

export function ReviewCardFace({ variant = 'weiss', className = '' }: { variant?: Variant; className?: string }) {
  const arcId = useId().replace(/:/g, '')
  const dark = variant === 'schwarz'
  const head = dark ? '#0a0a0a' : BLUE
  const body = dark ? '#0a0a0a' : '#ffffff'
  const ink = dark ? '#ffffff' : '#111111'
  return (
    <svg viewBox="0 0 1200 1200" className={className} role="img" aria-label="NFC-Bewertungskarte: Bewerte uns auf Google, Handy kurz dranhalten oder QR-Code scannen">
      <rect width={1200} height={1200} rx={64} fill={body} />
      <path d={HEADER} fill={head} />
      {dark ? (
        <path d={`M1200 594 ${WAVE}`} fill="none" stroke="#ffffff" strokeWidth={5} />
      ) : (
        <path d={`M1200 594 ${WAVE}`} fill="none" stroke="#a7b9f3" strokeWidth={14} transform="translate(0 9)" />
      )}

      {/* Symbol im Kreis: Sprechblase mit Stern (statt Markenlogo) */}
      <circle cx={300} cy={262} r={190} fill="#ffffff" />
      <path d="M200 182a36 36 0 0 1 36-36h128a36 36 0 0 1 36 36v108a36 36 0 0 1-36 36h-92l-50 44v-44h-0a22 22 0 0 1-22-22z" fill={head} />
      <g transform="translate(240 168) scale(5.1)">
        <path d={STAR} fill={GOLD} />
      </g>

      <g fill="#ffffff" textAnchor="middle" className="font-display">
        <text x={845} y={152} fontSize={74} fontWeight={500}>
          Bewerte uns
        </text>
        <text x={845} y={290} fontSize={106} fontWeight={600}>
          auf Google
        </text>
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${645 + i * 92} 352) scale(3.6)`}>
          <path d={STAR} fill={GOLD} />
        </g>
      ))}

      {/* Unterer Teil */}
      <path id={arcId} d="M70 806Q300 706 548 796" fill="none" />
      <text fontSize={42} fontWeight={500} fill={ink} className="font-display">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
          Handy kurz dranhalten
        </textPath>
      </text>
      <NfcPictogram ink={ink} bg={body} />
      <text x={602} y={950} textAnchor="middle" fontSize={42} fill={ink} className="font-display">
        oder
      </text>
      <text x={900} y={738} textAnchor="middle" fontSize={36} fontWeight={500} fill={ink} className="font-sans">
        QR-Code scannen
      </text>
      <DecorativeQr x={775} y={798} size={250} ink={ink} bg={body} />
      <g fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round">
        <path d="M744 822v-16a30 30 0 0 1 30-30h16" />
        <path d="M1010 776h16a30 30 0 0 1 30 30v16" />
        <path d="M744 1030v16a30 30 0 0 0 30 30h16" />
        <path d="M1010 1076h16a30 30 0 0 0 30-30v-16" />
      </g>
    </svg>
  )
}
