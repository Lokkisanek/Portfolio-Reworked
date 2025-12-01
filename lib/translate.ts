import en from '@/locales/en.json';
import cs from '@/locales/cs.json';
import de from '@/locales/de.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import zh from '@/locales/zh.json';
import ru from '@/locales/ru.json';
import pt from '@/locales/pt.json';
import ar from '@/locales/ar.json';
import { defaultLocale } from '@/lib/i18n';

const bundles = {
  en,
  cs,
  de,
  es,
  fr,
  zh,
  ru,
  pt,
  ar,
} as const;

export type LocaleKey = keyof typeof bundles;

export function hasLocaleBundle(locale: string): locale is LocaleKey {
  return Object.prototype.hasOwnProperty.call(bundles, locale);
}

export function t(key: string, locale: string) {
  const bundle = hasLocaleBundle(locale) ? bundles[locale] : bundles[defaultLocale];
  const parts = key.split('.');
  let cur: any = bundle;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return key;
  }
  return typeof cur === 'string' ? cur : key;
}

export const availableLocales = Object.keys(bundles);

export function getLocaleBundle(locale: string) {
  return hasLocaleBundle(locale) ? bundles[locale] : bundles[defaultLocale];
}

