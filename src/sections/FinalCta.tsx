import { LinkButton } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useLoopVisible } from '../lib/useLoopVisible'
import { Container, Eyebrow } from './ui'

/** Abschluss-CTA mit starkem Glow. */
export function FinalCta() {
  const loop = useLoopVisible<HTMLElement>()
  return (
    <section id="cta" ref={loop} className="section-y section-sep relative overflow-hidden" aria-labelledby="cta-title">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="yq-breathe absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.32),rgb(12_82_66/0.3)_55%,transparent)]"
        />
        <div className="absolute left-1/2 top-1/2 h-[30vmax] w-[40vmax] max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(94_234_212/0.22),transparent)]" />
      </div>

      <Container>
        <Reveal className="glass-accent relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] px-5 py-12 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]" />
          <Eyebrow className="relative">Los geht’s</Eyebrow>
          <h2 id="cta-title" className="relative mt-4 font-display text-[clamp(1.95rem,1.1rem+3.8vw,3.9rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance sm:mt-5">
            Bereit für mehr Bewertungen?
            <span className="text-gradient block">Mach es deinen Kunden einfach.</span>
          </h2>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
            <LinkButton href={`${import.meta.env.BASE_URL}bestellen/`}>Jetzt bestellen</LinkButton>
            <LinkButton href="#demo" variant="ghost">Demo öffnen</LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
