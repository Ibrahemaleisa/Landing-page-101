/**
 * The studio's elements. Each dropdown in the studio is one of these lists; `buildBrand()` turns a
 * selection (one id per element) into a complete Landing Kit brand, the same `BrandConfig` a real
 * site uses — so whatever you compose here can be exported as a `brand.ts`.
 */
import type { BrandConfig, ControlConfig, ElevationConfig, MotionConfig, ShapeConfig, SpaceConfig, TextStyle, TypeConfig } from "@landing/kit/brand";
import { FONT_FAMILIES, cssVar } from "./fonts";
import { PALETTES } from "./palettes";

export type L = { ar: string; en: string };
export interface Option<T> {
  id: string;
  label: L;
  value: T;
}

const stack = (ids: string[], generic = "sans-serif") => [...ids.map((id) => `var(${cssVar(id)})`), generic].join(", ");

// ----------------------------------------------------------------------------------- typography

export interface TypeChoice {
  latin: { display: string; body: string; mono?: string };
  arabic: { display: string; body: string };
  display: TextStyle;
  heading: TextStyle;
  label: TypeConfig["label"];
  /** Arabic line heights (Arabic always needs more air). */
  arLeading: { display: number; heading: number; body: number };
  generic?: "serif" | "sans-serif";
}

export const TYPOGRAPHY: Option<TypeChoice>[] = [
  {
    id: "neutral",
    label: { ar: "محايد عصري — Inter + بلكس", en: "Neutral — Inter + Plex Arabic" },
    value: {
      latin: { display: "inter", body: "inter" },
      arabic: { display: "plex-ar", body: "plex-ar" },
      display: { weight: 650, leading: 1.05, tracking: "-0.03em" },
      heading: { weight: 600, leading: 1.15, tracking: "-0.015em" },
      label: { weight: 600, leading: 1.3, tracking: "0.06em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.3, heading: 1.4, body: 1.8 },
    },
  },
  {
    id: "tech",
    label: { ar: "تقني — Space Grotesk + ريدكس", en: "Tech — Space Grotesk + Readex" },
    value: {
      latin: { display: "space-grotesk", body: "inter", mono: "jetbrains" },
      arabic: { display: "readex", body: "readex" },
      display: { weight: 700, leading: 0.98, tracking: "-0.045em" },
      heading: { weight: 700, leading: 1.08, tracking: "-0.03em" },
      label: { weight: 500, leading: 1.3, tracking: "0.06em", transform: "uppercase", family: "mono", step: -2 },
      arLeading: { display: 1.25, heading: 1.35, body: 1.8 },
    },
  },
  {
    id: "editorial",
    label: { ar: "تحريري — Fraunces + نسخ", en: "Editorial — Fraunces + Naskh" },
    value: {
      latin: { display: "fraunces", body: "inter" },
      arabic: { display: "naskh", body: "plex-ar" },
      display: { weight: 500, leading: 1.02, tracking: "-0.02em" },
      heading: { weight: 500, leading: 1.12, tracking: "-0.01em" },
      label: { weight: 600, leading: 1.3, tracking: "0.12em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.45, heading: 1.5, body: 1.85 },
      generic: "serif",
    },
  },
  {
    id: "luxury",
    label: { ar: "فاخر — Playfair + أميري", en: "Luxury — Playfair + Amiri" },
    value: {
      latin: { display: "playfair", body: "manrope" },
      arabic: { display: "amiri", body: "tajawal" },
      display: { weight: 500, leading: 1.04, tracking: "-0.01em" },
      heading: { weight: 500, leading: 1.15, tracking: "0" },
      label: { weight: 600, leading: 1.3, tracking: "0.18em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.5, heading: 1.55, body: 1.85 },
      generic: "serif",
    },
  },
  {
    id: "friendly",
    label: { ar: "ودود — DM Sans + القاهرة", en: "Friendly — DM Sans + Cairo" },
    value: {
      latin: { display: "dm-sans", body: "dm-sans" },
      arabic: { display: "cairo", body: "cairo" },
      display: { weight: 700, leading: 1.04, tracking: "-0.035em" },
      heading: { weight: 650, leading: 1.15, tracking: "-0.02em" },
      label: { weight: 600, leading: 1.3, step: -1 },
      arLeading: { display: 1.35, heading: 1.45, body: 1.8 },
    },
  },
  {
    id: "geometric",
    label: { ar: "هندسي — Outfit + الإسكندرية", en: "Geometric — Outfit + Alexandria" },
    value: {
      latin: { display: "outfit", body: "outfit" },
      arabic: { display: "alexandria", body: "alexandria" },
      display: { weight: 600, leading: 1.02, tracking: "-0.03em" },
      heading: { weight: 550, leading: 1.12, tracking: "-0.015em" },
      label: { weight: 500, leading: 1.3, tracking: "0.1em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.35, heading: 1.45, body: 1.85 },
    },
  },
  {
    id: "futuristic",
    label: { ar: "مستقبلي — Sora + شنقا", en: "Futuristic — Sora + Changa" },
    value: {
      latin: { display: "sora", body: "sora" },
      arabic: { display: "changa", body: "changa" },
      display: { weight: 600, leading: 1.02, tracking: "-0.04em" },
      heading: { weight: 600, leading: 1.12, tracking: "-0.02em" },
      label: { weight: 500, leading: 1.3, tracking: "0.14em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.3, heading: 1.4, body: 1.8 },
    },
  },
  {
    id: "corporate",
    label: { ar: "مؤسسي — Plex + كوفي", en: "Corporate — Plex + Kufi" },
    value: {
      latin: { display: "plex-sans", body: "plex-sans" },
      arabic: { display: "kufi", body: "plex-ar" },
      display: { weight: 600, leading: 1.08, tracking: "-0.02em" },
      heading: { weight: 600, leading: 1.18, tracking: "-0.01em" },
      label: { weight: 600, leading: 1.3, tracking: "0.04em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.45, heading: 1.5, body: 1.8 },
    },
  },
  {
    id: "expressive",
    label: { ar: "معبّر — Bricolage + المسيري", en: "Expressive — Bricolage + Messiri" },
    value: {
      latin: { display: "bricolage", body: "dm-sans" },
      arabic: { display: "messiri", body: "cairo" },
      display: { weight: 750, leading: 0.98, tracking: "-0.04em" },
      heading: { weight: 700, leading: 1.08, tracking: "-0.025em" },
      label: { weight: 600, leading: 1.3, step: -1 },
      arLeading: { display: 1.35, heading: 1.45, body: 1.8 },
    },
  },
  {
    id: "playful",
    label: { ar: "مرِح — Baloo + تجوال", en: "Playful — Baloo + Tajawal" },
    value: {
      latin: { display: "baloo-latin", body: "manrope" },
      arabic: { display: "baloo-ar", body: "tajawal" },
      display: { weight: 700, leading: 1.02, tracking: "-0.02em" },
      heading: { weight: 650, leading: 1.12, tracking: "-0.01em" },
      label: { weight: 700, leading: 1.3, step: -1 },
      arLeading: { display: 1.4, heading: 1.45, body: 1.8 },
    },
  },
];

// ----------------------------------------------------------------------------------- scale

export const SCALES: Option<{ minRatio: number; maxRatio: number; maxBase: number; displayStep: 5 | 6 }>[] = [
  { id: "modest", label: { ar: "هادئ", en: "Modest" }, value: { minRatio: 1.16, maxRatio: 1.2, maxBase: 17, displayStep: 6 } },
  { id: "balanced", label: { ar: "متوازن", en: "Balanced" }, value: { minRatio: 1.2, maxRatio: 1.25, maxBase: 18, displayStep: 6 } },
  { id: "dramatic", label: { ar: "درامي", en: "Dramatic" }, value: { minRatio: 1.22, maxRatio: 1.33, maxBase: 18, displayStep: 6 } },
];

// ----------------------------------------------------------------------------------- buttons

export const BUTTONS: Option<{ radius: number; control: ControlConfig }>[] = [
  { id: "soft", label: { ar: "ناعمة", en: "Soft" }, value: { radius: 10, control: { height: 48, weight: 600 } } },
  { id: "pill", label: { ar: "كبسولة", en: "Pill" }, value: { radius: 999, control: { height: 48, weight: 600 } } },
  { id: "square", label: { ar: "مربعة", en: "Square" }, value: { radius: 0, control: { height: 48, weight: 600 } } },
  {
    id: "caps",
    label: { ar: "حروف كبيرة", en: "All caps" },
    value: { radius: 4, control: { height: 50, weight: 700, transform: "uppercase", tracking: "0.08em" } },
  },
  {
    id: "mono",
    label: { ar: "خط ثابت (تقني)", en: "Monospace" },
    value: { radius: 0, control: { height: 48, weight: 600, transform: "uppercase", tracking: "0.04em", family: "mono" } },
  },
  { id: "bold", label: { ar: "عريضة وكبيرة", en: "Big & bold" }, value: { radius: 14, control: { height: 56, weight: 750 } } },
];

// ----------------------------------------------------------------------------------- shape & borders

export const SHAPES: Option<Omit<ShapeConfig, "control">>[] = [
  { id: "sharp", label: { ar: "حادة بخط رفيع", en: "Sharp, hairline" }, value: { card: 0, media: 0, badge: 0, border: 1 } },
  { id: "subtle", label: { ar: "انحناء خفيف", en: "Subtle" }, value: { card: 10, media: 8, badge: 6, border: 1 } },
  { id: "rounded", label: { ar: "مستديرة", en: "Rounded" }, value: { card: 18, media: 16, badge: 999, border: 1 } },
  { id: "soft-xl", label: { ar: "مستديرة جداً", en: "Extra round" }, value: { card: 28, media: 24, badge: 999, border: 1 } },
  { id: "bold", label: { ar: "حادة بخط عريض", en: "Sharp, bold lines" }, value: { card: 0, media: 0, badge: 0, border: 2 } },
];

// ----------------------------------------------------------------------------------- elevation

export const ELEVATIONS: Option<ElevationConfig | "tinted">[] = [
  { id: "flat", label: { ar: "مسطّح", en: "Flat" }, value: { style: "flat" } },
  { id: "soft", label: { ar: "ظل ناعم", en: "Soft shadow" }, value: { style: "soft" } },
  { id: "tinted", label: { ar: "ظل ملوّن", en: "Tinted shadow" }, value: "tinted" },
  { id: "hard", label: { ar: "ظل صلب", en: "Hard offset" }, value: { style: "hard", offset: 4 } },
  { id: "hard-xl", label: { ar: "ظل صلب عميق", en: "Deep offset" }, value: { style: "hard", offset: 7 } },
];

// ----------------------------------------------------------------------------------- density

export const DENSITIES: Option<SpaceConfig["density"]>[] = [
  { id: "compact", label: { ar: "مدمج", en: "Compact" }, value: "compact" },
  { id: "comfortable", label: { ar: "مريح", en: "Comfortable" }, value: "comfortable" },
  { id: "airy", label: { ar: "واسع", en: "Airy" }, value: "airy" },
];

// ----------------------------------------------------------------------------------- motion

export const MOTIONS: Option<MotionConfig>[] = [
  { id: "none", label: { ar: "بدون حركة", en: "None" }, value: { duration: { fast: 0, base: 0, slow: 0 }, ease: "linear", reveal: "none" } },
  {
    id: "calm",
    label: { ar: "هادئة", en: "Calm" },
    value: { duration: { fast: 160, base: 260, slow: 650 }, ease: "cubic-bezier(0.23, 1, 0.32, 1)", reveal: "rise", distance: 20 },
  },
  {
    id: "smooth",
    label: { ar: "سلسة", en: "Smooth" },
    value: { duration: { fast: 150, base: 220, slow: 450 }, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)", reveal: "rise", distance: 12 },
  },
  {
    id: "snappy",
    label: { ar: "سريعة", en: "Snappy" },
    value: { duration: { fast: 90, base: 140, slow: 240 }, ease: "cubic-bezier(0.2, 0, 0, 1)", reveal: "fade" },
  },
];

// ----------------------------------------------------------------------------------- templates

export const HEROES: Option<"display" | "split" | "centered" | "statement">[] = [
  { id: "display", label: { ar: "عرض كامل (تحريري)", en: "Full display (editorial)" }, value: "display" },
  { id: "split", label: { ar: "نص ومجسّم جنباً إلى جنب", en: "Split: copy + figure" }, value: "split" },
  { id: "centered", label: { ar: "متمركز فوق المنتج", en: "Centred over product" }, value: "centered" },
  { id: "statement", label: { ar: "عبارة كبيرة فقط", en: "Statement only" }, value: "statement" },
];

/** A page template is an ordered list of [block, variant, tone]. Blocks are rendered once per variant in the preview. */
export type Block = [block: string, variant: string, tone: "base" | "muted" | "inverse" | "brand"];

export const PAGES: Option<Block[]>[] = [
  {
    id: "saas",
    label: { ar: "منتج رقمي (SaaS)", en: "SaaS product" },
    value: [
      ["logos", "grid", "base"],
      ["showcase", "tabs", "inverse"],
      ["features", "bento", "base"],
      ["steps", "cards", "muted"],
      ["quotes", "grid", "base"],
      ["pricing", "plans", "muted"],
      ["faq", "split", "base"],
      ["cta", "band", "brand"],
    ],
  },
  {
    id: "editorial",
    label: { ar: "شركة تحريرية فاخرة", en: "Editorial company" },
    value: [
      ["statement", "start", "base"],
      ["features", "index", "inverse"],
      ["narrative", "rows", "base"],
      ["steps", "timeline", "muted"],
      ["quotes", "featured", "inverse"],
      ["cta", "split", "brand"],
    ],
  },
  {
    id: "marketplace",
    label: { ar: "سوق إلكتروني", en: "Marketplace" },
    value: [
      ["features", "grid", "muted"],
      ["steps", "cards", "base"],
      ["narrative", "rows", "muted"],
      ["stats", "cards", "base"],
      ["faq", "split", "muted"],
      ["cta", "panel", "base"],
    ],
  },
  {
    id: "portfolio",
    label: { ar: "صفحة شخصية / استوديو", en: "Portfolio / studio" },
    value: [
      ["statement", "start", "base"],
      ["features", "list", "muted"],
      ["narrative", "rows", "base"],
      ["quotes", "featured", "muted"],
      ["contact", "form", "base"],
    ],
  },
  {
    id: "launch",
    label: { ar: "إطلاق منتج جديد", en: "Product launch" },
    value: [
      ["logos", "row", "base"],
      ["features", "grid", "base"],
      ["stats", "row", "inverse"],
      ["compare", "table", "base"],
      ["pricing", "plans", "muted"],
      ["faq", "stacked", "base"],
      ["cta", "band", "brand"],
    ],
  },
];

// ----------------------------------------------------------------------------------- selection

export const ELEMENTS = {
  palette: PALETTES.map((p) => ({ id: p.id, label: p.label })),
  type: TYPOGRAPHY,
  scale: SCALES,
  buttons: BUTTONS,
  shape: SHAPES,
  elevation: ELEVATIONS,
  density: DENSITIES,
  motion: MOTIONS,
  hero: HEROES,
  page: PAGES,
} as const;

export type ElementKey = keyof typeof ELEMENTS;
export type Selection = Record<ElementKey, string>;

export const ELEMENT_LABELS: Record<ElementKey, L> = {
  palette: { ar: "الألوان", en: "Colours" },
  type: { ar: "الخطوط", en: "Typography" },
  scale: { ar: "حجم العناوين", en: "Type scale" },
  buttons: { ar: "الأزرار", en: "Buttons" },
  shape: { ar: "الزوايا والحدود", en: "Corners & borders" },
  elevation: { ar: "الظلال", en: "Shadows" },
  density: { ar: "المسافات", en: "Spacing" },
  motion: { ar: "الحركة", en: "Motion" },
  hero: { ar: "قالب الواجهة", en: "Hero template" },
  page: { ar: "قالب الصفحة", en: "Page template" },
};

export interface Preset {
  id: string;
  label: L;
  description: L;
  selection: Selection;
}

export const PRESETS: Preset[] = [
  {
    id: "studio",
    label: { ar: "استوديو بسيط", en: "Studio Minimal" },
    description: { ar: "نظيف ومحايد لمنتج رقمي", en: "Clean and neutral for a digital product" },
    selection: {
      palette: "ink",
      type: "neutral",
      scale: "balanced",
      buttons: "soft",
      shape: "subtle",
      elevation: "soft",
      density: "comfortable",
      motion: "smooth",
      hero: "centered",
      page: "saas",
    },
  },
  {
    id: "luxe",
    label: { ar: "فخامة الليل", en: "Midnight Luxe" },
    description: { ar: "داكن وذهبي، تحريري هادئ", en: "Dark and gold, calm and editorial" },
    selection: {
      palette: "midnight",
      type: "luxury",
      scale: "dramatic",
      buttons: "square",
      shape: "sharp",
      elevation: "flat",
      density: "airy",
      motion: "calm",
      hero: "display",
      page: "editorial",
    },
  },
  {
    id: "coastal",
    label: { ar: "ساحلي", en: "Coastal" },
    description: { ar: "منعش وودود لخدمة استهلاكية", en: "Fresh and friendly for a consumer service" },
    selection: {
      palette: "ocean",
      type: "friendly",
      scale: "balanced",
      buttons: "pill",
      shape: "rounded",
      elevation: "tinted",
      density: "comfortable",
      motion: "smooth",
      hero: "split",
      page: "launch",
    },
  },
  {
    id: "atelier",
    label: { ar: "أتيليه", en: "Atelier" },
    description: { ar: "طبيعي وأدبي لاستوديو أو صفحة شخصية", en: "Natural and literary for a studio or portfolio" },
    selection: {
      palette: "forest",
      type: "editorial",
      scale: "dramatic",
      buttons: "caps",
      shape: "sharp",
      elevation: "flat",
      density: "airy",
      motion: "calm",
      hero: "statement",
      page: "portfolio",
    },
  },
  {
    id: "sunrise",
    label: { ar: "شروق", en: "Sunrise" },
    description: { ar: "دافئ وحيوي لإطلاق جريء", en: "Warm and energetic for a bold launch" },
    selection: {
      palette: "sunset",
      type: "expressive",
      scale: "dramatic",
      buttons: "pill",
      shape: "soft-xl",
      elevation: "soft",
      density: "comfortable",
      motion: "smooth",
      hero: "centered",
      page: "launch",
    },
  },
  {
    id: "neon",
    label: { ar: "نيون", en: "Neon" },
    description: { ar: "ليلي وتقني لمنتج للمطورين", en: "Nocturnal and technical for a developer product" },
    selection: {
      palette: "neon",
      type: "futuristic",
      scale: "dramatic",
      buttons: "mono",
      shape: "bold",
      elevation: "hard",
      density: "compact",
      motion: "snappy",
      hero: "display",
      page: "saas",
    },
  },
  {
    id: "najd",
    label: { ar: "نجد", en: "Najd" },
    description: { ar: "ألوان الأرض لشركة سعودية راسخة", en: "Earth tones for an established Saudi company" },
    selection: {
      palette: "desert",
      type: "geometric",
      scale: "balanced",
      buttons: "soft",
      shape: "subtle",
      elevation: "flat",
      density: "airy",
      motion: "calm",
      hero: "split",
      page: "editorial",
    },
  },
  {
    id: "souq",
    label: { ar: "سوق", en: "Souq" },
    description: { ar: "واضح وموثوق لسوق إلكتروني", en: "Clear and trustworthy for a marketplace" },
    selection: {
      palette: "royal",
      type: "corporate",
      scale: "modest",
      buttons: "bold",
      shape: "rounded",
      elevation: "tinted",
      density: "compact",
      motion: "snappy",
      hero: "split",
      page: "marketplace",
    },
  },
  {
    id: "brutal",
    label: { ar: "خام", en: "Brutal" },
    description: { ar: "أبيض وأسود بحدود صلبة وجريئة", en: "Black and white with hard, honest edges" },
    selection: {
      palette: "mono",
      type: "tech",
      scale: "dramatic",
      buttons: "mono",
      shape: "bold",
      elevation: "hard-xl",
      density: "comfortable",
      motion: "snappy",
      hero: "statement",
      page: "portfolio",
    },
  },
  {
    id: "calm",
    label: { ar: "سكينة", en: "Calm" },
    description: { ar: "ناعم ومطمئن لتطبيق صحي أو تعليمي", en: "Soft and reassuring for a wellbeing or learning app" },
    selection: {
      palette: "pastel",
      type: "playful",
      scale: "modest",
      buttons: "pill",
      shape: "soft-xl",
      elevation: "soft",
      density: "airy",
      motion: "calm",
      hero: "centered",
      page: "marketplace",
    },
  },
];

export const DEFAULT_SELECTION: Selection = PRESETS[0]!.selection;

const pick = <T>(list: readonly Option<T>[], id: string): T => (list.find((o) => o.id === id) ?? list[0]!).value;

/** Returns the preset whose selection matches exactly, if any. */
export const matchPreset = (s: Selection) => PRESETS.find((p) => (Object.keys(p.selection) as ElementKey[]).every((k) => p.selection[k] === s[k]));

/** Any selection → a complete Landing Kit brand. */
export function buildBrand(s: Selection, name = "Studio"): BrandConfig {
  const palette = PALETTES.find((p) => p.id === s.palette) ?? PALETTES[0]!;
  const type = pick(TYPOGRAPHY, s.type);
  const scale = pick(SCALES, s.scale);
  const buttons = pick(BUTTONS, s.buttons);
  const shape = pick(SHAPES, s.shape);
  const elevationChoice = pick(ELEVATIONS, s.elevation);
  const generic = type.generic ?? "sans-serif";
  const mono = type.latin.mono ?? "jetbrains";

  const elevation: ElevationConfig = elevationChoice === "tinted" ? { style: "soft", tint: palette.tones.base.accent } : elevationChoice;

  return {
    name,
    themeColor: palette.tones.base.bg,
    color: { tones: palette.tones },
    type: {
      families: {
        display: stack([type.latin.display], generic),
        body: stack([type.latin.body]),
        mono: stack([mono], "monospace"),
      },
      scale: { minBase: 16, maxBase: scale.maxBase, minRatio: scale.minRatio, maxRatio: scale.maxRatio },
      displayStep: scale.displayStep,
      display: type.display,
      heading: type.heading,
      body: { weight: 400, leading: 1.6 },
      label: type.label,
      locales: {
        ar: {
          // Arabic face first (Arabic-only unicode-range), Latin runs fall through to the Latin face
          families: {
            display: stack([type.arabic.display, type.latin.display], generic),
            body: stack([type.arabic.body, type.latin.body]),
            mono: stack([type.arabic.body, mono], "monospace"),
          },
          display: { leading: type.arLeading.display },
          heading: { leading: type.arLeading.heading },
          body: { leading: type.arLeading.body },
          label: { family: "body", step: -1 },
        },
      },
    },
    shape: { ...shape, control: buttons.radius },
    elevation,
    space: { density: pick(DENSITIES, s.density) },
    motion: pick(MOTIONS, s.motion),
    layout: { container: 1200, gutter: { min: 20, max: 44 }, header: 68 },
    control: buttons.control,
  };
}

/** The fonts a selection uses, for the export's install instructions. */
export function fontsFor(s: Selection) {
  const t = pick(TYPOGRAPHY, s.type);
  const ids = new Set([t.latin.display, t.latin.body, t.latin.mono ?? "jetbrains", t.arabic.display, t.arabic.body]);
  return FONT_FAMILIES.filter((f) => ids.has(f.id));
}

/** A ready-to-paste `src/brand.ts` for the current selection. */
export function exportBrand(s: Selection, name = "My Brand"): string {
  const brand = buildBrand(s, name);
  const fonts = fontsFor(s);
  const json = JSON.stringify(brand, null, 2).replace(/"([a-zA-Z]\w*)":/g, "$1:");
  return `import { defineBrand } from "@landing/kit/brand";

/**
 * Exported from the Landing Kit style studio.
 * Selection: ${(Object.keys(s) as ElementKey[]).map((k) => `${k}=${s[k]}`).join(", ")}
 *
 * Fonts used (install in the site, register in astro.config.mjs with fontProviders.local()):
${fonts.map((f) => ` *   ${f.pkg}  →  cssVariable "${cssVar(f.id)}"${f.script === "arabic" ? "  (Arabic-only: unicodeRange Arabic, fallbacks: [], optimizedFallbacks: false)" : ""}`).join("\n")}
 * See sites/studio/astro.config.ts for a working registration of every family.
 */
export const brand = defineBrand(${json});
`;
}
