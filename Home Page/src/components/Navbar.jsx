import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Guides', href: '#guides' },
  { label: 'Testimonials', href: '#testimonials' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-dark-heading font-semibold text-xl">Turidoo</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-dark-text hover:text-dark-heading transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-dark-text hover:text-dark-heading transition-colors rounded-full hover:bg-dark-card">
              <Sun size={18} />
            </button>
            <a href="#" className="text-dark-text hover:text-dark-heading transition-colors text-sm">
              Log In
            </a>
            <a
              href="#"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-dark-text"
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
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-dark-text hover:text-dark-heading transition-colors text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-dark-border space-y-3">
              <a href="#" className="block text-dark-text hover:text-dark-heading text-sm py-2">
                Log In
              </a>
              <a
                href="#"
                className="block bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium text-center transition-colors"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
