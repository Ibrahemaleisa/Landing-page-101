# استوديو الأنماط · Style Studio

أداة خاصة لتجربة الأنماط: تختار نمطاً جاهزاً من عشرة، أو تخلط كل عنصر بنفسك من قوائم منسدلة، وترى
المعاينة تتغيّر مباشرة بالعربية أو الإنجليزية، على مقاس الجوال أو التابلت أو الكمبيوتر.

A private tool for exploring styles: pick one of ten ready-made styles, or mix every element yourself from dropdowns,
and watch the preview change live, in Arabic or English, at phone, tablet or desktop size.

## التشغيل · Run it

```sh
nvm use && pnpm install
pnpm --dir sites/studio dev        # http://localhost:4324/   (English: /en/)
```

The studio is not indexed (`noindex`) and isn't meant to be deployed publicly.

## العناصر · The elements

| العنصر · Element                    | الخيارات · Options                                                                                                                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| النمط الجاهز · Ready-made style     | 10: استوديو بسيط، فخامة الليل، ساحلي، أتيليه، شروق، نيون، نجد، سوق، خام، سكينة                                                                                                            |
| الألوان · Colours                   | 10 palettes, each with four tones (page, alternate band, contrasting band, accent band), all WCAG AA                                                                                      |
| الخطوط · Typography                 | 10 Latin + Arabic pairings (Inter/Plex, Space Grotesk/Readex, Fraunces/Naskh, Playfair/Amiri, DM Sans/Cairo, Outfit/Alexandria, Sora/Changa, Plex/Kufi, Bricolage/Messiri, Baloo/Tajawal) |
| حجم العناوين · Type scale           | Modest, balanced, dramatic                                                                                                                                                                |
| الأزرار · Buttons                   | Soft, pill, square, all caps, monospace, big & bold                                                                                                                                       |
| الزوايا والحدود · Corners & borders | Sharp hairline, subtle, rounded, extra round, sharp bold lines                                                                                                                            |
| الظلال · Shadows                    | Flat, soft, tinted, hard offset, deep offset                                                                                                                                              |
| المسافات · Spacing                  | Compact, comfortable, airy                                                                                                                                                                |
| الحركة · Motion                     | None, calm, smooth, snappy                                                                                                                                                                |
| قالب الواجهة · Hero template        | Full display, split with a figure, centred over product, statement only                                                                                                                   |
| قالب الصفحة · Page template         | SaaS product, editorial company, marketplace, portfolio/studio, product launch                                                                                                            |

Any combination works: every palette passes contrast in every tone, so mixing can't produce unreadable text. The panel
shows the live contrast result anyway.

## ميزات أخرى · Other features

- **اقتراح عشوائي · Surprise me**: a random mix of every element.
- **حجم المعاينة · Preview size**: phone (390 px), tablet (820 px), desktop.
- **لغة المعاينة · Preview language**: Arabic (RTL) or English (LTR), independent of the studio's own language.
- **افتح المعاينة كاملة · Open full preview**: the preview in its own tab. The URL holds the selection
  (`/preview/?palette=…&type=…`), so you can bookmark it.
- **الحفظ · Persistence**: the last selection is kept in the browser and in the address bar.
- **تصدير النمط · Export style**: a ready `src/brand.ts` for the current mix, with the fonts it needs. Create a site with
  `pnpm new-site <name>`, paste it into `src/brand.ts`, install the listed fonts and register them in
  `astro.config.mjs` (`sites/studio/astro.config.ts` registers every family and is a working example).

## How it works

- `src/studio/palettes.ts`, `src/studio/options.ts`: the ten options per element and the ten presets. `buildBrand()`
  turns any selection into a standard Landing Kit `BrandConfig`, the same thing a real site's `brand.ts` contains.
- `src/pages/[...locale]/preview.astro`: renders every section variant once. A small script compiles the brand in the
  browser with the kit's own `compileBrand()`, swaps the token stylesheet, then shows, orders and re-tones the blocks
  the chosen templates use. In-page links to sections a template doesn't have are hidden or retargeted.
- `src/pages/[...locale].astro`: the studio panel. It talks to the preview `<iframe>` with `postMessage`
  (same origin only).
- Fonts: 23 self-hosted families. Browsers download a face only when text uses it, so registering all of them costs
  nothing until a typography option selects them.

## Adding a palette, font pairing or preset

1. Add an entry to `PALETTES`, `TYPOGRAPHY` (fonts must exist in `src/studio/fonts.ts`) or `PRESETS`.
2. `pnpm test`: the studio tests check every palette's contrast, that every option compiles, that presets reference real
   options and are distinct, and that typography uses registered fonts.
3. `pnpm e2e`: every preset is scanned with axe in both languages and checked for overflow at 320 and 390 px.
