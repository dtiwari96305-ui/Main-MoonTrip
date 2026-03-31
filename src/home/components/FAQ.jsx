import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* Helper: renders answer content with paragraphs, bullets, and sub-headings */
const AnswerBlock = ({ parts }) => (
  <div className="pb-5 text-dark-text text-sm leading-relaxed space-y-3">
    {parts.map((part, i) => {
      if (part.type === 'p')
        return <p key={i}>{part.text}</p>;
      if (part.type === 'heading')
        return <p key={i} className="text-dark-heading font-semibold mt-2">{part.text}</p>;
      if (part.type === 'bullets')
        return (
          <ul key={i} className="space-y-1.5 pl-1">
            {part.items.map((item, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-primary shrink-0 mt-0.5">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      if (part.type === 'link')
        return <p key={i}><a href="#" className="text-primary hover:underline text-xs font-medium">{part.text}</a></p>;
      return null;
    })}
  </div>
);

const categories = [
  {
    title: 'Getting Started',
    questions: [
      {
        q: 'How does the free trial work for travel agencies and tour operators?',
        parts: [
          { type: 'p', text: 'Start with our Free plan \u2014 no credit card required. You get 5 quotes, 25 customers, and full WhatsApp sharing for sending branded PDF quotes to passengers. When you\u2019re ready for more bookings and GST invoicing, upgrade to any paid plan. You can cancel anytime with no charges.' },
        ],
      },
      {
        q: 'How long does it take to set up a travel agency account on MoonTrip?',
        parts: [
          { type: 'p', text: 'Less than 10 minutes. Sign up, add your agency details and GSTIN, and start creating travel quotes right away. No complex setup, no training \u2014 your team can begin quoting passengers immediately.' },
        ],
      },
      {
        q: 'Can I migrate my existing customer and booking data from spreadsheets?',
        parts: [
          { type: 'p', text: 'Yes! You can import customer data, booking history, and quotes from spreadsheets or other travel management tools. Our support team will help travel agencies migrate seamlessly at no extra cost.' },
        ],
      },
      {
        q: 'Is my passenger and booking data secure on MoonTrip?',
        parts: [
          { type: 'p', text: 'Absolutely. We use bank-grade encryption (AES-256) for all travel agency data at rest and TLS 1.3 for data in transit. Your passenger records, booking details, and financial data are hosted on AWS with daily backups and strict access controls.' },
        ],
      },
      {
        q: 'Can I share travel quotes and itineraries with passengers via WhatsApp?',
        parts: [
          { type: 'p', text: 'Yes! All plans include WhatsApp sharing. Send beautiful, branded PDF quotes and itineraries directly to passengers via WhatsApp, email, or any messaging app \u2014 a must-have for modern Indian travel agencies.' },
        ],
      },
      {
        q: 'Does MoonTrip support multiple currencies for international tour packages?',
        parts: [
          { type: 'p', text: 'Yes. MoonTrip supports INR as the primary currency with multi-currency quote generation. Travel agents can create quotes in USD, EUR, GBP, and more for international clients and inbound tourists.' },
        ],
      },
      {
        q: 'Do you offer annual billing discounts for travel agencies?',
        parts: [
          { type: 'p', text: 'Yes \u2014 save up to 2 months free when you choose annual billing. All plans offer significant savings with annual subscriptions, designed for travel agencies and tour operators looking for long-term value.' },
        ],
      },
    ],
  },
  {
    title: 'Technical & Compliance',
    questions: [
      {
        q: 'Is MoonTrip\u2019s invoicing 100% compliant with Indian Travel GST-1 and GST-3B regulations?',
        parts: [
          { type: 'p', text: 'Yes. Every invoice is tagged with travel-specific HSN/SAC codes (e.g. 996411 for flights, 996311 for hotels, 996422 for cabs). The system automatically categorizes B2B and B2C sales and provides ready-to-export reports formatted for GSTR-1 and GSTR-3B filings \u2014 built specifically for travel agent and tour operator compliance.' },
          { type: 'link', text: 'Read full guide' },
        ],
      },
      {
        q: 'How does the Air GST module calculate taxes on GDS and LCC commissions?',
        parts: [
          { type: 'p', text: 'MoonTrip applies the correct travel industry logic automatically. For GDS/IATA net-rate tickets, 5% GST is applied on the base fare under the Principal model. For LCC and standard bookings, 18% GST is applied on the service fee or commission under the Pure Agent model. The system also handles CGST/SGST splits for intra-state and IGST for inter-state transactions \u2014 no manual calculation needed.' },
          { type: 'link', text: 'Read full guide' },
        ],
      },
      {
        q: 'How does a travel agency use dual invoicing to separate customer pricing from internal profit margins?',
        parts: [
          { type: 'p', text: 'MoonTrip uses the industry-standard dual-invoice model built for travel agents and tour operators under the Pure Agent billing method. The Customer-Facing Tax Invoice shows the passenger transparent reimbursement costs and a processing charge. The Internal EXT (Balance Margin) Invoice captures the actual margin earned, hidden markups, and GST breakdown \u2014 visible only to the agency.' },
          { type: 'p', text: 'This separation ensures profit privacy on B2B vendor quotes, keeps both invoices fully GST-compliant and accounting-ready for GSTR-1 and GSTR-3B filings, and gives travel agents a clear, real-time view of net profits across every booking.' },
          { type: 'link', text: 'Read full guide' },
        ],
      },
      {
        q: 'How can a travel agent track actual profits after GST and vendor payouts?',
        parts: [
          { type: 'p', text: 'MoonTrip\u2019s Actual Profit Tracking automatically deducts Vendor Net Costs and GST liabilities from the Customer Grand Total in real time. The internal dashboard shows your true margin, commission earned from vendor incentives, and total profit percentage \u2014 all invisible to the customer. Whether you\u2019re handling B2B modified quotes or direct bookings, you always see the real numbers.' },
          { type: 'link', text: 'Read full guide' },
        ],
      },
      {
        q: 'How does MoonTrip calculate net profit for travel agents across different billing models and income scenarios?',
        parts: [
          { type: 'p', text: 'MoonTrip tracks every income stream a travel agency earns and aggregates them into a single real-time Total Profit figure.' },
          { type: 'heading', text: 'By Billing Model:' },
          { type: 'bullets', items: [
            'Pure Agent \u2014 Net Profit = Customer Total \u2212 Vendor Net Cost \u2212 GST (charged @18% on margin only)',
            'Principal @18% \u2014 Net Profit = Package Price \u2212 Vendor Cost, with GST @18% on the full package value',
            'Principal @5% \u2014 GST is 5% on the total for tour packages, with no Input Tax Credit',
          ]},
          { type: 'heading', text: 'Additional Income Streams:' },
          { type: 'bullets', items: [
            'Vendor Commissions \u2014 Handling charges and incentives from vendors reduce your effective cost and boost profit',
            'Service Markup \u2014 When customer-facing price exceeds the internal vendor invoice, the difference is tracked as margin',
            'Retained Processing Fees \u2014 Booking fees retained by the agency on confirmed or cancelled bookings',
            'Cancellation Income \u2014 Difference between what the vendor charges and what the agent charges the passenger, plus any non-refunded booking fees',
          ]},
          { type: 'heading', text: 'Cost Adjustments:' },
          { type: 'bullets', items: [
            'Vendor Service Fees \u2014 Processing charges and GST from vendors are tracked as agency costs that reduce margin',
            'TCS @5% \u2014 Auto-applied on international tour packages',
          ]},
        ],
      },
      {
        q: 'Does the ledger support travel-specific settlements like Balance Carry-Forwards?',
        parts: [
          { type: 'p', text: 'Absolutely. MoonTrip is built for the real-world flow of travel funds. If a passenger cancels a trip or makes an overpayment, you can roll the remaining funds into a Credit Note or a Future Trip Ledger. The Customer Advance Ledger tracks every credit and debit with a running balance \u2014 automatically applying existing balances to new bookings without manual spreadsheet errors. Industry-standard reconciliation for Off-Platform Adjustments, Contra-Entries, and Voucher-Based Settlements is fully supported.' },
          { type: 'link', text: 'Read full guide' },
        ],
      },
      {
        q: 'How does the PNR-to-Itinerary Converter handle multi-sector flights from Amadeus, Sabre, and Galileo?',
        parts: [
          { type: 'p', text: 'Travel agents simply paste their PNR text from any GDS terminal \u2014 Amadeus, Sabre, or Galileo \u2014 and MoonTrip\u2019s parser automatically extracts all flight segments, layovers, passenger details, and booking classes. It then auto-populates the quote builder with the relevant details, which can be instantly converted into an invoice and itinerary. No GDS integration or terminal connection needed \u2014 just paste and go.' },
          { type: 'p', text: 'MoonTrip also includes a Generic PNR Parser where agents can paste any free-form text or upload a ticket image to extract flight information and auto-populate quote and invoice line items instantly.' },
          { type: 'link', text: 'Read full guide' },
        ],
      },
      {
        q: 'How do automated pending payment reminders work for group bookings?',
        parts: [
          { type: 'p', text: 'The Smart Receivables module monitors every traveler\u2019s Accounts Receivable ledger. When a booking remains in \u2018Partial\u2019 or \u2018Unpaid\u2019 status past its due date, the system triggers automated, professional follow-ups via WhatsApp and Email. Reminders continue until the settlement is closed \u2014 ensuring no outstanding passenger balance slips through the cracks.' },
        ],
      },
      {
        q: 'Does the Commission and Discount module affect GST reporting for travel agents?',
        parts: [
          { type: 'p', text: 'Yes \u2014 and it\u2019s handled automatically. Vendor commissions are tracked separately as income and reduce your effective cost without appearing on the customer invoice. In the Pure Agent model, GST is charged only on the margin, not on the commission. Discounts are deducted from the taxable value, keeping your agency\u2019s GSTR-1 and GSTR-3B filings 100% accurate.' },
        ],
      },
      {
        q: 'How do Indian travel agents handle customer booking cancellations and refunds in MoonTrip?',
        parts: [
          { type: 'p', text: 'MoonTrip provides a guided cancellation wizard that handles every real-world scenario a travel agency faces \u2014 from full voids to partial refunds with markup recovery.' },
          { type: 'heading', text: 'Two Cancellation Paths:' },
          { type: 'bullets', items: [
            'Void Invoice \u2014 Nullifies the entire invoice when no charges apply. The full amount paid is refunded automatically.',
            'Cancellation Note (CN) \u2014 For partial cancellations with charges. The system walks you through vendor charges, customer charges, handling fees, and processing fee refunds step by step.',
          ]},
          { type: 'heading', text: 'Smart Charge Handling:' },
          { type: 'bullets', items: [
            'When the customer charge exceeds the actual vendor charge, the difference is captured as agent profit via an internal EXT invoice',
            'Processing fees can be retained or refunded \u2014 with a separate credit note generated automatically',
            'TCS refunds on international packages are handled with a single toggle',
          ]},
          { type: 'heading', text: 'Flexible Refund Destinations:' },
          { type: 'bullets', items: [
            'Customer Advance \u2014 Refund goes to the customer\u2019s advance balance for future trips',
            'Allocate to Another Trip \u2014 Split the refund across other pending bookings of the same customer',
            'Direct Refund \u2014 Settle via UPI, bank transfer, cheque, or card',
          ]},
          { type: 'p', text: 'Up to 3 GST-compliant documents are auto-generated: Cancellation Note (E1), Internal Margin Invoice (E2), and Processing Fee Credit Note (E4).' },
        ],
      },
      {
        q: 'How does the Customer Advance Ledger work for travel agencies managing deposits and prepayments?',
        parts: [
          { type: 'p', text: 'MoonTrip\u2019s Customer Advance Ledger gives travel agents a complete credit-and-debit view of every customer\u2019s prepaid balance \u2014 no spreadsheets needed.' },
          { type: 'heading', text: 'How Advances Are Created:' },
          { type: 'bullets', items: [
            'Direct Deposits \u2014 Record advance payments from customers via UPI, bank transfer, or any payment mode alongside regular booking allocations',
            'Cancellation Refunds \u2014 When a booking is cancelled, the refund amount is automatically credited to the customer\u2019s advance balance for future trips',
          ]},
          { type: 'heading', text: 'Auto-Application to Bookings:' },
          { type: 'bullets', items: [
            'When a new booking is created, MoonTrip checks for available advance balance and applies it automatically (FIFO \u2014 oldest advance first). The booking\u2019s pending amount is reduced instantly, and the advance balance is adjusted in real time.',
          ]},
          { type: 'heading', text: 'Ledger Tracking & Export:' },
          { type: 'bullets', items: [
            'Full credit/debit ledger with running balance per customer',
            'Export to PDF with date, payment reference, description, and running totals',
            'Generate GST-compliant Credit Notes for refund-sourced advances',
            'Convert unused advance balance to a direct refund at any time',
          ]},
        ],
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
            Everything you need to know about MoonTrip. Can't find what you're looking for?{' '}
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
                      className="w-full flex items-center justify-between py-5 text-left bg-transparent border-0 cursor-pointer"
                    >
                      <span className="text-dark-heading text-base font-medium pr-4">{item.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-dark-text shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && <AnswerBlock parts={item.parts} />}
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
