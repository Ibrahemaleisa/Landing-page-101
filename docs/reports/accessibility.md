# Accessibility report

Target: WCAG 2.2 AA. Engine: Chromium (Playwright 1.63). Date: 2026-10-28.

## Evidence

| Check                                       | Scope                                                                                                                                                                                                                | Result                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| axe-core 4.14, WCAG 2.0/2.1/2.2 A + AA tags | Opera, Qitah, Kitebase × 2 locales × 390 and 1440 px (24 scans)                                                                                                                                                      | **0 violations**           |
| axe-core, studio                            | Studio shell (ar, en) + all 10 presets × 2 locales (22 scans)                                                                                                                                                        | **0 violations**           |
| Contrast gate (unit tests)                  | Every tone of 3 reference brands and 10 studio palettes; 16 required pairs per tone                                                                                                                                  | **all pass**               |
| Scripted keyboard tests                     | Skip link, modal mobile menu (containment, Esc, focus return, focus to chosen section), tabs (RTL arrows, Home/End), accordions, pricing radios, form validation and focus, Formula toggle                           | **all pass**               |
| Reflow                                      | 320, 390, 768, 1024, 1440 px, every page; 320 and 390 px for every studio preset                                                                                                                                     | **no horizontal overflow** |
| Reduced motion                              | Every site                                                                                                                                                                                                           | **no running animations**  |
| Independent scripted audit                  | All six reference pages, 320–1280 px: tab order, focus visibility (pixel diff of every tab stop, 32–45 stops per page), names and roles, text spacing, zoom, target size, RTL, colour-only meaning, text over photos | see below                  |

## Baseline: Opera's current site (before)

axe found `color-contrast` (section numbers at `/55` opacity, footer at `/45`) and `scrollable-region-focusable` (the
swipe gallery). Manual checks found focus escaping the open mobile menu, and both languages sharing one URL with no
`hreflang`. See the [Opera audit](../research/opera-audit.md).

## Independent audit findings and their disposition

| #   | Finding (SC)                                                                                                        | Where                       | Status                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Choosing a link in the mobile menu returned focus to the menu button; the next Tab scrolled back to the top (2.4.3) | Kit `SiteHeader`, all sites | **Fixed.** Focus now moves to the chosen section; an e2e assertion covers it                                                     |
| 2   | Arabic home-link name doesn't contain the visible Latin wordmark "Opera" (2.5.3)                                    | `sites/opera`               | **Open — not changed by request** (Opera is reference-only). One-line fix: make `ui.home` "Opera — الصفحة الرئيسية"              |
| 3   | A `<figcaption>` nested inside a `div` instead of its `<figure>` (1.3.1)                                            | `sites/opera` BuildToDay    | **Open — not changed by request.** Fix: move the caption up one level                                                            |
| 4   | With text-spacing overrides at 320 px, no-wrap buttons widened their column and clipped text (1.4.12 + 1.4.10)      | Kit `Button`                | **Fixed.** Labels may wrap (balanced)                                                                                            |
| 5   | Error marker "!" from CSS `::before` was read as part of the error                                                  | Kit `Field`                 | **Fixed** (`content: "!" / ""`)                                                                                                  |
| 6   | "Name(required)" read without a space                                                                               | Kit `Field`                 | **Fixed**                                                                                                                        |
| 7   | Language `<nav>` nested inside the menu `<nav>`                                                                     | Kit `SiteHeader`            | **Fixed**                                                                                                                        |
| 8   | Full-bleed scroller's focus ring partly off-screen                                                                  | Kit `Scroller`              | **Fixed** (inset ring)                                                                                                           |
| 9   | Labels and badges as small as 9.5 px                                                                                | Kit                         | **Fixed**: 12 px floor for eyebrows, badges, table headers, step and price tags                                                  |
| 10  | Latin comma between role and company on Arabic pages                                                                | Kit `Testimonials`          | **Fixed**: `separator` prop, "، " on Arabic pages                                                                                |
| 11  | Placeholder links that go to unrelated sections ("Book a demo" → its own section)                                   | Kitebase, Qitah             | **Partly fixed** (Kitebase "Book a demo"). Remaining placeholders are documented in [known limitations](../known-limitations.md) |
| 12  | Part-finder fieldset named like the whole form                                                                      | Qitah                       | **Fixed**: legend "سيارتك" / "Your car"                                                                                          |
| 13  | Fluid display headings grow only ~1.3× at 200% browser zoom (1.4.4 advisory)                                        | Kit fluid scale             | **Open.** Body text scales ~2×; headings reach 2× at higher zoom. A rem-weighted preferred value is on the roadmap               |
| 14  | Formula: long button names, hint on the list not the buttons, live region repeats the pressed state                 | `sites/opera`               | **Open — not changed by request**                                                                                                |

Passed in the audit: skip link; tab order in RTL and LTR; no focus obscured by sticky headers (2.4.11); focus visible
with ≥ 3:1 change on every tab stop on every ground (median 7–17:1); native modal menu; tabs; pricing radios; accordions;
form errors and focus; landmarks and single H1; `lang`/`hreflang` on language links; alt text; reflow; target sizes
(smallest 32 px tall); reduced motion; text over photos and gradients; RTL mirroring and LTR isolation; no colour-only
meaning.

## Not tested

Screen readers (VoiceOver, NVDA, TalkBack), Firefox and Safari, Windows forced colours, real devices. See
[known limitations](../known-limitations.md).
