import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Dashboard from './components/Dashboard';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function HomePage({ onLogin, onSignUp, onDemo, onGuides, isLoggedIn, onDashboard }) {
  useEffect(() => {
    const target = sessionStorage.getItem('scrollTarget');
    if (target) {
      sessionStorage.removeItem('scrollTarget');
      requestAnimationFrame(() => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar onLogin={onLogin} onSignUp={onSignUp} onGuides={onGuides} isLoggedIn={isLoggedIn} onDashboard={onDashboard} />
      <Hero onSignUp={onSignUp} onDemo={onDemo} isLoggedIn={isLoggedIn} onDashboard={onDashboard} />
      <Stats />
      <Dashboard />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing onSignUp={onSignUp} />
      <FAQ />
      <CTA onSignUp={onSignUp} />
      <Footer onSignUp={onSignUp} onLogin={onLogin} />
    </div>
  );
}
