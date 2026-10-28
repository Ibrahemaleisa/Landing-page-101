import { describe, expect, it } from "vitest";
import { alternates, defineSite, dirOf, formatNumber, langOf, localeHref, localePaths, unlocalizedPath } from "../src/i18n";

const site = defineSite({
  url: "https://example.sa",
  defaultLocale: "ar",
  locales: {
    ar: { label: "العربية", dir: "rtl", hreflang: "ar-SA" },
    en: { label: "English", dir: "ltr" },
  },
});

describe("defineSite", () => {
  it("rejects a trailing slash or missing origin", () => {
    expect(() => defineSite({ ...site, url: "https://example.sa/" })).toThrow(/absolute origin/);
    expect(() => defineSite({ ...site, url: "example.sa" })).toThrow(/absolute origin/);
  });
});

describe("locale routing", () => {
  it("serves the default locale at the root", () => {
    expect(localePaths(site)).toEqual([
      { params: { locale: undefined }, props: { locale: "ar" } },
      { params: { locale: "en" }, props: { locale: "en" } },
    ]);
  });
  it("builds locale hrefs with trailing slashes", () => {
    expect(localeHref(site, "ar")).toBe("/");
    expect(localeHref(site, "en")).toBe("/en/");
    expect(localeHref(site, "en", "pricing")).toBe("/en/pricing/");
    expect(localeHref(site, "ar", "/pricing/")).toBe("/pricing/");
  });
  it("strips locale prefixes", () => {
    expect(unlocalizedPath(site, "/en/pricing/")).toBe("/pricing/");
    expect(unlocalizedPath(site, "/en/")).toBe("/");
    expect(unlocalizedPath(site, "/pricing")).toBe("/pricing/");
  });
  it("lists hreflang alternates with x-default", () => {
    expect(alternates(site, "/")).toEqual([
      { hreflang: "ar-SA", href: "https://example.sa/" },
      { hreflang: "en", href: "https://example.sa/en/" },
      { hreflang: "x-default", href: "https://example.sa/" },
    ]);
  });
  it("exposes lang and dir", () => {
    expect(langOf(site, "ar")).toBe("ar-SA");
    expect(dirOf(site, "ar")).toBe("rtl");
    expect(dirOf(site, "en")).toBe("ltr");
  });
});

describe("formatNumber", () => {
  it("keeps Western digits in Arabic by default", () => {
    expect(formatNumber("ar", 1250)).toBe("1,250");
  });
  it("can use Eastern Arabic digits", () => {
    expect(formatNumber("ar", 12, { numberingSystem: "arab" })).toBe("١٢");
  });
});
