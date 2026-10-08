import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { ProblemSolution } from './sections/ProblemSolution'
import { HowItWorks } from './sections/HowItWorks'
import { DashboardDemo } from './demo/DashboardDemo'
import { QrDemo } from './sections/QrDemo'
import { Benefits } from './sections/Benefits'
import { Pricing } from './sections/Pricing'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Background } from './sections/Background'

export default function App() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="relative">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <DashboardDemo />
        <QrDemo />
        <Benefits />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
