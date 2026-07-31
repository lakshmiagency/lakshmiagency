'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { DarkModeProvider } from '../context/DarkModeContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <DarkModeProvider>
        {children}
      </DarkModeProvider>
    </AuthProvider>
  );
};
export default Providers;
