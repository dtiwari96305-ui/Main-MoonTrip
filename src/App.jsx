import React, { useState, useEffect } from 'react';
import { supabase } from './shared/lib/supabase';
import HomePage from './home/HomePage';
import GuidesPage from './home/GuidesPage';
import { SignIn } from './auth/pages/SignIn';
import { SignUp } from './auth/pages/SignUp';
import { ForgotPassword } from './auth/pages/ForgotPassword';
import { DemoRouter } from './demo/routes/DemoRouter';
import { DashboardRouter } from './dashboard/routes/DashboardRouter';
import { clearDemoSession } from './demo/context/DemoContext';
import './index.css';

function App() {
  // Possible modes: null | 'signin' | 'signup' | 'forgot' | 'demo' | 'real'
  const [appMode, setAppMode]       = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);

  /* ── On mount: check existing Supabase session ─────────── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        sessionStorage.setItem('appMode', 'real');
        setAppMode('real');
      } else {
        setIsLoggedIn(false);
        const stored = sessionStorage.getItem('appMode');
        if (stored === 'demo') {
          setAppMode('demo');
        } else {
          setAppMode(null);
        }
      }
      setAuthChecked(true);
    });

    /* Listen for auth state changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        clearDemoSession();
        sessionStorage.removeItem('appMode');
        setAppMode(null);
      }
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
      }
      if (event === 'PASSWORD_RECOVERY') {
        // User landed from reset link — keep them on forgot flow
        setAppMode('forgot');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Navigation helpers ────────────────────────────────── */
  const goTo = (mode) => {
    if (mode === null) {
      sessionStorage.removeItem('appMode');
    } else if (mode === 'demo' || mode === 'real') {
      sessionStorage.setItem('appMode', mode);
    }
    setAppMode(mode);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearDemoSession();
    sessionStorage.removeItem('appMode');
    setIsLoggedIn(false);
    setAppMode(null);
  };

  const handleDemoExit = () => {
    clearDemoSession();
    sessionStorage.removeItem('appMode');
    setAppMode(null);
  };

  /* ── Loading screen ────────────────────────────────────── */
  if (!authChecked) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-inner">
          <div className="auth-loading-spinner" />
          <div className="auth-loading-text">Loading…</div>
        </div>
      </div>
    );
  }

  /* ── Auth pages ────────────────────────────────────────── */
  if (appMode === 'signin') {
    return (
      <SignIn
        onSuccess={() => goTo('real')}
        onSignUp={() => goTo('signup')}
        onForgotPassword={() => goTo('forgot')}
        onDemo={() => goTo('demo')}
      />
    );
  }

  if (appMode === 'signup') {
    return (
      <SignUp
        onSuccess={() => goTo('real')}
        onSignIn={() => goTo('signin')}
        onDemo={() => goTo('demo')}
      />
    );
  }

  if (appMode === 'forgot') {
    return (
      <ForgotPassword
        onBack={() => goTo('signin')}
      />
    );
  }

  /* ── Guides page ────────────────────────────────────────── */
  if (appMode === 'guides') {
    return (
      <GuidesPage
        onLogin={() => goTo('signin')}
        onSignUp={() => goTo('signup')}
        onHome={() => goTo(null)}
        onGuides={() => goTo('guides')}
        isLoggedIn={isLoggedIn}
        onDashboard={() => goTo('real')}
      />
    );
  }

  /* ── Home page (no auth) ───────────────────────────────── */
  if (!appMode) {
    return (
      <HomePage
        onLogin={() => goTo('signin')}
        onSignUp={() => goTo('signup')}
        onDemo={() => goTo('demo')}
        onGuides={() => goTo('guides')}
        isLoggedIn={isLoggedIn}
        onDashboard={() => goTo('real')}
      />
    );
  }

  /* ── Dashboards ────────────────────────────────────────── */
  return (
    <div className={`app-root app-mode-${appMode}`}>
      {appMode === 'demo' && (
        <DemoRouter onSwitchMode={handleDemoExit} />
      )}
      {appMode === 'real' && (
        <DashboardRouter onSwitchMode={handleSignOut} />
      )}
    </div>
  );
}

export default App;
