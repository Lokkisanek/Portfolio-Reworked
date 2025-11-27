'use client';

import React from 'react';
import ScrollHandler from '@/components/ScrollHandler';
import { ScrollProvider } from '@/components/ScrollContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <ScrollHandler />
      {children}
    </ScrollProvider>
  );
}
