'use client';

import React from 'react';
import { DarkModeProvider } from '../context/DarkModeContext';
import { EnquiryProvider } from '../context/EnquiryContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DarkModeProvider>
      <EnquiryProvider>
        {children}
      </EnquiryProvider>
    </DarkModeProvider>
  );
};
export default Providers;
