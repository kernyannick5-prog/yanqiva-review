import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { ProblemSolution } from './sections/ProblemSolution'
import { HowItWorks } from './sections/HowItWorks'
import { QrDemo } from './sections/QrDemo'
import { Benefits } from './sections/Benefits'
import { Pricing } from './sections/Pricing'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Background } from './sections/Background'
import { lowPower } from './lib/lowPower'
import { useTouchLayout } from './lib/useTouchLayout'

// 3D-Produktszene als eigener Chunk: Hero und LCP warten nicht auf den Szenen-Code. Der Platzhalter ist so hoch wie die fertige Sektion (kein Layout-Shift, Anker bleiben stabil).
const ProductShowcase = lazy(() => import('./sections/ProductShowcase').then((m) => ({ default: m.ProductShowcase })))

/** Gleiche Höhe wie die Sektion je Variante: Desktop (Sticky-Szene) 260vh, Touch/Lite je nach Breite. */
function ShowcaseFallback() {
  const touch = useTouchLayout()
  const height = lowPower || touch ? 'min-h-[810px] sm:min-h-[900px]' : 'h-[260vh]'
  return <section id="produkt" className={`section-light relative ${height}`} aria-busy="true" />
}

// Dashboard-Demo als eigener Chunk, damit der Hero schneller lädt.
const DashboardDemo = lazy(() => import('./demo/DashboardDemo').then((m) => ({ default: m.DashboardDemo })))

// Platzhalter so hoch wie die fertige Demo (gemessen bei 320 bis 1920 px), damit Anker wie #pricing nicht wegspringen, wenn die Demo nachlädt.
const demoFallback = <section id="demo" className="section-light min-h-[2100px] sm:min-h-[1990px] md:min-h-[1800px] lg:min-h-[1600px]" aria-busy="true" />

/** Mountet die (schwere) Demo erst, wenn sie nahe am Viewport ist; bis dahin Platzhalter gleicher Höhe. */
function DemoWhenNear() {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '1200px 0px' },
    )
    io.observe(el)
    // Tastaturnutzer: Demo beim ersten Tab-Druck laden, damit sie nicht aus der Tab-Reihenfolge fällt (WCAG 2.1.1/2.4.3)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setNear(true)
    }
    window.addEventListener('keydown', onKey, { once: false })
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [])
  if (near) return <Suspense fallback={demoFallback}><DashboardDemo /></Suspense>
  return <div ref={ref}>{demoFallback}</div>
}

/**
 * Anker-Sprünge (Navigation, /#pricing): Nachgeladene Abschnitte (Demo, Produktszene) können die Seite verlängern, während der sanfte Sprung läuft.
 * Nach dem Sprung prüfen wir daher noch zweimal, ob das Ziel wirklich oben liegt, und korrigieren es sonst ohne Animation.
 */
function useAnchorSettle() {
  useEffect(() => {
    const timers: number[] = []
    const settle = (hash: string) => {
      const id = decodeURIComponent(hash.slice(1))
      if (!id) return
      const check = () => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top > 100 || top < -60) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      timers.push(window.setTimeout(check, 1000), window.setTimeout(check, 2600))
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (a) settle(a.getAttribute('href') ?? '')
    }
    document.addEventListener('click', onClick)
    if (window.location.hash) settle(window.location.hash)
    return () => {
      document.removeEventListener('click', onClick)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [])
}

export default function App() {
  useAnchorSettle()
  return (
    <>
      <a href="#main" className="fixed left-3 top-3 z-[200] inline-flex min-h-11 -translate-y-[200%] items-center rounded-full bg-mint px-5 text-sm font-semibold text-ink-950 focus:translate-y-0">Zum Inhalt springen</a>
      <Background />
      <Navbar onLight />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Hero />
        <Suspense fallback={<ShowcaseFallback />}>
          <ProductShowcase />
        </Suspense>
        <ProblemSolution />
        <HowItWorks />
        <DemoWhenNear />
        <QrDemo />
        <Benefits />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
