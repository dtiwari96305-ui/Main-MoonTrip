import { useState } from 'react';
import { Check, X, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: { monthly: 'Free', annual: 'Free' },
    period: 'forever',
    description: 'Try Turidoo risk-free',
    popular: false,
    features: [
      { text: '5 quotes/month, 25 customers', included: true },
      { text: 'All billing models & GST invoices (watermarked)', included: true },
      { text: 'Bookings, cancellations & live trips', included: true },
      { text: 'Hidden markup & memorandum account', included: true },
      { text: '2 PDF themes & GSTIN auto-verification', included: true },
      { text: 'Share via WhatsApp', included: true },
      { text: 'Your logo & branding on PDFs', included: false },
      { text: 'Payment tracking & dues', included: false },
      { text: 'Reports & analytics', included: false },
      { text: 'Itinerary with images & themes', included: false },
    ],
    cta: 'Start Free',
    ctaStyle: 'border border-dark-border hover:border-primary/50 text-dark-heading',
  },
  {
    name: 'Starter',
    price: { monthly: '₹499', annual: '₹399' },
    period: { monthly: 'Billed monthly', annual: 'Billed annually' },
    description: 'Everything a solo agent needs',
    popular: false,
    features: [
      { text: '50 quotes/month, 200 customers', included: true },
      { text: 'Your logo & brand on every PDF', included: true },
      { text: 'Track payments, dues & refunds', included: true },
      { text: 'Bank details, UPI & QR code on invoices', included: true },
      { text: 'Credit notes, receipts & custom numbering', included: true },
      { text: 'TCS tracking & service-level margins', included: true },
      { text: 'Editable itinerary (text only)', included: true },
      { text: 'Share via WhatsApp, Gmail & email', included: true },
      { text: 'Reports & analytics', included: false },
      { text: 'Itinerary with images & themes', included: false },
    ],
    cta: 'Get Started',
    ctaStyle: 'border border-dark-border hover:border-primary/50 text-dark-heading',
  },
  {
    name: 'Growth',
    price: { monthly: '₹999', annual: '₹799' },
    period: { monthly: 'Billed monthly', annual: 'Billed annually' },
    description: 'Scale without limits',
    popular: true,
    features: [
      { text: 'Unlimited quotes & customers', included: true },
      { text: '3 team members', included: true },
      { text: 'Revenue, profit & booking analytics', included: true },
      { text: 'Top destinations & customer insights', included: true },
      { text: 'Itinerary with images, 10 themes & cover pages', included: true },
      { text: 'Advance ledger, batch payments & allocation', included: true },
      { text: 'All invoice types incl. cancellation & processing fee CN', included: true },
      { text: 'AI vendor quote import', included: false },
    ],
    cta: 'Start Growth',
    ctaStyle: 'bg-primary hover:bg-primary-dark text-white',
  },
  {
    name: 'Pro',
    price: { monthly: '₹4,999', annual: '₹3,999' },
    period: { monthly: 'Billed monthly', annual: 'Billed annually' },
    description: 'The complete agency toolkit',
    popular: false,
    features: [
      { text: 'Everything in Growth, unlimited', included: true },
      { text: 'AI vendor quote import — save 1–2 hrs/quote', included: true },
      { text: 'Upload PDF, image or Excel — auto-fills everything', included: true },
      { text: 'Auto-populate itinerary pages from vendor data', included: true },
      { text: 'PNR parser — paste PNR, auto-extract flight details into quotes', included: true },
      { text: '10 team members with role & module permissions', included: true },
      { text: 'Extra seats available for larger teams', included: true },
      { text: 'Priority support — we respond in hours', included: true },
    ],
    extra: '+ ₹500/seat/month for additional users',
    cta: 'Go Pro',
    ctaStyle: 'border border-dark-border hover:border-primary/50 text-dark-heading',
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-dark-text text-lg max-w-xl mx-auto">
            Start free and scale as your agency grows. No hidden fees, no long-term contracts.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-1 mb-12">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              !isAnnual ? 'bg-dark-card text-dark-heading border border-dark-border' : 'text-dark-text'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              isAnnual ? 'bg-dark-card text-dark-heading border border-dark-border' : 'text-dark-text'
            }`}
          >
            Annual
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-dark-card border rounded-2xl p-6 flex flex-col relative ${
                plan.popular ? 'border-primary' : 'border-dark-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-medium px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-primary text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl sm:text-4xl font-serif text-dark-heading">
                    {typeof plan.price === 'object'
                      ? isAnnual
                        ? plan.price.annual
                        : plan.price.monthly
                      : plan.price}
                  </span>
                  {plan.price.monthly !== 'Free' && <span className="text-dark-text text-sm">/mo</span>}
                </div>
                <div className="text-dark-text text-xs mt-1">
                  {typeof plan.period === 'object'
                    ? isAnnual
                      ? plan.period.annual
                      : plan.period.monthly
                    : plan.period}
                </div>
                <p className="text-dark-text text-sm mt-3">{plan.description}</p>
              </div>

              <hr className="border-dark-border mb-6" />

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.included ? (
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    ) : (
                      <X size={16} className="text-dark-text/40 mt-0.5 shrink-0" />
                    )}
                    <span className={f.included ? 'text-dark-text' : 'text-dark-text/40'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {plan.extra && (
                <p className="text-primary text-xs mb-4">{plan.extra}</p>
              )}

              <button
                className={`w-full py-2.5 rounded-full text-sm font-medium transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-dark-text">Have questions or need a custom plan?</p>
          <p className="text-primary font-medium mt-1">Contact us at support@turidoo.app</p>
        </div>
      </div>
    </section>
  );
}
