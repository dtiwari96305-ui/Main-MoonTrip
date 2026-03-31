import { ArrowRight } from 'lucide-react';

const guides = [
  {
    tags: ['GST Compliance', 'Air Tickets', 'Tax Calculation'],
    title: 'How to Correctly Calculate GST on Air Tickets for Indian Travel Agencies',
    description: 'Master the 5% vs 18% GST split on domestic and international air tickets. Covers GDS net-rate, LCC commission, and service fee taxation with formulas.',
  },
  {
    tags: ['Ledger Management', 'Reconciliation', 'Payments'],
    title: "Why Your Travel Agency Ledger Isn\u2019t Balancing (And How to Fix It)",
    description: 'Customer advances, cancellation refunds, and carry-forward balances \u2014 learn how to reconcile your travel agency ledger without spreadsheet errors.',
  },
  {
    tags: ['Dual Invoicing', 'Profit Margins', 'Pure Agent'],
    title: 'How Indian Travel Agents Use Dual Invoicing to Protect Profit Margins',
    description: 'Net-rate vs commission invoicing, Pure Agent vs Principal billing, and how dual invoices keep your markups private while staying GST-compliant.',
  },
  {
    tags: ['GSTR-1', 'GSTR-3B', 'GST Compliance'],
    title: 'How MoonTrip Automates GSTR-1 and GSTR-3B Filing Data for Travel Agencies',
    description: 'B2B vs B2C categorization, HSN/SAC codes, CGST/SGST/IGST split, credit notes \u2014 all automated. Stop spending 3 days on monthly GST filing.',
  },
  {
    tags: ['Hidden Markups', 'Settlements', 'Compliance'],
    title: 'Hidden Markups, Balance Settlements, and Dual Invoicing',
    description: 'Stop using secret notebooks. Learn the professional way to protect margins with dual invoicing, balance roll-forwards, and off-platform settlement tracking \u2014 100% GST-compliant.',
  },
  {
    tags: ['B2B Automation', 'Itinerary Builder', 'Vendor Import'],
    title: 'How to Turn a B2B (DMC) Vendor Quote into a Branded Itinerary in 2 Minutes',
    description: 'Stop re-typing vendor PDFs. AI-powered import extracts hotels, flights, and day-wise plans from any DMC quote \u2014 branded quote, invoice, and itinerary generated simultaneously.',
  },
  {
    tags: ['PNR Parser', 'GDS', 'Amadeus / Sabre / Galileo'],
    title: "How MoonTrip\u2019s PNR Parser Turns Raw GDS Text into Flight Vouchers and Invoices",
    description: 'Paste Amadeus, Sabre, or Galileo PNR text \u2014 auto-extract flight segments, passengers, and booking classes. No GDS terminal connection needed.',
  },
  {
    tags: ['Glossary', 'Reference', 'All Terms'],
    title: 'The Indian Travel Agency Dictionary \u2014 35 Essential Terms',
    description: 'Pure Agent, Hidden Markup, GSTR-1, PNR, TCS, FIFO Ledger \u2014 every term an Indian travel agent needs to know, defined and linked to detailed guides.',
  },
];

export default function AIPowered() {
  return (
    <section id="guides" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Guides</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
            Travel Agency Guides
          </h2>
          <p className="text-dark-text text-lg max-w-2xl">
            GST compliance, invoicing, ledger management, and profit tracking &mdash;
            explained for Indian travel agencies and tour operators.
          </p>
        </div>

        {/* Guide Cards */}
        <div className="space-y-6">
          {guides.map((guide) => (
            <div
              key={guide.title}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-primary text-xs font-medium bg-primary/10 border border-primary/20 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-dark-heading text-lg sm:text-xl font-serif font-semibold mb-3 leading-snug">
                {guide.title}
              </h3>

              {/* Description */}
              <p className="text-dark-text text-sm leading-relaxed mb-4">
                {guide.description}
              </p>

              {/* CTA */}
              <a href="#" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1.5 transition-colors">
                Read Guide
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
