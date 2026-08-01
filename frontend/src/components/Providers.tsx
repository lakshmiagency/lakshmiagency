'use client';

import React from 'react';
import { DarkModeProvider } from '../context/DarkModeContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DarkModeProvider>
      {children}
    </DarkModeProvider>
  );
};
export default Providers;
