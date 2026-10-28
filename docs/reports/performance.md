# Performance report

Lighthouse 13.6 lab measurements: median of 3 runs per page and form factor, simulated throttling (mobile: Moto G
class, slow 4G). Production builds served locally by `astro preview` (Opera's baseline by `next start`) on the same
container. Raw data: [`perf/opera-baseline.json`](perf/opera-baseline.json), [`perf/final.json`](perf/final.json).
Reproduce with `node scripts/perf/lighthouse.mjs <urls…>`.

## Before and after: Opera

| Mobile               | Opera today (Next.js)                      | Opera on Landing Kit       |
| -------------------- | ------------------------------------------ | -------------------------- |
| Performance score    | 79                                         | **100**                    |
| LCP                  | 5,442 ms                                   | **910 ms**                 |
| CLS                  | 0.000                                      | 0.000                      |
| TBT                  | 80 ms                                      | **0 ms**                   |
| JavaScript           | 260 KB                                     | **< 1 KB gzipped, inline** |
| Cache-Control on `/` | `private, no-store` (rendered per request) | static file, CDN-cacheable |

Same machine, same tool, same method. The pages are not byte-identical (the new one adds a project-brief form and the
same field photos at responsive AVIF/WebP sizes), so read this as "same content, different architecture".

## All pages (final run)

| Page                            | Mobile perf | Mobile LCP | CLS (max)       | TBT (mobile) | Transfer |
| ------------------------------- | ----------- | ---------- | --------------- | ------------ | -------- |
| Opera `/` (ar)                  | 100         | 910 ms     | 0.000           | 0 ms         | 424 KB   |
| Opera `/en/`                    | 100         | 908 ms     | 0.000           | 0 ms         | 247 KB   |
| Qitah `/` (ar)                  | 100         | 1,042 ms   | 0.000           | 20 ms        | 243 KB   |
| Qitah `/en/`                    | 100         | 914 ms     | 0.000           | 0 ms         | 112 KB   |
| Kitebase `/` (en)               | 100         | 753 ms     | 0.000           | 0 ms         | 81 KB    |
| Kitebase `/ar/`                 | 100         | 754 ms     | 0.021 (desktop) | 23 ms        | 104 KB   |
| Studio preview `/preview/` (ar) | 99          | 2,257 ms   | 0.001           | 0 ms         | 216 KB   |
| Studio preview `/en/preview/`   | 100         | 1,507 ms   | 0.001           | 0 ms         | 84 KB    |

Accessibility and SEO scored 100 on every reference page. The studio preview scores SEO 63 by design: it is `noindex`.

Notes:

- **JavaScript.** The reference sites ship 0.3–0.9 KB of gzipped script per page, inlined by Astro (menu, tabs, form
  validation, Opera's formula). Lighthouse reports it as 0 KB of script files. The studio preview ships 11 KB: it
  compiles brands in the browser with the kit's own `compileBrand()`.
- **Arabic pages weigh more** because they load an Arabic face as well as the Latin face for digits and Latin words.
  Opera's Arabic page is the heaviest because of its photographs plus two font families.
- **Kitebase Arabic CLS 0.021** (desktop) comes from the Readex Pro swap. Arabic-only faces are registered without
  metric fallbacks (they must not catch Latin glyphs), so their swap can shift text slightly. It is well under the 0.1
  threshold.
- **Studio preview LCP** is higher because the default style's figure is a large HTML mock and all 23 font families are
  registered (each downloads only when used). It is a private tool, not a public page.

## Thresholds (ADR 0007)

LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms, performance ≥ 90 on mobile: **met by every page**, studio included.

## Not measured

INP and other field metrics (they need real users: roadmap item 4), CDN and real-network conditions, cold DNS/TLS.
