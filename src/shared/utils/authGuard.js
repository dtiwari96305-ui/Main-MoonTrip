import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthGuard = ({ children }) => {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!checked) {
    return null;
  }

  // If user is in demo mode (no auth required), allow through
  const appMode = sessionStorage.getItem('appMode');
  if (appMode === 'demo') {
    return children;
  }

  if (!authed) {
    // Not authenticated and not demo — clear state and reload to home
    sessionStorage.removeItem('appMode');
    window.location.reload();
    return null;
  }

  return children;
};
