/**
 * Locales are URLs: the default locale lives at `/`, the others at `/<code>/` (ADR 0005).
 * One page file renders every locale through `localePaths()`.
 */

export interface LocaleDef {
  /** Name of the language in itself, e.g. "العربية". Used by the language switch. */
  label: string;
  dir: "ltr" | "rtl";
  /** BCP 47 tag for `hreflang` and `lang`. Defaults to the locale code. */
  hreflang?: string;
  /** Open Graph locale, e.g. `ar_SA`. */
  ogLocale?: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteConfig<L extends string = string> {
  /** Absolute origin without trailing slash, e.g. `https://opera.example`. */
  url: string;
  locales: Record<L, LocaleDef>;
  defaultLocale: NoInfer<L>;
}

/** Validates and returns the site config with literal locale types preserved. */
export function defineSite<const L extends string>(site: SiteConfig<L>): SiteConfig<L> {
  if (!/^https?:\/\/[^/]+$/.test(site.url)) {
    throw new Error(`site.url must be an absolute origin without a trailing slash, got "${site.url}"`);
  }
  if (!Object.hasOwn(site.locales, site.defaultLocale)) {
    throw new Error(`defaultLocale "${site.defaultLocale}" is not one of the site's locales`);
  }
  return site;
}

export type LocaleOf<S> = S extends SiteConfig<infer L> ? L : never;

/** A value per locale. */
export type Localized<L extends string, T> = Record<L, T>;

/** `getStaticPaths()` entries for a `[...locale].astro` page. */
export function localePaths<L extends string>(site: SiteConfig<L>) {
  return (Object.keys(site.locales) as L[]).map((locale) => ({
    params: { locale: locale === site.defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

/** Normalises a path to a leading and trailing slash, keeping any ?query or #hash after it. */
const clean = (path: string) => {
  const m = /^([^?#]*)(.*)$/.exec(path)!;
  let p = m[1]!.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = `/${p}`;
  if (p !== "/" && !p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
  return p + m[2];
};

/** Path of `path` in `locale`, e.g. `localeHref(site, "en", "/pricing")` → `/en/pricing/`. */
export function localeHref<L extends string>(site: SiteConfig<L>, locale: L, path = "/"): string {
  const p = clean(path);
  if (locale === site.defaultLocale) return p;
  return `/${locale}${p === "/" ? "/" : p}`;
}

/** Strips the locale prefix: `/en/pricing/` → `/pricing/`. */
export function unlocalizedPath<L extends string>(site: SiteConfig<L>, pathname: string): string {
  const seg = pathname.split("/")[1];
  if (seg && Object.hasOwn(site.locales, seg) && seg !== site.defaultLocale) {
    return clean(pathname.slice(seg.length + 1) || "/");
  }
  return clean(pathname);
}

export function langOf<L extends string>(site: SiteConfig<L>, locale: L): string {
  return site.locales[locale].hreflang ?? locale;
}

export function dirOf<L extends string>(site: SiteConfig<L>, locale: L): "ltr" | "rtl" {
  return site.locales[locale].dir;
}

/** `hreflang` alternates (absolute URLs) including `x-default` → the default locale. */
export function alternates<L extends string>(site: SiteConfig<L>, path = "/") {
  const list = (Object.keys(site.locales) as L[]).map((l) => ({
    hreflang: langOf(site, l),
    href: site.url + localeHref(site, l, path),
  }));
  list.push({ hreflang: "x-default", href: site.url + localeHref(site, site.defaultLocale, path) });
  return list;
}

/**
 * Number formatting that keeps Western (Latin) digits by default, which most Gulf brands use in
 * Arabic UI. Pass `numberingSystem: "arab"` for Eastern Arabic digits.
 */
export function formatNumber(locale: string, value: number, opts: Intl.NumberFormatOptions & { numberingSystem?: string } = {}) {
  const { numberingSystem = "latn", ...rest } = opts;
  return new Intl.NumberFormat(`${locale}-u-nu-${numberingSystem}`, rest).format(value);
}
