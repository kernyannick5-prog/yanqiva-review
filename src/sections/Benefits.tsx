import { motion } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { Container, Eyebrow, sectionTitle } from './ui'

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  className: 'size-6',
} as const

const items: { tag: string; title: string; text: string; icon: ReactNode }[] = [
  {
    tag: 'NFC + QR',
    title: 'Zwei Wege. Ein Ziel.',
    text: 'Tippen oder scannen: beide führen zur selben Bewertungsseite.',
    icon: (
      <svg {...svgProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <path d="M14 14h3v3M21 14v.01M14 21h.01M17.5 21H21v-3.5" />
      </svg>
    ),
  },
  {
    tag: 'Einfach',
    title: 'Keine App notwendig.',
    text: 'Das Smartphone deiner Kunden reicht. Kein Download, kein Login.',
    icon: (
      <svg {...svgProps}>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 18.5h2M9.5 8.5l1.8 1.8 3.2-3.6" />
      </svg>
    ),
  },
  {
    tag: 'Messbar',
    title: 'Sehe, wie oft deine Karten genutzt werden.',
    text: 'Das Dashboard zählt jeden Scan und jeden Tap.',
    icon: (
      <svg {...svgProps}>
        <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
      </svg>
    ),
  },
  {
    tag: 'Flexibel',
    title: 'Ziele und Links später jederzeit ändern.',
    text: 'Die Karte bleibt, nur das Ziel zieht um.',
    icon: (
      <svg {...svgProps}>
        <path d="M4 7h12M13 4l3 3-3 3M20 17H8M11 14l-3 3 3 3" />
      </svg>
    ),
  },
]

/** Setzt die Spotlight-Position per CSS-Variablen (kein Re-Render). */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

/** Vier Vorteile als Glas-Cards mit Hover-Spotlight. */
export function Benefits() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="benefits-title">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Vorteile</Eyebrow>
          <h2 id="benefits-title" className={`${sectionTitle} mt-4`}>
            Weniger Aufwand für dich. Weniger Hürden für deine Kunden.
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {items.map((it, i) => (
            <li key={it.tag}>
              <Reveal delay={i * 0.08} className="h-full">
                <motion.article
                  onPointerMove={trackPointer}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="glass group relative h-full overflow-hidden rounded-3xl p-6 sm:p-8"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgb(94 234 212 / 0.14), transparent 70%)' }}
                  />
                  <div className="relative">
                    <span className="grid size-12 place-items-center rounded-2xl border border-mint/30 bg-mint/10 text-mint transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      {it.icon}
                    </span>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-mint">{it.tag}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-balance">{it.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{it.text}</p>
                  </div>
                </motion.article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
