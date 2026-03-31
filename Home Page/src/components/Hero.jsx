import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
          <span className="text-primary text-sm">✦ Built for Indian Travel Agencies</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-dark-heading leading-tight mb-6">
          The Operating Software for{' '}
          <span className="text-primary">Modern Indian Travel Agencies.</span>
        </h1>

        {/* Subtext */}
        <p className="text-dark-text text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          One platform for Quotes, Itineraries, and 100% GST-Compliant Invoices with
          Flexible Settlement Options, Net Profit Tracking, Pending Payments and
          Automated Workflows.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="#"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 group"
          >
            Get Started Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#pricing"
            className="border border-dark-border hover:border-dark-text text-dark-heading px-8 py-3.5 rounded-full text-base font-medium transition-colors flex items-center gap-2"
          >
            See Pricing
            <span className="text-xs">▶</span>
          </a>
        </div>

        <p className="text-dark-text text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
