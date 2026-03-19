// ===========================
// DASHBOARD CHART & INTERACTIVITY
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  drawRevenueChart();
  drawBookingsChart();
  drawIndiaMap();
  drawWorldMap();
  initFinancialSummary();
});

function drawRevenueChart() {
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
  const padding = { top: 20, right: 10, bottom: 20, left: 0 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;

  // Data
  const labels = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
  const revenueData = [0.5, 0.4, 0.6, 0.8, 2.0, 7.5];
  const profitData  = [0.1, 0.1, 0.2, 0.3, 0.5, 2.0];
  const revValues = ["₹51,200", "₹42,500", "₹64,300", "₹82,100", "₹2,05,000", "₹7,67,732"];
  const profValues = ["₹8,500", "₹6,200", "₹12,400", "₹24,500", "₹48,900", "₹89,000"];
  const maxVal = 8;

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

  // Draw Grid (5 lines: 8, 6, 4, 2, 0)
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = padding.top + (chartH / 4) * i;
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
  canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    
    // Find closest point index
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
    
    // Check if mouse is near enough to show tooltip
    if (minDiff < 30) {
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
      
      // Position tooltip at center top of the point
      tooltip.style.left = `${pt.x}px`;
      tooltip.style.top = `${pt.y - 12}px`;
      tooltip.style.transform = `translate(-50%, -100%)`;
    } else {
      tooltip.classList.remove('active');
    }
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.classList.remove('active');
  });
}

// Bookings bar chart
function drawBookingsChart() {
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
  const padding = { top: 10, right: 10, bottom: 10, left: 0 };
  const chartH = H - padding.top - padding.bottom;
  const maxVal = 4;

  // Data
  const labels = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
  const data = [0, 0, 0, 0, 1, 3];
  const barWidth = 32;
  const totalBars = data.length;
  const chartW = W - padding.left - padding.right;
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

      // Draw highlight if hovered
      if (hoveredIdx === i) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(x - gap/2, padding.top, barWidth + gap, chartH);
      }

      if (val > 0) {
        // Gradient bar
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

  canvas.addEventListener('mousemove', (e) => {
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

        // Position
        const x = padding.left + gap * (hoveredIdx + 1) + barWidth * hoveredIdx;
        const barH = (val / maxVal) * chartH;
        const y = padding.top + chartH - barH;
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 10}px`;
        tooltip.style.transform = `translate(-100%, -50%)`; // To the left of the bar as in image
        if (hoveredIdx < 2) {
          tooltip.style.transform = `translate(20%, -50%)`; // Flip if too close to left
        }
      } else {
        tooltip.classList.remove('active');
      }
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredIdx = -1;
    draw();
    tooltip.classList.remove('active');
  });

  draw();
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
  drawRevenueChart();
  drawBookingsChart();
  drawIndiaMap();
  drawWorldMap();
});

// SPA routing handles nav item active states now.

function initFinancialSummary() {
  const popup = document.getElementById('fsPopupDashboard');
  const content = popup.querySelector('.fs-popup-content');
  const infoBtns = document.querySelectorAll('.fs-info-btn');

  const infoData = {
    revenue: "Cumulative <strong>total billed</strong> across all confirmed bookings.",
    profit: "Sum of all <strong>margins and commissions</strong> earned across bookings.",
    pending: "Total <strong>outstanding balance</strong> owed by customers across all bookings that are not yet fully paid.",
    conversion: "Percentage of quotes that were successfully <strong>converted</strong> into confirmed bookings.",
    quotes: "Total number of <strong>quotes created</strong> for customers across all destinations.",
    bookings: "Number of <strong>active and upcoming</strong> trips currently managed in the system.",
    customers: "Total number of <strong>unique customers</strong> registered in the system."
  };

  infoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.dataset.info;
      content.innerHTML = infoData[type];

      // Reset active states
      infoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Position popup relative to viewport with boundary checking
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
    });
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target)) {
      popup.classList.remove('active');
      infoBtns.forEach(b => b.classList.remove('active'));
    }
  });
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initLogsPopup();
});

