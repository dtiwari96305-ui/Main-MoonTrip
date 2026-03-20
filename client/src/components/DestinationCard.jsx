import React from 'react';

export const DestinationCard = ({ title, subtitle, iconClass, icon, canvasRef, destinations }) => {
  const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

  return (
    <div className="destination-card">
      <div className="dest-header">
        <div className={`dest-icon-wrap ${iconClass}`}>{icon}</div>
        <div className="dest-header-text">
          <h3 className="dest-title">{title}</h3>
          <p className="dest-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="dest-body">
        <div className="dest-map-area">
          <canvas ref={canvasRef} width="280" height="280"></canvas>
        </div>
        <div className="dest-list">
          <span className="dest-list-label">TOP DESTINATIONS</span>
          {destinations.map((d, i) => (
            <div key={i} className="dest-list-item">
              <span className={`dest-rank ${rankClasses[d.rank - 1] || ''}`}>{d.rank}</span>
              <div className="dest-info">
                <span className="dest-name">{d.name}</span>
                <span className="dest-meta">{d.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
