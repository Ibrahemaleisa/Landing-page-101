# 0004 — Native HTML first, vanilla TypeScript for the rest, no UI runtime

**Status:** Accepted · 2026-10-28

## Context

Landing page interactivity is small and well understood: a navigation menu, disclosure (FAQ), tabs, a billing-period
switch, a dialog, form validation. Opera's mobile menu reimplemented a modal by hand and missed focus containment
([audit D5](../research/opera-audit.md)). Native elements now provide these behaviours with the accessibility built in.

## Decision

| Need                            | Implementation                                                                                                                                  | JS      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Mobile navigation               | `<dialog>` opened with `showModal()`: inert background, Esc, focus containment and return are native                                            | ~1 KB   |
| Accordion / FAQ                 | `<details name="group">` (exclusive accordion) with `<summary>`                                                                                 | 0       |
| Pricing period switch           | Native radio inputs + `:has()` to show matching prices                                                                                          | 0       |
| Tabs                            | WAI-ARIA Tabs pattern (roving `tabindex`, arrow keys, Home/End, automatic activation). Without JS all panels render stacked with their headings | ~1.5 KB |
| Dialog                          | `<dialog>` + trigger script (falls back to an anchor link to the content)                                                                       | <1 KB   |
| Form validation                 | Constraint validation API + inline messages wired with `aria-describedby`/`aria-invalid`; submits normally without JS                           | ~1.5 KB |
| Horizontal scroller             | Focusable labelled region (`tabindex="0"`, `role="region"`), CSS scroll-snap                                                                    | 0       |
| Header state on scroll, reveals | CSS scroll-driven animations ([ADR 0010](0010-motion.md))                                                                                       | 0       |

Scripts are Astro `<script>` modules, bundled and deduplicated by Astro, and initialise by data attribute
(`[data-lk-tabs]`) so any number of instances work.

## Alternatives considered

- **React + Radix (Opera's app stack).** Excellent primitives, but about 45 KB of React runtime gzipped for a handful of
  widgets.
- **Alpine.js / petite-vue.** Small, but still a runtime and an attribute DSL to learn, and native elements do most of it.
- **Web Components (Lit).** A reasonable future direction for distribution outside Astro. Not needed now.

## Consequences

- Interactive pages ship roughly 3–5 KB of JavaScript in total.
- `<details name>` exclusivity needs a 2024+ browser. Older browsers fall back to independent disclosures, which is
  still correct.
- `:has()` is required for the zero-JS pricing switch (all evergreen browsers since late 2023). Without it both prices
  stay visible and labelled.
