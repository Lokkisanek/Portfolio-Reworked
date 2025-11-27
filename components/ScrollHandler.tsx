"use client";

import React, { useEffect } from 'react';
import { useScroll } from '@/components/ScrollContext';

export default function ScrollHandler({ exposeSetter }: { exposeSetter?: boolean }) {
  const { selected: section, setSelected: setSection } = useScroll();

  // optionally expose a global setter for simple event handlers
  useEffect(() => {
    if (exposeSetter) {
      (window as any).__scrollSetSelected = (val: string | null) => setSection(val);
      return () => { (window as any).__scrollSetSelected = undefined; };
    }
  }, [exposeSetter, setSection]);

  useEffect(() => {
    if (!section) return;

    const id = String(section).replace('#', '');
    const el = document.getElementById(id);
    const offset = 72;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      window.location.hash = String(section);
    }

    const t = setTimeout(() => setSection(null), 700);
    return () => clearTimeout(t);
  }, [section, setSection]);

  return null;
}
