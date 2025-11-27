'use client';

import React, { createContext, useContext, useState } from 'react';

type ScrollContextType = {
  selected: string | null;
  setSelected: (v: string | null) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <ScrollContext.Provider value={{ selected, setSelected }}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScroll must be used inside ScrollProvider');
  return ctx;
}

export default ScrollContext;
