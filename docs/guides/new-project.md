# Starting a new landing page

From zero to a building, bilingual, accessible site in about five minutes. No Opera code involved.

## Prerequisites

- Node **22.23.4** or newer (`nvm use` reads `.nvmrc`)
- pnpm 10 (`corepack enable` or `npm i -g pnpm@10`)

```sh
git clone <this repo> && cd landing-page-101
pnpm install
```

## 1. Scaffold

```sh
pnpm new-site acme --title "Acme" --url https://acme.example --locales en,ar --default en
# Arabic-first:
pnpm new-site souq --title "Souq" --url https://souq.sa --locales ar,en --default ar
pnpm install
```

Options: `--locales` (the starter ships content for `en` and `ar`), `--default` (served at `/`), `--port`, `--dry-run`.

You get `sites/<name>/`:

```
astro.config.mjs        fonts (Inter + IBM Plex Sans Arabic), site URL
src/brand.ts            neutral baseline brand — make it yours
src/site.ts             URL and locales
src/content/types.ts    the shape of your copy
src/content/en.ts, ar.ts
src/pages/[...locale].astro   the composition
src/components/Logo.astro
src/styles/site.css     @layer site — your own gestures
test/brand.test.ts      WCAG contrast for every tone
```

## 2. Run it

```sh
pnpm --dir sites/acme dev      # http://localhost:<port>/  (and /ar/)
```

## 3. Make it yours (in this order)

1. **Brand**: `src/brand.ts` (tones, type, shape, depth, density, motion). See the
   [brand customization guide](brand-customization.md). Swap fonts in `astro.config.mjs`.
2. **Copy**: write the real content in `src/content/*.ts`. Extend `types.ts` as sections are added; both locales must
   satisfy it, so a missing translation is a type error.
3. **Composition**: edit `src/pages/[...locale].astro`. Pick sections and variants from
   [components.md](../components.md), reorder them, assign tones. Add a signature section in `src/sections/`.
4. **Logo, favicon, OG image**: replace `src/components/Logo.astro` and `public/favicon.svg`; pass a 1200×630
   `image` to `BaseLayout` for link previews.
5. **Forms**: point `Form`'s `action` at your endpoint (or a form service) and remove `demo`.

## 4. Verify before shipping

```sh
pnpm test                         # includes your brand's contrast test
pnpm --dir sites/acme check       # astro check: 0 errors
pnpm --dir sites/acme build       # static output in sites/acme/dist
# add the site to tests/e2e/sites.ts (name, port, locales), then:
pnpm e2e                          # axe WCAG 2.2 AA, keyboard, RTL, overflow, links, console errors
node scripts/perf/lighthouse.mjs http://localhost:<port>/   # with `pnpm --dir sites/acme preview` running
```

## 5. Deploy

`sites/<name>/dist` is plain static files: any static host or CDN works (Cloudflare Pages, Netlify, Vercel static,
S3 + CloudFront, nginx). Set the host's build command to `pnpm install && pnpm --dir sites/<name> build` and the output
directory to `sites/<name>/dist`. Set `site.url` (in `src/site.ts` and `astro.config.mjs`) to the production origin:
canonical and `hreflang` URLs are built from it.
