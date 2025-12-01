export const supportedLocales: Record<
  string,
  { name: string; native: string }
> = {
  en: { name: "English", native: "English" },
  cs: { name: "Czech", native: "Čeština" },
  de: { name: "German", native: "Deutsch" },
  es: { name: "Spanish", native: "Español" },
  fr: { name: "French", native: "Français" },
  zh: { name: "Chinese", native: "中文" },
  ru: { name: "Russian", native: "Русский" },
  pt: { name: "Portuguese", native: "Português" },
  ar: { name: "Arabic", native: "العربية" },
};

export const defaultLocale = "en";

export function regionToLocale(region: string): string | null {
  const map: Record<string, string> = {
    CZ: "cs",
    SK: "cs",
    DE: "de",
    AT: "de",
    CH: "de",
    US: "en",
    GB: "en",
    IE: "en",
    AU: "en",
    CA: "en",
    FR: "fr",
    ES: "es",
    MX: "es",
    CN: "zh",
    TW: "zh",
    RU: "ru",
    BR: "pt",
    PT: "pt",
    AR: "es",
  };
  return map[region] || null;
}
