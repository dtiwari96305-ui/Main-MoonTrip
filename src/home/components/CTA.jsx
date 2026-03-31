import { ArrowRight } from 'lucide-react';

export default function CTA({ onSignUp }) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-primary text-sm font-medium tracking-widest uppercase">Get Started Today</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
          Ready to Transform Your Travel Agency?
        </h2>
        <p className="text-dark-text text-lg max-w-2xl mx-auto mb-10">
          Join hundreds of travel professionals who've modernised their workflow with Turidoo. Start free, upgrade when you're ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={onSignUp}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 group border-0 cursor-pointer"
          >
            Get Started Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#pricing"
            className="border border-dark-border hover:border-dark-text text-dark-heading px-8 py-3.5 rounded-full text-base font-medium transition-colors"
          >
            View Pricing
          </a>
        </div>

        <p className="text-dark-text text-sm">
          No credit card required &bull; 14-day free trial &bull; Cancel anytime
        </p>
      </div>
    </section>
  );
}
