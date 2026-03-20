import React from 'react';
import { TopDemoBanner } from './TopDemoBanner';
import { Sidebar } from './Sidebar';

export const Layout = ({ activeView, onViewChange, children }) => {
  return (
    <>
      <TopDemoBanner />
      <div className="app-layout">
        <Sidebar activeView={activeView} onViewChange={onViewChange} />
        <main className="main-content" id="main-content">
          {children}
        </main>
      </div>
    </>
  );
};
