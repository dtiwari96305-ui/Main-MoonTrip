import React, { useState, useMemo } from 'react';
import { Header } from './Header';
import '../styles/help.css';

const MANUAL_CATEGORIES = [
  { id: 'getting-started', title: 'Getting Started', articles: 2 },
  { id: 'dashboard', title: 'Dashboard', articles: 8 },
  { id: 'quotes', title: 'Quotes', articles: 11 },
  { id: 'bookings', title: 'Bookings', articles: 5 },
  { id: 'invoices', title: 'Invoices', articles: 5 },
  { id: 'payments', title: 'Payments', articles: 5 },
  { id: 'refunds', title: 'Refunds & Cancellations', articles: 9 },
  { id: 'settings', title: 'Settings', articles: 4 },
  { id: 'glossary', title: 'Glossary', articles: 10 },
];

const FAQS = [
  {
    q: "How do I create my first quote?",
    a: "Go to Quotes from the sidebar and click 'Create Quote'. Follow the 4-step wizard: Trip Details, Services, Pricing, and Review. You can share the quote via WhatsApp, email, or download as PDF."
  },
  {
    q: "How do I convert a quote to a booking?",
    a: "Open a sent/approved quote and click 'Convert to Booking' in the action bar. This creates a confirmed booking and automatically generates a Tax Invoice. You can edit customer PAN and GSTIN during conversion."
  },
  {
    q: "What billing model should I use?",
    a: "Pure Agent is best for lowest GST burden — GST applies only on your service fee. Principal (18%) is standard full-value billing. Principal Package (5%) is for tour packages with lower tax. Choose based on your GST compliance strategy."
  },
  {
    q: "How do I record a payment?",
    a: "Go to Payments and click 'Record Payment'. Select the customer, enter the amount, choose the payment mode (UPI, Cash, Bank Transfer, etc.), and allocate the payment to one or more bookings. A receipt is auto-generated."
  },
  {
    q: "How does the advance balance work?",
    a: "Advance balance is money received from a customer but not yet allocated to a booking. It's created when payments exceed booking amounts, or from cancellation refunds. You can apply advance to future bookings or refund it as cash."
  },
  {
    q: "How do I cancel a booking and issue a refund?",
    a: "Open the booking, click Cancel, select the reason, and choose refund options (refund processing fee? void invoice?). Preview the calculation, then confirm. The refund can go to cash, advance balance, or another trip."
  },
  {
    q: "What is TCS and when does it apply?",
    a: "TCS (Tax Collected at Source) at 5% applies to international package tours with 2 or more services. It's collected from the customer on top of the invoice value and deposited with the government."
  },
  {
    q: "How are CGST/SGST vs IGST determined?",
    a: "If your business and the customer are in the same state, GST is split into CGST + SGST (50/50). If in different states, the full amount is charged as IGST. International customers (code 99) have no GST."
  },
  {
    q: "Can I customize invoice numbering?",
    a: "Yes! Go to Settings > Numbering. You can set custom prefix, suffix, and starting number for quotes, tax invoices, sales invoices, and receipts."
  },
  {
    q: "What roles and permissions are available?",
    a: "Three presets: Administrator (full access), Team Member (operations-focused), and CA/Finance (finance-focused). Each role has module-level permissions: none, view, or full. Admins always have full access."
  },
  {
    q: "How do I share a quote or invoice?",
    a: "Use the share button on any quote or invoice. Options include WhatsApp, Gmail, default email app, and native share (on mobile). You can also download the PDF directly."
  },
  {
    q: "What is the External Balance Margin Invoice (EXT)?",
    a: "The EXT Invoice shows the balance between your actual margin and the processing charge displayed to the customer in Pure Agent mode. It documents the difference with proper GST breakdown."
  }
];

export const HelpSection = ({ mode = 'demo', onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [feedbackType, setFeedbackType] = useState('feature');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const query = searchQuery.toLowerCase();
    return FAQS.filter(faq => 
      faq.q.toLowerCase().includes(query) || 
      faq.a.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleManualClick = (sectionId = 'getting-started') => {
    if (onViewChange) {
      onViewChange('manual', { initialSection: sectionId });
    }
  };

  const handleFeedbackSubmit = (e) => {
    // ... same as before
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) return;

    if (mode === 'demo') {
      const modal = document.createElement('div');
      modal.className = 'demo-modal-overlay';
      modal.innerHTML = `
        <div class="demo-modal">
          <div class="demo-modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3>Demo Account</h3>
          <p>This is a demo account. Changes cannot be made.</p>
          <button class="demo-modal-btn">Got it</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('.demo-modal-btn').onclick = () => document.body.removeChild(modal);
    } else {
      alert('Feedback sent! We\'ll get back to you soon.');
      setFeedbackSubject('');
      setFeedbackMessage('');
    }
  };

  return (
    <div className="help-container fade-in">
      <Header 
        title="Help Center" 
        subtitle="FAQ, manual, and live search"
        showNewQuote={false}
        mode={mode}
      />

      {/* Search Bar */}
      <div className="help-search-wrapper">
        <div className="help-search-input-wrap">
          <div className="help-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input 
            type="text" 
            className="help-search-input" 
            placeholder="Search help — e.g. 'refund', 'GST', 'advance balance', 'billing model'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Manual Section */}
      <section className="help-section">
        <div className="help-section-header">
          <div className="help-section-title-wrap">
            <div className="help-section-icon-wrap" style={{ background: '#fff7ed', color: '#f97316' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h2 className="help-section-title">Manual</h2>
          </div>
          <button 
            onClick={() => handleManualClick()} 
            className="help-external-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Open Full Manual
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>
        </div>
        
        <div className="manual-grid">
          {MANUAL_CATEGORIES.map(cat => (
            <div key={cat.id} className="manual-card" onClick={() => handleManualClick(cat.id)}>
              <div className="manual-card-info">
                <h4>{cat.title}</h4>
                <p>{cat.articles} articles</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="help-section">
        <div className="help-section-header">
          <div className="help-section-title-wrap">
            <div className="help-section-icon-wrap" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 className="help-section-title">Frequently Asked Questions</h2>
          </div>
        </div>

        <div className="faq-list">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}>
              <button 
                className="faq-question-row" 
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="faq-question-left">
                  <div className="faq-question-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  {faq.q}
                </div>
                <svg 
                  className="faq-chevron" 
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: expandedFaq === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="help-section">
        <div className="contact-grid">
          <div className="contact-card whatsapp" onClick={() => window.open('https://wa.me/918511362508', '_blank')}>
            <div className="contact-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.8 8.38 8.38 0 0 1 3.8.9L22 2l-2.1 6.1Z"/></svg>
            </div>
            <div className="contact-info">
              <h4>WhatsApp Support</h4>
              <p>+91 85113 62508</p>
            </div>
            <div className="contact-external-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </div>
          </div>

          <div className="contact-card email" onClick={() => window.location.href = 'mailto:support@touridoo.app'}>
            <div className="contact-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <div className="contact-info">
              <h4>Email Support</h4>
              <p>support@touridoo.app</p>
            </div>
            <div className="contact-external-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="help-section">
        <form className="feedback-card" onSubmit={handleFeedbackSubmit}>
          <div className="feedback-header">
            <div style={{ color: '#f97316' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <h3>Send Feedback</h3>
            <span>to support@touridoo.app</span>
          </div>

          <div className="feedback-field">
            <label className="feedback-section-label">What's this about?</label>
            <div className="feedback-type-grid">
              <div 
                className={`feedback-type-card ${feedbackType === 'feature' ? 'selected' : ''}`}
                onClick={() => setFeedbackType('feature')}
              >
                <div style={{ color: feedbackType === 'feature' ? '#f59e0b' : '#64748b', marginBottom: 8 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                </div>
                <span>Feature Request</span>
              </div>
              <div 
                className={`feedback-type-card ${feedbackType === 'bug' ? 'selected' : ''}`}
                onClick={() => setFeedbackType('bug')}
              >
                <div style={{ color: feedbackType === 'bug' ? '#ef4444' : '#64748b', marginBottom: 8 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.31 0-6-2.69-6-6v-1h4v1c0 .55.45 1 1 1s1-.45 1-1v-1h4v1c0 3.31-2.69 6-6 6Z"/><path d="M12 10.13V6"/><path d="M6 13H2"/><path d="M22 13h-4"/><path d="m2 21 3-3"/><path d="m22 21-3-3"/><path d="m18 7-2 2.12"/><path d="m6 7 2 2.12"/></svg>
                </div>
                <span>Bug Report</span>
              </div>
              <div 
                className={`feedback-type-card ${feedbackType === 'general' ? 'selected' : ''}`}
                onClick={() => setFeedbackType('general')}
              >
                <div style={{ color: feedbackType === 'general' ? '#3b82f6' : '#64748b', marginBottom: 8 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span>General</span>
              </div>
            </div>
          </div>

          <div className="feedback-field">
            <label className="feedback-section-label">Subject</label>
            <input 
              type="text" 
              className="feedback-input" 
              placeholder="e.g. Add bulk import for customers" 
              value={feedbackSubject}
              onChange={(e) => setFeedbackSubject(e.target.value)}
              required
            />
          </div>

          <div className="feedback-field">
            <label className="feedback-section-label">Message</label>
            <textarea 
              className="feedback-textarea" 
              placeholder="Describe your feedback in detail..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="feedback-field">
            <label className="feedback-section-label">Attachments <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: 500 }}>(optional)</span></label>
            <div className="feedback-upload-area">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Click to attach screenshots or files
            </div>
          </div>

          <div className="feedback-footer">
            <div className="feedback-footer-info">
              Sends directly to support@touridoo.app
            </div>
            <button type="submit" className="feedback-submit-btn">
              Send Feedback
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
