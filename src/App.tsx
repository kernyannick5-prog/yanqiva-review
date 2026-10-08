import { lazy, Suspense } from 'react'
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

export default function App() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="relative">
        <Hero />
        <ProductShowcase />
        <ProblemSolution />
        <HowItWorks />
        <Suspense fallback={<section id="demo" className="min-h-[900px]" aria-busy="true" />}>
          <DashboardDemo />
        </Suspense>
        <QrDemo />
        <Benefits />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
