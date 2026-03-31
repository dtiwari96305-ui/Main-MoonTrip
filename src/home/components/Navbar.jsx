import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const anchorLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
];

export default function Navbar({ onLogin, onSignUp, onGuides, onHome, isLoggedIn, onDashboard }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOnHomePage = !onHome;

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    if (isOnHomePage) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      sessionStorage.setItem('scrollTarget', href);
      onHome();
    }
  };

  const handleGuides = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (onGuides) onGuides();
  };

  const handleLogo = (e) => {
    e.preventDefault();
    if (onHome) onHome();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" onClick={handleLogo} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-dark-heading font-semibold text-xl">MoonTrip</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {anchorLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-dark-text hover:text-dark-heading transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              onClick={handleGuides}
              className="text-dark-text hover:text-dark-heading transition-colors text-sm"
            >
              Guides
            </a>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={onDashboard}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-colors border-0 cursor-pointer"
              >
                Go to Dashboard &rarr;
              </button>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-dark-text hover:text-dark-heading transition-colors text-sm bg-transparent border-0 cursor-pointer p-2"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUp}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-colors border-0 cursor-pointer"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-dark-text bg-transparent border-0 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-bg border-t border-dark-border">
          <div className="px-4 py-4 space-y-3">
            {anchorLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-dark-text hover:text-dark-heading transition-colors text-sm py-2"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              onClick={handleGuides}
              className="block text-dark-text hover:text-dark-heading transition-colors text-sm py-2"
            >
              Guides
            </a>
            <div className="pt-3 border-t border-dark-border space-y-3">
              {isLoggedIn ? (
                <button
                  onClick={() => { setMobileOpen(false); onDashboard(); }}
                  className="block w-full bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium text-center transition-colors border-0 cursor-pointer"
                >
                  Go to Dashboard &rarr;
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); onLogin(); }}
                    className="block w-full text-left text-dark-text hover:text-dark-heading text-sm py-2 bg-transparent border-0 cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onSignUp(); }}
                    className="block w-full bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium text-center transition-colors border-0 cursor-pointer"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
