# 0001 — Astro 7, static output, as the rendering framework

**Status:** Accepted · 2026-10-28

## Context

Landing pages are read far more than they are interacted with. The Opera audit measured the cost of rendering one
inside an application framework: `/` was dynamic because the layout read the session cookie, which made it uncacheable.
The page shipped 260 KB of JavaScript, and mobile LCP was 5.4 s under Lighthouse's simulated 4G
([audit D1, D4](../research/opera-audit.md)).

Requirements: static HTML by default; per-component interactivity without a framework runtime; typed component props;
first-class image optimisation; i18n routes; a large, stable ecosystem; no vendor lock-in for hosting.

## Options

| Option                     | For                                                                                                                                                                                                                                      | Against                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Astro 7**                | Zero JS by default; `.astro` components with typed `Props`; scoped CSS; built-in image pipeline (AVIF/WebP, `srcset`) and font API with metric-matched fallbacks; islands if React/Svelte is ever needed; static output deploys anywhere | Its own component format (not React); Node ≥ 22.22 required by 7.4.x                                                                          |
| Next.js 16 (Opera's stack) | Team familiarity; React ecosystem                                                                                                                                                                                                        | Ships the React runtime even for static pages; RSC adds complexity a landing page doesn't need; static export loses `next/image` optimisation |
| Eleventy                   | Minimal, very fast                                                                                                                                                                                                                       | Weak typing for components; templating languages instead of components; we would rebuild image and font pipelines                             |
| SvelteKit / Nuxt           | Good DX                                                                                                                                                                                                                                  | A framework runtime per page; static is a mode, not the default                                                                               |
| Hand-rolled Vite + HTML    | No framework                                                                                                                                                                                                                             | We would reimplement routing, components, images and i18n                                                                                     |

## Decision

Astro 7 (pinned `~7.4.1`) with `output: "static"`. Components are `.astro` files with TypeScript `Props` interfaces.
No UI framework integration is installed. A site that needs one (a pricing calculator in React, say) can add an island
without changing the system.

## Consequences

- Every page is plain HTML and CSS, cacheable at the edge. JavaScript is only the few kilobytes each interactive
  component needs.
- Developers who know React must learn the `.astro` syntax. It is close to JSX and small.
- Astro 7.4.2 requires Node ≥ 22.23.4. The development container runs 22.22.0, so the kit pins `~7.4.1`
  (engines ≥ 22.22.0) and documents the bump in the roadmap.
- Dynamic needs (forms, personalisation) are handled by posting to an endpoint or by islands, never by making the
  page dynamic.
