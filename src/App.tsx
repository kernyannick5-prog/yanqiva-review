import { LazyMotion } from 'framer-motion'
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
import { loadMotionFeatures } from './lib/loadMotionFeatures'
import { useLowPower } from './lib/lowPower'
import { useTouchLayout } from './lib/useTouchLayout'
import { sectionElementId, sectionFromLegacyHash, sectionFromPath, sectionHref, type SectionName } from './lib/sectionRoutes'

// 3D-Produktszene als eigener Chunk: Hero und LCP warten nicht auf den Szenen-Code. Der Platzhalter ist so hoch wie die fertige Sektion (kein Layout-Shift, Anker bleiben stabil).
const ProductShowcase = lazy(() => import('./sections/ProductShowcase').then((m) => ({ default: m.ProductShowcase })))

/** Gleiche Höhe wie die Sektion je Variante: Desktop (Sticky-Szene) 260vh, Touch/Lite je nach Breite. */
function ShowcaseFallback() {
  const touch = useTouchLayout()
  const lowPower = useLowPower()
  const height = lowPower || touch ? 'min-h-[810px] sm:min-h-[900px]' : 'h-[260vh]'
  return <section id="produkt" className={`section-light relative ${height}`} aria-busy="true" />
}

// Dashboard-Demo als eigener Chunk, damit der Hero schneller lädt.
const DashboardDemo = lazy(() => import('./demo/DashboardDemo').then((m) => ({ default: m.DashboardDemo })))

// Platzhalter so hoch wie die fertige Demo (gemessen bei 320 bis 1920 px), damit Sprünge wie /preise/ nicht wegspringen, wenn die Demo nachlädt.
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
 * Saubere Sektions-Pfade (/preise/ statt /#preise): Klick auf einen solchen Link scrollt ohne Neuladen und setzt per pushState den Pfad;
 * direktes Laden von /preise/ scrollt zur Sektion; alte Hash-Links (/#preise, #pricing, ...) werden per replaceState umgeschrieben.
 * Nachgeladene Abschnitte (Demo, Produktszene) können die Seite während des Sprungs verlängern: Nach dem Sprung prüfen wir daher noch
 * zweimal, ob das Ziel wirklich oben liegt, und korrigieren es sonst ohne Animation. Der Skip-Link (#main) bleibt ein normaler Anker.
 */
function useSectionRouting() {
  useEffect(() => {
    const timers: number[] = []
    const clearTimers = () => {
      timers.splice(0).forEach((t) => window.clearTimeout(t))
    }
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scrollTo = (name: SectionName, smooth: boolean) => {
      clearTimers()
      const el = document.getElementById(sectionElementId(name))
      if (!el) return
      const behavior: ScrollBehavior = smooth && !reduced() ? 'smooth' : 'instant'
      if (name === 'start') window.scrollTo({ top: 0, behavior })
      else el.scrollIntoView({ behavior, block: 'start' })
      // Fokus ans Ziel, damit Tastatur- und Screenreader-Nutzer dort weitermachen (der Sprung selbst scrollt schon)
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1')
        el.classList.add('outline-none')
      }
      el.focus({ preventScroll: true })
      const check = () => {
        if (name === 'start') {
          if (window.scrollY > 4) window.scrollTo({ top: 0, behavior: 'instant' })
          return
        }
        // Element neu suchen: Platzhalter (Demo, Produktszene) werden beim Nachladen durch die echte Sektion ersetzt
        const current = document.getElementById(sectionElementId(name))
        if (!current) return
        const top = current.getBoundingClientRect().top
        if (top > 100 || top < -60) current.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      timers.push(window.setTimeout(check, 1000), window.setTimeout(check, 2600))
    }

    // Nach Reload/Zurück soll der Browser nicht an einer Pixelposition der noch nicht fertig geladenen Seite landen
    const prevRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'

    // Erstes Laden: alter Hash -> neuer Pfad (ohne neuen Verlaufseintrag), sonst Pfad der Sektion
    const { hash, pathname } = window.location
    const legacy = sectionFromLegacyHash(hash)
    if (legacy) {
      history.replaceState(history.state, '', sectionHref(legacy))
      scrollTo(legacy, false)
    } else {
      const fromPath = sectionFromPath(pathname)
      if (fromPath && fromPath !== 'start') scrollTo(fromPath, false)
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.search) return
      const name = url.hash ? sectionFromLegacyHash(url.hash) : sectionFromPath(url.pathname)
      if (!name) return
      e.preventDefault()
      const target = sectionHref(name)
      if (window.location.pathname !== target || window.location.hash) history.pushState(null, '', target)
      scrollTo(name, true)
    }
    const onPopState = () => {
      const name = sectionFromPath(window.location.pathname)
      // Hash-Navigation (#main) und fremde Pfade überlässt die App dem Browser
      if (!name || window.location.hash) return
      scrollTo(name, false)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopState)
      clearTimers()
      history.scrollRestoration = prevRestoration
    }
  }, [])
}

export default function App() {
  useSectionRouting()
  return (
    <LazyMotion features={loadMotionFeatures} strict>
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
    </LazyMotion>
  )
}
