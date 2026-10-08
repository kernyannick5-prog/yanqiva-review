import { motion, type Variants } from 'framer-motion'
import { Reveal } from '../components/Reveal'
import { Container, Eyebrow, sectionTitle } from './ui'

const ease = [0.22, 1, 0.36, 1] as const

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.28, delayChildren: 0.2 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}

const before = ['Kunde muss suchen', 'Google öffnen', 'Unternehmen suchen', 'Bewertung anklicken']
const after = ['NFC-Tap', 'Google-Bewertung']

/** Vorher/Nachher-Vergleich. */
export function ProblemSolution() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="ps-title">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Vorher · Nachher</Eyebrow>
          <h2 id="ps-title" className={`${sectionTitle} mt-4`}>
            Bewertungen scheitern selten am Willen. Meist am Weg.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* VORHER */}
          <Reveal className="glass relative rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Vorher</p>
            <div className="mt-5 max-w-sm rounded-2xl rounded-bl-sm bg-white/[0.06] px-4 py-3 text-[15px] text-muted">
              „Können Sie uns bitte auf Google bewerten?“
            </div>
            <motion.ol
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="mt-6 space-y-3"
            >
              {before.map((s, i) => (
                <motion.li
                  key={s}
                  variants={itemVariants}
                  className="flex min-h-12 items-center gap-3 rounded-xl border border-dashed border-white/10 px-4 text-[15px] text-faint"
                  style={{ marginLeft: i % 2 ? 10 : 0 }}
                >
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full border border-white/10 text-xs">{i + 1}</span>
                  {s}
                  {i < before.length - 1 && <span aria-hidden className="ml-auto text-white/20">↓</span>}
                </motion.li>
              ))}
            </motion.ol>
            <p className="mt-6 text-sm text-faint">Vier Schritte. Viele springen unterwegs ab.</p>
          </Reveal>

          {/* NACHHER */}
          <Reveal delay={0.1} className="glass relative overflow-hidden rounded-3xl border-mint/30 p-6 shadow-glow sm:p-8">
            <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(94_234_212/0.22),transparent)]" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-mint">Nachher</p>
            <div className="relative mt-5 max-w-sm rounded-2xl rounded-bl-sm bg-mint/10 px-4 py-3 text-[15px] text-text">
              Einmal antippen. Das war’s.
            </div>
            <motion.ol
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="relative mt-6 space-y-3"
            >
              {after.map((s, i) => (
                <motion.li
                  key={s}
                  variants={itemVariants}
                  className="flex min-h-12 items-center gap-3 rounded-xl border border-mint/30 bg-mint/[0.07] px-4 text-[15px] font-medium text-text"
                >
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-mint text-xs font-bold text-ink-950">{i + 1}</span>
                  {s}
                  <span aria-hidden className="ml-auto text-mint">↓</span>
                </motion.li>
              ))}
              <motion.li
                variants={itemVariants}
                className="flex min-h-12 items-center gap-3 rounded-xl bg-mint px-4 text-[15px] font-semibold text-ink-950 shadow-[0_0_30px_-4px_rgb(94_234_212/0.7)]"
              >
                <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.5, delay: 0.3 } } }}
                  />
                </svg>
                Fertig
              </motion.li>
            </motion.ol>
            <p className="relative mt-6 text-sm text-muted">Zwei Schritte, null Suchen.</p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
