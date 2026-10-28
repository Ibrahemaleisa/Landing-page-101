# Architecture Decision Records

Each record states the context, the options weighed, the decision and its consequences. Records are immutable
once accepted: a reversal is a new record that supersedes the old one.

| #                                                       | Decision                                                                                      | Status   |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| [0001](0001-static-first-astro.md)                      | Astro 7, static output, as the rendering framework                                            | Accepted |
| [0002](0002-styling-css-tokens-no-utility-framework.md) | Plain CSS: custom properties, cascade layers, scoped component styles. No Tailwind            | Accepted |
| [0003](0003-brand-config-and-tones.md)                  | Brands are typed config compiled to CSS variables; sections pick a _tone_                     | Accepted |
| [0004](0004-native-html-interactivity.md)               | Native HTML first (`<dialog>`, `<details>`, `:has()`), vanilla TS for the rest, no UI runtime | Accepted |
| [0005](0005-i18n-rtl.md)                                | Locales are URLs; logical properties; typed content parity between locales                    | Accepted |
| [0006](0006-content-layout-separation.md)               | Content in typed modules, composition in `.astro` pages, sections content-agnostic            | Accepted |
| [0007](0007-quality-gates.md)                           | Vitest + Playwright + axe + Lighthouse; contrast is a test, not a review comment              | Accepted |
| [0008](0008-monorepo-distribution.md)                   | pnpm workspace; kit shipped as source; sites scaffolded by a CLI                              | Accepted |
| [0009](0009-fonts.md)                                   | Self-hosted fonts through Astro's font API with the local provider                            | Accepted |
| [0010](0010-motion.md)                                  | CSS-only motion primitives with tokenised timing; reduced motion removes movement             | Accepted |
