import React, { createContext, useContext, useState } from 'react';
import { DemoModal } from '../components/DemoModal';

const DemoContext = createContext(null);

export const DemoProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerDemoPopup = () => setIsOpen(true);

  return (
    <DemoContext.Provider value={triggerDemoPopup}>
      {children}
      {isOpen && <DemoModal onClose={() => setIsOpen(false)} />}
    </DemoContext.Provider>
  );
};

const noop = () => {};
export const useDemoPopup = () => useContext(DemoContext) || noop;
