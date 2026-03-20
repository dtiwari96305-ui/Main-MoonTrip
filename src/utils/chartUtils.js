// Chart drawing utilities ported from dashboard.js

export function getRevenueChartData(months) {
  const allLabels = ["Apr 2024","May 2024","Jun 2024","Jul 2024","Aug 2024","Sep 2024","Oct 2024","Nov 2024","Dec 2024","Jan 2025","Feb 2025","Mar 2025","Apr 2025","May 2025","Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"];
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

export function getBookingsChartData(months) {
  const allLabels = ["Apr 2024","May 2024","Jun 2024","Jul 2024","Aug 2024","Sep 2024","Oct 2024","Nov 2024","Dec 2024","Jan 2025","Feb 2025","Mar 2025","Apr 2025","May 2025","Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"];
  const labels = allLabels.slice(-months);
  const data = labels.map((_, i) => {
    const isStored = (i >= labels.length - 6);
    if (isStored) return [0, 0, 0, 0, 1, 3][i - (labels.length - 6)];
    return Math.floor(Math.random() * 3);
  });
  return { labels, data };
}

export function drawRevenueChart(canvas, tooltipEl, months = 6) {
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
  const padding = { top: 20, right: 10, bottom: 20, left: 10 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;

  const { labels, revenueData, profitData, revValues, profValues } = getRevenueChartData(months);
  const maxVal = Math.max(...revenueData, 1) * 1.1;

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

  ctx.clearRect(0, 0, W, H);
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

  revPoints.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F47D5B';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Tooltip
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

  return labels;
}

export function drawBookingsChart(canvas, tooltipEl, months = 6) {
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

  const { labels, data } = getBookingsChartData(months);
  const maxVal = Math.max(...data, 4);
  const barWidth = months === 6 ? 32 : (months === 12 ? 16 : 8);
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

  const handleMouseMove = (e) => {
    const mouseX = e.offsetX;
    let currentIdx = -1;
    data.forEach((val, i) => {
      const x = padding.left + gap * (i + 1) + barWidth * i;
      if (mouseX >= x - gap/2 && mouseX <= x + barWidth + gap/2) currentIdx = i;
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

export function drawIndiaMap(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);
  const W = rect.width, H = rect.height;
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5; ctx.fillStyle = '#fef7f0';
  ctx.beginPath();
  const cx = W * 0.5, cy = H * 0.48, sw = W * 0.55, sh = H * 0.75;
  ctx.moveTo(cx - sw*0.15, cy - sh*0.48);
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
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Goa
  ctx.beginPath(); ctx.arc(cx - sw*0.22, cy + sh*0.2, 5, 0, Math.PI*2); ctx.fillStyle='#F47D5B'; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
  // Srinagar
  ctx.beginPath(); ctx.arc(cx - sw*0.05, cy - sh*0.4, 5, 0, Math.PI*2); ctx.fillStyle='#F47D5B'; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
}

export function drawWorldMap(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);
  const W = rect.width, H = rect.height;
  ctx.fillStyle = '#e8eef5'; ctx.strokeStyle = '#d1dae5'; ctx.lineWidth = 0.8;
  function blob(x,y,w,h) { ctx.beginPath(); ctx.ellipse(x,y,w,h,0,0,Math.PI*2); ctx.fill(); ctx.stroke(); }
  blob(W*0.18,H*0.35,W*0.08,H*0.2); blob(W*0.15,H*0.6,W*0.06,H*0.15);
  blob(W*0.42,H*0.28,W*0.08,H*0.1); blob(W*0.43,H*0.52,W*0.07,H*0.18);
  blob(W*0.62,H*0.3,W*0.12,H*0.15); blob(W*0.7,H*0.55,W*0.1,H*0.06);
  blob(W*0.75,H*0.6,W*0.06,H*0.04); blob(W*0.8,H*0.7,W*0.08,H*0.08);
  ctx.beginPath(); ctx.arc(W*0.73,H*0.58,5,0,Math.PI*2); ctx.fillStyle='#F47D5B'; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
}
