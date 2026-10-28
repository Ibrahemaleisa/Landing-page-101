import { defineSite } from "@landing/kit/i18n";

export const site = defineSite({
  url: "https://studio.example",
  defaultLocale: "ar",
  locales: {
    ar: { label: "العربية", dir: "rtl", ogLocale: "ar_SA" },
    en: { label: "English", dir: "ltr", ogLocale: "en_US" },
  },
});

export type Locale = keyof typeof site.locales;
