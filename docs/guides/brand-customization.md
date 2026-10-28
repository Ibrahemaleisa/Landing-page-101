# Brand customization guide

A brand lives in one file, `sites/<site>/src/brand.ts`. This guide walks through it in the order that changes a page's
character most. The three reference brands are worked examples:

|           | Opera                           | Qitah                                | Kitebase                                       |
| --------- | ------------------------------- | ------------------------------------ | ---------------------------------------------- |
| Character | Premium, editorial, composed    | Bright, trustworthy, utility         | Engineered, candid, loud                       |
| Grounds   | Night / Mist / Plum alternating | Mist, white, Blue50, Qitah Blue band | Paper, ink band, lime band                     |
| Type      | Jost 500, tight, large display  | IBM Plex 700, compact                | Space Grotesk 700, −4.5% tracking, mono labels |
| Shape     | 8 / 12 px, hairlines            | 12 / 16 px, soft                     | 0 px, 2 px rules                               |
| Depth     | Flat                            | Soft, ink-tinted                     | Hard offset shadows                            |
| Density   | Airy                            | Compact                              | Comfortable                                    |
| Motion    | Calm 600 ms rise                | Quick 250 ms                         | Snappy fade                                    |
| Hero      | `display` + photo + orbit       | `split` + part finder                | `centered` + product console                   |

## 1. Tones: your colour rhythm

Define one tone per kind of ground the page uses. `base` is required and applies to the whole page; other names are
yours (`night`, `inverse`, `brand`, `tint`…). Sections pick one with `tone="…"`.

```ts
color: {
  tones: {
    base:    { scheme: "light", bg: "#f5f2f8", fg: "#170b26", fgMuted: "#5e5470", line: "#d6cce3",
               accent: "#64228a", onAccent: "#f5f2f8", accentHover: "#3c1862", ring: "#64228a", surface: "#ffffff" },
    night:   { scheme: "dark", bg: "#08050e", bgImage: "radial-gradient(…)", fg: "#f5f2f8", fgMuted: "#b4a8c8",
               accent: "#64228a", onAccent: "#f5f2f8", accentText: "#c9b3e6", ring: "#c9b3e6", surface: "#1e0d33", … },
  },
},
```

- Never use opacity for text colour. Pick a real muted colour that passes 4.5:1. `pnpm test` will tell you if it doesn't.
- On dark grounds a saturated accent often fails as text: give `accentText` a lighter tint (Opera uses lilac).
- `heading` sets a separate heading colour (Qitah's blue headings).
- `highlight`/`onHighlight` drive selection, badges and markers (Kitebase's lime stripe).

## 2. Typography: your voice

```ts
type: {
  families: { display: "var(--font-space-grotesk), system-ui, sans-serif", body: "…", mono: "var(--font-jetbrains), monospace" },
  scale: { minBase: 16, maxBase: 18, minRatio: 1.25, maxRatio: 1.38 }, // higher maxRatio = more drama on wide screens
  displayStep: 5,                                                        // which step the hero headline uses
  display: { weight: 700, leading: 0.95, tracking: "-0.045em" },
  heading: { weight: 700, leading: 1.05, tracking: "-0.03em" },
  body:    { weight: 400, leading: 1.55 },
  label:   { weight: 500, leading: 1.3, tracking: "0.06em", transform: "uppercase", family: "mono", step: -2 },
  locales: { ar: { families: { … }, display: { leading: 1.2 }, body: { leading: 1.8 } } },
},
```

### Fonts

Register fonts in `astro.config.mjs` with `fontProviders.local()` pointing at `@fontsource*` files in `node_modules`
(reproducible, offline, self-hosted; see [ADR 0009](../adr/0009-fonts.md)), then pass them to `BaseLayout`'s `fonts`
prop and preload the one or two faces used above the fold.

**Bilingual stacks — the one rule to remember.** Astro's font variables end with a generated fallback face and a generic
family. If an Arabic-only face comes _after_ a Latin variable, the generic family catches Arabic glyphs first and you get
system Arabic (we hit this; the symptom is spaced, unshaped Arabic in buttons). So for a secondary-script face:

```js
{
  name: "Readex Pro", cssVariable: "--font-readex", provider: fontProviders.local(),
  fallbacks: [],               // no generated Arial fallback without a unicode-range
  optimizedFallbacks: false,
  options: { variants: [{ src: [ … "readex-pro-arabic-wght-normal.woff2"], weight: "160 700", style: "normal",
                          unicodeRange: ["U+0600-06FF, U+0750-077F, …"] }] },
}
```

and put it **first** in that locale's families: `"var(--font-readex), var(--font-space-grotesk)"`. Arabic glyphs
resolve to the Arabic face; Latin words and digits fall through to the Latin face.

Arabic needs taller line-heights (body ≈ 1.8, headings ≈ 1.3) and never takes letter-spacing or uppercase. The compiler
enforces the latter for caseless scripts. If an Arabic face reads optically smaller than its Latin partner, give the
locale its own `scale` (Opera does) instead of `size-adjust`.

## 3. Shape, depth, density, motion

```ts
shape:     { control: 0, card: 0, media: 0, badge: 0, border: 2 },  // 999 for pills
elevation: { style: "hard", offset: 4 },                             // "flat" | "soft" (+ tint) | "hard"
space:     { density: "comfortable" },                               // "compact" | "comfortable" | "airy"
motion:    { duration: { fast: 100, base: 160, slow: 280 }, ease: "cubic-bezier(0.2, 0, 0, 1)", reveal: "fade" },
control:   { height: 48, weight: 600, transform: "uppercase", tracking: "0.04em", family: "mono" },
layout:    { container: 1200, gutter: { min: 20, max: 40 }, header: 68 },
```

Keep `control.height` at 44 or more for comfortable touch targets.

## 4. Composition: where most of the difference comes from

Tokens alone make a recoloured template. Change the **structure**:

- Choose the hero composition that matches how the product is bought: a premium service _tells_ (`display`), a
  marketplace _lets you start_ (`split` with a working form), a product _shows itself_ (`centered` with the UI).
- Choose proof that fits: photographs from the field (Opera), honest product facts and sample data clearly labelled
  (Qitah), a comparison table and pricing (Kitebase).
- Alternate tones deliberately: a rhythm of grounds is a large part of an identity.
- Build one or two **signature sections** in `src/sections/` (see [components.md](../components.md#building-a-signature-section)).
- Add brand gestures in `src/styles/site.css` inside `@layer site { … }`: Kitebase's highlighter headline and spec-sheet
  rules, Qitah's chip eyebrows. Keep them token-based so they survive tone changes.

## 5. Check it

```sh
pnpm test                       # contrast gate for every tone
pnpm --dir sites/<site> check   # types
pnpm --dir sites/<site> build
pnpm e2e                        # axe, keyboard, RTL, overflow (add your site to tests/e2e/sites.ts)
```
