# Testing and quality standards

Decision record: [ADR 0007](adr/0007-quality-gates.md). This page is the working checklist.

## Commands

| Command                                                 | What it proves                                                                                                                                                        |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`                                             | ESLint 10: TypeScript rules, Astro rules, jsx-a11y strict (with documented exceptions for `role="list"` on styled lists and `tabindex` on scrollable regions)         |
| `pnpm format:check`                                     | Prettier formatting                                                                                                                                                   |
| `pnpm check`                                            | `astro check` (TypeScript strict) for the kit and every site, including each site's content parity between locales                                                    |
| `pnpm test`                                             | Vitest: contrast maths against WCAG reference values, fluid-scale maths, brand compiler output, i18n routing helpers, the scaffolder, **every brand's contrast gate** |
| `pnpm build`                                            | Static production build of every site                                                                                                                                 |
| `pnpm e2e`                                              | Playwright + axe against the production builds of every site, in both locales (`E2E_SITES=opera,qitah` to limit)                                                      |
| `pnpm perf` / `node scripts/perf/lighthouse.mjs <urls>` | Lighthouse lab metrics, median of 3 runs, mobile and desktop                                                                                                          |
| `pnpm verify`                                           | lint → check → test → build → e2e                                                                                                                                     |

## What the end-to-end suite asserts (per site × locale)

- **axe-core** WCAG 2.0/2.1/2.2 A and AA rules at 390 px and 1440 px: zero violations.
- `<html lang dir>` match the locale; self-canonical; `hreflang` for every locale plus `x-default`.
- Exactly one `h1`; every image has an `alt` attribute; every `main section` is named; every `aria-labelledby` resolves;
  ids are unique.
- No horizontal overflow at 320, 390, 768, 1024 and 1440 px.
- No console errors, page errors, failed requests or HTTP ≥ 400 responses (after scrolling the whole page).
- Every in-page link (`#…`) points at an element that exists.
- Keyboard: the first Tab focuses the skip link, which moves to `#main`; the mobile menu is modal (focus can't escape
  in 25 Tabs), Esc closes it and returns focus, and `aria-expanded` follows; menu links close the menu and navigate;
  accordions toggle with Enter; tabs move with the arrow key that follows the reading direction, plus Home/End.
- Reduced motion: no running animations.
- Site-specific behaviour: the zero-JS pricing switch (mouse and arrow keys), form validation and focus management
  (Opera brief), the Formula toggle semantics (hover previews, only activation selects).

## Definition of done for a new site

- [ ] `pnpm test` passes, including the site's brand contrast test
- [ ] `astro check` 0 errors, `astro build` succeeds
- [ ] Added to `tests/e2e/sites.ts`; `pnpm e2e` passes with 0 axe violations in every locale
- [ ] Lighthouse mobile lab: LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms, performance ≥ 90 (recorded in `docs/reports/perf/`)
- [ ] Manual checks: screen reader pass (VoiceOver or NVDA) over the hero, menu and forms; 200% zoom; Windows High
      Contrast / forced colours glance; real phone in both locales
- [ ] Sample data, fictional names and simulated features are labelled on the page
- [ ] Every closing section has an action; every form has a real endpoint or says it's a demo

## What automated checks don't cover

axe catches roughly a third of WCAG failures. Not covered automatically: screen reader announcement quality, cognitive
load and copy clarity, logical reading order beyond DOM order, contrast of text over photographs (axe can't compute it
reliably), and Firefox/WebKit rendering (only Chromium is installed in this environment). These need the manual checks
above.
