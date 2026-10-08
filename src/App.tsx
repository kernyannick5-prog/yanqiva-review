import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { ProductShowcase } from './sections/ProductShowcase'
import { ProblemSolution } from './sections/ProblemSolution'
import { HowItWorks } from './sections/HowItWorks'
import { QrDemo } from './sections/QrDemo'
import { Benefits } from './sections/Benefits'
import { Pricing } from './sections/Pricing'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Background } from './sections/Background'

// Dashboard-Demo als eigener Chunk, damit der Hero schneller lädt.
const DashboardDemo = lazy(() => import('./demo/DashboardDemo').then((m) => ({ default: m.DashboardDemo })))

const demoFallback = <section id="demo" className="min-h-[900px]" aria-busy="true" />

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

export default function App() {
  return (
    <>
      <a href="#main" className="fixed left-3 top-3 z-[200] inline-flex min-h-11 -translate-y-[200%] items-center rounded-full bg-mint px-5 text-sm font-semibold text-ink-950 focus:translate-y-0">Zum Inhalt springen</a>
      <Background />
      <Navbar />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Hero />
        <ProductShowcase />
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
