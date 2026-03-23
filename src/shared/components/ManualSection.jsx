import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './Header';
import '../styles/manual.css';

const SECTIONS = [
  { id: 'getting-started', title: 'Getting Started', subtitle: 'First steps and app overview', icon: '📖' },
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Understanding your dashboard metrics', icon: '📊' },
  { id: 'quotes', title: 'Quotes', subtitle: 'Creating and managing travel quotes', icon: '📄' },
  { id: 'bookings', title: 'Bookings', subtitle: 'Managing confirmed trips and invoices', icon: '📅' },
  { id: 'invoices', title: 'Invoices', subtitle: 'Tax invoices and credit notes', icon: '🧾' },
  { id: 'payments', title: 'Payments', subtitle: 'Recording payments and receipts', icon: '💳' },
  { id: 'refunds', title: 'Refunds & Cancellations', subtitle: 'Processing trip cancellations', icon: '🔄' },
  { id: 'settings', title: 'Settings', subtitle: 'Application configuration', icon: '⚙️' },
  { id: 'glossary', title: 'Glossary', subtitle: 'Terms and definitions', icon: '📚' },
];

const ARTICLES = [
  // GETTING STARTED
  {
    section: 'getting-started',
    title: 'Application Overview',
    subtitle: 'Touridoo is an end-to-end travel agency management platform.',
    body: 'Touridoo helps travel agencies manage the full lifecycle from <b>quote creation</b> to <b>booking confirmation</b>, <b>invoicing</b>, <b>payment collection</b>, and <b>cancellation/refunds</b>. The sidebar gives you quick access to all modules: Dashboard, Customers, Quotes, Bookings, Live Trips, Payments, Sales Invoices, and Settings.'
  },
  {
    section: 'getting-started',
    title: 'End-to-End Workflow',
    subtitle: 'The typical flow: Quote → Booking → Invoice → Payment → (optional) Cancellation.',
    body: `<ul>
      <li><b>Step 1 — Create a Quote:</b> Add trip details, select services, set <b>pricing and billing model</b>.</li>
      <li><b>Step 2 — Send to Customer:</b> Share via WhatsApp, email, or download PDF.</li>
      <li><b>Step 3 — Convert to Booking:</b> Once approved, convert the quote. A Tax Invoice is generated automatically.</li>
      <li><b>Step 4 — Collect Payments:</b> Record payments against the booking. Receipts are generated for each payment.</li>
      <li><b>Step 5 — Trip Completion:</b> Track via Live Trips. Mark <b>complete</b> when the trip is over.</li>
      <li><b>Optional — Cancel & Refund:</b> Cancel the booking, issue a Cancellation Note, and process refund to customer's advance, another booking, or as cash.</li>
    </ul>`
  },
  // DASHBOARD
  {
    section: 'dashboard',
    title: 'Total Quotes',
    subtitle: 'Cumulative count of all quotations created in the selected period.',
    body: 'Shows the total number of quotes your agency has created. Click the card to navigate to the Quotes page. The percentage change compares the current period to the previous equivalent period.'
  },
  {
    section: 'dashboard',
    title: 'Active Bookings',
    subtitle: 'Number of confirmed/in-progress bookings.',
    body: 'Displays the count of bookings with status <span class="code-pill">confirmed</span> or <span class="code-pill">in_progress</span>. Cancelled and completed bookings are excluded. Click to navigate to Bookings.'
  },
  {
    section: 'dashboard',
    title: 'Revenue',
    badge: 'credit',
    subtitle: 'Total revenue billed across confirmed bookings for the selected period.',
    body: 'Revenue is the sum of <span class="code-pill">invoice_value</span> (or <span class="code-pill">total_payable</span> when TCS applies) across all confirmed bookings in the chosen time range (30 days, 60 days, 90 days, 1 year, or all time). This represents your top-line billing, not profit.'
  },
  {
    section: 'dashboard',
    title: 'Total Customers',
    subtitle: 'Unique customer count across all quotes and bookings.',
    body: 'The total number of unique customers registered in your system. Click to navigate to the Customers page.'
  },
  {
    section: 'dashboard',
    title: 'Total Revenue (Financial Summary)',
    badge: 'credit',
    subtitle: 'Cumulative revenue across all confirmed bookings.',
    body: 'Shown in the Financial Summary panel. This is the total amount billed to customers across all confirmed/active bookings. It includes GST and TCS where applicable.'
  },
  {
    section: 'dashboard',
    title: 'Total Profit',
    badge: 'credit',
    subtitle: 'Sum of margins and commissions earned across all bookings.',
    body: 'Total Profit = Margin + Commission across all bookings. Margin is the difference between what you charge the customer (package price) and what you pay vendors (total cost). Commission is any vendor-paid incentive tracked separately.'
  },
  {
    section: 'dashboard',
    title: 'Pending Payments',
    badge: 'debit',
    subtitle: 'Outstanding balance owed by customers.',
    body: 'Sum of <span class="code-pill">amount_pending</span> across all non-fully-paid bookings. Calculated as <span class="code-pill">total_payable</span> - <span class="code-pill">amount_paid</span> for each booking. This tells you how much money is yet to be collected from customers.'
  },
  {
    section: 'dashboard',
    title: 'Quote Conversion Rate',
    subtitle: 'Percentage of quotes successfully converted to bookings.',
    body: 'Calculated as (total_bookings / total_quotes) x 100. A higher conversion rate indicates better sales effectiveness. Only quotes that have been converted to bookings count.'
  },
  // QUOTES
  {
    section: 'quotes',
    title: 'Trip Details (Step 1)',
    subtitle: 'Define destination, dates, and travelers for the quote.',
    body: `<ul>
      <li><b>Destination Type:</b> Domestic or International. Determines TCS applicability and GST rules.</li>
      <li><b>Place of Travel:</b> City or destination name.</li>
      <li><b>State / Country of Travel:</b> For domestic trips, the Indian state. For international, the country.</li>
      <li><b>Departure & Return Date:</b> Trip start and end dates. Duration is auto-calculated.</li>
      <li><b>Adults / Children / Infants:</b> Traveler counts. Children are ages 2–12, infants 0–2.</li>
      <li><b>Traveler Details:</b> Optional — name and passport number for each traveler.</li>
    </ul>`
  },
  {
    section: 'quotes',
    title: 'Services (Step 2)',
    subtitle: 'Select and configure travel services with costs, vendors and margins.',
    body: `<p>Choose from 13 service types: <b>Flight, Flight Extras, Train, Bus, Hotel, Land Package, Visa, Activities, Cab/Transport, Fooding, Admission, Travel Insurance, Other.</b></p>
    <p>For each service:</p>
    <ul>
      <li><b>Service Cost:</b> Cost in the original currency (auto-converts to INR via FX rates).</li>
      <li><b>Currency:</b> Select currency if not INR; live exchange rates are fetched.</li>
      <li><b>Vendor:</b> The supplier/provider name.</li>
      <li><b>Service Margin:</b> Your desired profit for this specific service.</li>
    </ul>
    <p><b>Simple vs Detailed:</b> Simple mode uses a single margin for the whole service. Detailed mode allows per-item breakdowns.</p>
    <p><b>Package Detection:</b> If 2 or more services are added to an international trip, it is classified as a "Package" for TCS 5% compliance.</p>`
  },
  {
    section: 'quotes',
    title: 'Billing Model',
    subtitle: 'Determines how GST is applied: on margin only or full value.',
    body: `<ul>
      <li><b>Pure Agent:</b> Best for lowest GST burden. GST applies only on your service fee (Margin). Vendors bill the customer directly in your records.</li>
      <li><b>Principal (18%):</b> Standard full-value billing. You bill the customer for the entire amount + 18% GST.</li>
      <li><b>Principal Package (5%):</b> For tour packages. Statutory 5% GST on total value (no Input Tax Credit).</li>
      <li><b>Principal Pass-through (18% + ITC):</b> Full value billing where you claim Input Tax Credit on vendor bills.</li>
    </ul>`
  },
  {
    section: 'quotes',
    title: 'Pricing (Step 3)',
    subtitle: 'Set the customer price or margin, and calculate GST and TCS.',
    body: `<p>Two input modes:</p>
    <ul>
      <li><b>Total Quote:</b> Enter the final price you want to charge; system back-calculates margin.</li>
      <li><b>Set Margin:</b> Enter your desired profit; system calculates final package price.</li>
    </ul>
    <p>Key calculated fields:</p>
    <ul>
      <li><b>Package Price:</b> The core trip cost before taxes.</li>
      <li><b>GST Amount:</b> The tax component based on the billing model.</li>
      <li><b>CGST/SGST:</b> Intra-state split. <b>IGST:</b> Inter-state tax.</li>
      <li><b>TCS:</b> Tax Collected at Source (International packages only).</li>
      <li><b>Total Payable:</b> Final amount the customer must pay.</li>
    </ul>`
  },
  {
    section: 'quotes',
    title: 'Margin',
    badge: 'credit',
    subtitle: 'Total profit earned between cost and sale price.',
    body: 'The difference between the Total Cost of all services and the final Package Price charged to the customer. This is your primary earnings from the trip.'
  },
  {
    section: 'quotes',
    title: 'Commission Earned',
    badge: 'credit',
    subtitle: 'Additional earnings from vendors, tracked separately.',
    body: 'Any incentive or fallback commission provided by airlines or hotels that is not part of the customer-facing margin. This adds to your Total Profit.'
  },
  {
    section: 'quotes',
    title: 'Display Processing Charge (Pure Agent)',
    badge: 'credit',
    subtitle: 'Customer-visible fee in Pure Agent mode.',
    body: `<p>In Pure Agent, you must disclose a service fee. <b>Inclusive:</b> The fee is part of your margin. <b>Exclusive:</b> The fee is added on top of your margin.</p>`
  },
  {
    section: 'quotes',
    title: 'Place of Supply',
    subtitle: 'Determines the GST jurisdiction.',
    body: `<ul>
      <li><b>Same State:</b> Business and customer in same state → split CGST + SGST.</li>
      <li><b>Different State:</b> Business and customer in different states → full IGST.</li>
      <li><b>International:</b> Customer state/country code 99 → 0% GST (Export of Service).</li>
    </ul>`
  },
  {
    section: 'quotes',
    title: 'TCS (Tax Collected at Source)',
    badge: 'debit',
    subtitle: 'Government mandate for international tour packages.',
    body: `<p><b>Applies when:</b> International trip AND 2+ services. <b>Rate:</b> 5% on the total value. <b>Note:</b> This is collected from the customer and you must deposit it with the government under their PAN.</p>`
  },
  {
    section: 'quotes',
    title: 'Review & Send (Step 4)',
    subtitle: 'Finalize the proposal and share it.',
    body: `<p>Add <b>Inclusions, Exclusions,</b> and <b>Note/Terms</b>. Use <b>Internal Notes</b> for team-only info. <b>PDF Types:</b> Standard (with costs), Itinerary Only (no costs), or Condensed. <b>Share:</b> WhatsApp, Email, or direct PDF link.</p>`
  },
  {
    section: 'quotes',
    title: 'Quote Financial Summary',
    subtitle: 'A breakdown of the full financial structure of the quote.',
    body: 'Shows Total Cost, Total Margin, Total Commission, GST, TCS and Total Payable in one panel for quick review before sending.'
  },
  // BOOKINGS
  {
    section: 'bookings',
    title: 'Converting a Quote to Booking',
    subtitle: 'The transition from proposal to confirmed sale.',
    body: 'Once a customer approves a quote, click <b>Convert to Booking</b>. You will be prompted to confirm Customer details (PAN, GSTIN). Converting generates a <b>Tax Invoice</b> automatically and creates the booking record. The quote remains as a reference.'
  },
  {
    section: 'bookings',
    title: 'Booking Statuses',
    subtitle: 'The lifecycle of a confirmed trip.',
    body: `<ul>
      <li><span class="code-pill">confirmed</span>: Booking is active.</li>
      <li><span class="code-pill">in_progress</span>: Trip is currently happening.</li>
      <li><span class="code-pill">completed</span>: Trip is over.</li>
      <li><span class="code-pill">cancelled</span>: Trip was cancelled.</li>
    </ul>
    <p><b>Payment Statuses:</b> <span class="code-pill">paid</span> (Fully paid), <span class="code-pill">partially_paid</span>, or <span class="code-pill">unpaid</span>.</p>`
  },
  {
    section: 'bookings',
    title: 'Total Payable',
    badge: 'credit',
    subtitle: 'The final amount confirmed for the booking.',
    body: 'Copied from the Quote at the time of conversion. This is the legal amount billed on the Tax Invoice.'
  },
  {
    section: 'bookings',
    title: 'Amount Paid',
    badge: 'credit',
    subtitle: 'Total payments received against this booking.',
    body: 'The sum of all recorded payments that have been allocated to this specific booking ID.'
  },
  {
    section: 'bookings',
    title: 'Amount Pending',
    badge: 'debit',
    subtitle: 'Outstanding balance for this booking.',
    body: 'Calculated as <span class="code-pill">total_payable</span> - <span class="code-pill">amount_paid</span>. Highlights what the customer still owes.'
  },
  // INVOICES
  {
    section: 'invoices',
    title: 'Tax Invoice',
    subtitle: 'The primary legal billing document.',
    body: 'Generated automatically on booking conversion. Shows your business details, customer details, SAC code (9985 for Tour Operator), and GST breakdown based on the billing model chosen in the quote.'
  },
  {
    section: 'invoices',
    title: 'External Balance Margin Invoice (EXT)',
    subtitle: 'Documentation for non-disclosed margin.',
    body: 'In Pure Agent mode, if your actual margin exceeds the disclosed Processing Charge, an EXT invoice is generated to document that balance with proper GST for your records.'
  },
  {
    section: 'invoices',
    title: 'Sales Invoices Page',
    subtitle: 'Listing of all generated invoices.',
    body: 'A centralized list of all Tax Invoices, EXT Invoices, and Cancellation Notes. Search by Invoice Number or Customer Name. Download PDFs or share links.'
  },
  {
    section: 'invoices',
    title: 'Cancellation Note (CN)',
    badge: 'debit',
    subtitle: 'Documenting a booking cancellation.',
    body: 'Issued when a booking is cancelled. It effectively reverses or adjusts the original Tax Invoice value for accounting and GST purposes.'
  },
  {
    section: 'invoices',
    title: 'Processing Fee Credit Note',
    badge: 'debit',
    subtitle: 'Refunding a service fee.',
    body: 'If you charged a processing fee and choose to refund it during cancellation, this credit note is issued to reverse that charge.'
  },
  // PAYMENTS
  {
    section: 'payments',
    title: 'Recording a Payment',
    badge: 'credit',
    subtitle: 'Log money received from a customer.',
    body: `<ol>
      <li>Select the <b>Customer</b>.</li>
      <li>Enter <b>Amount</b> and <b>Date</b>.</li>
      <li>Choose <b>Mode</b> (UPI, Cash, Bank Transfer, Net Banking, Credit Card, Debit Card, Check).</li>
      <li><b>Allocate</b> the payment to an open booking, or leave it for <b>Advance Balance</b>.</li>
      <li>Save to generate a <b>Payment Receipt</b>.</li>
    </ol>`
  },
  {
    section: 'payments',
    title: 'Advance Balance',
    badge: 'debit',
    subtitle: 'Money held but not yet applied to a booking trip.',
    body: 'Occurs when a customer pays more than their combined booking totals, or when a refund from a cancelled booking is moved to "Advance" instead of being paid out as cash.'
  },
  {
    section: 'payments',
    title: 'Advance Ledger',
    subtitle: 'Historical record of customer funds.',
    body: 'A detailed log for each customer showing every payment received, every allocation made to a trip, and any refund processed from their advance balance.'
  },
  {
    section: 'payments',
    title: 'Payment Allocation',
    subtitle: 'Linking payments to specific services.',
    body: 'Allocations ensure that the system knows which booking is "Paid" and which is "Pending". You can split a single payment across multiple bookings.'
  },
  {
    section: 'payments',
    title: 'Payment Receipt',
    badge: 'credit',
    subtitle: 'Proof of payment for the customer.',
    body: 'Issued for every recorded payment. Shows the total received and how much was applied to which booking IDs.'
  },
  // REFUNDS & CANCELLATIONS
  {
    section: 'refunds',
    title: 'Cancellation & Refund Overview',
    subtitle: 'Four phases of the cancellation process.',
    body: `<ol>
      <li><b>Initiate:</b> Click cancel on a booking and select a reason (Customer Request, Vendor Issue, Death/Illness, Other).</li>
      <li><b>Calculate:</b> Set refund processing fees and non-refundable charges (GST/TCS/Service Fees).</li>
      <li><b>Preview:</b> Review calculations and impact on the Tax Invoice (Void vs Credit Note).</li>
      <li><b>Confirm:</b> Generate the Cancellation Note and process the refund.</li>
    </ol>`
  },
  {
    section: 'refunds',
    title: 'Refund Mode',
    badge: 'debit',
    subtitle: 'Where does the refund money go?',
    body: `<ul>
      <li><b>Cash/Bank Refund:</b> Money paid back directly to the customer.</li>
      <li><b>Move to Advance:</b> Held in the system for future trips.</li>
      <li><b>Move to Another Trip:</b> Instantly applied to a different active booking for the same customer.</li>
    </ul>`
  },
  {
    section: 'refunds',
    title: 'Void Invoice',
    subtitle: 'Complete cancellation of a non-billed invoice.',
    body: 'If a booking is cancelled before any formal compliance reporting or if allowed by your policy, the invoice can be "Voided", making it invalid.'
  },
  {
    section: 'refunds',
    title: 'Refund Processing Fee',
    subtitle: 'Your charge for handling the cancellation.',
    body: 'Choosing to charge a fee reduces the total refund amount to the customer. This fee helps cover your operational costs.'
  },
  {
    section: 'refunds',
    title: 'Non-Refundable Charges',
    badge: 'debit',
    subtitle: 'Taxes and fees that cannot be recovered.',
    body: 'Systems often mark GST or TCS as non-refundable if the government deposit has already been processed or based on commercial terms.'
  },
  {
    section: 'refunds',
    title: 'Net Refund Amount',
    badge: 'debit',
    subtitle: 'Final amount calculated for the customer.',
    body: 'Total Paid - Processing Fees - Non-Refundable Taxes = Net Refund Amount.'
  },
  {
    section: 'refunds',
    title: 'Impact on Invoices',
    subtitle: 'How billing records change.',
    body: 'Cancelling a booking creates a Cancellation Note that adjusts your total sales for the period. The original invoice is either voided or adjusted by the CN.'
  },
  {
    section: 'refunds',
    title: 'Impact on Advance Ledger',
    subtitle: 'Tracking the refund flow.',
    body: 'Moving a refund to advance balance creates a credit entry in the customer\'s ledger, which can then be used for future allocations.'
  },
  {
    section: 'refunds',
    title: 'Impact on Tenant Finances',
    badge: 'debit',
    subtitle: 'How your agency\'s revenue is updated.',
    body: 'The refund decreases your Revenue and Total Profit metrics in the Dashboard as the sale is formally reversed.'
  },
  // SETTINGS
  {
    section: 'settings',
    title: 'Organization Settings',
    subtitle: 'Business identity configuration.',
    body: 'Configure your Business Name, Tagline, Address, Logo, GSTIN, and PAN. These details appear on all Quotes and Invoices.'
  },
  {
    section: 'settings',
    title: 'Bank & Payment Details',
    subtitle: 'Where customers should send money.',
    body: 'Configure your Bank Name, Account Number, IFSC, and UPI ID. These are printed on Invoices and Receipts for the customer\'s convenience.'
  },
  {
    section: 'settings',
    title: 'Document Numbering',
    subtitle: 'Customizing your document sequence.',
    body: 'Set custom prefixes and starting numbers for Quotes, Tax Invoices, Receipts, and Cancellation Notes (e.g., TDR/2024/).'
  },
  {
    section: 'settings',
    title: 'Team & Permissions',
    subtitle: 'Manage user access.',
    body: `<ul>
      <li><b>Administrator:</b> Full system access.</li>
      <li><b>Team Member:</b> Focused on operations (quotes/bookings).</li>
      <li><b>CA/Finance:</b> Access to billing and accounting records.</li>
    </ul>`
  },
  // GLOSSARY
  {
    section: 'glossary',
    title: 'Total Cost',
    badge: 'debit',
    subtitle: 'What you pay the vendors.',
    body: 'The sum of all service costs (vendor pricing + FX adjustments) before your margin is added.'
  },
  {
    section: 'glossary',
    title: 'Package Price',
    subtitle: 'Base price before taxes.',
    body: 'Total Cost + Total Margin. This is the value GST is usually calculated upon.'
  },
  {
    section: 'glossary',
    title: 'Invoice Value',
    badge: 'credit',
    subtitle: 'Base price + GST.',
    body: 'Package Price + GST Amount. This represents the total billed amount for the services provided.'
  },
  {
    section: 'glossary',
    title: 'Total Payable',
    badge: 'credit',
    subtitle: 'Final customer obligation.',
    body: 'Invoice Value + TCS (if applicable). This is the exact amount the customer must pay to your agency.'
  },
  {
    section: 'glossary',
    title: 'CGST & SGST',
    subtitle: 'GST for intra-state sales.',
    body: 'Central GST and State GST. If your agency is in Maharashtra and you bill a customer in Maharashtra, you charge 2.5% CGST + 2.5% SGST (for a 5% total).'
  },
  {
    section: 'glossary',
    title: 'IGST',
    subtitle: 'GST for inter-state sales.',
    body: 'Integrated GST. If your agency is in Maharashtra and you bill a customer in Delhi, you charge 5% IGST.'
  },
  {
    section: 'glossary',
    title: 'TCS (Tax Collected at Source)',
    badge: 'debit',
    subtitle: 'LRS compliance tax.',
    body: 'A 5% tax collected on international travel packages, to be deposited with the government against the customer\'s PAN.'
  },
  {
    section: 'glossary',
    title: 'Advance Balance',
    badge: 'debit',
    subtitle: 'Customer credit on account.',
    body: 'Funds received from a customer that are currently unallocated to any active booking.'
  },
  {
    section: 'glossary',
    title: 'Pure Agent Model',
    subtitle: 'GST optimization method.',
    body: 'A billing model where you act as an intermediary, and GST is only charged on your service fee rather than the full travel value.'
  },
  {
    section: 'glossary',
    title: 'Handling Fee',
    badge: 'credit',
    subtitle: 'Alternative term for processing charge.',
    body: 'A small fee charged for the service of booking and managing travel itineraries.'
  }
];

export const ManualSection = ({ mode = 'demo', initialSection = 'getting-started' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Lock main layout scroll and remove padding when manual is open to prevent "scrolling up"
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const originalOverflow = mainContent.style.overflow;
      const originalPadding = mainContent.style.padding;
      
      mainContent.style.overflow = 'hidden';
      mainContent.style.padding = '0';
      
      return () => {
        mainContent.style.overflow = originalOverflow;
        mainContent.style.padding = originalPadding;
      };
    }
  }, []);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  // Intersection Observer for Scroll Spy
  useEffect(() => {
    const options = {
      root: contentRef.current,
      rootMargin: '-20% 0px -80% 0px', // Trigger when section is in top portion
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      if (searchQuery) return; // Disable during search

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [searchQuery]);

  // Back to top visibility
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setShowBackToTop(scrollTop > 300);
  };

  // Initial deep link scroll
  useEffect(() => {
    if (initialSection && sectionRefs.current[initialSection]) {
      setTimeout(() => {
        sectionRefs.current[initialSection].scrollIntoView({ behavior: 'smooth' });
        setActiveSection(initialSection);
      }, 100);
    }
  }, [initialSection]);

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionClick = (id) => {
    setActiveSection(id);
    if (sectionRefs.current[id]) {
      sectionRefs.current[id].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const highlightText = (text, query) => {
    if (!query || typeof text !== 'string') return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="manual-highlight">{part}</mark> 
        : part
    );
  };

  // Helper to highlight text within HTML while avoiding tags
  const highlightHTML = (html, query) => {
    if (!query) return html;
    
    // Split by tags to only highlight text nodes
    const parts = html.split(/(<[^>]+>)/g);
    return parts.map(part => {
      if (part.startsWith('<')) return part;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return part.replace(regex, '<mark class="manual-highlight">$1</mark>');
    }).join('');
  };


  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const query = searchQuery.toLowerCase();
    
    return SECTIONS.map(section => {
      const matchingArticles = ARTICLES.filter(article => 
        article.section === section.id && (
          article.title.toLowerCase().includes(query) ||
          article.subtitle.toLowerCase().includes(query) ||
          article.body.toLowerCase().includes(query)
        )
      );
      return matchingArticles.length > 0 ? { ...section, matchingArticles } : null;
    }).filter(Boolean);
  }, [searchQuery]);

  return (
    <div className="manual-container fade-in">
      <Header
        title="Manual"
        subtitle="Complete application reference"
        showNewQuote={false}
        mode={mode}
      >
        <button className="print-btn" onClick={handlePrint} style={{
          marginRight: '8px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          background: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          🖨 Print
        </button>
      </Header>

      <div className="manual-layout">
        {/* Left Sidebar - Fixed */}
        <aside className="manual-sidebar">
          <span className="manual-sidebar-label">Sections</span>
          <div className="manual-sidebar-list">
            {SECTIONS.map(section => {
              const count = ARTICLES.filter(a => a.section === section.id).length;
              return (
                <div 
                  key={section.id} 
                  className={`manual-sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(section.id)}
                >
                  {section.title}
                  <span className="count">{count}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Content - Independent Scroll */}
        <div className="manual-content" ref={contentRef} onScroll={handleScroll}>
          {/* Search Bar Container */}
          <div className="manual-search-container">
            <div className="help-search-wrapper">
              <div className="help-search-input-wrap">
                <div className="help-search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input 
                  type="text" 
                  className="help-search-input" 
                  placeholder="Search manual — e.g. 'how to cancel', 'what is TCS', 'advance balance'."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredSections.length > 0 ? (
            filteredSections.map((section, sIdx) => {
              const articles = section.matchingArticles || ARTICLES.filter(a => a.section === section.id);
              return (
                <div 
                  key={section.id} 
                  id={section.id} 
                  className="manual-section"
                  ref={el => sectionRefs.current[section.id] = el}
                >
                  {sIdx > 0 && <div className="manual-section-separator" />}
                  
                  <div className="manual-section-heading">
                    <div className="manual-section-top-row">
                      <span className="manual-section-icon">{section.icon}</span>
                      <h2 className="manual-section-title">{section.title}</h2>
                    </div>
                    <p className="manual-section-subtitle">{section.subtitle}</p>
                  </div>

                  <div className="articles-list">
                    {articles.map((article, aIdx) => (
                      <div key={aIdx} className="article-card">
                        <div className="article-header">
                          <h3 className="article-title">{highlightText(article.title, searchQuery)}</h3>
                          {article.badge && (
                            <span className={`article-badge badge-${article.badge}`}>
                              {article.badge === 'credit' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                              )}
                              {article.badge === 'credit' ? 'Credit to Tenant' : 'Debit to Tenant'}
                            </span>
                          )}
                        </div>
                        <p className="article-article-subtitle">{highlightText(article.subtitle, searchQuery)}</p>
                        <div 
                          className="article-body" 
                          dangerouslySetInnerHTML={{ 
                            __html: highlightHTML(article.body, searchQuery)
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results-manual">
              <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No results for "<b>{searchQuery}</b>"</p>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top */}
      <button 
        className={`back-to-top-pill ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
        </svg>
        Back to top
      </button>
    </div>
  );
};
