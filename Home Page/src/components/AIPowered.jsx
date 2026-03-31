import { Sparkles } from 'lucide-react';

const suggestions = [
  'Too many spreadsheets',
  'GST invoices are painful',
  "Can't track payments",
  'Quote PDFs look unprofessional',
];

export default function AIPowered() {
  return (
    <section id="guides" className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={14} className="text-primary" />
          <span className="text-primary text-sm">AI-Powered</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mb-4">
          What's Slowing Your Agency Down?
        </h2>
        <p className="text-dark-text text-lg mb-10">
          Describe your challenge — we'll show you exactly how Turidoo solves it.
        </p>

        {/* Search Input */}
        <div className="flex items-center bg-dark-card border border-dark-border rounded-full p-2 max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="e.g. Tracking payments is a mess..."
            className="flex-1 bg-transparent text-dark-heading placeholder-dark-text/50 px-4 py-2 text-sm outline-none"
          />
          <button className="bg-primary/20 hover:bg-primary/30 text-primary px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
            <Sparkles size={14} />
            Find Solution
          </button>
        </div>

        {/* Suggestion Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {suggestions.map((s) => (
            <button
              key={s}
              className="bg-dark-card border border-dark-border hover:border-primary/30 text-dark-text text-sm px-4 py-2 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
