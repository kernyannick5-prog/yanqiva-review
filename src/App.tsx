import { LazyMotion } from 'framer-motion'
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
import { WhatsAppFab } from './components/WhatsApp'
import { Background } from './sections/Background'
import { loadMotionFeatures } from './lib/loadMotionFeatures'
import { sectionElementId, sectionFromLegacyHash, sectionFromPath, sectionHref, type SectionName } from './lib/sectionRoutes'

// Dashboard-Demo als eigener Chunk, damit der Hero schneller lädt.
const DashboardDemo = lazy(() => import('./demo/DashboardDemo').then((m) => ({ default: m.DashboardDemo })))

// Platzhalter so hoch wie die fertige Demo (gemessen bei 320 bis 1920 px), damit Sprünge wie /preise/ nicht wegspringen, wenn die Demo nachlädt.
const demoFallback = <section id="demo" className="section-light min-h-[2100px] sm:min-h-[1990px] md:min-h-[1800px] lg:min-h-[1560px] xl:min-h-[1620px]" aria-busy="true" />

/** Lädt den Demo-Chunk vor (ohne Rendern), damit er beim Mounten sofort da ist. */
const preloadDemo = () => void import('./demo/DashboardDemo')

/**
 * Mountet die (schwere) Demo, sobald sie nahe am Viewport ist, spätestens kurz nach dem Laden (Leerlauf), und sofort, wenn der Fokus
 * per Tastatur ins Dokument kommt. Bis dahin steht ein Platzhalter gleicher Höhe da. Wichtig für Tastaturnutzer (WCAG 2.1.1/2.4.3/2.4.11):
 * Die Demo muss gemountet sein, bevor der erste Tab-Druck den Fokus weiterreicht. Sonst springt der Fokus über die noch leere Sektion hinweg,
 * und die nachladende Sektion ändert die Seitenhöhe mitten im weichen Scrollen (BR-01).
 */
function DemoWhenNear() {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mount = () => setNear(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) mount()
      },
      { rootMargin: '1200px 0px' },
    )
    io.observe(el)
    // Leerlauf nach dem Laden: Chunk laden und Demo mounten, lange bevor jemand per Tab dorthin gelangt
    let idleId = 0
    let timeoutId = 0
    const idle = () => {
      preloadDemo()
      timeoutId = window.setTimeout(mount, 400)
    }
    const start = () => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(idle, { timeout: 3000 })
      else timeoutId = window.setTimeout(idle, 1500)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    // Tastatur: schon beim ersten Tab-Druck bzw. Fokus (z. B. Sprunglink) laden und mounten
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        preloadDemo()
        mount()
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('focusin', mount, { once: true })
    return () => {
      io.disconnect()
      window.removeEventListener('load', start)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', mount)
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId)
      window.clearTimeout(timeoutId)
    }
  }, [])
  if (near) return <Suspense fallback={demoFallback}><DashboardDemo /></Suspense>
  return <div ref={ref}>{demoFallback}</div>
}

/**
 * WCAG 2.4.7/2.4.11: Bekommt ein Element per Tastatur den Fokus, muss es sichtbar und nicht von der fixen Navigationsleiste verdeckt sein.
 * Beim weichen Scrollen (scroll-behavior: smooth) und bei nachladenden Abschnitten kann der Browser das Ziel verfehlen. Wir warten daher,
 * bis die Scrollposition zur Ruhe gekommen ist, und holen den Fokus bei Bedarf ohne Animation in die Bildschirmmitte.
 */
function useKeepFocusVisible() {
  useEffect(() => {
    let raf = 0
    let recheck = 0
    const obscuredTop = () => {
      const bar = document.querySelector('header nav')
      return bar ? bar.getBoundingClientRect().bottom + 8 : 0
    }
    const ensureVisible = (el: HTMLElement) => {
      if (!el.isConnected || document.activeElement !== el) return
      const r = el.getBoundingClientRect()
      if (r.height === 0 || r.height > window.innerHeight * 0.7) return
      if (r.top >= obscuredTop() && r.bottom <= window.innerHeight - 8) return
      el.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target
      if (!(el instanceof HTMLElement) || !el.matches(':focus-visible')) return
      window.cancelAnimationFrame(raf)
      window.clearTimeout(recheck)
      let last = window.scrollY
      let still = 0
      let frames = 0
      const tick = () => {
        if (document.activeElement !== el) return
        frames += 1
        still = window.scrollY === last ? still + 1 : 0
        last = window.scrollY
        if (still >= 8 || frames > 150) {
          ensureVisible(el)
          // Nachladende Abschnitte können die Höhe danach noch ändern: einmal erneut prüfen
          recheck = window.setTimeout(() => ensureVisible(el), 500)
          return
        }
        raf = window.requestAnimationFrame(tick)
      }
      raf = window.requestAnimationFrame(tick)
    }
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      window.cancelAnimationFrame(raf)
      window.clearTimeout(recheck)
    }
  }, [])
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
  useKeepFocusVisible()
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <a href="#main" className="fixed left-3 top-3 z-[200] inline-flex min-h-11 -translate-y-[200%] items-center rounded-full bg-mint px-5 text-sm font-semibold text-ink-950 focus:translate-y-0">Zum Inhalt springen</a>
      <Background />
      <Navbar onLight />
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
      <WhatsAppFab />
    </LazyMotion>
  )
}
