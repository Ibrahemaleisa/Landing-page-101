# Components and sections

Import from `@landing/kit/<group>/<Name>.astro`. Props are typed: your editor and `astro check` will show the full
interface. Live examples: the three reference sites (`sites/opera`, `sites/qitah`, `sites/kitebase`). Run any of them
with `pnpm --dir sites/<name> dev`.

## Layout and document

| Component                  | Purpose                                                                     | Key props                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `layouts/BaseLayout`       | `<html lang dir>`, brand CSS, fonts, SEO, skip link                         | `site`, `brand`, `locale`, `title`, `description`, `siteName`, `skipLabel`, `fonts`, `image`, `jsonLd`, `tone` |
| `seo/Seo`                  | Canonical, `hreflang` + `x-default`, Open Graph, Twitter, JSON-LD (escaped) | used by BaseLayout                                                                                             |
| `primitives/Section`       | Landmark region with tone and rhythm                                        | `id`, `tone`, `labelledby`, `pad`, `width`, `contained`                                                        |
| `primitives/SectionHeader` | Eyebrow / index / title / lead                                              | `id`, `title`, `layout: stack \| split \| center`, `size`, `index`, `rule`                                     |
| `primitives/Container`     | Max-width frame with gutters                                                | `width: default \| narrow \| wide`                                                                             |

## Primitives

| Component  | Notes                                                                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Icon`     | Curated Lucide set (`name`) or custom `paths`. Directional icons mirror in RTL automatically. `label` makes it meaningful; otherwise it is hidden from assistive technology. |
| `Media`    | `<picture>` with AVIF/WebP, responsive `widths`, intrinsic size (no CLS), `priority` for the LCP image, `fill`, `focus`, `aspect`.                                           |
| `Scroller` | Horizontal scroll-snap row that is a focusable, labelled region (keyboard-scrollable).                                                                                       |
| `Ltr`      | Isolates LTR runs (phones, codes, prices) inside RTL text.                                                                                                                   |

## Components

| Component      | Behaviour                                                                                                                                                                                                                       | JS    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `Button`       | `<a>` with `href`, else `<button>` (`type` defaults to `button`). Variants `primary`, `secondary`, `ghost`, `link`; sizes `sm`, `md`, `lg`; `icon`, `iconStart`, `block`, `external` (adds a hidden "opens in a new tab" note). | —     |
| `Actions`      | Row of Buttons from `Action[]`; the first is primary by default.                                                                                                                                                                | —     |
| `Badge`        | `outline`, `solid`, `highlight`.                                                                                                                                                                                                | —     |
| `Card`         | Surface (`surface`, `outline`, `plain`); `href` makes the whole card clickable through one stretched link.                                                                                                                      | —     |
| `Accordion`    | `<details name>` disclosure group; `exclusive` makes it one-open-at-a-time.                                                                                                                                                     | 0     |
| `Tabs`         | WAI-ARIA tabs: roving tabindex, arrows follow the reading direction, Home/End. Panels are slots `panel-<id>`. Without JS all panels render in order.                                                                            | ~1 KB |
| `Dialog`       | Native `<dialog>` + `showModal()`: inert background, Esc, focus return. Without JS the trigger links to the content.                                                                                                            | <1 KB |
| `Form`         | Native constraint validation plus accessible messages: `aria-invalid`, `aria-describedby`, an error summary (`role="alert"`), focus moves to the first invalid field. `demo` shows success without sending.                     | ~1 KB |
| `Field`        | Label, hint, error slot; `text`, `email`, `tel`, `url`, `number`, `search`, `textarea`, `select` (with `optgroup`); `dir` for always-LTR values; localised `requiredMessage` / `invalidMessage`.                                | —     |
| `Alert`        | Inline feedback; `live: polite \| assertive` sets `role`.                                                                                                                                                                       | —     |
| `LocaleSwitch` | Links to the same page in other locales, each label in its own language with `lang`/`hreflang`.                                                                                                                                 | —     |
| `SiteHeader`   | Desktop nav plus a modal mobile menu on `<dialog>`. Modes `sticky`, `overlay` (transparent → solid via a CSS scroll timeline), `static`. `homeLabel` must contain the logo's visible text (WCAG 2.5.3).                         | ~1 KB |

## Sections

Every section takes `id` and optional `tone`, and labels itself with its heading.

| Section            | Compositions                                                                                                                                 | Notes                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Hero`             | `display` (full-height editorial, bleed media), `split` (copy + working figure), `centered` (product figure below), `statement` (words only) | Title as one string or lines; `accentLine`; slots `media`, `figure`, `meta`, `after`; `underHeader` for overlay headers |
| `Statement`        | `start` (12-col offset), `center`                                                                                                            | A position stated in one sentence, plus a lead                                                                          |
| `Features`         | `grid` (icon cards), `list` (rows), `index` (editorial table of contents with tags), `bento` (asymmetric)                                    | `columns`, `headerLayout`                                                                                               |
| `FeatureNarrative` | Alternating copy/visual rows                                                                                                                 | Visuals in slots `media-0`, `media-1`, …; `mediaFirst`                                                                  |
| `Showcase`         | Tabbed product demonstration                                                                                                                 | Slots `media-<id>`; `tabsVariant: pill \| underline`                                                                    |
| `Steps`            | `timeline` (connected, with `current` → `aria-current="step"`), `cards`                                                                      | `titleSize` for continuation sections                                                                                   |
| `Stats`            | `row`, `cards`                                                                                                                               | `note` for sources or "sample data"                                                                                     |
| `Testimonials`     | `grid`, `featured`                                                                                                                           | `note` to label illustrative quotes                                                                                     |
| `LogoCloud`        | `row`, `grid`                                                                                                                                | Inline SVG (`currentColor`) or wordmark text                                                                            |
| `Comparison`       | Real `<table>` with caption and row/column headers; scrolls inside a focusable region on phones                                              | `highlight` column; booleans render as labelled icons                                                                   |
| `Pricing`          | Plan cards, optional **zero-JS** billing switch (radios + `:has()`)                                                                          | Prices are preformatted strings; `custom` price                                                                         |
| `FAQ`              | `split` (sticky header), `stacked`                                                                                                           | Exclusive accordion by default                                                                                          |
| `MediaMosaic`      | Desktop mosaic (one tall frame + others), phone swipe row                                                                                    | Captions on the image's darkened foot                                                                                   |
| `CTA`              | `band`, `panel`, `split`; optional background `media` under a scrim; `aside` slot                                                            | Requires at least one action (type-level)                                                                               |
| `Contact`          | Heading and confirmed details beside a form slot                                                                                             | Missing details are not shown                                                                                           |
| `Footer`           | Brand block, link groups, language switch, legal line                                                                                        |                                                                                                                         |

## Building a signature section

A signature section is something only one brand has (Opera's Formula ring, Qitah's part finder, Kitebase's flag
console). Build it in the site's `src/sections/` from kit primitives so it inherits tone, rhythm and RTL behaviour:

```astro
---
import Section from "@landing/kit/primitives/Section.astro";
import SectionHeader from "@landing/kit/primitives/SectionHeader.astro";
---

<Section id="formula" tone="base" labelledby="formula-title">
  <SectionHeader id="formula-title" title="Five principles. One loop." rule />
  <!-- your markup; style it with --tone-* and --space-* tokens in @layer site -->
</Section>
```

Rules of thumb: read colours from `--tone-*` so the section works on any ground; use logical properties; keep any
script to progressive enhancement; add an e2e test for any interaction.
