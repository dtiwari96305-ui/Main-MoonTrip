import React, { useEffect, useRef, useState, useMemo } from 'react';
import { RealHeader as Header } from '../components/RealHeader';
import { StatCard } from '../../shared/components/StatCard';
import { DestinationCard } from '../../shared/components/DestinationCard';
import { useData } from '../context/DataContext';
import { RealIndiaMapD3 } from '../components/RealIndiaMapD3';
import { RealWorldMapD3 } from '../components/RealWorldMapD3';
import { openQuoteDetail } from '../../utils/quoteNav';
import { openBookingDetail } from '../../utils/bookingNav';
import {
  bucketPaymentsByMonth,
  bucketBookingsByMonth,
  drawRealRevenueChart,
  drawRealBookingsChart,
  getRevenueYLabels,
  getBookingsYLabels,
} from '../utils/realChartUtils';
import { QuoteTypeModal } from '../../shared/components/QuoteTypeModal';

// ─── Chart Period Selector (same as demo) ─────────────────────────

const ChartPeriodSelect = ({ id, onChangeMonths }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(6);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSelect = (months) => {
    setSelected(months);
    setOpen(false);
    onChangeMonths(months);
  };

  return (
    <div className={`chart-period-wrapper ${open ? 'open' : ''}`} ref={ref}>
      <div className="chart-period-select" id={id} onClick={() => setOpen(!open)}>
        <span className="selected-period">{selected} months</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div className="chart-dropdown">
        {[6, 12, 24].map(m => (
          <div key={m} className={`chart-dropdown-item ${selected === m ? 'active' : ''}`} onClick={() => handleSelect(m)}>
            {m} months
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Helper: parse amount string ──────────────────────────────────

function parseAmt(str) {
  if (typeof str === 'number') return str;
  return parseInt((str || '0').replace(/[₹,\s]/g, ''), 10) || 0;
}

// ─── Helper: format currency ──────────────────────────────────────

function fmtCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

// ─── Recent Activity: icons & status config ──────────────────────

const raIcons = {
  quotes:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>,
  bookings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>,
};

const raBadge = {
  draft:     { bg: '#f3f4f6', color: '#6b7280' },
  sent:      { bg: '#dbeafe', color: '#2563eb' },
  approved:  { bg: '#dcfce7', color: '#16a34a' },
  converted: { bg: '#f3e8ff', color: '#9333ea' },
  rejected:  { bg: '#fee2e2', color: '#dc2626' },
  confirmed: { bg: '#dcfce7', color: '#16a34a' },
  completed: { bg: '#dcfce7', color: '#16a34a' },
  cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

const statusConfig = {
  draft:     { label: 'Draft',     cls: 'draft' },
  sent:      { label: 'Sent',      cls: 'sent' },
  approved:  { label: 'Approved',  cls: 'converted' },
  converted: { label: 'Converted', cls: 'converted' },
  rejected:  { label: 'Rejected',  cls: 'draft' },
  upcoming:  { label: 'Upcoming',  cls: 'sent' },
  active:    { label: 'Active',    cls: 'converted' },
  completed: { label: 'Completed', cls: 'converted' },
  cancelled: { label: 'Cancelled', cls: 'draft' },
};

// ─── Time-ago helper ──────────────────────────────────────────────

const raTimeAgo = (ms) => {
  if (!ms) return '';
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs  < 24) return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── Main Dashboard Component ─────────────────────────────────────

export const RealDashboard = ({ onViewChange }) => {
  const { customers, quotes, bookings, payments } = useData();

  const revCanvasRef = useRef(null);
  const revTooltipRef = useRef(null);
  const bookCanvasRef = useRef(null);
  const bookTooltipRef = useRef(null);
  const [revMonths, setRevMonths] = useState(6);
  const [bookMonths, setBookMonths] = useState(6);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // ── Computed stats ──────────────────────────────────────────────

  const totalRevenue = useMemo(() => payments.reduce((s, p) => s + parseAmt(p.amount), 0), [payments]);
  const activeBookings = useMemo(() => bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length, [bookings]);
  const approvedQuotes = useMemo(() => quotes.filter(q => q.status === 'approved' || q.status === 'converted').length, [quotes]);
  const conversionRate = useMemo(() => quotes.length > 0 ? ((approvedQuotes / quotes.length) * 100).toFixed(1) : '0.0', [quotes, approvedQuotes]);
  const pendingPayments = useMemo(() => {
    const bookingTotal = bookings.reduce((s, b) => s + parseAmt(b.amount), 0);
    const paid = totalRevenue;
    return Math.max(0, bookingTotal - paid);
  }, [bookings, totalRevenue]);

  // ── Recent Activity (quotes + bookings only, newest first) ─────

  const recentActivity = useMemo(() => {
    const items = [];

    quotes.forEach(q => {
      const sc = statusConfig[q.status] || { label: q.status || 'Draft', cls: 'draft' };
      const sortTime = q.raw?.created_at ? new Date(q.raw.created_at).getTime()
        : q.createdDate ? new Date(q.createdDate.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$2 $1, $3')).getTime() : 0;
      items.push({
        key: q.uuid || q.id,
        type: 'quotes',
        refLabel: q.quoteNumber || q.id,
        amount: q.amount || '₹0',
        badge: sc.cls,
        badgeLabel: sc.label,
        customer: q.customerName || '',
        colorClass: 'ai-blue',
        sortTime,
      });
    });

    bookings.forEach(b => {
      const sortTime = b.raw?.created_at ? new Date(b.raw.created_at).getTime()
        : b.date ? new Date(b.date.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$2 $1, $3')).getTime() : 0;
      items.push({
        key: b.uuid || b.id,
        type: 'bookings',
        refLabel: b.bookingNumber || b.id,
        amount: b.amount || '₹0',
        badge: null,
        badgeLabel: null,
        customer: b.customerName || '',
        colorClass: 'ai-green',
        sortTime,
      });
    });

    items.sort((a, b) => b.sortTime - a.sortTime);
    return items.slice(0, 10);
  }, [quotes, bookings]);

  // ── Chart data ──────────────────────────────────────────────────

  const revData = useMemo(() => bucketPaymentsByMonth(payments, revMonths), [payments, revMonths]);
  const bookData = useMemo(() => bucketBookingsByMonth(bookings, bookMonths), [bookings, bookMonths]);
  const revYLabels = useMemo(() => getRevenueYLabels(revData.revenue), [revData.revenue]);
  const bookYLabels = useMemo(() => getBookingsYLabels(bookData.data), [bookData.data]);

  // ── Draw charts ─────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      drawRealRevenueChart(revCanvasRef.current, revTooltipRef.current, revData.labels, revData.revenue, revData.profit, true);
      drawRealBookingsChart(bookCanvasRef.current, bookTooltipRef.current, bookData.labels, bookData.data);
    }, 100);
    const handleResize = () => {
      drawRealRevenueChart(revCanvasRef.current, revTooltipRef.current, revData.labels, revData.revenue, revData.profit, false);
      drawRealBookingsChart(bookCanvasRef.current, bookTooltipRef.current, bookData.labels, bookData.data);
    };
    window.addEventListener('resize', handleResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', handleResize); };
  }, [revData, bookData]);

  // ── Top customers ───────────────────────────────────────────────

  const topCustomers = useMemo(() => {
    const totals = {};
    const bookingCounts = {};
    payments.forEach(p => {
      const name = p.customerName;
      if (!name) return;
      totals[name] = (totals[name] || 0) + parseAmt(p.amount);
    });
    bookings.forEach(b => {
      const name = b.customerName;
      if (!name) return;
      bookingCounts[name] = (bookingCounts[name] || 0) + 1;
    });
    return customers
      .map(c => ({ ...c, totalRevenue: totals[c.name] || 0, bookingCount: bookingCounts[c.name] || 0 }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3);
  }, [customers, payments, bookings]);

  const gradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
  ];

  // ── Destinations ────────────────────────────────────────────────

  const { domesticDests, internationalDests } = useMemo(() => {
    const domestic = {};
    const international = {};

    // Aggregate from bookings
    bookings.forEach(b => {
      if (!b.destination) return;
      const amt = parseAmt(b.amount);
      const type = (b.destType || '').toLowerCase();
      const bucket = type === 'international' ? international : domestic;
      if (!bucket[b.destination]) {
        bucket[b.destination] = { name: b.destination, trips: 0, revenue: 0 };
      }
      bucket[b.destination].trips += 1;
      bucket[b.destination].revenue += amt;
    });

    // Also check quotes with destType
    quotes.forEach(q => {
      if (!q.destName) return;
      const type = (q.destType || '').toLowerCase();
      const bucket = type === 'international' ? international : domestic;
      if (!bucket[q.destName]) {
        bucket[q.destName] = { name: q.destName, trips: 0, revenue: 0 };
      }
      // Don't double count trips, just ensure entry exists
    });

    const sortAndRank = (obj) => Object.values(obj)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((d, i) => ({
        rank: i + 1,
        name: d.name,
        meta: `${d.trips} trip${d.trips !== 1 ? 's' : ''} · ${fmtCurrency(d.revenue)}`,
      }));

    return {
      domesticDests: sortAndRank(domestic),
      internationalDests: sortAndRank(international),
    };
  }, [bookings, quotes]);

  // ──────────────────────────────────────────────────────────────────

  return (
    <div id="view-dashboard" className="fade-in">

      <div className="dash-section-anim" style={{ animationDelay: '0ms', zIndex: 10 }}>
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your business overview."
          showDateFilter={true}
          onNewQuote={() => setShowTypeModal(true)}
        />
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="stat-cards dash-section-anim" style={{ animationDelay: '100ms', zIndex: 9 }}>
        <StatCard
          label="Total Quotes" value={quotes.length} change={quotes.length > 0 ? `${quotes.length} total` : 'No quotes yet'} colorVariant="orange"
          onClick={() => onViewChange && onViewChange('quotes')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard
          label="Active Bookings" value={activeBookings} change={bookings.length > 0 ? `${bookings.length} total` : 'No bookings yet'} colorVariant="blue"
          onClick={() => onViewChange && onViewChange('bookings')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          label="Revenue (30d)" value={totalRevenue > 0 ? fmtCurrency(totalRevenue).slice(1) : '0'} prefix="₹" change={totalRevenue > 0 ? 'All time' : 'No payments yet'} colorVariant="green"
          onClick={() => onViewChange && onViewChange('payments')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
        />
        <StatCard
          label="Total Customers" value={customers.length} change={customers.length > 0 ? `${customers.length} total` : 'No customers yet'} colorVariant="purple"
          onClick={() => onViewChange && onViewChange('customers')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </div>

      {/* ── Revenue Chart + Recent Activity ────────────────────── */}
      <div className="dashboard-body dash-section-anim" style={{ animationDelay: '200ms', zIndex: 8 }}>
        <div className="revenue-chart-card">
          <div className="chart-header">
            <div className="chart-header-left">
              <h3 className="chart-title">Revenue Overview</h3>
              <p className="chart-subtitle">Last {revMonths} months performance</p>
            </div>
            <div className="chart-header-right">
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot revenue-dot"></span> Revenue</span>
                <span className="legend-item"><span className="legend-dot profit-dot"></span> Profit</span>
              </div>
              <ChartPeriodSelect id="realRevenuePeriodSelect" onChangeMonths={setRevMonths} />
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-y-axis">
              {revYLabels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <div className="chart-area">
              <canvas ref={revCanvasRef} width="600" height="220"></canvas>
              <div ref={revTooltipRef} className="chart-tooltip"></div>
            </div>
          </div>
          <div className="chart-x-axis">
            {revData.labels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        {/* Recent Activity — quotes & bookings only, demo-identical format */}
        <div className="recent-activity-card">
          <div className="activity-header">
            <h3 className="activity-title">Recent Activity</h3>
            <p className="activity-subtitle">Latest quotes and bookings</p>
          </div>
          <div className="activity-list" id="recentActivityList">
            {recentActivity.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No recent activity yet
              </div>
            ) : (
              recentActivity.map(item => {
                const bs = item.badge ? (raBadge[item.badge] || raBadge.draft) : null;
                return (
                  <div
                    key={item.key}
                    className="activity-item"
                    onClick={() => item.type === 'quotes' ? openQuoteDetail(item.key, 'dashboard') : openBookingDetail(item.key, 'dashboard')}
                  >
                    <div className={`activity-icon-wrap ${item.colorClass}`}>
                      {raIcons[item.type]}
                    </div>
                    <div className="activity-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                        <span className="activity-ref">{item.refLabel}</span>
                        {bs && (
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: '2px 8px', borderRadius: 20,
                            background: bs.bg, color: bs.color,
                            textTransform: 'capitalize', flexShrink: 0,
                          }}>
                            {item.badgeLabel}
                          </span>
                        )}
                      </div>
                      {item.customer && (
                        <div className="activity-customer" style={{ marginTop: 2 }}>{item.customer}</div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {item.amount && <div className="activity-amount">{item.amount}</div>}
                      <div className="activity-date" style={{ marginTop: 2 }}>{raTimeAgo(item.sortTime)}</div>
                    </div>
                    <div className="activity-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Monthly Bookings Chart + Financial Summary ─────────── */}
      <div className="dashboard-body dash-section-anim" style={{ marginTop: '20px', animationDelay: '300ms', zIndex: 7 }}>
        <div className="revenue-chart-card">
          <div className="chart-header">
            <div className="chart-header-left">
              <h3 className="chart-title">Monthly Bookings</h3>
              <p className="chart-subtitle">Booking volume over last {bookMonths} months</p>
            </div>
            <div className="chart-header-right">
              <ChartPeriodSelect id="realBookingsPeriodSelect" onChangeMonths={setBookMonths} />
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-y-axis">
              {bookYLabels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <div className="chart-area">
              <canvas ref={bookCanvasRef} width="300" height="150"></canvas>
              <div ref={bookTooltipRef} className="chart-tooltip"></div>
            </div>
          </div>
          <div className="chart-x-axis">
            {bookData.labels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="financial-summary-card">
          <div className="fs-header">
            <h3 className="fs-title">Financial Summary</h3>
            <p className="fs-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>All-time business overview</p>
          </div>
          <div className="fs-items">
            <div className="fs-item">
              <div className="fs-icon-wrap fs-icon-orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="fs-info">
                <span className="fs-label">Total Revenue</span>
                <span className="fs-value">{fmtCurrency(totalRevenue)}</span>
              </div>
            </div>
            <div className="fs-item">
              <div className="fs-icon-wrap fs-icon-blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </div>
              <div className="fs-info">
                <span className="fs-label">Total Profit</span>
                <span className="fs-value">{fmtCurrency(0)}</span>
              </div>
            </div>
            <div className="fs-item">
              <div className="fs-icon-wrap fs-icon-yellow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="fs-info">
                <span className="fs-label">Pending Payments</span>
                <span className="fs-value">{fmtCurrency(pendingPayments)}</span>
              </div>
            </div>
            <div className="fs-item">
              <div className="fs-icon-wrap fs-icon-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div className="fs-info">
                <span className="fs-label">Quote Conversion</span>
                <span className="fs-value">{conversionRate}%</span>
                <span className="fs-sub">{approvedQuotes} of {quotes.length} quotes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Destinations ───────────────────────────────────── */}
      <div className="dash-section-anim" style={{ animationDelay: '400ms' }}>
        <div className="destinations-row">
          <DestinationCard
            title="Top Domestic Destinations"
            subtitle={domesticDests.length > 0 ? `${domesticDests.length} destination${domesticDests.length !== 1 ? 's' : ''}` : 'No data yet'}
            iconClass="dest-icon-red"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
            mapContent={<RealIndiaMapD3 destinations={domesticDests} />}
            destinations={domesticDests.length > 0 ? domesticDests : [{ rank: 1, name: 'No destinations yet', meta: 'Add bookings to see data' }]}
          />
          <DestinationCard
            title="Top International Destinations"
            subtitle={internationalDests.length > 0 ? `${internationalDests.length} destination${internationalDests.length !== 1 ? 's' : ''}` : 'No data yet'}
            iconClass="dest-icon-blue"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
            mapContent={<RealWorldMapD3 destinations={internationalDests} />}
            wideMap
            destinations={internationalDests.length > 0 ? internationalDests : [{ rank: 1, name: 'No destinations yet', meta: 'Add bookings to see data' }]}
          />
        </div>
      </div>

      {/* ── Top Customers ──────────────────────────────────────── */}
      <div className="dash-section-anim" style={{ animationDelay: '500ms' }}>
        <div className="top-customers-card">
          <div className="tc-header">
            <div className="tc-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h3 className="tc-title">Top Customers</h3>
              <p className="tc-subtitle">By revenue generated</p>
            </div>
          </div>
          {topCustomers.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              No customers yet. Add customers to see rankings.
            </div>
          ) : (
            <table className="tc-table">
              <thead>
                <tr>
                  <th className="tc-th-rank">#</th>
                  <th className="tc-th-customer">CUSTOMER</th>
                  <th className="tc-th-bookings">BOOKINGS</th>
                  <th className="tc-th-revenue">REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, idx) => {
                  const initials = (c.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <tr key={c.id}>
                      <td className="tc-rank">{idx + 1}</td>
                      <td className="tc-customer">
                        <div className="tc-avatar" style={{ background: gradients[idx % gradients.length] }}>{initials}</div>
                        <div className="tc-customer-info">
                          <span className="tc-customer-name">{c.name}</span>
                          <span className="tc-customer-id">{c.id}</span>
                        </div>
                      </td>
                      <td className="tc-bookings">{c.bookingCount}</td>
                      <td className="tc-revenue">{fmtCurrency(c.totalRevenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <button className="tc-view-all-btn" onClick={() => onViewChange && onViewChange('customers')}>
            View All
          </button>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <div className="dash-section-anim" style={{ animationDelay: '600ms' }}>
        <div className="quick-actions">
          <div className="quick-action-card" onClick={() => onViewChange && onViewChange('create-quote')} style={{ cursor: 'pointer' }}>
            <div className="qa-icon-wrap qa-icon-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="qa-text">
              <span className="qa-title">Create Quote</span>
              <span className="qa-desc">Start a new travel quotation</span>
            </div>
            <div className="qa-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <div className="quick-action-card" onClick={() => onViewChange && onViewChange('customers')} style={{ cursor: 'pointer' }}>
            <div className="qa-icon-wrap qa-icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>
            </div>
            <div className="qa-text">
              <span className="qa-title">Add Customer</span>
              <span className="qa-desc">Register a new customer</span>
            </div>
            <div className="qa-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <div className="quick-action-card" onClick={() => onViewChange && onViewChange('bookings')} style={{ cursor: 'pointer' }}>
            <div className="qa-icon-wrap qa-icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div className="qa-text">
              <span className="qa-title">View Bookings</span>
              <span className="qa-desc">Track active bookings</span>
            </div>
            <div className="qa-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      {showTypeModal && (
        <QuoteTypeModal
          onClose={() => setShowTypeModal(false)}
          onContinue={(type) => {
            setShowTypeModal(false);
            onViewChange && onViewChange('create-quote', { quoteType: type });
          }}
        />
      )}
    </div>
  );
};
