import React, { createContext, useContext } from 'react';

const ModeContext = createContext({ mode: 'demo', isDemo: true });

export const ModeProvider = ({ mode, children }) => {
  const value = { mode, isDemo: mode === 'demo' };
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = () => useContext(ModeContext);
