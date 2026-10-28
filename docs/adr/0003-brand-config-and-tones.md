# 0003 — Brands are typed config compiled to CSS variables; sections pick a tone

**Status:** Accepted · 2026-10-28

## Context

"Same template, different logo and colour" happens when a theme is only a palette. The brands we must serve differ in:

- **Colour grounds and rhythm.** Opera alternates Night, Mist and Plum sections. Qitah is bright Mist with Blue bands.
  A SaaS brand might be paper-white with an ink band.
- **Typography.** Families per script, scale contrast, heading weight, label casing and tracking.
- **Shape.** Pill versus square, 1px hairlines versus 2px rules.
- **Depth.** Flat, soft shadows, or hard offset shadows.
- **Density and motion.** Generous editorial spacing versus compact utility; calm fades versus snappy.

Opera's `dark` class on a section, which re-themes the tokens for that subtree, was the right idea in an ad-hoc form.

## Decision

1. `defineBrand()` takes a typed `BrandConfig`:
   - `color.tones`: named tone scopes (`base`, `muted`, `inverse`, `brand`, plus any custom names). Each tone defines `bg`,
     `fg`, `fgMuted`, `line`, `accent`, `onAccent`, `ring` and `surface`, plus optional `heading`, `accentText`,
     `accentHover`, `surfaceFg`, `surfaceFgMuted`, `surfaceLine`, `highlight`/`onHighlight` and `bgImage`.
   - `type`: families per role (`display`, `body`, `mono`), per-locale overrides (Arabic families, line-heights,
     an optional per-script scale), a fluid scale (`minBase`, `maxBase`, `minRatio`, `maxRatio`), heading weight and
     tracking, and label style (`uppercase`, tracking).
   - `shape`: radii for controls, cards and media, plus border width.
   - `elevation`: `flat` | `soft` | `hard`, with an offset (hard) or a shadow tint (soft).
   - `space`: density (`compact` | `comfortable` | `airy`), which drives section padding and the fluid space scale.
   - `motion`: durations, easing, reveal style (`none` | `fade` | `rise`) and distance.
   - `layout`: container width, gutters, header height.
2. `compileBrand()` turns the config into a CSS string: `:root` variables, one `[data-tone="…"]` block per tone,
   `:lang(ar)` overrides, and fluid `clamp()` steps computed with the Utopia method (360 px → 1280 px viewport).
3. Sections render `<section data-tone="inverse">`. Every component reads `--tone-*`, so a button inside an
   inverse section is automatically correct.
4. `checkBrandContrast()` computes WCAG 2.x contrast for every tone: `fg`/`bg`, `fgMuted`/`bg`, `onAccent`/`accent`,
   `surfaceFg`/`surface` ≥ 4.5; `accent`/`bg`, `ring`/`bg`, `line` (non-text, informational) ≥ 3 where marked. The kit's
   test-suite helper fails the build for any reference brand that misses a threshold.

## Alternatives considered

- **Light/dark themes only.** Can't express Opera's three-ground rhythm or a brand band.
- **Design Tokens Community Group JSON + Style Dictionary.** A good interchange format, but it adds a toolchain and loses
  TypeScript inference for the fluid-scale and tone logic. Export to DTCG JSON is on the roadmap for Figma sync.
- **Runtime theming (JS sets variables).** Causes a flash and needs JavaScript. Compile-time CSS has neither problem.

## Consequences

- A brand file is about 100 lines of readable, typed data, and a typo in a tone name is a type error.
- Contrast regressions are caught by `pnpm test`, not in review.
- Composition variety (hero types, section structure) is not in the brand config, deliberately. Composition is a page
  decision ([ADR 0006](0006-content-layout-separation.md)).
