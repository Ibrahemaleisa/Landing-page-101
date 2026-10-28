# Architecture

Landing Kit is a static-first system for building distinct, accessible, fast landing pages for many brands. Decisions
and their trade-offs are in [`docs/adr`](adr/README.md). This page is the map.

```
landing-page-101/
├─ packages/
│  ├─ kit/                     @landing/kit — the system (shipped as source)
│  │  └─ src/
│  │     ├─ brand/             defineBrand · compileBrand · contrast · fluid scale
│  │     ├─ i18n/              defineSite · localePaths · localized helpers
│  │     ├─ styles/            layers: reset · base · layout · motion (global CSS)
│  │     ├─ layouts/           BaseLayout (html lang/dir, brand CSS, fonts, SEO, skip link)
│  │     ├─ seo/               Seo (canonical, hreflang, OG, JSON-LD)
│  │     ├─ primitives/        Container · Section · SectionHeader · Stack · Grid · Heading · Text · Eyebrow · Icon · Ltr · Scroller · Media
│  │     ├─ components/        Button · Link · Badge · Card · Accordion · Tabs · Dialog · Field/Input/Select/Textarea · Alert · Stat · Quote · LocaleSwitch · SiteHeader · MobileNav · Logo
│  │     └─ sections/          Hero (5 compositions) · Features (grid/list/index) · FeatureNarrative · Showcase (tabs) · LogoCloud · Testimonials · Stats · Steps · Comparison · Pricing · FAQ · CTA · ContactForm · Statement · MediaMosaic · Footer
│  └─ create-landing/          `pnpm new-site` scaffolder
├─ templates/starter/          what `new-site` copies
├─ sites/
│  ├─ opera/                   premium enterprise/event operations — Arabic-first, editorial, dark
│  ├─ qitah/                   Saudi automotive parts marketplace — Arabic-first, bright, utility
│  └─ kitebase/                fictional SaaS (feature flags) — English-first, paper/ink/lime, brutalist
├─ tests/e2e/                  Playwright across every site
├─ scripts/perf/               Lighthouse measurement
└─ docs/                       ADRs, guides, reports
```

## The four layers of a site

| Layer       | File                                           | Example                                               |
| ----------- | ---------------------------------------------- | ----------------------------------------------------- |
| Brand       | `src/brand.ts`                                 | tones, type, shape, elevation, density, motion        |
| Site        | `src/site.ts`                                  | URL, locales, navigation, social                      |
| Content     | `src/content/{ar,en}.ts` (typed by `types.ts`) | headlines, features, FAQs                             |
| Composition | `src/pages/[...locale].astro`                  | which sections, in what order, which variant and tone |

A signature section, one that is unique to a brand, lives in `src/sections/` of that site and is built from kit
primitives.

## How a brand becomes CSS

```
brand.ts ──defineBrand()──► BrandConfig (typed)
                               │
                 compileBrand()│  Utopia fluid steps, tone blocks, :lang() overrides
                               ▼
               <style> :root{--step-0:clamp(…);--radius-control:…}
                       [data-tone="inverse"]{--tone-bg:…;--tone-fg:…}
                       :root:lang(ar){--font-body:…;--leading-body:1.8} </style>
                               │
       components read only semantic variables: --tone-*, --step-*, --space-*, --radius-*, --motion-*
```

`checkBrandContrast()` evaluates the same config in unit tests, so a brand can't ship a failing text pair.

## Runtime

Static HTML and CSS. JavaScript only where a component needs it (mobile nav, tabs, dialog, form validation), as small
deduplicated modules. No framework runtime.
