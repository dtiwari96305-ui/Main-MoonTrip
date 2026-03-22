import React, { useState } from 'react';
import { LandingScreen } from './pages/LandingScreen';
import { DemoRouter } from './demo/routes/DemoRouter';
import { DashboardRouter } from './dashboard/routes/DashboardRouter';
import './index.css';

function App() {
  const [appMode, setAppMode] = useState(() => sessionStorage.getItem('appMode') || null);

  const handleSelectMode = (mode) => {
    sessionStorage.setItem('appMode', mode);
    setAppMode(mode);
  };

  const handleSwitchMode = () => {
    sessionStorage.removeItem('appMode');
    setAppMode(null);
  };

  if (!appMode) {
    return <LandingScreen onSelectMode={handleSelectMode} />;
  }

  return (
    <div className={`app-root app-mode-${appMode}`}>
      {appMode === 'demo' && <DemoRouter onSwitchMode={handleSwitchMode} />}
      {appMode === 'real' && <DashboardRouter onSwitchMode={handleSwitchMode} />}
    </div>
  );
}

export default App;
