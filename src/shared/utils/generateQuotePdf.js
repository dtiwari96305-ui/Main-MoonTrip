import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOGO_BASE64 } from './branding';

// ─── Constants ────────────────────────────────────────────────────────────────
const CO = {
  name:    'WANDERLUST TRAVELS',
  gstin:   '27AABCW1234F1ZP',
  phone:   '+91 98765 43210',
  email:   'demo@touridoo.in',
  address: '301, Trade Center, BKC, Mumbai, Maharashtra 400051',
};

const BANK = {
  bank:   'HDFC Bank',
  acName: 'Wanderlust Travels',
  acNo:   '50100234567891',
  ifsc:   'HDFC0001234',
  branch: 'BKC, Mumbai',
};

const BRAND = [22, 163, 74];   // #16A34A
const DARK  = [30,  41,  59];   // slate-800
const MUTED = [100, 116, 139];  // slate-500
const LIGHT = [248, 250, 252];  // slate-50
const WHITE = [255, 255, 255];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => {
  const d = new Date();
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
};

// Add N days to a "09 Mar 2026" formatted string
const addDays = (dateStr, n) => {
  const m = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const p = (dateStr || '').split(' ');
  if (p.length !== 3) return dateStr;
  const d = new Date(parseInt(p[2]), m[p[1]] ?? 0, parseInt(p[0]));
  d.setDate(d.getDate() + n);
  const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${mn[d.getMonth()]} ${d.getFullYear()}`;
};

// Draw brand-color section heading (bold, smaller, brand color)
const secHead = (doc, text, x, y) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(BRAND[0], BRAND[1], BRAND[2]);
  doc.text(text, x, y);
};

// Page footer: address left + "Generated on … | Page X of Y" right
// For customer PDF page 2, address is centered
const drawFooter = (doc, pageNum, totalPages, addressAlign = 'left') => {
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;
  const fy    = pageH - 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  if (addressAlign === 'center') {
    doc.text(CO.address, pageW / 2, fy, { align: 'center' });
  } else {
    doc.text(CO.address, 14, fy);
  }
  doc.text(
    `Generated on ${todayStr()}  |  Page ${pageNum} of ${totalPages}`,
    pageW - 14, fy, { align: 'right' },
  );
};

// Thin horizontal rule
const hRule = (doc, y, color = [220, 226, 236]) => {
  const pageW = doc.internal.pageSize.width;
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.35);
  doc.line(14, y, pageW - 14, y);
};

// Simple QR-code placeholder (3 finder patterns + scattered dots)
const drawQR = (doc, cx, cy, size) => {
  const x = cx - size / 2;
  const y = cy;
  const s = size;
  // Outer border
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.5);
  doc.rect(x, y, s, s);
  // Helper to draw a finder pattern
  const finder = (fx, fy, fs) => {
    doc.setFillColor(40, 40, 40);
    doc.rect(fx, fy, fs, fs, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(fx + 1.5, fy + 1.5, fs - 3, fs - 3, 'F');
    doc.setFillColor(40, 40, 40);
    doc.rect(fx + 3, fy + 3, fs - 6, fs - 6, 'F');
  };
  const fp = s * 0.28;
  const pad = s * 0.04;
  finder(x + pad, y + pad, fp);                                       // top-left
  finder(x + s - pad - fp, y + pad, fp);                             // top-right
  finder(x + pad, y + s - pad - fp, fp);                             // bottom-left
  // Timing + data modules
  const m = s * 0.055;
  const positions = [
    [0.44,0.12],[0.57,0.12],[0.70,0.12],[0.44,0.22],[0.63,0.22],
    [0.12,0.44],[0.26,0.44],[0.50,0.44],[0.63,0.44],[0.76,0.44],
    [0.19,0.57],[0.38,0.57],[0.57,0.57],[0.12,0.63],[0.44,0.63],[0.70,0.63],
    [0.26,0.70],[0.50,0.70],[0.76,0.70],[0.12,0.76],[0.38,0.76],[0.63,0.76],
    [0.44,0.82],[0.57,0.82],[0.76,0.82],
  ];
  doc.setFillColor(40, 40, 40);
  positions.forEach(([rx, ry]) => {
    doc.rect(x + rx * s, y + ry * s, m, m, 'F');
  });
};

// ─── CUSTOMER PDF ─────────────────────────────────────────────────────────────
export const generateCustomerPDF = (quoteId, detail) => {
  const fin  = detail.fin;
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.width;
  const M     = 14;
  const usW   = pageW - M * 2;
  let y = 15;

  // ── PAGE 1 ──────────────────────────────────────────────────────────────────

  // Company logo + names — top left
  doc.addImage(LOGO_BASE64, 'PNG', M, y, 16, 16);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text('Touridoo', M + 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`Wanderlust Travels  |  ${CO.email}  |  ${CO.phone}`, M + 20, y + 13);

  // "QUOTATION" centered title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text('QUOTATION', pageW / 2, y + 14, { align: 'center' });

  // Horizontal divider below title
  y += 19;
  hRule(doc, y);

  // Company info block
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`GSTIN: ${CO.gstin}`, M, y);
  doc.text(`Phone: ${CO.phone}  |  Email: ${CO.email}`, M, y + 4.5);
  doc.text(`Address: ${CO.address}`, M, y + 9);

  // Quote ID + Date — right aligned, same block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text(`Quote: ${quoteId}`, pageW - M, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`Date: ${fin.quoteDate || detail.createdDate}`, pageW - M, y + 5, { align: 'right' });

  y += 16;

  // ── BILL TO ──────────────────────────────────────────────────────────────────
  doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]);
  doc.roundedRect(M, y, usW * 0.55, 31, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(BRAND[0], BRAND[1], BRAND[2]);
  doc.text('BILL TO', M + 5, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text(detail.customerName, M + 5, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`Phone: ${detail.customerPhone}`, M + 5, y + 20.5);
  doc.text(`Email: ${detail.customerEmail}`, M + 5, y + 26);
  y += 37;

  // ── TRIP DETAILS ─────────────────────────────────────────────────────────────
  secHead(doc, 'TRIP DETAILS', M, y);
  y += 7;
  const tripItems = [
    ['Destination', detail.destination],
    ['Type', detail.destType],
    ['Date of Travel', detail.tripDate],
    ['Duration', detail.duration],
    ['Travelers', detail.travelers],
  ];
  const halfW = usW / 2 + 4;
  tripItems.forEach(([label, value], i) => {
    const col   = i % 2;
    const row   = Math.floor(i / 2);
    const tx    = M + col * halfW;
    const ty    = y + row * 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(label, tx, ty);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(String(value || '—'), tx, ty + 5);
  });
  y += Math.ceil(tripItems.length / 2) * 12 + 4;

  // ── SERVICES INCLUDED ────────────────────────────────────────────────────────
  secHead(doc, 'SERVICES INCLUDED', M, y);
  y += 7;
  detail.inclusions.forEach((item, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(`${i + 1}.  ${item}`, M + 2, y);
    y += 6;
  });
  y += 5;

  // ── PRICING TABLE ────────────────────────────────────────────────────────────
  secHead(doc, 'PRICING', M, y);
  y += 4;
  const pricingBody = [
    ['Cost of Travel (Reimbursement)',                fin.costOfTravel],
    ['Processing / Service Charge (SAC: 998551)',     fin.processingCustomer],
    ['CGST on Processing @9%',                        fin.cgst],
    ['SGST on Processing @9%',                        fin.sgst],
    ['Invoice Value',                                 fin.invoiceValue],
    ['Total Payable',                                 fin.totalPayable],
  ];

  autoTable(doc, {
    startY: y,
    head: [['DESCRIPTION', 'AMOUNT (₹)']],
    body: pricingBody,
    headStyles: {
      fillColor: BRAND, textColor: WHITE,
      fontStyle: 'bold', fontSize: 8.5, cellPadding: 4,
    },
    bodyStyles: { fontSize: 8.5, textColor: DARK, cellPadding: 4 },
    alternateRowStyles: { fillColor: LIGHT },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 42, halign: 'right' },
    },
    styles: { font: 'helvetica', overflow: 'linebreak' },
    margin: { left: M, right: M },
    didParseCell: (data) => {
      const lastTwo = pricingBody.length - 2;
      if (data.section === 'body' && data.row.index >= lastTwo) {
        data.cell.styles.fontStyle = 'bold';
        if (data.row.index === pricingBody.length - 1) {
          data.cell.styles.fillColor = [255, 247, 244];
          data.cell.styles.textColor = BRAND;
        }
      }
    },
  });

  const tableEnd = doc.lastAutoTable.finalY;
  y = tableEnd + 6;

  // Footer note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  const noteText = 'Under Pure Agent model, GST is applicable only on the processing/service charge. Travel costs are reimbursements.';
  const noteLines = doc.splitTextToSize(noteText, usW);
  doc.text(noteLines, M, y);

  // Page 1 footer
  drawFooter(doc, 1, 2);

  // ── PAGE 2 ──────────────────────────────────────────────────────────────────
  doc.addPage();
  y = 0;

  // Orange accent bar at very top
  doc.setFillColor(BRAND[0], BRAND[1], BRAND[2]);
  doc.rect(0, 0, pageW, 9, 'F');
  y = 22;

  // ── BANK DETAILS ─────────────────────────────────────────────────────────────
  secHead(doc, 'BANK DETAILS', M, y);
  y += 8;
  const bankRows = [
    ['Bank',     BANK.bank],
    ['A/C Name', BANK.acName],
    ['A/C No.',  BANK.acNo],
    ['IFSC',     BANK.ifsc],
    ['Branch',   BANK.branch],
  ];
  bankRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(label, M, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(String(value), M + 30, y);
    y += 6.5;
  });
  y += 10;

  // ── QR CODE ──────────────────────────────────────────────────────────────────
  const qrSize = 48;
  drawQR(doc, pageW / 2, y, qrSize);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Scan to Pay', pageW / 2, y + qrSize + 6, { align: 'center' });

  // "For Wanderlust Travels" + signatory line — right side, same vertical band
  const sigTopY = y + 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text('For Wanderlust Travels', pageW - M, sigTopY, { align: 'right' });
  doc.setDrawColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setLineWidth(0.3);
  doc.line(pageW - M - 52, sigTopY + 20, pageW - M, sigTopY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Authorized Signatory', pageW - M, sigTopY + 25, { align: 'right' });

  y += qrSize + 16;

  // ── TERMS & CONDITIONS ───────────────────────────────────────────────────────
  secHead(doc, 'TERMS & CONDITIONS', M, y);
  y += 8;
  const terms = [
    '50% advance at the time of booking.',
    'Balance payment 15 days before departure.',
    'Cancellation charges apply as per policy.',
    'Prices subject to availability at the time of booking.',
    'GST as applicable.',
  ];
  terms.forEach((term, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(`${i + 1}.  ${term}`, M + 2, y);
    y += 7;
  });
  y += 6;

  // ── DISCLAIMER ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  const disc = 'This is a computer-generated quotation and does not require a signature. Prices are subject to availability at the time of booking confirmation.';
  doc.text(doc.splitTextToSize(disc, usW), M, y);

  // Page 2 footer — address centered
  drawFooter(doc, 2, 2, 'center');

  doc.save(`${quoteId}-Quote.pdf`);
};

// ─── AGENT PDF ────────────────────────────────────────────────────────────────
export const generateAgentPDF = (quoteId, detail, quoteStatus) => {
  const fin  = detail.fin;
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.width;
  const M     = 14;
  const usW   = pageW - M * 2;
  let y = 15;

  // ── PAGE 1 ──────────────────────────────────────────────────────────────────

  // Company logo + names — top left
  doc.addImage(LOGO_BASE64, 'PNG', M, y, 16, 16);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text('Touridoo', M + 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`Wanderlust Travels  |  ${CO.email}  |  ${CO.phone}`, M + 20, y + 13);

  // "INTERNAL — AGENT COPY" subtitle
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('INTERNAL — AGENT COPY', M, y);

  // Divider
  y += 4;
  hRule(doc, y);

  // GSTIN / address block
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`GSTIN: ${CO.gstin}  |  Phone: ${CO.phone}  |  Email: ${CO.email}`, M, y);
  y += 4.5;
  doc.text(`Address: ${CO.address}`, M, y);
  y += 10;

  // ── QUOTATION DETAILS (2-col grid) ──────────────────────────────────────────
  secHead(doc, 'QUOTATION DETAILS', M, y);
  y += 7;
  const colW  = usW / 2 - 4;
  const col2X = M + colW + 8;
  const validUntil = addDays(fin.quoteDate || detail.createdDate, 30);

  const qdPairs = [
    ['Quote No.', quoteId,                       'Date',        fin.quoteDate || detail.createdDate],
    ['Status',    (quoteStatus || 'DRAFT').toUpperCase(), 'Valid Until', validUntil],
  ];
  qdPairs.forEach(([l1, v1, l2, v2]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(l1, M, y);
    doc.text(l2, col2X, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(String(v1), M, y + 5);
    doc.text(String(v2), col2X, y + 5);
    y += 13;
  });
  y += 2;

  // ── CUSTOMER (2-col) ─────────────────────────────────────────────────────────
  secHead(doc, 'CUSTOMER', M, y);
  y += 7;
  const custPairs = [
    ['Name',  detail.customerName,  'Phone', detail.customerPhone],
    ['Email', detail.customerEmail, 'PAN',   '—'],
    ['GSTIN', '—',                  '',      ''],
  ];
  custPairs.forEach(([l1, v1, l2, v2]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(l1, M, y);
    if (l2) doc.text(l2, col2X, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(String(v1 || '—'), M, y + 5);
    if (v2) doc.text(String(v2), col2X, y + 5);
    y += 12;
  });
  y += 2;

  // ── TRIP DETAILS (2-col) ─────────────────────────────────────────────────────
  secHead(doc, 'TRIP DETAILS', M, y);
  y += 7;
  const tripPairs = [
    ['Destination', detail.destination, 'Type',       detail.destType],
    ['Travel Date', detail.tripDate,    'Duration',   detail.duration],
    ['No. of Pax',  detail.travelers,   'Package',    'Yes'],
  ];
  tripPairs.forEach(([l1, v1, l2, v2]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(l1, M, y);
    doc.text(l2, col2X, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(String(v1 || '—'), M, y + 5);
    doc.text(String(v2 || '—'), col2X, y + 5);
    y += 12;
  });
  y += 2;

  // ── SERVICE BREAKDOWN TABLE ──────────────────────────────────────────────────
  secHead(doc, 'SERVICE BREAKDOWN', M, y);
  y += 4;
  const svcBody = detail.services.map((svc, i) => [
    String(i + 1), svc.name, svc.vendor, svc.cost,
  ]);
  svcBody.push(['', 'Total Cost', '', detail.totalServiceCost]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'SERVICE', 'VENDOR', 'COST (₹)']],
    body: svcBody,
    headStyles: {
      fillColor: BRAND, textColor: WHITE,
      fontStyle: 'bold', fontSize: 8, cellPadding: 3.5,
    },
    bodyStyles: { fontSize: 8, textColor: DARK, cellPadding: 3.5 },
    alternateRowStyles: { fillColor: LIGHT },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
    },
    styles: { font: 'helvetica', overflow: 'linebreak' },
    margin: { left: M, right: M },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === svcBody.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 247, 244];
        data.cell.styles.textColor = BRAND;
      }
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // ── PRICING & BILLING ────────────────────────────────────────────────────────
  secHead(doc, 'PRICING & BILLING', M, y);
  y += 7;
  const billingModelLabel = fin.billingModel === 'pure_agent' ? 'Pure Agent' : 'Principal';
  const billingFields = [
    ['Billing Model',                billingModelLabel,   false],
    ['Total Cost',                   fin.costOfServices,  false],
    ['Margin',                       fin.processingCharge,false],
    ['Commission Earned',            fin.processingCharge,false],
    ['Package Price',                fin.packagePrice,    false],
    [`GST @${fin.gstRate}`,          fin.gstAmount,       false],
    ['CGST',                         fin.cgst,            true],
    ['SGST',                         fin.sgst,            true],
    ['Place of Supply',              'Maharashtra',       false],
    ['Invoice Value',                fin.invoiceValue,    false],
    ['TOTAL PAYABLE',                fin.totalPayable,    false, true],
  ];
  billingFields.forEach(([label, value, indented, isTotal]) => {
    if (isTotal) {
      hRule(doc, y - 1);
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(BRAND[0], BRAND[1], BRAND[2]);
      doc.text(label, M, y);
      doc.text(String(value || '—'), pageW - M, y, { align: 'right' });
      hRule(doc, y + 2, BRAND);
      y += 8;
    } else {
      const tx = indented ? M + 6 : M;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(label, tx, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);
      doc.text(String(value || '—'), pageW - M, y, { align: 'right' });
      y += 6.5;
    }
  });

  // Page 1 footer
  drawFooter(doc, 1, 2);

  // ── PAGE 2 ──────────────────────────────────────────────────────────────────
  doc.addPage();
  y = 22;

  // ── PROFIT ANALYSIS ──────────────────────────────────────────────────────────
  secHead(doc, 'PROFIT ANALYSIS', M, y);
  y += 9;

  // Profit margin % — bold header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text(`Profit Margin: ${fin.profitPct}`, M, y);
  y += 11;

  // Margin + Commission inline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Margin:', M, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  const mLabelW = doc.getTextWidth('Margin:') + 2;
  doc.text(fin.processingCharge, M + mLabelW, y);

  const commX = M + 75;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Commission:', commX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  const cLabelW = doc.getTextWidth('Commission:') + 2;
  doc.text(fin.processingCharge, commX + cLabelW, y);
  y += 10;

  // Total Profit — highlighted box
  doc.setFillColor(255, 247, 244);
  doc.roundedRect(M, y - 3, usW, 14, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(BRAND[0], BRAND[1], BRAND[2]);
  doc.text(`Total Profit: ${fin.profitTotal}`, M + 6, y + 6);

  // Page 2 footer
  drawFooter(doc, 2, 2);

  doc.save(`${quoteId}-Agent.pdf`);
};
