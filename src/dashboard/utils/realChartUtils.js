/**
 * Data-driven chart utilities for the Real Dashboard.
 * Same visual style as the demo charts but accept data arrays instead of hardcoded values.
 */

/**
 * Generate month labels going back `months` months from today.
 */
export function generateMonthLabels(months) {
  const labels = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }));
  }
  return labels;
}

/**
 * Parse an Indian-formatted currency string like "₹1,40,952" to a number.
 */
function parseAmount(str) {
  if (typeof str === 'number') return str;
  return parseInt((str || '0').replace(/[₹,\s]/g, ''), 10) || 0;
}

/**
 * Bucket payments into monthly totals.
 * @param {Array} payments - [{amount, date, ...}]
 * @param {number} months - how many months back
 * @returns {{ labels: string[], revenue: number[], profit: number[] }}
 */
export function bucketPaymentsByMonth(payments, months) {
  const labels = generateMonthLabels(months);
  const revenue = new Array(months).fill(0);
  const profit = new Array(months).fill(0);

  const now = new Date();

  payments.forEach(p => {
    const amt = parseAmount(p.amount);
    // Try to parse the date
    let d;
    if (p.date) {
      d = new Date(p.date);
      if (isNaN(d.getTime())) {
        // Try Indian format: "09 Mar 2026"
        d = new Date(p.date.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$2 $1, $3'));
      }
    }
    if (!d || isNaN(d.getTime())) {
      // Try createdDate
      if (p.createdDate) {
        d = new Date(p.createdDate);
        if (isNaN(d.getTime())) {
          d = new Date(p.createdDate.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$2 $1, $3'));
        }
      }
    }
    if (!d || isNaN(d.getTime())) return;

    const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    const idx = months - 1 - diffMonths;
    if (idx >= 0 && idx < months) {
      revenue[idx] += amt;
    }
  });

  return { labels, revenue, profit };
}

/**
 * Bucket bookings into monthly counts.
 * @param {Array} bookings - [{createdDate, ...}]
 * @param {number} months
 * @returns {{ labels: string[], data: number[] }}
 */
export function bucketBookingsByMonth(bookings, months) {
  const labels = generateMonthLabels(months);
  const data = new Array(months).fill(0);
  const now = new Date();

  bookings.forEach(b => {
    let d;
    const dateStr = b.createdDate || b.travelDate;
    if (dateStr) {
      d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        d = new Date(dateStr.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$2 $1, $3'));
      }
    }
    if (!d || isNaN(d.getTime())) return;

    const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    const idx = months - 1 - diffMonths;
    if (idx >= 0 && idx < months) {
      data[idx] += 1;
    }
  });

  return { labels, data };
}

// ─── Drawing ──────────────────────────────────────────────────────

function setupCanvas(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);
  return { ctx, W: rect.width, H: rect.height };
}

function drawEmptyMessage(ctx, W, H, message) {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, W / 2, H / 2);
}

/**
 * Draw a revenue line chart — same visual style as the demo.
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} tooltipEl
 * @param {string[]} labels
 * @param {number[]} revenueData - raw amounts (not in lakhs)
 * @param {number[]} profitData - raw amounts
 * @param {boolean} animate
 */
export function drawRealRevenueChart(canvas, tooltipEl, labels, revenueData, profitData, animate = false) {
  const setup = setupCanvas(canvas);
  if (!setup) return labels;
  const { ctx, W, H } = setup;

  const padding = { top: 20, right: 10, bottom: 20, left: 10 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const baseline = padding.top + chartH;

  // Check if all data is zero
  const hasData = revenueData.some(v => v > 0) || profitData.some(v => v > 0);
  if (!hasData) {
    drawGridLines(ctx, padding, chartH, W);
    drawEmptyMessage(ctx, W, H, 'No revenue data yet');
    return labels;
  }

  // Convert to lakhs for display
  const revLakhs = revenueData.map(v => v / 100000);
  const profLakhs = profitData.map(v => v / 100000);
  const maxVal = Math.max(...revLakhs, 0.1) * 1.1;

  const revValues = revenueData.map(v => `₹${v.toLocaleString('en-IN')}`);
  const profValues = profitData.map(v => `₹${v.toLocaleString('en-IN')}`);

  function dataToPoints(data, progress = 1) {
    return data.map((val, i) => {
      const x = padding.left + (chartW / Math.max(data.length - 1, 1)) * i;
      const targetY = padding.top + chartH - (val / maxVal) * chartH;
      const y = baseline - (baseline - targetY) * progress;
      return { x, y };
    });
  }

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
      ctx.lineTo(points[points.length - 1].x, baseline);
      ctx.lineTo(points[0].x, baseline);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, padding.top, 0, baseline);
      grad.addColorStop(0, fillColor);
      grad.addColorStop(1, 'rgba(244, 125, 91, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function drawDots(points) {
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#16A34A';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  function renderFrame(progress) {
    const revPoints = dataToPoints(revLakhs, progress);
    const profPoints = dataToPoints(profLakhs, progress);
    ctx.clearRect(0, 0, W, H);
    drawGridLines(ctx, padding, chartH, W);
    drawSmoothLine(profPoints, '#10b981', null);
    drawSmoothLine(revPoints, '#16A34A', 'rgba(22, 163, 74, 0.1)');
    if (progress === 1) drawDots(revPoints);
    return revPoints;
  }

  if (canvas._animFrame) cancelAnimationFrame(canvas._animFrame);

  if (animate) {
    renderFrame(0);
    let startTime = null;
    function step(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 1000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      renderFrame(eased);
      if (progress < 1) {
        canvas._animFrame = requestAnimationFrame(step);
      } else {
        renderFrame(1);
        attachTooltip();
      }
    }
    canvas._animFrame = requestAnimationFrame(step);
  } else {
    renderFrame(1);
    attachTooltip();
  }

  function attachTooltip() {
    const revPoints = dataToPoints(revLakhs, 1);
    const handleMouseMove = (e) => {
      if (!tooltipEl) return;
      const mouseX = e.offsetX;
      let closestIdx = 0;
      let minDiff = Infinity;
      revPoints.forEach((pt, i) => {
        const diff = Math.abs(mouseX - pt.x);
        if (diff < minDiff) { minDiff = diff; closestIdx = i; }
      });
      const pt = revPoints[closestIdx];
      const threshold = (chartW / labels.length) / 2 + 10;
      if (minDiff < threshold) {
        tooltipEl.innerHTML = `<span class="tooltip-date">${labels[closestIdx]}</span><div class="tooltip-row"><span class="tooltip-label">Revenue :</span><span class="tooltip-revenue">${revValues[closestIdx]}</span></div><div class="tooltip-row"><span class="tooltip-label">Profit :</span><span class="tooltip-profit">${profValues[closestIdx]}</span></div>`;
        tooltipEl.classList.add('active');
        tooltipEl.style.left = `${pt.x}px`;
        tooltipEl.style.top = `${pt.y - 12}px`;
        tooltipEl.style.transform = `translate(-50%, -100%)`;
      } else { tooltipEl.classList.remove('active'); }
    };
    if (canvas._lastMoveHandler) canvas.removeEventListener('mousemove', canvas._lastMoveHandler);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas._lastMoveHandler = handleMouseMove;
    canvas.addEventListener('mouseleave', () => { if (tooltipEl) tooltipEl.classList.remove('active'); });
  }

  return labels;
}

/**
 * Draw a bookings bar chart — same visual style as the demo.
 */
export function drawRealBookingsChart(canvas, tooltipEl, labels, data) {
  const setup = setupCanvas(canvas);
  if (!setup) return labels;
  const { ctx, W, H } = setup;

  const padding = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartH = H - padding.top - padding.bottom;
  const chartW = W - padding.left - padding.right;

  const hasData = data.some(v => v > 0);
  if (!hasData) {
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
    drawEmptyMessage(ctx, W, H, 'No bookings yet');
    return labels;
  }

  const maxVal = Math.max(...data, 4);
  const months = data.length;
  const barWidth = months <= 6 ? 32 : (months <= 12 ? 16 : 8);
  const totalBars = data.length;
  const gap = (chartW - totalBars * barWidth) / (totalBars + 1);
  let hoveredIdx = -1;

  function draw() {
    ctx.clearRect(0, 0, W, H);
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
        ctx.fillRect(x - gap / 2, padding.top, barWidth + gap, chartH);
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

  const handleMouseMove = (e) => {
    const mouseX = e.offsetX;
    let currentIdx = -1;
    data.forEach((val, i) => {
      const x = padding.left + gap * (i + 1) + barWidth * i;
      if (mouseX >= x - gap / 2 && mouseX <= x + barWidth + gap / 2) currentIdx = i;
    });
    if (currentIdx !== hoveredIdx) {
      hoveredIdx = currentIdx;
      draw();
      if (hoveredIdx !== -1 && tooltipEl) {
        tooltipEl.innerHTML = `<span class="tooltip-date">${labels[hoveredIdx]}</span><div class="tooltip-row"><span class="tooltip-label">Bookings :</span><span style="font-weight:600;color:#6366f1;margin-left:4px;">${data[hoveredIdx]}</span></div>`;
        tooltipEl.classList.add('active');
        const x = padding.left + gap * (hoveredIdx + 1) + barWidth * hoveredIdx;
        const barH = (data[hoveredIdx] / maxVal) * chartH;
        tooltipEl.style.left = `${x}px`;
        tooltipEl.style.top = `${padding.top + chartH - barH - 10}px`;
        tooltipEl.style.transform = `translate(-50%, -100%)`;
      } else if (tooltipEl) { tooltipEl.classList.remove('active'); }
    }
  };
  if (canvas._lastMoveHandler) canvas.removeEventListener('mousemove', canvas._lastMoveHandler);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas._lastMoveHandler = handleMouseMove;
  canvas.addEventListener('mouseleave', () => { hoveredIdx = -1; draw(); if (tooltipEl) tooltipEl.classList.remove('active'); });

  draw();
  return labels;
}

// ─── Shared helpers ────────────────────────────────────────────────

function drawGridLines(ctx, padding, chartH, W) {
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();
  }
}

/**
 * Compute Y-axis labels for the revenue chart.
 */
export function getRevenueYLabels(revenueData) {
  const max = Math.max(...revenueData, 0);
  if (max === 0) return ['0', '0', '0', '0', '0'];
  const maxLakhs = (max / 100000) * 1.1;
  return [4, 3, 2, 1, 0].map(i => {
    const val = (maxLakhs / 4) * i;
    return val >= 1 ? `${val.toFixed(1)}L` : `${(val * 100).toFixed(0)}K`;
  });
}

/**
 * Compute Y-axis labels for the bookings chart.
 */
export function getBookingsYLabels(data) {
  const max = Math.max(...data, 4);
  return [4, 3, 2, 1, 0].map(i => Math.round((max / 4) * i).toString());
}
