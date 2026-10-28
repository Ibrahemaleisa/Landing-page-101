import { defineSite } from "@landing/kit/i18n";

export const site = defineSite({
  url: "https://qitah.example",
  defaultLocale: "ar",
  locales: {
    ar: { label: "العربية", dir: "rtl", hreflang: "ar-SA", ogLocale: "ar_SA" },
    en: { label: "English", dir: "ltr", ogLocale: "en_US" },
  },
});

export type Locale = keyof typeof site.locales;
