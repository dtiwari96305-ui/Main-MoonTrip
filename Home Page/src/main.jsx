import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🚀 Turidoo main.jsx is executing...');

window.addEventListener('error', (event) => {
  console.error('❌ Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

try {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ React successfully rendered to the DOM.');
} catch (error) {
  console.error('💥 Failed to render React app:', error);
}
