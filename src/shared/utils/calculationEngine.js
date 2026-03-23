// ─── Quote Calculation Engine ─────────────────────────────────────────────────
// Shared calculation logic for Create/Edit Quote forms.
// Used by both Real Dashboard and Demo Dashboard.

/**
 * Extract GST state code from Place of Supply string like "Maharashtra (27)"
 */
export function extractStateCode(placeOfSupply) {
  if (!placeOfSupply) return '';
  const match = placeOfSupply.match(/\((\d+)\)/);
  return match ? match[1] : '';
}

/**
 * Extract state code from GSTIN (first 2 digits)
 */
export function extractGstinState(gstin) {
  if (!gstin || gstin.length < 2) return '';
  return gstin.substring(0, 2);
}

/**
 * Determine GST type: 'cgst-sgst' | 'igst' | 'none'
 */
function getGstType(placeOfSupply, businessStateCode, destType) {
  if (destType === 'international') return 'none';
  const supplyCode = extractStateCode(placeOfSupply);
  if (supplyCode === '99') return 'none';
  if (!supplyCode || !businessStateCode) return 'igst';
  return supplyCode === businessStateCode ? 'cgst-sgst' : 'igst';
}

/**
 * Get GST rate for a billing model
 */
function getGstRate(billingModel) {
  return billingModel === 'principal-5' ? 0.05 : 0.18;
}

/**
 * Main calculation function.
 *
 * @param {Object} p - All input parameters
 * @param {number} p.costOfServices      - Sum of all service costs from Step 3
 * @param {string} p.billingModel        - 'pure-agent'|'principal-18'|'principal-5'|'principal-pass'
 * @param {string} p.pricingMode         - 'total-quote'|'set-margin'
 * @param {number|string} p.totalQuoteAmount  - Total amount customer pays (total-quote mode)
 * @param {number|string} p.marginAmount      - Desired margin (set-margin mode, or override)
 * @param {number} p.totalServiceMargin  - Sum of per-service margins from Step 3
 * @param {number|string} p.vendorCommission  - Commission earned from vendors
 * @param {string} p.placeOfSupply       - e.g. "Maharashtra (27)"
 * @param {string} p.businessStateCode   - First 2 digits of business GSTIN
 * @param {string} p.destType            - 'domestic'|'international'
 * @param {number} p.serviceCount        - Number of active services
 * @param {string} p.dpcDisplay          - 'inclusive'|'exclusive' (Pure Agent only)
 * @param {number|string} p.displayProcessingCharge - Processing charge amount (Pure Agent)
 */
export function calculate(p) {
  const costOfServices = parseFloat(p.costOfServices) || 0;
  const billingModel = p.billingModel || 'pure-agent';
  const pricingMode = p.pricingMode || 'set-margin';
  const totalQuoteAmount = parseFloat(p.totalQuoteAmount) || 0;
  const marginInput = parseFloat(p.marginAmount) || 0;
  const totalServiceMargin = parseFloat(p.totalServiceMargin) || 0;
  const vendorCommission = parseFloat(p.vendorCommission) || 0;
  const destType = p.destType || 'domestic';
  const serviceCount = p.serviceCount || 0;
  const dpcDisplay = p.dpcDisplay || 'exclusive';
  const dpcAmount = parseFloat(p.displayProcessingCharge) || 0;

  const isPureAgent = billingModel === 'pure-agent';
  const gstRate = getGstRate(billingModel);
  const gstType = getGstType(p.placeOfSupply, p.businessStateCode, destType);
  const noGst = gstType === 'none';
  const tcsApplicable = destType === 'international' && serviceCount >= 2;
  const TCS_RATE = 0.05;

  let margin, packagePrice, processingCharge, baseProcessingCharge;
  let gstOnProcessing, gstAmount, costOfTravel;
  let invoiceValue, tcs, totalPayable;

  if (isPureAgent) {
    // ── Processing charge from Display Processing Charge input ──
    if (dpcDisplay === 'inclusive' && dpcAmount > 0) {
      baseProcessingCharge = dpcAmount / (1 + 0.18);
      gstOnProcessing = dpcAmount - baseProcessingCharge;
    } else {
      baseProcessingCharge = dpcAmount;
      gstOnProcessing = dpcAmount * 0.18;
    }
    processingCharge = baseProcessingCharge;

    if (pricingMode === 'total-quote' && totalQuoteAmount > 0) {
      // ── Back-calculate margin from total ──
      // Total = costOfServices + margin + processingCharge + gstOnProcessing + TCS
      // Where TCS = invoiceValue × TCS_RATE
      // invoiceValue = costOfServices + margin + processingCharge + gstOnProcessing
      // Total = invoiceValue × (1 + TCS_RATE) if TCS applicable
      const procWithGst = noGst ? processingCharge : (processingCharge + gstOnProcessing);
      const preTcs = tcsApplicable ? totalQuoteAmount / (1 + TCS_RATE) : totalQuoteAmount;
      // Try with GST first
      let calcMargin = preTcs - costOfServices - procWithGst;
      // If margin <= 0 in pure agent, GST on processing = 0
      if (calcMargin <= 0) {
        const preTcsNoGst = tcsApplicable ? totalQuoteAmount / (1 + TCS_RATE) : totalQuoteAmount;
        calcMargin = preTcsNoGst - costOfServices - processingCharge;
      }
      margin = calcMargin;
    } else {
      // ── Forward: use margin input or sum of service margins ──
      margin = marginInput || totalServiceMargin;
    }

    const isNoMargin = margin <= 0;
    costOfTravel = costOfServices + margin;

    // If no margin, no GST on processing (per Pure Agent rules)
    if (isNoMargin || noGst) {
      gstOnProcessing = 0;
    }

    gstAmount = gstOnProcessing;
    invoiceValue = costOfTravel + processingCharge + gstOnProcessing;
    tcs = tcsApplicable ? invoiceValue * TCS_RATE : 0;
    totalPayable = invoiceValue + tcs;
    packagePrice = costOfTravel;

  } else {
    // ── Principal models (principal-18, principal-5, principal-pass) ──
    if (pricingMode === 'total-quote' && totalQuoteAmount > 0) {
      // ── Back-calculate margin from total ──
      // Total = invoiceValue + TCS
      // invoiceValue = packagePrice + GST = packagePrice × (1 + gstRate)  [if GST applies]
      // TCS = invoiceValue × TCS_RATE
      // Total = invoiceValue × (1 + TCS_RATE) if TCS applicable
      const preTcs = tcsApplicable ? totalQuoteAmount / (1 + TCS_RATE) : totalQuoteAmount;
      if (noGst) {
        packagePrice = preTcs;
      } else {
        packagePrice = preTcs / (1 + gstRate);
      }
      margin = packagePrice - costOfServices;
    } else {
      // ── Forward calculation ──
      margin = marginInput || totalServiceMargin;
      packagePrice = costOfServices + margin;
    }

    gstAmount = noGst ? 0 : packagePrice * gstRate;
    invoiceValue = packagePrice + gstAmount;
    tcs = tcsApplicable ? invoiceValue * TCS_RATE : 0;
    totalPayable = invoiceValue + tcs;

    costOfTravel = packagePrice;
    processingCharge = margin;
    baseProcessingCharge = margin;
    gstOnProcessing = gstAmount;
  }

  // ── GST split ──
  let cgst = 0, sgst = 0, igst = 0;
  if (!noGst && gstAmount > 0) {
    if (gstType === 'cgst-sgst') {
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    } else {
      igst = gstAmount;
    }
  }

  // ── Profit ──
  const totalProfit = margin + vendorCommission;

  return {
    costOfServices,
    billingModel,
    isPureAgent,

    margin,
    packagePrice,
    hiddenMarkup: margin,

    costOfTravel,
    processingCharge,
    baseProcessingCharge: baseProcessingCharge || 0,
    gstOnProcessing: isPureAgent ? (gstOnProcessing || 0) : 0,

    gstRate,
    gstType,
    noGst,
    gstAmount: gstAmount || 0,
    cgst,
    sgst,
    igst,

    tcsApplicable,
    tcs,

    invoiceValue,
    totalPayable,

    commission: vendorCommission,
    totalProfit,

    isNoMargin: isPureAgent && margin <= 0,
  };
}
