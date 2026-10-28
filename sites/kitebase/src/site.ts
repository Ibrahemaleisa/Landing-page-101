import { defineSite } from "@landing/kit/i18n";

export const site = defineSite({
  url: "https://kitebase.example",
  defaultLocale: "en",
  locales: {
    en: { label: "English", dir: "ltr", ogLocale: "en_US" },
    ar: { label: "العربية", dir: "rtl", ogLocale: "ar_SA" },
  },
});

export type Locale = keyof typeof site.locales;
