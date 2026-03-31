import { useEffect, useRef } from 'react';
import { FileText, Calendar, CreditCard, Globe, Smartphone, Share2, Shield, Plane, TrendingUp } from 'lucide-react';
import screenshotQuotes from '../../assets/screenshots/screenshot-quotes.png';
import screenshotBookings from '../../assets/screenshots/screenshot-bookings.png';
import screenshotPayments from '../../assets/screenshots/screenshot-payments.png';

const coreFeatures = [
  {
    icon: FileText,
    title: 'Smart Quote Builder',
    description: 'Create detailed, professional quotes with itemized services, hotels, flights, and transport. Set margins, add notes, and share polished PDFs with your clients in seconds — not hours.',
    bullets: ['Multi-service quote support', 'One-click PDF generation & sharing', 'Quote-to-booking conversion'],
    screenshot: screenshotQuotes,
    alt: 'MoonTrip Quotes - Smart quote builder with customer and pricing management',
  },
  {
    icon: Calendar,
    title: 'Effortless Booking Management',
    description: 'From confirmed quotes to active bookings — manage every trip with timeline views, status tracking, and automatic customer notifications. Never miss a detail again.',
    bullets: ['Real-time booking status updates', 'Service-level detail tracking', 'Calendar & timeline views'],
    screenshot: screenshotBookings,
    alt: 'MoonTrip Bookings - Effortless booking management with payment tracking',
  },
  {
    icon: CreditCard,
    title: 'Complete Payment Tracking',
    description: 'Track every payment, due, and refund across all bookings. Maintain a clear ledger. Generate GST-compliant tax invoices and share them via WhatsApp, email, or print.',
    bullets: ['Advance & balance tracking', 'Professional tax invoices (GST)', 'Share via WhatsApp, email, or print'],
    screenshot: screenshotPayments,
    alt: 'MoonTrip Payments - Complete payment ledger with transaction history',
  },
];

const whyFeatures = [
  {
    icon: Globe,
    title: 'Multi-Tenant Ready',
    description: 'Each agency gets its own secure workspace. Your data stays yours — always.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Manage your entire agency from your phone. Every feature, everywhere you go.',
  },
  {
    icon: Share2,
    title: 'Instant PDF Sharing',
    description: 'Share quotes and invoices via WhatsApp, email, or any channel your clients prefer.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Encrypted data, secure authentication, and role-based access keep your agency safe.',
  },
  {
    icon: Plane,
    title: 'Service Management',
    description: 'Flights, hotels, transport, visas — manage every service type with custom fields and pricing.',
  },
  {
    icon: TrendingUp,
    title: 'Business Insights',
    description: 'See revenue, outstanding payments, and booking trends at a glance from your dashboard.',
  },
];

function ScrollReveal({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('screenshot-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="screenshot-reveal">
      {children}
    </div>
  );
}

export default function Features() {
  return (
    <>
      {/* Core Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium tracking-widest uppercase">Core Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
              Everything Your Agency Needs,<br />Nothing It Doesn't
            </h2>
            <p className="text-dark-text text-lg max-w-2xl mx-auto">
              Purpose-built tools that let you focus on what matters — creating unforgettable journeys for your clients.
            </p>
          </div>

          {/* Feature rows */}
          <div className="space-y-24">
            {coreFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="lg:w-1/2">
                  <div className="bg-dark-card border border-dark-border rounded-xl p-3 inline-block mb-4">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-dark-heading mb-4">{feature.title}</h3>
                  <p className="text-dark-text leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3 text-dark-text">
                        <span className="text-primary">✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <ScrollReveal>
                    <div className="screenshot-hover">
                      <img
                        src={feature.screenshot}
                        alt={feature.alt}
                        loading="lazy"
                        className="feature-screenshot"
                      />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Turidoo / Built for the Way You Work */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-medium tracking-widest uppercase">Why Turidoo</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
              Built for the Way You Work
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {whyFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary/30 transition-colors"
              >
                <div className="bg-dark-bg border border-dark-border rounded-xl p-3 inline-block mb-4">
                  <feature.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-dark-heading text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-dark-text text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
