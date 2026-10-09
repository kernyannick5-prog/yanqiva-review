import { motion } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { Container, SectionHead } from './ui'

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
    text: 'Das Dashboard zeigt, wie oft deine Karten angetippt und gescannt werden.',
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
    <section className="section-light section-y relative overflow-hidden" aria-labelledby="benefits-title">
      <Container>
        <Reveal>
          <SectionHead eyebrow="Vorteile" id="benefits-title">
            Weniger Aufwand für dich. Weniger Hürden für deine Kunden.
          </SectionHead>
        </Reveal>

        <ul className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
          {items.map((it, i) => (
            <li key={it.tag}>
              <Reveal delay={i * 0.08} className="h-full">
                <motion.article
                  onPointerMove={trackPointer}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="glass group relative h-full overflow-hidden rounded-3xl p-5 sm:p-8"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgb(15 118 110 / 0.09), transparent 70%)' }}
                  />
                  <div className="relative">
                    <span className="grid size-11 place-items-center rounded-2xl border border-violet-glow/35 bg-[linear-gradient(135deg,rgb(94_234_212/0.14),rgb(139_92_246/0.2))] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] sm:size-12 text-mint transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      {it.icon}
                    </span>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-eyebrow sm:mt-6">{it.tag}</p>
                    <h3 className="mt-2 font-display text-[1.375rem] font-semibold leading-tight tracking-tight text-balance sm:text-2xl">{it.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{it.text}</p>
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
