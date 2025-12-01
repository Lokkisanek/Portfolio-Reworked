"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supportedLocales, defaultLocale, regionToLocale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: string;
  setLocale: (l: string) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(defaultLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("locale");
      if (stored && supportedLocales[stored]) {
        setLocaleState(stored);
        return;
      }

      const nav = (navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language) || defaultLocale;

      const parts = nav.split(/[-_]/);
      const lang = parts[0];
      const region = parts[1] ? parts[1].toUpperCase() : undefined;

      let chosen = defaultLocale;
      if (lang && supportedLocales[lang]) {
        chosen = lang;
      } else if (region) {
        const mapped = regionToLocale(region);
        if (mapped && supportedLocales[mapped]) chosen = mapped;
      }

      setLocaleState(chosen);
      localStorage.setItem("locale", chosen);
    } catch (e) {
      setLocaleState(defaultLocale);
    }
  }, []);

  const setLocale = (l: string) => {
    const safe = supportedLocales[l] ? l : defaultLocale;
    setLocaleState(safe);
    try {
      localStorage.setItem("locale", safe);
    } catch {}
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
