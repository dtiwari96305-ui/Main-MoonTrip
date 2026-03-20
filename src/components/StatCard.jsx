import React, { useState, useEffect } from 'react';

export const StatCard = ({ label, value, change, prefix = '', icon, colorVariant = 'orange', onClick }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  const targetValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  useEffect(() => {
    let startValue = 0;
    const duration = 1000; // 1 second animation
    const stepTime = 20; // 20ms steps
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(startValue));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  const bgClasses = {
    orange: 'stat-quotes',
    blue: 'stat-bookings',
    green: 'stat-revenue',
    purple: 'stat-customers',
  };
  const iconClasses = {
    orange: 'stat-icon-orange',
    blue: 'stat-icon-blue',
    green: 'stat-icon-green',
    purple: 'stat-icon-purple',
  };

  const formattedValue = typeof value === 'string' && value.includes(',') 
    ? Math.floor(displayValue).toLocaleString('en-IN')
    : Math.floor(displayValue);

  return (
    <div 
      className={`stat-card ${bgClasses[colorVariant] || ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div className="stat-card-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{prefix}{formattedValue}</span>
        <span className="stat-change positive">↑ {change}</span>
      </div>
      <div className={`stat-icon-box ${iconClasses[colorVariant] || ''}`}>
        {icon}
      </div>
    </div>
  );
};
