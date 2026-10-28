# Known limitations and technical debt

Stated plainly so nobody discovers them in production.

## Verification gaps

| Gap                                                                                                                                                  | Impact                                                                                                                                                                                                           | Mitigation / plan                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Only Chromium is tested.** Playwright's Firefox and WebKit builds aren't installed in the build environment.                                       | Rendering or behaviour differences in Safari/Firefox are unverified. Known by design: Firefox shows no scroll-driven reveals (content is static, by design); `<details name>` exclusivity needs a 2024+ browser. | Add Firefox/WebKit to CI (roadmap 2). Test on a real iPhone (Safari) before launch.                                                                         |
| **No screen reader testing.** Accessibility evidence is axe (0 violations), scripted keyboard tests and an independent scripted audit.               | Announcement quality, verbosity and reading order in VoiceOver/NVDA/TalkBack are unverified.                                                                                                                     | Manual pass per the [definition of done](quality.md#definition-of-done-for-a-new-site).                                                                     |
| **Performance numbers are lab data** from Lighthouse on one container, against a local static server (no CDN, no network latency beyond simulation). | Real-world LCP will be higher, especially on cold caches. INP isn't measured at all.                                                                                                                             | Field RUM (roadmap 4). The before/after comparison with Opera's Next.js build used the same machine and method, so the _relative_ difference is meaningful. |
| **No real-device testing.** Mobile layouts were verified with emulated viewports (320–1440 px).                                                      | Touch, safe areas and on-screen keyboards with forms are untested on hardware.                                                                                                                                   | Device pass before launch.                                                                                                                                  |

## Product gaps

- **Forms don't send anything.** Opera's brief uses `demo` mode and says so on the page. A real endpoint (with
  server-side validation and spam protection) is a per-site integration.
- **Qitah's part finder** submits a GET to `#results` on the static page. It demonstrates the interaction; real search
  needs the marketplace API. Without JavaScript the model list shows every make's models (grouped by make) rather than
  only the chosen make's.
- **Opera uses stand-ins for licensed assets.** IBM Plex Sans Arabic replaces Thmanyah Sans (licence forbids
  redistribution); the logo geometry is the generated construction from the Opera repository, not official artwork.
  Contact details are absent because none are verified in Opera's source (they are `null` there).
- **Placeholder external URLs.** `https://app.opera.example/login` and `https://merchants.qitah.example/` stand in for
  real product URLs and must be configured per deployment.
- **Kitebase is fictional**, as are its customers, quotes and prices. All are labelled as such on the page.
- **No per-page Open Graph images.** `BaseLayout` accepts one; none of the reference sites supply a 1200×630 image yet.
- **Single page per site.** Multi-page sites work (`localeHref(site, locale, "/pricing/")` and `path` on `BaseLayout`),
  but no reference site exercises them, and there is no generated sitemap yet (`@astrojs/sitemap` can be added per site).

## Technical debt

- **The kit is consumed as source inside the monorepo**; it isn't published (roadmap 1).
- **Signature styling sometimes reaches into kit class names** from the `site` layer (e.g. Kitebase restyles
  `.lk-sh`, Qitah styles `.lk-eyebrow` as chips). It's deliberate and layered, but those class names are now a public API
  and need semver discipline.
- **`SiteHeader` uses a fixed `id="lk-mnav"`**, so a page supports one header (normal for landing pages).
- **Locale-specific tone values aren't supported**: tones are per brand, typography is per locale.
- **Section components are content-agnostic but not CMS-ready**: there is no JSON schema for page composition yet
  (roadmap 11).
- **Astro's font API** generates fallbacks without a `unicode-range`, which forced the bilingual-stack rule in the brand
  guide. If Astro adds range-aware fallbacks, the rule can be relaxed.
- **The scaffolder** ships starter content for `en` and `ar` only.
