import React from 'react';
import { DestinationCard } from './DestinationCard';
import { IndiaMapD3 } from './IndiaMapD3';
import { WorldMapD3 } from './WorldMapD3';

export const TopDestinations = () => (
  <div className="destinations-row">
    <DestinationCard
      title="Top Domestic Destinations"
      subtitle="2 destinations"
      iconClass="dest-icon-red"
      icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
      mapContent={<IndiaMapD3 />}
      destinations={[
        { rank: 1, name: 'Goa', meta: '1 trip · ₹4,69,900' },
        { rank: 2, name: 'Srinagar - Gulmarg - ...', meta: '1 trip · ₹1,56,880' },
      ]}
    />
    <DestinationCard
      title="Top International Destinations"
      subtitle="1 destination"
      iconClass="dest-icon-blue"
      icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
      mapContent={<WorldMapD3 />}
      wideMap
      destinations={[
        { rank: 1, name: 'Bali, Indonesia', meta: '1 trip · ₹1,40,952' },
      ]}
    />
  </div>
);
