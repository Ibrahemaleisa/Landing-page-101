import { defineSite } from "@landing/kit/i18n";

export const site = defineSite({
  url: "https://opera.example",
  defaultLocale: "ar",
  locales: {
    ar: { label: "العربية", dir: "rtl", hreflang: "ar", ogLocale: "ar_SA" },
    en: { label: "English", dir: "ltr", ogLocale: "en_US" },
  },
});

export type Locale = keyof typeof site.locales;

/**
 * Verified company facts. Published as-is, so only confirmed details belong here; a `null`
 * field is not rendered (carried over from Opera's own rule).
 */
export const company = {
  name: { ar: "أوبيرا", en: "Opera" },
  country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
  email: null as string | null,
  phone: null as string | null,
  /** Opera's operations workspace (the product), linked from the header. */
  workspaceUrl: "https://app.opera.example/login",
};
