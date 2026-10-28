# Dependency and security review

Reviewed 2026-10-28. `pnpm audit` (all dependencies) and `pnpm audit --prod`: **No known vulnerabilities found.**

## Runtime footprint

The deployed sites contain **no third-party JavaScript**. Shipped script is the kit's own vanilla TypeScript (menu,
tabs, dialog, form validation, Opera's formula), under 1 KB gzipped per page, inlined by Astro. No analytics, no
trackers, no external requests: fonts and images are self-hosted (the e2e suite fails on any failed or ≥ 400 request).

## Dependencies and why each is justified

| Package                                                                                                               | Where           | Why                                                                                                | Alternative rejected                                 |
| --------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `astro` 7.4.2                                                                                                         | kit peer, sites | Static rendering, components, image pipeline, font API (ADR 0001)                                  | Next.js (runtime cost), Eleventy (weak typing)       |
| `sharp`                                                                                                               | sites           | Astro's image service: AVIF/WebP, resizing at build time                                           | Shipping originals (heavier LCP)                     |
| `@fontsource*` (Jost, IBM Plex Sans/Arabic/Mono, Space Grotesk, JetBrains Mono, Readex Pro)                           | sites           | OFL fonts as versioned files, self-hosted through the local provider (ADR 0009)                    | Google Fonts CDN (privacy, network-dependent builds) |
| `@astrojs/check`, `typescript` ~6.0                                                                                   | dev             | `astro check` type gate                                                                            | —                                                    |
| `vitest`                                                                                                              | dev             | Unit tests                                                                                         | Jest (slower ESM setup)                              |
| `@playwright/test` 1.63.0, `@axe-core/playwright`                                                                     | dev             | E2E and accessibility scans (version matches the pre-installed Chromium)                           | Cypress (no multi-server preview setup)              |
| `lighthouse`, `chrome-launcher`                                                                                       | dev             | Lab performance measurement                                                                        | PageSpeed API (external, rate-limited)               |
| `eslint` 10, `typescript-eslint`, `eslint-plugin-astro`, `eslint-plugin-jsx-a11y-x`, `astro-eslint-parser`, `globals` | dev             | Lint and static a11y checks (`-x` fork because `eslint-plugin-jsx-a11y` doesn't support ESLint 10) | —                                                    |
| `prettier`, `prettier-plugin-astro`                                                                                   | dev             | Formatting                                                                                         | —                                                    |

The kit itself has **zero runtime dependencies** (only the `astro` peer).

## Supply-chain and configuration notes

- Versions are pinned exactly or with `~`/`^` in package manifests and locked in `pnpm-lock.yaml`.
- `engine-strict=true` (`.npmrc`) and `.nvmrc` pin Node 22.23.4+.
- `pnpm-workspace.yaml` declares a `packageExtensions` entry so `@napi-rs/wasm-runtime` resolves its `@emnapi/*` peers
  (needed by `@astrojs/check`'s compiler WASM fallback under pnpm's strict layout). It adds two packages from the same
  publisher and changes nothing else.
- JSON-LD is serialised with `<` escaped (`Seo.astro`) so content can't close the script element.
- `set:html` is used only for markup the kit renders itself (slots, icon paths) or site-authored inline SVG logos,
  never for user input. There is no user input rendered at build time.
- Forms: the reference sites run in `demo` mode and send nothing. Real deployments must post to an endpoint that
  validates server-side and protects against spam (e.g. Cloudflare Turnstile); client-side validation is for usability
  only.
- No secrets, keys or credentials exist in the repository, and none are needed to build.
- Recommended production headers (host configuration, not in the repo): `Content-Security-Policy` allowing `'self'` plus
  the inline script and style hashes Astro emits, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, long-lived `Cache-Control: immutable` for `/_astro/*`.
