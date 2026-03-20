import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const BRAND = [244, 125, 91]; // #F47D5B

const fileDateStamp = () => {
  const d = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()}${months[d.getMonth()]}${d.getFullYear()}`;
};

const displayDateTime = () => {
  const d = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = ((h % 12) || 12).toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm} ${ampm}`;
};

/**
 * ExportDropdown
 * @param {Object[]} data        - Filtered/visible rows from the parent section
 * @param {Object[]} columns     - [{ header: string, key: string }, ...]
 * @param {string}   sectionName - e.g. "Bookings"
 * @param {string}   fileBase    - e.g. "Bookings_Export"
 */
export const ExportDropdown = ({ data, columns, sectionName, fileBase }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Always keep a ref to the latest data — guards against stale closures
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Close on outside click
  useEffect(() => {
    const onOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const fileName = (ext) => `${fileBase}_${fileDateStamp()}.${ext}`;

  // Shared guard — always read from the ref so we get the freshest snapshot
  const getRows = () => {
    const rows = dataRef.current;
    console.log(`[Export – ${sectionName}] data snapshot (${rows?.length ?? 0} rows):`, rows);
    if (rows?.length > 0) console.log(`[Export – ${sectionName}] sample row keys:`, Object.keys(rows[0]));
    return rows;
  };

  // ─── PDF ────────────────────────────────────────────────────────────────────
  const exportPDF = () => {
    setOpen(false);
    const rows = getRows();
    if (!rows || rows.length === 0) {
      alert('No data to export. Apply a filter that returns at least one row.');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    const pageW = doc.internal.pageSize.width;

    // Report header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...BRAND);
    doc.text(`${sectionName} Report`, 14, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${displayDateTime()}`, 14, 23);

    // Build head + body from column map — flatten all values to plain strings
    const head = [columns.map((c) => c.header)];
    const body = rows.map((row) =>
      columns.map((c) => {
        const val = row[c.key];
        // Flatten: stringify anything non-primitive
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      })
    );

    autoTable(doc, {
      startY: 30,
      head,
      body,
      headStyles: { fillColor: BRAND, textColor: [255,255,255], fontStyle: 'bold', fontSize: 9, cellPadding: 5 },
      bodyStyles: { fontSize: 8.5, textColor: [30,41,59], cellPadding: 4 },
      alternateRowStyles: { fillColor: [248,250,252] },
      styles: { font: 'helvetica', overflow: 'linebreak' },
      margin: { left: 14, right: 14 },
    });

    // Page footers — written after table so total page count is final
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${totalPages}`, pageW / 2, doc.internal.pageSize.height - 8, { align: 'center' });
    }

    doc.save(fileName('pdf'));
  };

  // ─── Excel ──────────────────────────────────────────────────────────────────
  const exportExcel = () => {
    setOpen(false);
    const rows = getRows();
    if (!rows || rows.length === 0) {
      alert('No data to export. Apply a filter that returns at least one row.');
      return;
    }

    const headers = columns.map((c) => c.header);

    // Flatten each row to an array of plain strings in column order
    const dataRows = rows.map((row) =>
      columns.map((c) => {
        const val = row[c.key];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      })
    );

    const wsData = [
      [`${sectionName} Report`],           // row 1 — title
      [`Generated on: ${displayDateTime()}`], // row 2 — date
      [],                                    // row 3 — spacer
      headers,                               // row 4 — column headers
      ...dataRows,                           // row 5+ — data
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Merge title across all columns
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

    // Auto column widths
    ws['!cols'] = headers.map((h, i) => {
      const maxLen = Math.max(h.length, ...dataRows.map((r) => String(r[i] ?? '').length));
      return { wch: Math.min(maxLen + 4, 45) };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sectionName);
    XLSX.writeFile(wb, fileName('xlsx'));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
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
