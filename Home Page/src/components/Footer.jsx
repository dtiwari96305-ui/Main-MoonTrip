import { Mail, MessageCircle } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ],
  'Get Started': [
    { label: 'Sign Up Free', href: '#' },
    { label: 'Log In', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Cookie Settings', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-dark-heading font-semibold text-xl">Turidoo</span>
            </a>
            <p className="text-dark-text text-sm leading-relaxed max-w-xs">
              The modern platform for travel agencies. From quotes to itineraries, GST invoices, and payment tracking — all in one place.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-dark-heading text-sm font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-dark-text hover:text-dark-heading text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-dark-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-text text-sm">&copy; 2026 Turidoo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-dark-text hover:text-dark-heading transition-colors">
              <Mail size={18} />
            </a>
            <a href="#" className="text-dark-text hover:text-dark-heading transition-colors">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
