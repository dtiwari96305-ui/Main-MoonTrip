// Migrated from: HTML/JS logic
import React from 'react';
import { AppRouter } from './routes/AppRouter';
import { DemoProvider } from './context/DemoContext';
import './index.css';

function App() {
  return (
    <DemoProvider>
      <div className="app-root">
        <AppRouter />
      </div>
    </DemoProvider>
  );
}

export default App;
