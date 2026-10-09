import { LinkButton } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useLoopVisible } from '../lib/useLoopVisible'
import { Container, Eyebrow } from './ui'

/** Abschluss-CTA mit starkem Glow. */
export function FinalCta() {
  const loop = useLoopVisible<HTMLElement>()
  return (
    <section id="cta" ref={loop} className="section-light section-y relative overflow-hidden" aria-labelledby="cta-title">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="yq-breathe absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.12),rgb(15_118_110/0.1)_55%,transparent)]"
        />
        <div className="absolute left-1/2 top-1/2 h-[30vmax] w-[40vmax] max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(15_118_110/0.1),transparent)]" />
      </div>

      <Container>
        {/* Dunkelgruene Akzentkarte auf Weiss: eigener dunkler Scope (Tokens/Kontraste wie im dunklen Theme) */}
        <Reveal className="section-dark mx-auto max-w-3xl rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(11_44_35/0.55)]">
        <div className="glass-accent relative overflow-hidden rounded-[2rem] px-5 py-12 text-center [--glass-solid:#134235] [--shadow-glow:0_1px_0_0_rgb(255_255_255/0.12)_inset,0_0_0_1px_rgb(94_234_212/0.28)] sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]" />
          <Eyebrow className="relative">Los geht’s</Eyebrow>
          <h2 id="cta-title" className="relative mt-4 font-display text-[clamp(1.95rem,1.1rem+3.8vw,3.9rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance sm:mt-5">
            Bereit loszulegen?
            <span className="text-gradient block">Mach es deinen Kunden einfach.</span>
          </h2>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
            <LinkButton href={`${import.meta.env.BASE_URL}bestellen/`}>Jetzt bestellen</LinkButton>
            <LinkButton href="#demo" variant="ghost">Demo öffnen</LinkButton>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  )
}
