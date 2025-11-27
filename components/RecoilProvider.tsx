'use client';

import React from 'react';
import ScrollHandler from '@/components/ScrollHandler';
import { ScrollProvider } from '@/components/ScrollContext';

export default function RecoilProvider({ children }: { children: React.ReactNode }) {
  // Keep the component name for backwards compatibility where it might be referenced.
  return (
    <ScrollProvider>
      <ScrollHandler exposeSetter />
      {children}
    </ScrollProvider>
  );
}
