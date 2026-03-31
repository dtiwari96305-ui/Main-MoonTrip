import { ArrowRight } from 'lucide-react';

export default function Hero({ onSignUp, onDemo, isLoggedIn, onDashboard }) {
  return (
    <section className="pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
          <span className="text-primary text-sm">&#10022; Built for Indian Travel Agencies</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          {isLoggedIn ? (
            <button
              onClick={onDashboard}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 group border-0 cursor-pointer"
            >
              Go to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={onSignUp}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 group border-0 cursor-pointer"
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          <a
            href="#pricing"
            className="border border-dark-border hover:border-dark-text text-dark-heading px-8 py-3.5 rounded-full text-base font-medium transition-colors flex items-center gap-2"
          >
            See Pricing
            <span className="text-xs">&#9654;</span>
          </a>
        </div>

        {!isLoggedIn && (
          <button
            onClick={onDemo}
            className="text-primary hover:text-primary-light text-sm font-medium bg-transparent border-0 cursor-pointer mb-4 transition-colors"
          >
            View Demo Dashboard &rarr;
          </button>
        )}

        <p className="text-dark-text text-sm">
          No credit card required &bull; 14-day free trial &bull; Cancel anytime
        </p>
      </div>
    </section>
  );
}
