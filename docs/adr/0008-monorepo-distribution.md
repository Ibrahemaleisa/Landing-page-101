# 0008 — pnpm workspace; kit shipped as source; sites scaffolded by a CLI

**Status:** Accepted · 2026-10-28

## Context

The system serves several independent products. They need a shared core that evolves, and each product's site must
be independently buildable and deployable. Publishing to a registry costs money or setup the brief rules out for now.

## Decision

- One pnpm workspace: `packages/kit` (`@landing/kit`), `packages/create-landing` (scaffolder), `sites/*` (one per product).
- The kit ships **source** (`.astro`, `.ts`, `.css`) through `package.json#exports`. That is the norm for Astro component
  libraries: Astro compiles them in the consuming site, so there is no build step to keep in sync.
- `pnpm new-site <name> [--locales ar,en] [--default ar]` copies `templates/starter`, renames it, and wires
  `@landing/kit: workspace:*`.
- Sites deploy independently. Each `sites/<name>` builds to static `dist/` for any static host.

## Consequences

- A site outside this repository can consume the kit once it is published (`npm publish` of `packages/kit`; roadmap).
  Until then new sites are created inside the workspace.
- Kit changes are immediately visible to every reference site, and the e2e suite runs across all of them. That is the
  regression net for shared code.
- Breaking kit changes require updating the reference sites in the same change.
