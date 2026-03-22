import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Company constants ─────────────────────────────────────────────────────────
const COMPANY = {
  name:    'WANDERLUST TRAVELS',
  gstin:   '27AABCW1234F1ZP',
  phone:   '+91 98765 43210',
  email:   'demo@touridoo.in',
  address: '301, Trade Center, BKC, Mumbai, Maharashtra 400051',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n) =>
  n != null && n !== 0 ? '\u20B9' + n.toLocaleString('en-IN') : '';

const todayStr = () => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
};

const fileDate = () => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '');
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const generateLedgerPdf = ({ customer, ext, myLedger }) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PW   = doc.internal.pageSize.getWidth();   // 210
  const PH   = doc.internal.pageSize.getHeight();  // 297
  const ML   = 15;   // left margin
  const MR   = 15;   // right margin
  const CW   = PW - ML - MR;  // content width = 180

  const email      = ext.emailOverride || customer.email;
  const cityLine   = [ext.city, ext.state, ext.country].filter(Boolean).join(', ');
  const today      = todayStr();

  // ── HEADER BAND ───────────────────────────────────────────────────────────
  // Light background strip
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, PW, 36, 'F');

  // Company name — large bold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(COMPANY.name, ML, 12);

  // Company email | phone — below name
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${COMPANY.email}  \u2022  ${COMPANY.phone}`, ML, 18);

  // Document title — right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('CUSTOMER LEDGER', PW - MR, 12, { align: 'right' });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(ML, 36, PW - MR, 36);

  // ── COMPANY INFO BLOCK ────────────────────────────────────────────────────
  let y = 44;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('COMPANY DETAILS', ML, y);
  y += 5;

  const companyFields = [
    ['GSTIN',    COMPANY.gstin],
    ['Phone',    COMPANY.phone],
    ['Email',    COMPANY.email],
    ['Address',  COMPANY.address],
  ];

  companyFields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label + ':', ML, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(value, ML + 20, y);
    y += 4.5;
  });

  // Vertical separator
  const sepX = ML + CW / 2;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(sepX, 44, sepX, y - 2);

  // ── CUSTOMER INFO BLOCK ────────────────────────────────────────────────────
  let cy = 44;
  const cx = sepX + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CUSTOMER DETAILS', cx, cy);
  cy += 5;

  const customerFields = [
    ['Customer', customer.name],
    ['As on',    today],
    ['Phone',    customer.phone],
    ['Email',    email],
    ['Location', cityLine || 'India'],
  ];

  customerFields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label + ':', cx, cy);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(value, cx + 22, cy);
    cy += 4.5;
  });

  y = Math.max(y, cy) + 4;

  // Divider before table
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(ML, y, PW - MR, y);
  y += 5;

  // ── LEDGER TABLE ──────────────────────────────────────────────────────────
  const totalDebit   = myLedger.reduce((s, r) => s + (r.debit  || 0), 0);
  const totalCredit  = myLedger.reduce((s, r) => s + (r.credit || 0), 0);
  const finalBalance = myLedger.length > 0 ? myLedger[myLedger.length - 1].balance : 0;
  const isCr        = finalBalance >= 0;

  const tableRows = myLedger.map((entry) => [
    entry.date,
    entry.id,
    entry.desc,
    entry.debit  ? '\u20B9' + entry.debit.toLocaleString('en-IN')  : '',
    entry.credit ? '\u20B9' + entry.credit.toLocaleString('en-IN') : '',
    '\u20B9' + Math.abs(entry.balance).toLocaleString('en-IN') + (entry.balance >= 0 ? ' Cr' : ' Dr'),
  ]);

  autoTable(doc, {
    startY:     y,
    margin:     { left: ML, right: MR },
    head: [[
      { content: 'DATE',        styles: { halign: 'left'  } },
      { content: 'REF',         styles: { halign: 'left'  } },
      { content: 'DESCRIPTION', styles: { halign: 'left'  } },
      { content: 'DEBIT',       styles: { halign: 'right' } },
      { content: 'CREDIT',      styles: { halign: 'right' } },
      { content: 'BALANCE',     styles: { halign: 'right' } },
    ]],
    body: tableRows,
    foot: [[
      { content: 'TOTALS', colSpan: 3, styles: { halign: 'left', fontStyle: 'bold' } },
      { content: fmtINR(totalDebit),   styles: { halign: 'right', fontStyle: 'bold' } },
      { content: fmtINR(totalCredit),  styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '\u20B9' + Math.abs(finalBalance).toLocaleString('en-IN') + (isCr ? ' Cr' : ' Dr'), styles: { halign: 'right', fontStyle: 'bold' } },
    ]],
    showFoot:    'lastPage',
    headStyles: {
      fillColor:  [241, 245, 249],
      textColor:  [71, 85, 105],
      fontStyle:  'bold',
      fontSize:   7.5,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize:    8,
      textColor:   [30, 41, 59],
      cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
    },
    footStyles: {
      fillColor:  [248, 250, 252],
      textColor:  [30, 41, 59],
      fontStyle:  'bold',
      fontSize:   8,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    alternateRowStyles: { fillColor: [252, 253, 254] },
    columnStyles: {
      0: { cellWidth: 28, halign: 'left'  },
      1: { cellWidth: 24, halign: 'left'  },
      2: { cellWidth: 64, halign: 'left'  },
      3: { cellWidth: 22, halign: 'right' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 28, halign: 'right' },
    },
    tableLineColor: [226, 232, 240],
    tableLineWidth: 0.3,
    styles: { overflow: 'linebreak' },
  });

  // ── SUMMARY BLOCK ─────────────────────────────────────────────────────────
  const afterTable = doc.lastAutoTable.finalY + 8;

  doc.setFillColor(isCr ? 220 : 254, isCr ? 252 : 226, isCr ? 231 : 226);
  doc.roundedRect(ML, afterTable, CW, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const summaryLabel = isCr ? 'Amount Owed to Customer' : 'Amount Due from Customer';
  doc.text(summaryLabel, ML + 10, afterTable + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(isCr ? 22 : 185, isCr ? 163 : 28, isCr ? 74 : 28);
  const summaryAmt = '\u20B9' + Math.abs(finalBalance).toLocaleString('en-IN') + (isCr ? ' Cr' : ' Dr');
  doc.text(summaryAmt, ML + 10, afterTable + 17);

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const footY = PH - 10;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(ML, footY - 5, PW - MR, footY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(COMPANY.address, ML, footY);
  doc.text(`Generated on ${today}  \u2022  Page 1 of 1`, PW - MR, footY, { align: 'right' });

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const safeName = customer.name.replace(/\s+/g, '-');
  doc.save(`Ledger-${safeName}-${fileDate()}.pdf`);
};
