import { sectionHref } from '../lib/sectionRoutes'
import { LinkButton } from '../components/Button'
import { Aurora, EdgeLight } from '../components/Led'
import { Reveal } from '../components/Reveal'
import { WhatsAppButton, WhatsAppNote } from '../components/WhatsApp'
import { useLoopVisible } from '../lib/useLoopVisible'
import { Container, Eyebrow } from './ui'

/** Abschluss-CTA mit starkem Glow. */
export function FinalCta() {
  const loop = useLoopVisible<HTMLElement>()
  return (
    <section id="loslegen" ref={loop} className="section-light section-y relative overflow-x-clip" aria-labelledby="loslegen-title">
      <Aurora intensity={1.2} />

      <Container>
        {/* Dunkelgruene Akzentkarte auf Weiss: eigener dunkler Scope (Tokens/Kontraste wie im dunklen Theme) */}
        <Reveal className="section-dark mx-auto max-w-3xl rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(11_44_35/0.55)]">
        <div className="glass-accent relative overflow-hidden rounded-[2rem] px-5 py-12 text-center [--glass-solid:#134235] [--shadow-glow:0_1px_0_0_rgb(255_255_255/0.12)_inset,0_0_0_1px_rgb(94_234_212/0.28)] sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <EdgeLight dark className="yq-edge-thin" />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]" />
          <Eyebrow className="relative">Los geht’s</Eyebrow>
          <h2 id="loslegen-title" className="relative mt-4 font-display text-[clamp(1.95rem,1.1rem+3.8vw,3.9rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-balance sm:mt-5">
            Bereit loszulegen?
            <span className="text-gradient block">Machen Sie es Ihren Kunden einfach.</span>
          </h2>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
            <LinkButton href={`${import.meta.env.BASE_URL}bestellen/`}>Jetzt bestellen</LinkButton>
            <LinkButton href={sectionHref('demo')} variant="ghost">Demo öffnen</LinkButton>
          </div>
          <div className="relative mt-8 flex flex-col items-center gap-2.5 border-t border-white/10 pt-6">
            <p className="text-sm text-muted">Noch Fragen? Schreiben Sie uns direkt.</p>
            <WhatsAppButton />
            <WhatsAppNote className="max-w-xs text-faint" />
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  )
}
