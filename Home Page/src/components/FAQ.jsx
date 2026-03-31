import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = [
  {
    title: 'Getting Started',
    questions: [
      {
        q: 'How does the free trial work for travel agencies and tour operators?',
        a: "Start with our Free plan — no credit card required. You get 5 quotes, 25 customers, and full WhatsApp sharing for sending branded PDF quotes to passengers. When you're ready for more bookings and GST invoicing, upgrade to any paid plan. You can cancel anytime with no charges.",
      },
      {
        q: 'How long does it take to set up a travel agency account on Turidoo?',
        a: 'Most agencies are up and running within 5 minutes. Just sign up, enter your agency details, GSTIN, and start creating quotes immediately.',
      },
      {
        q: 'Can I migrate my existing customer and booking data from spreadsheets?',
        a: 'Yes! You can import customer data from Excel or CSV files. Our system maps your columns automatically so you can get started without re-entering everything.',
      },
      {
        q: 'Is my passenger and booking data secure on Turidoo?',
        a: 'Absolutely. We use bank-grade encryption, secure authentication, and role-based access controls. Each agency gets its own isolated workspace.',
      },
      {
        q: 'Can I share travel quotes and itineraries with passengers via WhatsApp?',
        a: 'Yes, all plans include WhatsApp sharing. Generate a PDF and share it directly to your client via WhatsApp with one click.',
      },
      {
        q: 'Does Turidoo support multiple currencies for international tour packages?',
        a: 'Yes, you can create quotes in multiple currencies for international packages while maintaining INR as your base currency for accounting.',
      },
      {
        q: 'Do you offer annual billing discounts for travel agencies?',
        a: 'Yes! Annual billing saves you up to 20% compared to monthly plans. Switch anytime from your billing settings.',
      },
    ],
  },
  {
    title: 'Technical & Compliance',
    questions: [
      {
        q: "Is Turidoo's invoicing 100% compliant with Indian Travel GST-1 and GST-3B regulations?",
        a: 'Yes, our invoicing system is fully compliant with Indian GST regulations including GST-1, GST-3B, and HSN/SAC code requirements specific to the travel industry.',
      },
      {
        q: 'How does the Air GST module calculate taxes on GDS and LCC commissions?',
        a: 'The Air GST module automatically calculates taxes based on commission type (GDS vs LCC), base fare, and applicable tax slabs as per current GST regulations.',
      },
      {
        q: 'How does a travel agency use dual invoicing to separate customer pricing from internal profit margins?',
        a: 'Turidoo supports dual invoicing with customer-facing quotes showing the client price, and internal memorandum accounts tracking your actual costs and margins.',
      },
      {
        q: 'How can a travel agent track actual profits after GST and vendor payouts?',
        a: 'Our net profit tracker automatically calculates your actual earnings after deducting GST liability, vendor costs, TCS, and commissions — giving you the real picture.',
      },
      {
        q: 'How does Turidoo calculate net profit for travel agents across different billing models and income scenarios?',
        a: 'We support all billing models — B2C, B2B, commission-based, and markup-based. The profit calculator adjusts formulas based on your billing type automatically.',
      },
      {
        q: 'Does the ledger support travel-specific settlements like Balance Carry-Forwards?',
        a: 'Yes, the advance ledger supports deposits, partial payments, balance carry-forwards, and batch payment allocation across multiple bookings.',
      },
      {
        q: 'How does the PNR-to-Itinerary Converter handle multi-sector flights from Amadeus, Sabre, and Galileo?',
        a: 'Simply paste the PNR and our parser auto-extracts flight details including multi-sector routes, timings, and airline info from all major GDS systems.',
      },
      {
        q: 'How do automated pending payment reminders work for group bookings?',
        a: 'Set up automatic reminders that notify customers via WhatsApp or email when payments are due. Customize frequency and messaging per booking.',
      },
      {
        q: 'Does the Commission and Discount module affect GST reporting for travel agents?',
        a: 'Yes, commissions and discounts are factored into GST calculations automatically, ensuring your tax invoices and returns are always accurate.',
      },
      {
        q: 'How do Indian travel agents handle customer booking cancellations and refunds in Turidoo?',
        a: 'Process cancellations with automatic credit note generation, refund tracking, and processing fee invoices — all GST compliant.',
      },
      {
        q: 'How does the Customer Advance Ledger work for travel agencies managing deposits and prepayments?',
        a: 'The advance ledger tracks every deposit, allocates payments to specific bookings, and maintains a running balance for each customer.',
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState('0-0');

  const toggle = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-dark-text text-lg">
            Everything you need to know about Turidoo. Can't find what you're looking for?{' '}
            <a href="#" className="text-primary hover:underline">Reach out to our team</a>.
          </p>
        </div>

        {categories.map((cat, ci) => (
          <div key={cat.title} className="mb-10">
            <h3 className="text-primary text-sm font-medium tracking-widest uppercase mb-6">{cat.title}</h3>
            <div className="space-y-0">
              {cat.questions.map((item, qi) => {
                const key = `${ci}-${qi}`;
                const isOpen = openIndex === key;
                return (
                  <div key={key} className="border-b border-dark-border">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between py-5 text-left"
                    >
                      <span className="text-dark-heading text-base font-medium pr-4">{item.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-dark-text shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-5 text-dark-text text-sm leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
