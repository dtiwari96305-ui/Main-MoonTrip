import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const infoPopupText = {
  // DASHBOARD
  revenue: 'Cumulative total billed across all confirmed bookings.',
  profit: 'Sum of all margins and commissions earned across bookings.',
  pending: 'Total outstanding balance owed by customers across all bookings that are not yet fully paid.',
  conversion: 'Percentage of quotes that were successfully converted into confirmed bookings.',

  // PAYMENTS
  credit: 'Money received into the advance balance through advance deposits.',
  debit: 'Money applied from the advance balance towards a booking payment.',
  advance: 'Total unallocated advance money held on behalf of customers. These are amounts received but not yet applied to any specific booking.',
  mode: 'Adjusted via Advance means the payment was settled using the customer\'s existing advance balance, rather than a new direct payment.',

  // SALES INVOICES
  ext_info: 'Primary is the main tax invoice for a booking. EXT (Extension) is an additional invoice issued when some services are billed under a different GST rate.',
  status_info: 'Shows whether the booking is active or cancelled. Cancelled invoices are voided and linked to a Credit Note if one was generated.',

  // SETTINGS - COMPANY
  gst_billing: 'Toggle GST on or off for your business. When disabled, all GST calculations, GSTIN fields, and tax breakdowns will be removed from quotes, invoices, and bills. Ideal for small-scale businesses not registered under GST.',
  slug: 'Your unique subdomain on touridoo.app. This is how your customer-facing quote links are structured. It cannot be changed.',
  gstin: 'Your 15-character GST Identification Number. Enter your GSTIN and click Verify to auto-fill company details from the GST portal.',
  pan: 'Your company\'s 10-character Permanent Account Number. Required for tax invoices above ₹2 lakh.',
  ifsc: '11-character bank branch code used for NEFT/RTGS transfers. Bank name and branch are auto-filled when you enter a valid IFSC.',
  upi: 'A QR code will be auto-generated from this UPI ID and printed on your invoices and quotes for easy payment collection.',
  terms: 'This text appears at the bottom of Tax Invoice PDFs sent to customers.',
  pdf_theme: 'Choose the visual style for all customer-facing PDFs — quotes, invoices, and receipts.',

  // SETTINGS - NOMENCLATURE
  nom_prefix_booking: 'Text that appears before the number. For example, prefix INV with number 5 produces INV-5.',
  nom_number_booking: 'The sequence number for your next document. Setting this lower than existing documents may cause duplicate conflicts.',
  nom_suffix_booking: 'Text that appears after the number. Commonly used for financial year codes, e.g. FY26 produces INV-5-FY26.',
  nom_prefix_quote: 'Text that appears before the number. For example, prefix INV with number 5 produces INV-5.',
  nom_number_quote: 'The sequence number for your next document. Setting this lower than existing documents may cause duplicate conflicts.',
  nom_suffix_quote: 'Text that appears after the number. Commonly used for financial year codes, e.g. FY26 produces INV-5-FY26.',
  nom_payment: 'Payment receipt numbers are auto-assigned in sequential order and cannot be customized.',

  // BOOKING DETAILS
  bd_actual_agent_view: 'Internal view including hidden markup. Not visible to the customer.',
  bd_tcs: 'Tax Collected at Source is mandated for international tour packages. The collected amount is deposited with the government.',

  // QUOTE DETAILS
  qd_actual_agent_view: 'Internal view including hidden markup. Not visible to the customer.',
  qd_cost_of_services: 'Sum of all service costs entered.',
  qd_your_profit: 'Hidden markup + processing charge (excl GST). GST on hidden markup is handled at the memorandum account level.',
  qd_tcs: 'Tax Collected at Source is mandated for international tour packages. The collected amount is deposited with the government.',
  qd_input_mode: 'Whether you entered the total price (margin was auto-calculated) or set the margin (total was auto-calculated).',

  // CREATE QUOTE — STEP 2
  cq_dest_type: 'Affects tax calculations. International packages over ₹7 lakh are subject to TCS @5%.',
  cq_state_of_travel: 'Used to determine the Place of Supply for GST, which decides whether CGST+SGST or IGST applies on the invoice.',
  cq_tcs_banner: 'TCS (Tax Collected at Source) is mandated by the Indian government for international tour packages exceeding ₹7 lakh per person.',

  // CREATE QUOTE — STEP 4
  cq_billing_model: 'Determines how GST is calculated on your invoice. Choose based on your business registration type and preference.',
  cq_bm_pure_agent: 'You act as a facilitator. GST is charged only on your service fee/margin, not on the full trip cost.',
  cq_bm_principal_18: 'You bill the customer for the full trip amount. GST @18% applies on the entire invoice value.',
  cq_bm_principal_5: 'For package tours. GST @5% on the full amount. You cannot claim Input Tax Credit (ITC) on your purchases.',
  cq_bm_principal_pass: 'GST @18% on the full value, but you can claim back GST paid on inputs like hotels and transport (ITC available).',
  cq_place_of_supply: 'State where services are supplied. Determines SGST/CGST (same state) or IGST (different state). Select International for foreign clients (no GST).',
  cq_pricing_mode: 'Choose whether to start with the customer\'s price and let the system calculate your margin, or enter your desired margin and let the system compute the final price.',
  cq_total_margin: 'Your profit on this trip, calculated as the difference between what you charge the customer and what the trip costs you.',
  cq_total_quote: 'The final price the customer pays. Includes your margin, applicable GST, and TCS (required for international packages over ₹7 lakh).',
  cq_commission: 'Incentives or referral fees paid to you by hotels, airlines, or tour operators. Tracked separately and added on top of your margin in total profit.',
  cq_dpc_inclusive: 'The processing charge amount already contains GST.',
  cq_dpc_exclusive: 'GST will be added on top of this processing charge.',

  // RECORD PAYMENT
  rp_allocate: 'Distribute this payment across one or more bookings. Any unallocated remainder is saved as advance balance.',
  rp_mode: 'How the customer made the payment. This is shown on the payment receipt.',
  rp_advance_balance: 'The unallocated portion of this payment will be saved as advance balance for this customer, usable against future bookings.',
  rp_reference: 'UTR (Unique Transaction Reference) number from the bank or payment app. Useful for reconciliation.',
};

export const InfoBtn = ({ infoKey }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const popupRef = useRef(null);

  const calculateCoords = useCallback(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2 + window.scrollX,
        top: rect.top + window.scrollY - 12
      });
    }
  }, []);

  useEffect(() => {
    if (showPopup) {
      calculateCoords();
      window.addEventListener('scroll', calculateCoords, true);
      window.addEventListener('resize', calculateCoords);
    }
    return () => {
      window.removeEventListener('scroll', calculateCoords, true);
      window.removeEventListener('resize', calculateCoords);
    };
  }, [showPopup, calculateCoords]);

  useEffect(() => {
    const handler = (e) => {
      if (iconRef.current && iconRef.current.contains(e.target)) return;
      if (popupRef.current && popupRef.current.contains(e.target)) {
        setTimeout(() => setShowPopup(false), 50);
        return;
      }
      setShowPopup(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      <span 
        className="info-btn" 
        ref={iconRef} 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPopup(!showPopup);
        }}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="11" style={{opacity:0.15}}/>
          <circle cx="12" cy="12" r="8.5" style={{opacity:0.25}}/>
          <circle cx="12" cy="12" r="6" style={{opacity:0.6}}/>
          <path d="M12 11v5M12 7.5h.01" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </span>
      
      {showPopup && createPortal(
        <div 
          className="info-popup-portal"
          ref={popupRef}
          style={{
            position: 'absolute',
            left: coords.left,
            top: coords.top,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999,
          }}
        >
          <div className="ip-content">
            {infoPopupText[infoKey] || 'More information coming soon.'}
          </div>
          <button className="ip-learn-more">
            Learn more 
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </button>
        </div>,
        document.body
      )}
    </>
  );
};
