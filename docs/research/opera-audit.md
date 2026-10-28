# Opera landing page audit

**Subject:** the public corporate site in `Ibrahemaleisa/Opera-OS` (`src/app/(site)/**`, `src/components/site/**`, the
site parts of `src/app/globals.css`, `src/content/{site-copy,company,field,work}.ts`).
**Commit audited:** shallow clone of the default branch, 2026-10-28.
**Method:** I read all of the site code. I built a production copy locally (`next build && next start`; the clone was not
modified and nothing was deployed). I measured it with Lighthouse 13.6 (`scripts/perf/lighthouse.mjs`, median of 3 runs)
and scanned it with axe-core 4.14 through Playwright (WCAG 2.0/2.1/2.2 A and AA tags) in both locales at 1280px and 390px.
Raw numbers: [`docs/reports/perf/opera-baseline.json`](../reports/perf/opera-baseline.json).

Opera is the reference implementation the system was derived from, not a template. This audit separates what is
universal from what is Opera's own, and records what should not be carried forward.

## Measured baseline

| Measure                  | Mobile (simulated 4G, Moto G class) | Desktop  |
| ------------------------ | ----------------------------------- | -------- |
| Lighthouse performance   | 79                                  | 98       |
| LCP                      | 5,442 ms                            | 1,108 ms |
| CLS                      | 0.000                               | 0.000    |
| TBT                      | 80 ms                               | 1 ms     |
| JavaScript transferred   | 260 KB                              | 260 KB   |
| Total transferred        | 890 KB                              | 892 KB   |
| Lighthouse accessibility | 96                                  | 96       |
| Lighthouse SEO           | 100                                 | 100      |
| Cache-Control on `/`     | `private, no-cache, no-store`       | same     |

axe-core (WCAG 2.2 AA tag set):

| Run        | Violations                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| ar, 1280px | `color-contrast` ×4: section index numbers (`text-current/55` on Mist), footer copyright (`text-mist/45`)                |
| en, 1280px | same 4                                                                                                                   |
| ar, 390px  | `color-contrast` ×1 (footer); `scrollable-region-focusable` ×1: the swipeable field gallery can't be reached by keyboard |

Manual checks:

| Check                                                      | Result                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Mobile menu: focus after 12 Tab presses with the menu open | **Escapes the menu** into the page behind (no focus containment, background not `inert`, no `aria-modal`)        |
| `hreflang` alternates                                      | **None.** Arabic and English share one URL, and a cookie chooses between them                                    |
| Canonical                                                  | Resolves to the app base URL environment value (`http://localhost:3000` in this build), not the requested origin |
| Horizontal overflow at 390px and 1280px                    | None                                                                                                             |
| Reduced motion                                             | Respected: animations are removed and the orbit ring is shown drawn                                              |

INP was not measured. It needs field data or scripted real interactions. The page's only interactive parts are the
menu, the language toggle and the Formula list, and the 80 ms TBT suggests main-thread pressure is low.

## A. Universal foundations (every landing page needs these)

1. **Logical properties everywhere** (`ps-`, `me-`, `start-`, `end-`). RTL mirrors without per-direction overrides, and the
   few deliberate exceptions are explicit (`ltr:`/`rtl:` gradient directions, the never-mirrored logo, `.ltr-nums`).
2. **Per-script typography rules.** Arabic gets taller line-height (1.6 body / 1.25 headings against Latin 1.5 / 1.15), no
   letter-spacing, no uppercase. Latin labels get uppercase plus tracking. Arabic fonts are scaled (`size-adjust: 115%`)
   to match Latin x-height. These rules hold for any bilingual Arabic/Latin brand.
3. **Fluid type with `clamp()`** and `text-wrap: balance` on headings and `pretty` on leads.
4. **One page frame.** A max-width container with responsive gutters (`max-w-[1320px] px-5 sm:px-8 lg:px-12`) and a 12-column
   grid inside sections.
5. **Accessible skeleton.** A skip link, `<main id>`, every section `aria-labelledby` its heading, and lists as `<ol>`/`<ul>`.
   The decorative SVG is `aria-hidden`, and the changing Formula label sits in an `aria-live` region.
6. **Motion as progressive enhancement.** Content is visible by default. Scroll-driven animations
   (`animation-timeline: view()`) apply only where supported, with no JavaScript, and `prefers-reduced-motion` removes them.
7. **Verified-facts content discipline.** `company.ts` publishes only confirmed details: a `null` field is not rendered,
   and structured data includes only verified facts. This is a good rule for any company site.
8. **SEO basics.** Per-page metadata, Open Graph, JSON-LD `Organization` with `<` escaped, robots and sitemap routes.

## B. Configurable reusable patterns (worth turning into parameterised sections)

| Pattern in Opera                                                                                                        | Generalisation                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SectionMark` (index number + label on a hairline)                                                                      | Section header with an optional index, eyebrow and rule. Each brand chooses whether to number sections           |
| Hero: full-height display headline, photograph bleeding from the far edge with a gradient mask, body and CTAs on a rule | "Display" hero composition with optional bleed media, mask direction from `dir`, and stacked headline lines      |
| About: statement + lead on an asymmetric 12-col split                                                                   | "Statement" section (9/12 heading, 6/12 offset lead)                                                             |
| Process loop with "current step"                                                                                        | Steps/timeline section with an optional current marker (`aria-current="step"`)                                   |
| Capabilities as an editorial index, not cards                                                                           | Indexed-list section: rows with number, title, body and tags                                                     |
| Work: feature tile + 2-col tiles; desktop mosaic, mobile swipe row                                                      | Media mosaic and case-study grid sections; scroller primitive (with the keyboard fix)                            |
| Technologies: copy + "product truth" panel                                                                              | Split section with an arbitrary figure slot                                                                      |
| Contact: photo held back under gradients, display headline, single CTA, definition list                                 | CTA section with background media and scrim, plus a contact details list                                         |
| Header transparent → solid on scroll via `scroll(root)` timeline                                                        | Header "overlay" mode as a CSS-only option                                                                       |
| Tone switching per section (`dark` class re-themes tokens on Plum/Night)                                                | First-class **section tones**: each section declares a tone and every component reads the tone's semantic tokens |

## C. Opera-specific decisions (stay in Opera's brand and site, not in the system)

- The palette and its proportions: Plum/Night 60%, Mist 25%, Lilac/Aubergine 12%, Violet 3%, with violet reserved for the one
  primary action and the "now" dot.
- Jost plus Thmanyah Sans (licence-gated) or IBM Plex Sans Arabic at 115%. Medium (500) headings, −1% Latin tracking.
- The orbit motif: the open ring with a 45° gap at 11 o'clock, the logo reveal order (dot → ring → name), and the
  never-mirrored symbol.
- The **Formula** section: the brand ring split into five arcs. It is a brand signature, not a pattern. The system should make
  building such a section easy (tokens, primitives, a section shell) but must not ship it.
- The status ring and its six states.
- Section numbering ("01 · من نحن").
- Editorial restraint: no cards, hairline rules, and photography held in the night.

## D. Weaknesses and technical debt

| #   | Finding                                                                                                                                                                          | Evidence                                                            | Impact                                                                                                 | Disposition in the new system                                                                                             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| D1  | **The landing page is dynamic and uncacheable.** The layout calls `getSession()` (reads cookies) and `getI18n()` (reads the locale cookie), so `/` is `ƒ` (rendered per request) | Build output `ƒ /`; `Cache-Control: private, no-store`              | Every visit pays server render time. No CDN caching. Mobile LCP 5.4 s                                  | Static output by default; personalisation, if ever needed, as an island                                                   |
| D2  | **One URL for two languages.** The locale comes from a cookie, there is no `hreflang`, and the canonical is `/` for both                                                         | axe/DOM probe: 0 `hreflang` links                                   | Arabic or English cannot be indexed separately. Shared links open in whatever language the cookie says | Locale-prefixed static routes with `hreflang` + `x-default` and per-locale canonicals                                     |
| D3  | **Canonical depends on an environment variable** (`appBaseUrl()`)                                                                                                                | Canonical = `http://localhost:3000` in a build without the variable | Wrong canonical if the variable is missing                                                             | Site URL is required configuration, validated at build                                                                    |
| D4  | **260 KB of JavaScript** for a page whose only interactivity is a menu, a toggle and a hover list                                                                                | Lighthouse `resource-summary`                                       | Download and parse cost on mid-range phones                                                            | Zero framework runtime. A few kilobytes of vanilla TS per interactive component                                           |
| D5  | **Mobile menu isn't modal.** No focus containment, the background stays reachable, no focus return to the trigger                                                                | Probe: focus outside `#site-menu` after 12 Tabs                     | Fails WCAG 2.4.3 Focus Order in practice. Screen readers can wander behind the overlay                 | Native `<dialog>` + `showModal()`: inert background, Esc and focus handling built in                                      |
| D6  | **Contrast failures** on low-opacity text (`/55`, `/45`)                                                                                                                         | axe `color-contrast` ×4                                             | WCAG 1.4.3 failures                                                                                    | Contrast is a build-time and test-time gate on every tone's `fg`/`fg-muted` pair. Opacity-based text colours are not used |
| D7  | **Keyboard-unreachable horizontal scroller**                                                                                                                                     | axe `scrollable-region-focusable`                                   | WCAG 2.1.1                                                                                             | Scroller primitive is focusable (`tabindex=0`, labelled region)                                                           |
| D8  | **Section components are bound to Opera's copy shape** (`t: SiteCopy` passed everywhere, `t.capabilities.items[p.category]`)                                                     | `capabilities.tsx`, `work.tsx`                                      | Sections can't be reused without the whole copy object                                                 | Sections take small, typed, content-agnostic props                                                                        |
| D9  | **Duplicated UI strings in markup.** The primary/secondary button class strings are repeated in 4 files. Nav links are defined twice (header and footer)                         | `hero.tsx`, `contact.tsx`, `work.tsx`, header/footer                | Drift, inconsistent focus styles                                                                       | `Button` component; navigation defined once in site config                                                                |
| D10 | **Magic numbers across files.** Header height `72px` appears as `-mt-[72px]`, `pt-[136px]`, `top-[72px]`, plus `!text-[12px]` overrides and inline `calc((100vw-1320px)/2+3rem)` | Several files                                                       | Layout breaks if one changes                                                                           | Header height, container width and gutters are tokens. Full-bleed is a primitive                                          |
| D11 | **Site tokens mixed with app tokens.** `globals.css` carries sidebar, chart and table tokens the site never uses, and the site loads all of them                                 | `globals.css` 345 lines                                             | Coupling: a dashboard change can alter the marketing site                                              | Brand tokens are separate from product-UI tokens                                                                          |
| D12 | **The Contact CTA disappears** when `COMPANY.contact.email` is `null`, its current value                                                                                         | `contact.tsx`                                                       | The final section has no action: a conversion dead end                                                 | CTA sections require an action. Contact falls back to a form or other channel                                             |
| D13 | **Social image is the 512×512 app icon** with `twitter:card=summary`                                                                                                             | `page.tsx` metadata                                                 | Poor link previews                                                                                     | Per-page 1200×630 OG image slot                                                                                           |
| D14 | **Formula semantics.** Hover sets the `aria-pressed` toggle state, so pointer hover changes ARIA state without user activation                                                   | `formula.tsx`                                                       | Confusing toggle state for assistive technology                                                        | Note for Opera's own signature section (rebuilt in the reference site with hover as preview, click as selection)          |
| D15 | **No automated tests for the site.** Opera's suite covers the operations platform, not the landing page                                                                          | `tests/`                                                            | Regressions found by eye                                                                               | Playwright axe, keyboard, RTL and overflow tests on every reference site                                                  |
| D16 | **Footer year is computed at request time** (`new Date()`), which is harmless only because the page is dynamic (D1)                                                              | `site-footer.tsx`                                                   | Becomes a stale value under static output                                                              | Build-time year, documented                                                                                               |

## Conclusions that shaped the architecture

1. Static generation and near-zero JavaScript are worth more than any micro-optimisation (D1, D4).
2. Locales must be URLs (D2).
3. Tones (semantic token scopes per section), not page-wide light/dark themes, are what let a brand alternate grounds the way
   Opera does (B, last row).
4. Brand personality lives in more than colour: type families and scale, label casing, shape, borders versus shadows, density,
   motion, and above all **composition**. The system needs several genuinely different compositions per section type, plus
   an easy path to signature sections (C).
5. Contrast and modality must be enforced by tooling, not taste (D5, D6, D7).
