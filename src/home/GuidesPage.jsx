import Navbar from './components/Navbar';
import AIPowered from './components/AIPowered';
import Footer from './components/Footer';

export default function GuidesPage({ onLogin, onSignUp, onHome, onGuides, isLoggedIn, onDashboard }) {
  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar
        onLogin={onLogin}
        onSignUp={onSignUp}
        onGuides={onGuides}
        onHome={onHome}
        isLoggedIn={isLoggedIn}
        onDashboard={onDashboard}
      />
      <div className="pt-16">
        <AIPowered />
      </div>
      <Footer onSignUp={onSignUp} onLogin={onLogin} />
    </div>
  );
}
