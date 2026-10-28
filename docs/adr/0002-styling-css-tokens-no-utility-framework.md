# 0002 — Plain CSS: custom properties, cascade layers, scoped component styles

**Status:** Accepted · 2026-10-28

## Context

The system has to express very different brands from one component set. Opera used Tailwind v4 and ended up with long
duplicated class strings, `!` overrides and arbitrary values such as `lg:pe-[max(3rem,calc((100vw-1320px)/2+3rem))]`
([audit D9, D10](../research/opera-audit.md)). Brand variation in a utility framework tends to leak into markup, where
each brand needs different class lists, and that is exactly what makes sites converge on one look.

## Options

| Option                                                        | For                                                                                                                                                                                                                            | Against                                                                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **CSS custom properties + `@layer` + Astro scoped `<style>`** | The brand is data (variables), so the same markup restyles completely; zero dependencies; modern CSS (`clamp`, `:has`, container queries, logical properties, `color-mix`) covers our needs; styles live next to the component | Developers write CSS; no utility shorthand                                                                    |
| Tailwind v4                                                   | Fast authoring; popular                                                                                                                                                                                                        | Brand differences end up as class differences in markup; arbitrary-value sprawl; theming via variables anyway |
| CSS-in-JS (vanilla-extract, Panda)                            | Type-safe tokens                                                                                                                                                                                                               | Build tooling and an extra mental model for what CSS variables already do                                     |
| Open Props / a CSS framework                                  | Ready-made scales                                                                                                                                                                                                              | Their scales become everyone's look                                                                           |

## Decision

- **Tokens** are CSS custom properties generated from the brand config ([ADR 0003](0003-brand-config-and-tones.md)).
- **Layers:** `@layer reset, tokens, base, layout, components, sections, utilities, site;`. Sites write in `site` and win
  over the kit without `!important`.
- **Components** use Astro scoped styles and read only semantic variables (`--tone-fg`, `--space-m`, `--radius-control`, …),
  never brand palette values.
- **Logical properties only** (`margin-inline-start`, `inset-inline-end`). Physical properties are a lint-level review
  failure except for deliberate, commented exceptions.
- A small set of layout utilities (`.lk-container`, `.lk-stack`, `.lk-cluster`, `.lk-grid`, `.lk-visually-hidden`) for
  composition in pages.

## Consequences

- Changing a brand never touches markup. One component can be pill-shaped and soft in one brand and square with hard
  shadows in another.
- There is no utility-class shorthand. Page-specific styling is written as scoped CSS in the site.
- Prefixing kit classes with `lk-` avoids collisions with site CSS.
