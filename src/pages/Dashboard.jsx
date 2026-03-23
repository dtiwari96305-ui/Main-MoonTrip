import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../shared/components/Header';
import { StatCard } from '../shared/components/StatCard';
import { RecentActivityCard } from '../shared/components/RecentActivityCard';
import { FinancialSummaryCard } from '../shared/components/FinancialSummaryCard';
import { TopDestinations } from '../shared/components/TopDestinations';
import { TopCustomersCard } from '../shared/components/TopCustomersCard';
import { QuickActions } from '../components/QuickActions';
import { drawRevenueChart, drawBookingsChart } from '../shared/utils/chartUtils';
import { useDemoData } from '../context/DemoContext';

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

const xAxisLabels = {
  6: ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
  12: ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
  24: ['Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
};

export const Dashboard = ({ onViewChange }) => {
  const revCanvasRef = useRef(null);
  const revTooltipRef = useRef(null);
  const bookCanvasRef = useRef(null);
  const bookTooltipRef = useRef(null);
  const [revMonths, setRevMonths] = useState(6);
  const [bookMonths, setBookMonths] = useState(6);
  const { quotes, bookings, customers } = useDemoData();

  const activeBookingsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'confirmed').length;
  const revenue30d = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + parseInt(String(b.amount).replace(/[₹,\s]/g, '') || 0, 10), 0).toLocaleString('en-IN');

  useEffect(() => {
    const timer = setTimeout(() => {
      drawRevenueChart(revCanvasRef.current, revTooltipRef.current, revMonths, true);
      drawBookingsChart(bookCanvasRef.current, bookTooltipRef.current, bookMonths);
    }, 100);
    const handleResize = () => {
      drawRevenueChart(revCanvasRef.current, revTooltipRef.current, revMonths, false);
      drawBookingsChart(bookCanvasRef.current, bookTooltipRef.current, bookMonths);
    };
    window.addEventListener('resize', handleResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', handleResize); };
  }, [revMonths, bookMonths]);

  const revLabels = xAxisLabels[revMonths] || xAxisLabels[6];
  const bookLabels = xAxisLabels[bookMonths] || xAxisLabels[6];

  return (
    <div id="view-dashboard" className="fade-in">
      
      <div className="dash-section-anim" style={{ animationDelay: '0ms', zIndex: 10 }}>
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your business overview."
          showDateFilter={true}
          onNewQuote={() => onViewChange && onViewChange('create-quote')}
        />
      </div>

      <div className="stat-cards dash-section-anim" style={{ animationDelay: '100ms', zIndex: 9 }}>
        <StatCard 
          label="Total Quotes" value={quotes.length} change="100.0% vs prev" colorVariant="orange"
          onClick={() => onViewChange && onViewChange('quotes')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} 
        />
        <StatCard 
          label="Active Bookings" value={activeBookingsCount} change="100.0% vs prev" colorVariant="blue"
          onClick={() => onViewChange && onViewChange('bookings')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} 
        />
        <StatCard 
          label="Total Revenue" value={revenue30d} prefix="₹" change="100.0% vs prev" colorVariant="green"
          onClick={() => onViewChange && onViewChange('bookings')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>} 
        />
        <StatCard 
          label="Total Customers" value={customers.length} change="100.0% vs prev" colorVariant="purple"
          onClick={() => onViewChange && onViewChange('customers')}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} 
        />
      </div>

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
              <ChartPeriodSelect id="revenuePeriodSelect" onChangeMonths={setRevMonths} />
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-y-axis">
              <span>8.0L</span><span>6.0L</span><span>4.0L</span><span>2.0L</span><span>0.0L</span>
            </div>
            <div className="chart-area">
              <canvas ref={revCanvasRef} width="600" height="220"></canvas>
              <div ref={revTooltipRef} className="chart-tooltip"></div>
            </div>
          </div>
          <div className="chart-x-axis">
            {revLabels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        <RecentActivityCard />
      </div>

      <div className="dashboard-body dash-section-anim" style={{ marginTop: '20px', animationDelay: '300ms', zIndex: 7 }}>
        <div className="revenue-chart-card">
          <div className="chart-header">
            <div className="chart-header-left">
              <h3 className="chart-title">Monthly Bookings</h3>
              <p className="chart-subtitle">Booking volume over last {bookMonths} months</p>
            </div>
            <div className="chart-header-right">
              <ChartPeriodSelect id="bookingsPeriodSelect" onChangeMonths={setBookMonths} />
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-y-axis">
              <span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
            </div>
            <div className="chart-area">
              <canvas ref={bookCanvasRef} width="300" height="150"></canvas>
              <div ref={bookTooltipRef} className="chart-tooltip"></div>
            </div>
          </div>
          <div className="chart-x-axis">
            {bookLabels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>
        <FinancialSummaryCard />
      </div>

      <div className="dash-section-anim" style={{ animationDelay: '400ms' }}>
        <TopDestinations />
      </div>
      <div className="dash-section-anim" style={{ animationDelay: '500ms' }}>
        <TopCustomersCard onViewChange={onViewChange} />
      </div>
      <div className="dash-section-anim" style={{ animationDelay: '600ms' }}>
        <QuickActions onViewChange={onViewChange} />
      </div>
    </div>
  );
};

export default Dashboard;
