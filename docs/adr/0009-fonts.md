# 0009 — Self-hosted fonts through Astro's font API (local provider)

**Status:** Accepted · 2026-10-28

## Context

Fonts are usually the second-largest render-blocking cost on a landing page and a common source of CLS. Third-party font
CDNs add a connection, leak visitor IPs, and make builds depend on the network.

## Options

- **Astro font API, `npm`/`fontsource` provider.** Resolves families remotely. In this environment it tried
  `cdn.jsdelivr.net` (blocked), which shows that the build depends on a CDN.
- **Astro font API, `local` provider pointing at `@fontsource*` files in `node_modules`.** Versioned via the lockfile,
  works offline, and still gets Astro's generated `@font-face`, preloads and metric-matched fallbacks.
- Manual `@font-face` in CSS. Works, but no generated fallbacks or preload integration.

## Decision

Each site lists its families in `astro.config.mjs` with `fontProviders.local()` and paths into `@fontsource*` packages.
The kit's `BaseLayout` renders `<Font>` for the families the brand names, preloading only the display/body Latin or
primary-script face. Only the subsets the site uses are included (e.g. Arabic + Latin).

## Consequences

- Builds are reproducible offline.
- Licence-restricted fonts (e.g. Opera's Thmanyah Sans) are not committed. The brand lists a free stand-in (IBM Plex Sans
  Arabic) and documents how to drop in the licensed files.
