/** The reference sites under test, their preview ports and locale routes. */
export interface SiteUnderTest {
  name: string;
  port: number;
  locales: { path: string; lang: string; dir: "ltr" | "rtl" }[];
}

const ALL: SiteUnderTest[] = [
  {
    name: "opera",
    port: 4321,
    locales: [
      { path: "/", lang: "ar", dir: "rtl" },
      { path: "/en/", lang: "en", dir: "ltr" },
    ],
  },
  {
    name: "qitah",
    port: 4322,
    locales: [
      { path: "/", lang: "ar", dir: "rtl" },
      { path: "/en/", lang: "en", dir: "ltr" },
    ],
  },
  {
    name: "kitebase",
    port: 4323,
    locales: [
      { path: "/", lang: "en", dir: "ltr" },
      { path: "/ar/", lang: "ar", dir: "rtl" },
    ],
  },
];

/** `E2E_SITES=opera,kitebase` limits the run to some sites. */
const only = process.env.E2E_SITES?.split(",");
export const SITES = only ? ALL.filter((s) => only.includes(s.name)) : ALL;

export const url = (s: SiteUnderTest, path: string) => `http://localhost:${s.port}${path}`;

/** Every (site, locale) pair, for parameterised tests. */
export const PAGES = SITES.flatMap((site) => site.locales.map((locale) => ({ site, locale, id: `${site.name} ${locale.lang}` })));
