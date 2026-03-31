import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Dashboard from './components/Dashboard'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import AIPowered from './components/AIPowered'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Dashboard />
      <HowItWorks />
      <Features />
      <Testimonials />
      <AIPowered />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
