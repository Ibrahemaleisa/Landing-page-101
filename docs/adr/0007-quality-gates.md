# 0007 — Vitest + Playwright + axe + Lighthouse; contrast is a test

**Status:** Accepted · 2026-10-28

## Context

Opera's landing page had no automated tests and shipped contrast and keyboard defects ([audit D6, D7, D15](../research/opera-audit.md)).
Quality claims in this project must be backed by tool output.

## Decision

| Gate        | Tool                                                                                                                                                                                                                                                  | Command             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Types       | `astro check` (TypeScript strict) per package/site                                                                                                                                                                                                    | `pnpm check`        |
| Lint        | ESLint 10 flat config: `typescript-eslint`, `eslint-plugin-astro` + its jsx-a11y rules                                                                                                                                                                | `pnpm lint`         |
| Format      | Prettier + `prettier-plugin-astro`                                                                                                                                                                                                                    | `pnpm format:check` |
| Unit        | Vitest: brand compiler, fluid scale maths, contrast maths, locale helpers, **every reference brand's contrast**                                                                                                                                       | `pnpm test`         |
| Build       | `astro build` for every site                                                                                                                                                                                                                          | `pnpm build`        |
| End-to-end  | Playwright (Chromium) against built sites: axe WCAG 2.2 A/AA, no horizontal overflow at 320/390/768/1440, `lang`/`dir`/`hreflang`, keyboard (skip link, modal menu containment and return, tabs arrows, accordion), reduced motion, no console errors | `pnpm e2e`          |
| Performance | Lighthouse 13 (lab, mobile + desktop, median of 3) recorded to `docs/reports/perf/`                                                                                                                                                                   | `pnpm perf`         |

**Production-readiness thresholds** for a site built on the kit:

- 0 axe violations on every page, locale and viewport tested.
- Lighthouse mobile lab: LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms (TBT is the lab proxy for INP), performance ≥ 90.
- No horizontal overflow at 320 px.
- JavaScript ≤ 15 KB compressed per page unless a section justifies more.

## Consequences

- Firefox and WebKit are not in the automated matrix: Playwright WebKit and Firefox builds are not installed in this
  environment. Recorded as a known limitation.
- Lab numbers are not field data. Field monitoring (CrUX or web-vitals RUM) is on the roadmap.
