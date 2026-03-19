// ===========================
// DASHBOARD CHART & INTERACTIVITY
// ===========================


/**
 * ANIMATE VALUE (Count-up)
 */
function animateValue(el, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = progress * (end - start) + start;
    
    // Formatting
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    
    if (el.dataset.countup.includes('.')) {
      el.innerText = prefix + value.toFixed(1) + suffix;
    } else {
      el.innerText = prefix + Math.floor(value).toLocaleString('en-IN') + suffix;
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function initCountUp() {
  const elements = document.querySelectorAll('[data-countup]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseFloat(el.dataset.countup);
        animateValue(el, 0, end, 1500);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/**
 * SIMULATE LOADING (Skeleton)
 */
function simulateLoading() {
  // Show skeletons for 1s then reveal content
  setTimeout(() => {
    document.querySelectorAll('.loading').forEach(el => {
      el.classList.remove('loading');
    });
  }, 1200);
}

function drawRevenueChart(months = 6) {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const tooltip = document.getElementById('chartTooltip');

  // Size canvas properly
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const padding = { top: 20, right: 10, bottom: 20, left: 10 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;

  // Generate Data
  const { labels, revenueData, profitData, revValues, profValues } = getRevenueChartData(months);
  const maxVal = Math.max(...revenueData, 1) * 1.1;

  // Update DOM X-Axis
  const xAxis = document.getElementById('revenueXAxis');
  if (xAxis) {
     xAxis.innerHTML = '';
     // Only show a subset of labels if months > 6 to avoid crowding
     const step = months > 12 ? 4 : (months > 6 ? 2 : 1);
     labels.forEach((label, i) => {
       if (i % step === 0 || i === labels.length - 1) {
         const span = document.createElement('span');
         span.textContent = label;
         xAxis.appendChild(span);
       }
     });
  }

  function dataToPoints(data) {
    return data.map((val, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      return { x, y };
    });
  }

  const revPoints = dataToPoints(revenueData);
  const profPoints = dataToPoints(profitData);

  function drawSmoothLine(points, color, fillColor) {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const cp1x = (points[i].x + points[i + 1].x) / 2;
      const cp1y = points[i].y;
      const cp2x = (points[i].x + points[i + 1].x) / 2;
      const cp2y = points[i + 1].y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i + 1].x, points[i + 1].y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (fillColor) {
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.lineTo(points[0].x, padding.top + chartH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, fillColor);
      grad.addColorStop(1, 'rgba(244, 125, 91, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Draw Grid (5 lines)
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  const gridLinesCount = 5;
  for (let i = 0; i < gridLinesCount; i++) {
    const y = padding.top + (chartH / (gridLinesCount - 1)) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();
  }

  drawSmoothLine(profPoints, '#10b981', null);
  drawSmoothLine(revPoints, '#F47D5B', 'rgba(244, 125, 91, 0.1)');

  // Draw dots
  revPoints.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F47D5B';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Tooltip Logic
  const handleMouseMove = (e) => {
    const mouseX = e.offsetX;
    
    let closestIdx = 0;
    let minDiff = Infinity;
    
    revPoints.forEach((pt, i) => {
      const diff = Math.abs(mouseX - pt.x);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });

    const pt = revPoints[closestIdx];
    const threshold = (chartW / labels.length) / 2 + 10;
    
    if (minDiff < threshold) {
      tooltip.innerHTML = `
        <span class="tooltip-date">${labels[closestIdx]}</span>
        <div class="tooltip-row">
          <span class="tooltip-label">Revenue :</span>
          <span class="tooltip-revenue">${revValues[closestIdx]}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Profit :</span>
          <span class="tooltip-profit">${profValues[closestIdx]}</span>
        </div>
      `;
      tooltip.classList.add('active');
      tooltip.style.left = `${pt.x}px`;
      tooltip.style.top = `${pt.y - 12}px`;
      tooltip.style.transform = `translate(-50%, -100%)`;
    } else {
      tooltip.classList.remove('active');
    }
  };

  // Re-attach listener
  if (canvas._lastMoveHandler) {
    canvas.removeEventListener('mousemove', canvas._lastMoveHandler);
  }
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas._lastMoveHandler = handleMouseMove;

  canvas.addEventListener('mouseleave', () => {
    tooltip.classList.remove('active');
  });
}

// Bookings bar chart
let currentRevenueMonths = 6;
let currentBookingsMonths = 6;

function drawBookingsChart(months = 6) {
  currentBookingsMonths = months;
  const canvas = document.getElementById('bookingsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const padding = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartH = H - padding.top - padding.bottom;
  const chartW = W - padding.left - padding.right;

  // Generate Data
  const { labels, data } = getBookingsChartData(months);
  const maxVal = Math.max(...data, 4);

  // Update DOM X-Axis
  const xAxis = document.getElementById('bookingsXAxis');
  if (xAxis) {
     xAxis.innerHTML = '';
     const step = months > 12 ? 4 : (months > 6 ? 2 : 1);
     labels.forEach((label, i) => {
       if (i % step === 0 || i === labels.length - 1) {
         const span = document.createElement('span');
         span.textContent = label;
         xAxis.appendChild(span);
       }
     });
  }

  const barWidth = months === 6 ? 32 : (months === 12 ? 16 : 8);
  const totalBars = data.length;
  const gap = (chartW - totalBars * barWidth) / (totalBars + 1);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    data.forEach((val, i) => {
      const x = padding.left + gap * (i + 1) + barWidth * i;
      const barH = (val / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      if (hoveredIdx === i) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(x - gap/2, padding.top, barWidth + gap, chartH);
      }

      if (val > 0) {
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, '#818cf8');
        grad.addColorStop(1, '#6366f1');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        ctx.fill();
      }
    });
  }

  let hoveredIdx = -1;
  const tooltip = document.getElementById('bookingsTooltip');

  const handleMouseMove = (e) => {
    const mouseX = e.offsetX;
    let currentIdx = -1;
    data.forEach((val, i) => {
      const x = padding.left + gap * (i + 1) + barWidth * i;
      if (mouseX >= x - gap/2 && mouseX <= x + barWidth + gap/2) {
        currentIdx = i;
      }
    });

    if (currentIdx !== hoveredIdx) {
      hoveredIdx = currentIdx;
      draw();

      if (hoveredIdx !== -1) {
        const val = data[hoveredIdx];
        const label = labels[hoveredIdx];
        tooltip.innerHTML = `
          <span class="tooltip-date">${label}</span>
          <div class="tooltip-row">
            <span class="tooltip-label">Bookings :</span>
            <span class="tooltip-booking-val" style="font-weight:600; color:#6366f1; margin-left:4px;">${val}</span>
          </div>
        `;
        tooltip.classList.add('active');

        const x = padding.left + gap * (hoveredIdx + 1) + barWidth * hoveredIdx;
        const barH = (val / maxVal) * chartH;
        const y = padding.top + chartH - barH;
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 10}px`;
        tooltip.style.transform = `translate(-50%, -100%)`;
      } else {
        tooltip.classList.remove('active');
      }
    }
  };

  if (canvas._lastMoveHandler) {
    canvas.removeEventListener('mousemove', canvas._lastMoveHandler);
  }
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas._lastMoveHandler = handleMouseMove;

  canvas.addEventListener('mouseleave', () => {
    hoveredIdx = -1;
    draw();
    tooltip.classList.remove('active');
  });

  draw();
}

function getRevenueChartData(months) {
  const allLabels = ["Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
  const labels = allLabels.slice(-months);
  
  const revenueData = labels.map((_, i) => {
    const isStored = (i >= labels.length - 6);
    if (isStored) return [0.5, 0.4, 0.6, 0.8, 2.0, 7.5][i - (labels.length - 6)];
    return 0.3 + Math.random() * 1.5;
  });

  const profitData = labels.map((_, i) => {
    const isStored = (i >= labels.length - 6);
    if (isStored) return [0.1, 0.1, 0.2, 0.3, 0.5, 2.0][i - (labels.length - 6)];
    return 0.05 + Math.random() * 0.4;
  });

  const revValues = revenueData.map(v => `₹${(v * 100000).toLocaleString('en-IN')}`);
  const profValues = profitData.map(v => `₹${(v * 100000).toLocaleString('en-IN')}`);

  return { labels, revenueData, profitData, revValues, profValues };
}

function getBookingsChartData(months) {
  const allLabels = ["Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
  const labels = allLabels.slice(-months);
  
  const data = labels.map((_, i) => {
    const isStored = (i >= labels.length - 6);
    if (isStored) return [0, 0, 0, 0, 1, 3][i - (labels.length - 6)];
    return Math.floor(Math.random() * 3);
  });

  return { labels, data };
}

function initChartDropdowns() {
  const dropdownWrappers = document.querySelectorAll('.chart-period-wrapper');

  dropdownWrappers.forEach(wrapper => {
    const select = wrapper.querySelector('.chart-period-select');
    const items = wrapper.querySelectorAll('.chart-dropdown-item');
    const selectedText = select.querySelector('.selected-period');

    select.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');
      document.querySelectorAll('.chart-period-wrapper').forEach(w => w.classList.remove('open'));
      if (!isOpen) wrapper.classList.add('open');
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const months = parseInt(item.dataset.months);
        selectedText.textContent = item.textContent;
        
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (wrapper.id === 'revenuePeriodWrapper') {
          currentRevenueMonths = months;
          drawRevenueChart(months);
          document.querySelector('.revenue-chart-card .chart-subtitle').textContent = `Last ${months} months performance`;
        } else {
          currentBookingsMonths = months;
          drawBookingsChart(months);
          document.querySelector('#bookingsChart').closest('.revenue-chart-card').querySelector('.chart-subtitle').textContent = `Booking volume over last ${months} months`;
        }
        
        wrapper.classList.remove('open');
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.chart-period-wrapper').forEach(w => w.classList.remove('open'));
  });
}

// India map (simplified outline with destination dots)
function drawIndiaMap() {
  const canvas = document.getElementById('indiaMap');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;

  // Draw simplified India outline
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.fillStyle = '#fef7f0';
  
  ctx.beginPath();
  // Simplified India shape
  const cx = W * 0.5, cy = H * 0.48;
  const sw = W * 0.55, sh = H * 0.75;
  
  ctx.moveTo(cx - sw*0.15, cy - sh*0.48); // Kashmir
  ctx.lineTo(cx + sw*0.05, cy - sh*0.5);
  ctx.lineTo(cx + sw*0.2, cy - sh*0.42);
  ctx.lineTo(cx + sw*0.35, cy - sh*0.3);
  ctx.quadraticCurveTo(cx + sw*0.45, cy - sh*0.15, cx + sw*0.42, cy - sh*0.05);
  ctx.lineTo(cx + sw*0.48, cy + sh*0.05);
  ctx.quadraticCurveTo(cx + sw*0.5, cy + sh*0.15, cx + sw*0.42, cy + sh*0.2);
  ctx.lineTo(cx + sw*0.35, cy + sh*0.25);
  ctx.quadraticCurveTo(cx + sw*0.3, cy + sh*0.35, cx + sw*0.2, cy + sh*0.38);
  ctx.lineTo(cx + sw*0.1, cy + sh*0.42);
  ctx.quadraticCurveTo(cx + sw*0.05, cy + sh*0.48, cx, cy + sh*0.5);
  ctx.quadraticCurveTo(cx - sw*0.1, cy + sh*0.45, cx - sw*0.2, cy + sh*0.3);
  ctx.lineTo(cx - sw*0.25, cy + sh*0.2);
  ctx.quadraticCurveTo(cx - sw*0.4, cy + sh*0.1, cx - sw*0.35, cy - sh*0.05);
  ctx.lineTo(cx - sw*0.3, cy - sh*0.15);
  ctx.quadraticCurveTo(cx - sw*0.25, cy - sh*0.3, cx - sw*0.2, cy - sh*0.4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Goa dot (west coast, lower)
  const goaX = cx - sw*0.22, goaY = cy + sh*0.2;
  ctx.beginPath();
  ctx.arc(goaX, goaY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#F47D5B';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Srinagar dot (top, Kashmir)
  const sriX = cx - sw*0.05, sriY = cy - sh*0.4;
  ctx.beginPath();
  ctx.arc(sriX, sriY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#F47D5B';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// World map (simplified with Bali dot)
function drawWorldMap() {
  const canvas = document.getElementById('worldMap');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;

  // Draw simplified continents as blobs
  ctx.fillStyle = '#e8eef5';
  ctx.strokeStyle = '#d1dae5';
  ctx.lineWidth = 0.8;

  // Europe/Africa blob
  function drawBlob(x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Americas
  drawBlob(W * 0.18, H * 0.35, W * 0.08, H * 0.2);
  drawBlob(W * 0.15, H * 0.6, W * 0.06, H * 0.15);

  // Europe
  drawBlob(W * 0.42, H * 0.28, W * 0.08, H * 0.1);

  // Africa
  drawBlob(W * 0.43, H * 0.52, W * 0.07, H * 0.18);

  // Asia
  drawBlob(W * 0.62, H * 0.3, W * 0.12, H * 0.15);

  // Southeast Asia / Indonesia
  drawBlob(W * 0.7, H * 0.55, W * 0.1, H * 0.06);
  drawBlob(W * 0.75, H * 0.6, W * 0.06, H * 0.04);

  // Australia
  drawBlob(W * 0.8, H * 0.7, W * 0.08, H * 0.08);

  // Bali dot
  const baliX = W * 0.73, baliY = H * 0.58;
  ctx.beginPath();
  ctx.arc(baliX, baliY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#F47D5B';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Redraw on resize
window.addEventListener('resize', () => {
  drawRevenueChart(currentRevenueMonths);
  drawBookingsChart(currentBookingsMonths);
  drawIndiaMap();
  drawWorldMap();
});

// SPA routing handles nav item active states now.

function initGlobalInfoPopups() {
  const popup = document.getElementById('globalInfoPopup');
  const content = popup.querySelector('.fs-popup-content');
  const infoBtns = document.querySelectorAll('.info-btn');

  const infoData = {
    // Dashboard Stats
    revenue: "Cumulative <strong>total billed</strong> across all confirmed bookings.",
    profit: "Sum of all <strong>margins and commissions</strong> earned across bookings.",
    pending: "Total <strong>outstanding balance</strong> owed by customers across all bookings that are not yet fully paid.",
    conversion: "Percentage of quotes that were successfully <strong>converted</strong> into confirmed bookings.",
    quotes: "Total number of <strong>quotes created</strong> for customers across all destinations.",
    bookings: "Number of <strong>active and upcoming</strong> trips currently managed in the system.",
    customers: "Total number of <strong>unique customers</strong> registered in the system.",

    // Payments section
    total_received: "The total amount of <strong>money actually collected</strong> from customers, including partial and advance payments.",
    transactions: "The total count of <strong>successful payment records</strong> processed through the system.",
    credit: "Money received into the <strong>advance balance</strong> through advance deposits.",
    debit: "Money applied from the <strong>advance balance</strong> towards a booking payment.",
    advance: "Total <strong>unallocated advance money</strong> held on behalf of customers. These are amounts received but not yet applied to any specific booking.",
    mode: "<strong>Adjusted via Advance</strong> means the payment was settled using the customer's existing advance balance, rather than a new direct payment.",

    // Invoices section
    ext_info: "Primary is the main tax invoice for a booking. <strong>EXT (Extension)</strong> is an additional invoice issued when some services are billed under a different GST rate.",
    status_info: "Shows whether the booking is <strong>active or cancelled</strong>. Cancelled invoices are voided and linked to a Credit Note if one was generated.",

    // Settings General
    slug: "Your unique subdomain on moontrip.app. This is how your customer-facing quote links are structured. It cannot be changed.",
    gstin: "Your 15-character GST Identification Number. Enter your GSTIN and click Verify to auto-fill company details from the GST portal.",
    gst_billing: "Toggle GST billing globally. When enabled, GST fields like GSTIN and HSN/SAC codes will be mandatory on invoices. Ideal for small-scale businesses not registered under GST.",
    pan: "Your company's 10-character Permanent Account Number. Required for tax invoices above ₹2 lakh.",

    // Settings Bank
    ifsc: "11-character bank branch code used for NEFT/RTGS transfers. Bank name and branch are auto-filled when you enter a valid IFSC.",
    upi: "A QR code will be auto-generated from this UPI ID and printed on your invoices and quotes for easy payment collection.",

    // Settings Documents
    terms: "This text appears at the bottom of Tax Invoice PDFs sent to customers.",
    pdf_theme: "Choose the visual style for all customer-facing PDFs — quotes, invoices, and receipts.",

    // Settings Nomenclature
    nom_prefix_booking: "Text that appears before the booking number. For example, prefix INV with number 5 produces INV-5.",
    nom_number_booking: "The sequence number for your next document. Setting this lower than existing documents may cause duplicate conflicts.",
    nom_suffix_booking: "Text that appears after the booking number. Commonly used for financial year codes, e.g. FY26 produces INV-5-FY26.",
    nom_prefix_quote: "Text that appears before the quote number. For example, prefix Q with number 5 produces Q-5.",
    nom_number_quote: "The sequence number for your next document. Setting this lower than existing documents may cause duplicate conflicts.",
    nom_suffix_quote: "Text that appears after the quote number. Commonly used for financial year codes, e.g. FY26 produces Q-5-FY26.",
    nom_payment: "Payment receipt numbers are auto-assigned in sequential order and cannot be customized."
  };

  const handlePopup = (btn) => {
    const type = btn.dataset.info;
    if (!infoData[type]) return;

    content.innerHTML = infoData[type];

    // Reset active states dynamically (important for SPA view swaps)
    document.querySelectorAll('.info-btn.active').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Position popup relative to viewport (fixed positioning)
    const btnRect = btn.getBoundingClientRect();
    let left = btnRect.left + btnRect.width / 2;
    let top = btnRect.top - 12;

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.transform = "translate(-50%, -100%)";
    
    popup.classList.add('active');

    // Boundary check
    const popupRect = popup.getBoundingClientRect();
    const padding = 20;

    if (popupRect.right > window.innerWidth - padding) {
      const diff = popupRect.right - (window.innerWidth - padding);
      left -= diff;
      popup.style.left = left + 'px';
    }
    if (popupRect.left < padding) {
      const diff = padding - popupRect.left;
      left += diff;
      popup.style.left = left + 'px';
    }
  };

  // mousedown in capture phase is most reliable for "click outside" dismissal
  document.addEventListener('mousedown', (e) => {
    const activePopup = document.getElementById('globalInfoPopup');
    if (!activePopup) return;

    const btn = e.target.closest('.info-btn');
    if (btn) {
      const isCurrentlyActive = btn.classList.contains('active');
      
      // Close all first
      activePopup.classList.remove('active');
      document.querySelectorAll('.info-btn').forEach(b => b.classList.remove('active'));
      
      if (!isCurrentlyActive) {
        handlePopup(btn);
      }
    } else if (activePopup.classList.contains('active') && !activePopup.contains(e.target)) {
      activePopup.classList.remove('active');
      document.querySelectorAll('.info-btn').forEach(b => b.classList.remove('active'));
    }
  }, true);
}

// Logs Popup logic
function initLogsPopup() {
  const logBtns = document.querySelectorAll('.log-btn');
  const logsPopup = document.getElementById('logsPopup');
  
  if (!logsPopup) return;

  logBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      logsPopup.classList.toggle('active');
      
      // Close other popups
      const otherPopups = ['dateFilterDropdown', 'fsPopupDashboard'];
      otherPopups.forEach(id => {
        const p = document.getElementById(id);
        if (p) p.classList.remove('active');
      });
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (logsPopup.classList.contains('active') && !logsPopup.contains(e.target)) {
      logsPopup.classList.remove('active');
    }
  });
}

// Status Dropdown and Demo Modal logic
function initStatusDropdowns() {
  const statusWrappers = document.querySelectorAll('.status-dropdown-wrapper');
  const demoModal = document.getElementById('demoModal');
  const closeDemoModal = document.getElementById('closeDemoModal');

  if (!statusWrappers || !demoModal || !closeDemoModal) return;

  statusWrappers.forEach(wrapper => {
    const pill = wrapper.querySelector('.status-pill');
    const dropdownItems = wrapper.querySelectorAll('.status-dropdown-item');

    // Toggle dropdown
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close all other status dropdowns
      statusWrappers.forEach(w => {
        if (w !== wrapper) w.classList.remove('active');
      });

      wrapper.classList.toggle('active');
    });

    // Handle dropdown items
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.classList.remove('active');
        
        // Show Demo Modal
        demoModal.classList.add('active');
      });
    });
  });

  // Close demo modal
  closeDemoModal.addEventListener('click', () => {
    demoModal.classList.remove('active');
  });

  // Close dropdowns and modal on outside click
  document.addEventListener('click', (e) => {
    statusWrappers.forEach(w => {
      if (!w.contains(e.target)) {
        w.classList.remove('active');
      }
    });

    if (demoModal.classList.contains('active') && !demoModal.querySelector('.demo-modal-content').contains(e.target)) {
        demoModal.classList.remove('active');
    }
  });
}

// Initialize on load
// Initialize all on load
document.addEventListener('DOMContentLoaded', () => {
    // UX & Chart Enhancements
    initCountUp();
    simulateLoading();
    drawRevenueChart();
    drawBookingsChart();
    drawIndiaMap();
    drawWorldMap();
    initChartDropdowns();

    // Global Components
    initGlobalInfoPopups();
    initLogsPopup();
    initStatusDropdowns();
});
