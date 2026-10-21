import { useCallback, useEffect, useRef, useState } from 'react'
import { Aurora } from '../components/Led'
import { CARD_IMAGE_NOTE } from '../order/catalog'
import { Container, Eyebrow } from './ui'
import { ShowcasePlayer, type ShowcasePlayerHandle } from './showcase/ShowcasePlayer'
import { Captions, StepList } from './showcase/Steps'
import { POSTER_TIME, STEP_TARGETS, stepAt } from './showcase/constants'
import { TimeSync } from './showcase/TimeSync'
import { SCENE_END, captionAt, progressAt, stepBar, timeAt } from './showcase/timeline'

const titleClass =
  'font-display text-[clamp(1.75rem,1.1rem+3vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-balance'

/** Hintergrund: statischer Aurora-Farbverlauf (das Video davor ist selbst bewegt, jede zusätzliche Endlos-Animation kostet Bildrate) + dezentes Raster. */
function StageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Aurora still />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    </div>
  )
}

/**
 * Produktabschnitt: Das Video (Smartphone + NFC-Karte) ersetzt die frühere Live-3D-Szene. Schritte und Kurztexte folgen der Videozeit,
 * ein Klick auf einen Schritt springt im Video zum passenden Moment.
 */
export function ProductShowcase() {
  const player = useRef<ShowcasePlayerHandle>(null)
  const bars = useRef<(HTMLSpanElement | null)[]>([])
  const [initialP] = useState(() => progressAt(POSTER_TIME))
  // Nur Schritt und Kurztext sind React-State (wechseln selten, setState mit gleichem Wert rendert nicht neu).
  const [active, setActive] = useState(() => stepAt(initialP))
  const [caption, setCaption] = useState(() => captionAt(initialP))

  // Fortschrittsbalken: nur der aktive Schritt wird animiert (Compositor, im Gleichlauf mit dem Video), die übrigen stehen fest auf voll bzw. leer.
  const [timeline] = useState(() => new TimeSync())
  useEffect(() => {
    bars.current.forEach((el, i) => {
      if (el && i !== active) el.style.transform = `scaleX(${i < active ? 1 : 0})`
    })
    return timeline.add(bars.current[active], (t) => `scaleX(${stepBar(progressAt(Math.min(t, SCENE_END)), active)})`)
  }, [timeline, active])

  const onTime = useCallback((t: number) => {
    const p = progressAt(Math.min(t, SCENE_END))
    setActive(stepAt(p))
    setCaption(captionAt(p))
  }, [])
  const jump = useCallback((i: number) => player.current?.jumpTo(timeAt(STEP_TARGETS[i])), [])

  return (
    <section id="produkt" aria-labelledby="produkt-title" className="section-light section-y relative overflow-x-clip">
      <StageBackdrop />
      <Container className="relative grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <Eyebrow>Das Produkt</Eyebrow>
          <h2 id="produkt-title" className={`mt-2.5 lg:mt-5 ${titleClass}`}>
            <span className="block">Eine Karte.</span>
            <span className="text-gradient block">Bewerten mit einem Tap.</span>
          </h2>
        </div>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <ShowcasePlayer ref={player} onTime={onTime} timeline={timeline} />
          <p className="mt-3 text-center text-[13px] leading-snug text-faint">{CARD_IMAGE_NOTE}</p>
        </div>
        <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2 lg:gap-6">
          <StepList initialP={initialP} bars={bars} active={active} onSelect={jump} />
          <Captions index={caption} className="lg:min-h-[4.5rem]" />
        </div>
      </Container>
    </section>
  )
}
