import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const COMPANY_NAME    = 'WANDERLUST TRAVELS';
const COMPANY_ADDRESS = '301, Trade Center, BKC';
const BRAND           = [244, 125, 91]; // #F47D5B

const fileDateStamp = () => {
  const d = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()}${months[d.getMonth()]}${d.getFullYear()}`;
};

const displayDate = () => {
  const d = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * ExportDropdown
 * @param {Object[]} data        - Filtered/visible rows from the parent section
 * @param {Object[]} columns     - [{ header: string, key: string }, ...]
 * @param {string}   sectionName - e.g. "Bookings"
 * @param {string}   companyName - defaults to WANDERLUST TRAVELS
 */
export const ExportDropdown = ({
  data,
  columns,
  sectionName,
  companyName = COMPANY_NAME,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Always read from ref to avoid stale closures
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  // Close on outside click
  useEffect(() => {
    const onOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const fileName    = (ext) => `${sectionName}-Export-${fileDateStamp()}.${ext}`;
  const sectionTitle = `${sectionName.toUpperCase()} EXPORT`;

  const getRows = () => dataRef.current;

  const flattenRow = (row) =>
    columns.map((c) => {
      const val = row[c.key];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    });

  // ─── PDF ──────────────────────────────────────────────────────────────────
  const exportPDF = () => {
    setOpen(false);
    const rows = getRows();
    if (!rows || rows.length === 0) {
      alert('No data to export. Apply a filter that returns at least one row.');
      return;
    }

    const doc   = new jsPDF({ orientation: 'landscape' });
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const dateStr    = displayDate();
    const countLabel = `${rows.length} ${sectionName.toLowerCase()}`;

    // ── Header block ──
    // Company name — top left, bold dark
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(30, 41, 59);
    doc.text(companyName, 14, 18);

    // Generated info — top right, muted
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${dateStr}  |  ${countLabel}`, pageW - 14, 18, { align: 'right' });

    // Section title — centered, bold
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(sectionTitle, pageW / 2, 29, { align: 'center' });

    // Divider line
    doc.setDrawColor(220, 226, 236);
    doc.setLineWidth(0.4);
    doc.line(14, 33, pageW - 14, 33);

    // ── Table ──
    autoTable(doc, {
      startY: 38,
      head:   [columns.map((c) => c.header)],
      body:   rows.map(flattenRow),
      headStyles: {
        fillColor:  BRAND,
        textColor:  [255, 255, 255],
        fontStyle:  'bold',
        fontSize:   9,
        cellPadding: 5,
      },
      bodyStyles: {
        fontSize:    8.5,
        textColor:   [30, 41, 59],
        cellPadding: 4,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { font: 'helvetica', overflow: 'linebreak' },
      margin: { left: 14, right: 14 },
    });

    // ── Footer (every page) ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      // Address — bottom left
      doc.text(COMPANY_ADDRESS, 14, pageH - 8);
      // Date + page number — bottom right
      doc.text(
        `Generated on ${dateStr}   |   Page ${i} of ${totalPages}`,
        pageW - 14,
        pageH - 8,
        { align: 'right' },
      );
    }

    doc.save(fileName('pdf'));
  };

  // ─── Excel ────────────────────────────────────────────────────────────────
  const exportExcel = () => {
    setOpen(false);
    const rows = getRows();
    if (!rows || rows.length === 0) {
      alert('No data to export. Apply a filter that returns at least one row.');
      return;
    }

    const headers  = columns.map((c) => c.header);
    const dataRows = rows.map(flattenRow);
    const colCount = headers.length;
    const dateStr  = displayDate();

    // 4-row header block + column header row + data
    const wsData = [
      [companyName],                                                                    // row 1
      [sectionTitle],                                                                   // row 2
      [`Generated on: ${dateStr}  |  ${rows.length} ${sectionName.toLowerCase()}`],    // row 3
      [],                                                                               // row 4 — spacer
      headers,                                                                          // row 5
      ...dataRows,                                                                      // row 6+
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Merge header rows across all columns
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
    ];

    // Auto column widths
    ws['!cols'] = headers.map((h, i) => {
      const maxLen = Math.max(h.length, ...dataRows.map((r) => String(r[i] ?? '').length));
      return { wch: Math.min(maxLen + 4, 45) };
    });

    // Cell styles (SheetJS CE — best-effort; styles render in LibreOffice / Excel 2016+)
    const styleCell = (addr, style) => {
      if (ws[addr]) ws[addr].s = style;
    };

    styleCell(XLSX.utils.encode_cell({ r: 0, c: 0 }), {
      font: { bold: true, sz: 14 },
    });
    styleCell(XLSX.utils.encode_cell({ r: 1, c: 0 }), {
      font: { bold: true, sz: 12 },
    });
    styleCell(XLSX.utils.encode_cell({ r: 2, c: 0 }), {
      font: { color: { rgb: '64748B' }, sz: 9 },
    });

    // Column header row (row index 4) — bold white text, brand-primary fill
    headers.forEach((_, i) => {
      const addr = XLSX.utils.encode_cell({ r: 4, c: i });
      if (ws[addr]) {
        ws[addr].s = {
          font:      { bold: true, color: { rgb: 'FFFFFF' } },
          fill:      { fgColor: { rgb: 'F47D5B' } },
          alignment: { horizontal: 'center' },
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sectionName);
    XLSX.writeFile(wb, fileName('xlsx'));
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <button className="import-btn" onClick={() => setOpen((o) => !o)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#fff', border: '1px solid #e8ecf1',
          borderRadius: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: 6, zIndex: 300, minWidth: 185,
          animation: 'fadeIn 0.15s ease-out forwards',
        }}>
          {/* Export as PDF */}
          <div
            onClick={exportPDF}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderRadius: 7, cursor: 'pointer',
              background: '#fff5f5', color: '#dc2626',
              fontSize: '0.84rem', fontWeight: 600, marginBottom: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.96)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Export as PDF
          </div>

          {/* Export as Excel */}
          <div
            onClick={exportExcel}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderRadius: 7, cursor: 'pointer',
              background: '#f0fff4', color: '#16a34a',
              fontSize: '0.84rem', fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.96)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
            Export as Excel
          </div>
        </div>
      )}
    </div>
  );
};
