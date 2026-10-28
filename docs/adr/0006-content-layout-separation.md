# 0006 — Content in typed modules, composition in pages, sections content-agnostic

**Status:** Accepted · 2026-10-28

## Context

The brief asks to separate content, layout configuration, brand tokens and component implementation, and to support
different narrative structures rather than a fixed sequence. Opera's sections took the whole `SiteCopy` object
([audit D8](../research/opera-audit.md)), so none could be reused.

## Decision

Four layers, each owned by a different file:

| Layer          | Where                                                                                         | Changes when…                                                        |
| -------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Brand tokens   | `sites/<site>/src/brand.ts` (`defineBrand`)                                                   | The identity changes                                                 |
| Content        | `sites/<site>/src/content/{ar,en}.ts` (typed by `content/types.ts`)                           | Copy changes                                                         |
| Composition    | `sites/<site>/src/pages/*.astro`                                                              | The narrative changes: section order, variants, which sections exist |
| Implementation | `packages/kit/src/{components,sections}` and, for signature work, `sites/<site>/src/sections` | Behaviour or markup changes                                          |

- **Sections take small typed props** (`title`, `lead`, `items`, `actions`, a `variant`, a `tone`) and named slots for
  arbitrary content (`media`, `figure`, `aside`). They never import site content.
- **Composition is code, not a JSON page schema.** An `.astro` page that lists sections is as readable as JSON, but it is
  type-checked, supports slots and conditional logic, and lets a site drop in a one-off section between two kit sections.
- **Signature sections** (Opera's Formula ring, Qitah's vehicle search) live in the site. They are built from kit
  primitives (`Section`, `SectionHeader`, `Container`, tokens) so they inherit tone, rhythm and RTL behaviour.

## Alternatives considered

- **Astro content collections (Markdown/YAML + Zod).** Excellent for many similar documents (blog, case studies). Landing
  page copy is a small, heterogeneous tree where TypeScript gives better locale parity. Collections remain the right choice
  for case studies and are on the roadmap.
- **A JSON/CMS-driven page builder.** Useful once non-developers compose pages. The typed section props are the contract a
  future `renderSections(config)` adapter would target (roadmap); building it now would be speculative.

## Consequences

- A developer composes a new narrative by reordering and choosing variants in one file.
- Content editors edit TypeScript objects. That is acceptable for developer-led teams; a CMS adapter is the next step
  when that stops being true.
