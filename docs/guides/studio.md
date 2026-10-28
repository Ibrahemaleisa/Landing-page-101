# استوديو الأنماط · Style Studio

أداة خاصة لتجربة الأنماط: تبدأ بنمط جاهز من أربعة عشر، أو تختار كل عنصر بنفسك من بطاقات مرسومة تُريك شكل كل
خيار، ثم تعدّله بدقة بأشرطة تمرير ومنتقي ألوان. كل خانة وكل خيار معه جملة بسيطة تشرح ماذا يغيّر. والمعاينة تتغيّر
مباشرة بالعربية أو الإنجليزية، على مقاس الجوال أو التابلت أو الكمبيوتر.

A private tool for exploring styles: start from one of fourteen ready-made styles, or pick every element yourself from
picture cards that show what each choice looks like, then refine it with sliders and a colour picker. Every element and
every option carries one plain sentence saying what it changes. The preview updates live, in Arabic or English, at
phone, tablet or desktop size.

## التشغيل · Run it

```sh
nvm use && pnpm install
pnpm --dir sites/studio dev        # http://localhost:4324/   (English: /en/)
```

The studio is not indexed (`noindex`). It is deployed on Vercel from `master` (project `landing-style-studio`, root `sites/studio`): https://landing-style-studio.vercel.app

## العناصر · The elements

| العنصر · Element                    | الخيارات · Options                                                                                                                                                                                                             | تعديل دقيق · Fine-tune             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| النمط الجاهز · Ready-made style     | 14: استوديو بسيط، فخامة الليل، ساحلي، أتيليه، شروق، نيون، نجد، سوق، خام، سكينة، زهر، طرفية، مهرجان، معرض                                                                                                                       |                                    |
| الألوان · Colours                   | 12 palettes, each with four tones (page, alternate band, contrasting band, accent band), all WCAG AA                                                                                                                           | Any button/link colour (picker)    |
| الخطوط · Typography                 | 12 Latin + Arabic pairings (Inter/Plex, Space Grotesk/Readex, Fraunces/Naskh, Playfair/Amiri, DM Sans/Cairo, Outfit/Alexandria, Sora/Changa, Plex/Kufi, Bricolage/Messiri, Baloo/Tajawal, Fraunces/Amiri, JetBrains Mono/Kufi) | Heading weight                     |
| حجم العناوين · Type scale           | Modest, balanced, dramatic, huge                                                                                                                                                                                               | Body text size, hero headline size |
| الأزرار · Buttons                   | Soft, pill, square, all caps, monospace, big & bold, compact, rounded, headline font, wide caps pill                                                                                                                           | Roundness, height, text weight     |
| الزوايا والحدود · Corners & borders | Sharp hairline, subtle, rounded, extra round, sharp bold lines, borderless, mixed                                                                                                                                              | Card & image roundness, border     |
| الظلال · Shadows                    | Flat, soft, tinted, small offset, hard offset, deep offset                                                                                                                                                                     |                                    |
| المسافات · Spacing                  | Compact, comfortable, airy                                                                                                                                                                                                     | Content width                      |
| الحركة · Motion                     | None, calm, smooth, snappy, bouncy, cinematic, gentle fade, quick rise                                                                                                                                                         | Speed, reveal distance             |
| قالب الواجهة · Hero template        | Full display, split with a figure, centred over product, statement only                                                                                                                                                        |                                    |
| قالب الصفحة · Page template         | SaaS product, editorial company, marketplace, portfolio/studio, product launch, services agency, mobile app, event                                                                                                             |                                    |

Any combination works: every palette passes contrast in every tone, so mixing can't produce unreadable text. The panel
shows the live contrast result anyway.

## التحكم · Controls

- **بطاقات بدل القوائم المنسدلة · Cards instead of dropdowns**: each element is a collapsible group of picture cards
  (native radio buttons, so arrow keys and screen readers work). The pictures are drawn from the option's real values:
  a real button sample, colour swatches, the font itself, a sketch of the hero or of the page's sections and tones, a
  dot that moves with the motion's speed and easing.
- **شرح بسيط · Plain-language hints**: every element has a one-line explanation under its title, and "Your choice"
  explains the selected option. Every slider has its own hint.
- **تعديل دقيق · Fine-tune**: sliders (and the colour picker) refine the chosen option without picking another one.
  A changed value is highlighted; "Back to default" clears that element's fine-tuning; picking a different option for
  the element clears it too. Motion sliders are disabled while motion is off.
- **منتقي الألوان · Colour picker**: any colour becomes the button and link colour. If it's too light or too dark to
  read, its shade is adjusted automatically (the panel says so), and the accent band is repainted around it. The unit
  tests try 54 colours on every palette and require every WCAG pair to pass.

## ميزات أخرى · Other features

- **اقتراح عشوائي · Surprise me**: a random mix of every element.
- **حجم المعاينة · Preview size**: phone (390 px), tablet (820 px), desktop.
- **لغة المعاينة · Preview language**: Arabic (RTL) or English (LTR), independent of the studio's own language.
- **افتح المعاينة كاملة · Open full preview**: the preview in its own tab. The URL holds the selection and any
  fine-tuning (`/preview/?palette=…&type=…&btnRadius=…`), so you can bookmark or share it.
- **الحفظ · Persistence**: the last selection is kept in the browser and in the address bar.
- **تصدير النمط · Export style**: a ready `src/brand.ts` for the current mix, with the fonts it needs. Create a site with
  `pnpm new-site <name>`, paste it into `src/brand.ts`, install the listed fonts and register them in
  `astro.config.mjs` (`sites/studio/astro.config.ts` registers every family and is a working example).

## How it works

- `src/studio/palettes.ts`, `src/studio/options.ts`: the options per element (each with a hint), the presets and the
  `TWEAKS` (fine-tuning sliders). `buildBrand(selection, name, tweaks)` turns any selection into a standard Landing
  Kit `BrandConfig`, the same thing a real site's `brand.ts` contains.
- `src/studio/color.ts`: derives the accent roles from a picked colour while keeping WCAG contrast.
- `src/components/ChoiceArt.astro`: the small pictures on the choice cards.
- `src/pages/[...locale]/preview.astro`: renders every section variant once. A small script compiles the brand in the
  browser with the kit's own `compileBrand()`, swaps the token stylesheet, then shows, orders and re-tones the blocks
  the chosen templates use. In-page links to sections a template doesn't have are hidden or retargeted.
- `src/pages/[...locale].astro`: the studio panel. It talks to the preview `<iframe>` with `postMessage`
  (same origin only).
- Fonts: 23 self-hosted families. Browsers download a face only when text uses it, so registering all of them costs
  nothing until a typography option selects them.

## Adding a palette, font pairing or preset

1. Add an entry to `PALETTES`, `TYPOGRAPHY` (fonts must exist in `src/studio/fonts.ts`), any other option list, or
   `PRESETS`. Every option needs a `hint` in Arabic and English. A new slider is one entry in `TWEAKS` plus its line in
   `buildBrand()`.
2. `pnpm test`: the studio tests check every palette's contrast, that every option compiles, that presets reference real
   options and are distinct, and that typography uses registered fonts.
3. `pnpm e2e`: every preset is scanned with axe in both languages and checked for overflow at 320 and 390 px.
