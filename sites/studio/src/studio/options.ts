/**
 * The studio's elements. Each group of choice cards in the studio is one of these lists, and the
 * sliders under it are its `TWEAKS`; `buildBrand()` turns a selection (one id per element, plus any
 * fine-tuning) into a complete Landing Kit brand, the same `BrandConfig` a real
 * site uses — so whatever you compose here can be exported as a `brand.ts`.
 */
import type { BrandConfig, ControlConfig, ElevationConfig, Hex, MotionConfig, ShapeConfig, SpaceConfig, TextStyle, TypeConfig } from "@landing/kit/brand";
import { isHex, withAccent } from "./color";
import { FONT_FAMILIES, cssVar } from "./fonts";
import { PALETTES } from "./palettes";

export type L = { ar: string; en: string };
export interface Option<T> {
  id: string;
  label: L;
  /** One plain sentence saying what this choice looks like, for people who don't speak design. */
  hint: L;
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
    hint: { ar: "واضح ومريح، يناسب أي مشروع", en: "Clear and comfortable; fits any project" },
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
    hint: { ar: "عصري وحاد، للمنتجات التقنية", en: "Modern and sharp, for tech products" },
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
    hint: { ar: "عناوين بطابع المجلات والصحف", en: "Magazine-style headlines" },
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
    hint: { ar: "أنيق وكلاسيكي، للعلامات الفاخرة", en: "Elegant and classic, for luxury brands" },
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
    hint: { ar: "دائري ولطيف، قريب من الناس", en: "Rounded and approachable" },
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
    hint: { ar: "أشكال هندسية نظيفة ومتوازنة", en: "Clean, balanced geometric shapes" },
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
    hint: { ar: "عريض وعصري بإحساس مستقبلي", en: "Wide and modern with a futuristic feel" },
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
    hint: { ar: "رسمي وموثوق للشركات", en: "Formal and trustworthy for companies" },
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
    hint: { ar: "جريء ولافت بشخصية قوية", en: "Bold and eye-catching" },
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
    hint: { ar: "مرِح وخفيف للتطبيقات والأطفال", en: "Playful and light, for apps and kids" },
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
  {
    id: "classic",
    hint: { ar: "كلاسيكي راقٍ بخط عربي تقليدي", en: "Refined and classic with a traditional Arabic face" },
    label: { ar: "كلاسيكي — Fraunces + أميري", en: "Classic — Fraunces + Amiri" },
    value: {
      latin: { display: "fraunces", body: "manrope" },
      arabic: { display: "amiri", body: "naskh" },
      display: { weight: 600, leading: 1.04, tracking: "-0.025em" },
      heading: { weight: 600, leading: 1.14, tracking: "-0.01em" },
      label: { weight: 600, leading: 1.3, tracking: "0.14em", transform: "uppercase", step: -2 },
      arLeading: { display: 1.5, heading: 1.55, body: 1.9 },
      generic: "serif",
    },
  },
  {
    id: "mono",
    hint: { ar: "خط برمجي بعرض ثابت، طابع تقني صريح", en: "Fixed-width code font with an honest technical feel" },
    label: { ar: "برمجي — JetBrains Mono + كوفي", en: "Code — JetBrains Mono + Kufi" },
    value: {
      latin: { display: "jetbrains", body: "inter", mono: "jetbrains" },
      arabic: { display: "kufi", body: "plex-ar" },
      display: { weight: 700, leading: 1.04, tracking: "-0.04em" },
      heading: { weight: 650, leading: 1.12, tracking: "-0.02em" },
      label: { weight: 500, leading: 1.3, tracking: "0.04em", transform: "uppercase", family: "mono", step: -2 },
      arLeading: { display: 1.4, heading: 1.45, body: 1.8 },
    },
  },
];

// ----------------------------------------------------------------------------------- scale

export const SCALES: Option<{ minRatio: number; maxRatio: number; maxBase: number; displayStep: NonNullable<TypeConfig["displayStep"]> }>[] = [
  {
    id: "modest",
    label: { ar: "هادئ", en: "Modest" },
    hint: { ar: "عناوين قريبة من حجم النص، مناسبة للمحتوى الكثير", en: "Headings close to body size; good for dense content" },
    value: { minRatio: 1.16, maxRatio: 1.2, maxBase: 17, displayStep: 6 },
  },
  {
    id: "balanced",
    label: { ar: "متوازن", en: "Balanced" },
    hint: { ar: "فرق واضح بين العناوين والنص بدون مبالغة", en: "A clear difference between headings and text, without excess" },
    value: { minRatio: 1.2, maxRatio: 1.25, maxBase: 18, displayStep: 6 },
  },
  {
    id: "dramatic",
    label: { ar: "درامي", en: "Dramatic" },
    hint: { ar: "عناوين كبيرة تلفت النظر على الشاشات العريضة", en: "Big headlines that grab attention on wide screens" },
    value: { minRatio: 1.22, maxRatio: 1.33, maxBase: 18, displayStep: 6 },
  },
  {
    id: "huge",
    label: { ar: "ضخم", en: "Huge" },
    hint: { ar: "عنوان الواجهة يملأ الشاشة، للصفحات الجريئة", en: "A hero headline that fills the screen, for bold pages" },
    value: { minRatio: 1.24, maxRatio: 1.36, maxBase: 18, displayStep: 7 },
  },
];

// ----------------------------------------------------------------------------------- buttons

export const BUTTONS: Option<{ radius: number; control: ControlConfig }>[] = [
  {
    id: "soft",
    label: { ar: "ناعمة", en: "Soft" },
    hint: { ar: "زوايا مستديرة قليلاً، الخيار الآمن", en: "Slightly rounded corners; the safe choice" },
    value: { radius: 10, control: { height: 48, weight: 600 } },
  },
  {
    id: "pill",
    label: { ar: "كبسولة", en: "Pill" },
    hint: { ar: "أطراف دائرية بالكامل، ودودة وعصرية", en: "Fully round ends; friendly and modern" },
    value: { radius: 999, control: { height: 48, weight: 600 } },
  },
  {
    id: "square",
    label: { ar: "مربعة", en: "Square" },
    hint: { ar: "زوايا حادة تماماً، رسمية وفخمة", en: "Perfectly sharp corners; formal and premium" },
    value: { radius: 0, control: { height: 48, weight: 600 } },
  },
  {
    id: "caps",
    label: { ar: "حروف كبيرة", en: "All caps" },
    hint: { ar: "الإنجليزي بحروف كبيرة ومتباعدة (العربي يبقى كما هو)", en: "Latin text in spaced capitals (Arabic is unchanged)" },
    value: { radius: 4, control: { height: 50, weight: 700, transform: "uppercase", tracking: "0.08em" } },
  },
  {
    id: "mono",
    label: { ar: "خط ثابت (تقني)", en: "Monospace" },
    hint: { ar: "خط برمجي بزوايا حادة، للمنتجات التقنية", en: "Code font with sharp corners, for tech products" },
    value: { radius: 0, control: { height: 48, weight: 600, transform: "uppercase", tracking: "0.04em", family: "mono" } },
  },
  {
    id: "bold",
    label: { ar: "عريضة وكبيرة", en: "Big & bold" },
    hint: { ar: "أزرار كبيرة وثقيلة يصعب تجاهلها", en: "Large, heavy buttons that are hard to miss" },
    value: { radius: 14, control: { height: 56, weight: 750 } },
  },
  {
    id: "compact",
    label: { ar: "صغيرة وخفيفة", en: "Compact" },
    hint: { ar: "أزرار أصغر وأخف، لواجهة هادئة", en: "Smaller, lighter buttons for a quiet interface" },
    value: { radius: 8, control: { height: 44, weight: 500 } },
  },
  {
    id: "rounded",
    label: { ar: "مستديرة كبيرة", en: "Rounded" },
    hint: { ar: "زوايا مستديرة واضحة، لطيفة وواثقة", en: "Clearly rounded corners; soft but confident" },
    value: { radius: 18, control: { height: 52, weight: 650 } },
  },
  {
    id: "display",
    label: { ar: "بخط العناوين", en: "Headline font" },
    hint: { ar: "الأزرار تستخدم نفس خط العناوين لشخصية موحّدة", en: "Buttons use the headline font for a unified voice" },
    value: { radius: 6, control: { height: 50, weight: 600, family: "display" } },
  },
  {
    id: "wide",
    label: { ar: "كبسولة متباعدة", en: "Wide caps pill" },
    hint: { ar: "كبسولة بحروف متباعدة، طابع أزياء وموضة", en: "A pill with widely spaced letters; a fashion feel" },
    value: { radius: 999, control: { height: 52, weight: 600, transform: "uppercase", tracking: "0.16em" } },
  },
];

// ----------------------------------------------------------------------------------- shape & borders

export const SHAPES: Option<Omit<ShapeConfig, "control">>[] = [
  {
    id: "sharp",
    label: { ar: "حادة بخط رفيع", en: "Sharp, hairline" },
    hint: { ar: "بطاقات بزوايا حادة وحدود رفيعة", en: "Cards with sharp corners and thin borders" },
    value: { card: 0, media: 0, badge: 0, border: 1 },
  },
  {
    id: "subtle",
    label: { ar: "انحناء خفيف", en: "Subtle" },
    hint: { ar: "استدارة بسيطة بالكاد تُلاحظ", en: "A gentle rounding you barely notice" },
    value: { card: 10, media: 8, badge: 6, border: 1 },
  },
  {
    id: "rounded",
    label: { ar: "مستديرة", en: "Rounded" },
    hint: { ar: "بطاقات مستديرة وودودة", en: "Friendly rounded cards" },
    value: { card: 18, media: 16, badge: 999, border: 1 },
  },
  {
    id: "soft-xl",
    label: { ar: "مستديرة جداً", en: "Extra round" },
    hint: { ar: "زوايا كبيرة جداً، ناعمة كالتطبيقات", en: "Very large corners, soft like a mobile app" },
    value: { card: 28, media: 24, badge: 999, border: 1 },
  },
  {
    id: "bold",
    label: { ar: "حادة بخط عريض", en: "Sharp, bold lines" },
    hint: { ar: "حدود سميكة وزوايا حادة، جريئة وخام", en: "Thick borders and sharp corners; bold and raw" },
    value: { card: 0, media: 0, badge: 0, border: 2 },
  },
  {
    id: "borderless",
    label: { ar: "بدون حدود", en: "Borderless" },
    hint: { ar: "بطاقات بلا خطوط حولها، تعتمد على اللون والظل", en: "Cards without outlines; colour and shadow do the work" },
    value: { card: 16, media: 14, badge: 999, border: 0 },
  },
  {
    id: "mixed",
    label: { ar: "مختلطة", en: "Mixed" },
    hint: { ar: "بطاقات شبه حادة وصور مستديرة، تباين لطيف", en: "Near-sharp cards with rounded images; a pleasing contrast" },
    value: { card: 4, media: 24, badge: 999, border: 1 },
  },
];

// ----------------------------------------------------------------------------------- elevation

export const ELEVATIONS: Option<ElevationConfig | "tinted">[] = [
  {
    id: "flat",
    label: { ar: "مسطّح", en: "Flat" },
    hint: { ar: "بدون ظلال، الحدود هي التي تفصل", en: "No shadows; borders separate things" },
    value: { style: "flat" },
  },
  {
    id: "soft",
    label: { ar: "ظل ناعم", en: "Soft shadow" },
    hint: { ar: "ظل خفيف يرفع البطاقات عن الخلفية", en: "A light shadow lifts cards off the page" },
    value: { style: "soft" },
  },
  {
    id: "tinted",
    label: { ar: "ظل ملوّن", en: "Tinted shadow" },
    hint: { ar: "ظل ناعم بلون العلامة بدل الأسود", en: "A soft shadow in the brand colour instead of black" },
    value: "tinted",
  },
  {
    id: "hard-sm",
    label: { ar: "ظل صلب خفيف", en: "Small offset" },
    hint: { ar: "ظل مصمت قصير، لمسة جرافيكية بسيطة", en: "A short solid shadow; a light graphic touch" },
    value: { style: "hard", offset: 2 },
  },
  {
    id: "hard",
    label: { ar: "ظل صلب", en: "Hard offset" },
    hint: { ar: "ظل مصمت بلون النص، طابع ملصقات", en: "A solid shadow in the text colour; poster-like" },
    value: { style: "hard", offset: 4 },
  },
  {
    id: "hard-xl",
    label: { ar: "ظل صلب عميق", en: "Deep offset" },
    hint: { ar: "ظل مصمت كبير، جريء جداً", en: "A large solid shadow; very bold" },
    value: { style: "hard", offset: 7 },
  },
];

// ----------------------------------------------------------------------------------- density

export const DENSITIES: Option<SpaceConfig["density"]>[] = [
  {
    id: "compact",
    label: { ar: "مدمج", en: "Compact" },
    hint: { ar: "مسافات قليلة، محتوى أكثر في الشاشة", en: "Less space, more content on screen" },
    value: "compact",
  },
  {
    id: "comfortable",
    label: { ar: "مريح", en: "Comfortable" },
    hint: { ar: "مسافات متوسطة، توازن جيد", en: "Medium spacing; a good balance" },
    value: "comfortable",
  },
  {
    id: "airy",
    label: { ar: "واسع", en: "Airy" },
    hint: { ar: "مسافات كبيرة تعطي إحساس الفخامة والهدوء", en: "Generous space that feels calm and premium" },
    value: "airy",
  },
];

// ----------------------------------------------------------------------------------- motion

export const MOTIONS: Option<MotionConfig>[] = [
  {
    id: "none",
    label: { ar: "بدون حركة", en: "None" },
    hint: { ar: "كل شيء ثابت، لا شيء يتحرك", en: "Everything stays still" },
    value: { duration: { fast: 0, base: 0, slow: 0 }, ease: "linear", reveal: "none" },
  },
  {
    id: "calm",
    label: { ar: "هادئة", en: "Calm" },
    hint: { ar: "حركة بطيئة وناعمة عند التمرير", en: "Slow, soft movement as you scroll" },
    value: { duration: { fast: 160, base: 260, slow: 650 }, ease: "cubic-bezier(0.23, 1, 0.32, 1)", reveal: "rise", distance: 20 },
  },
  {
    id: "smooth",
    label: { ar: "سلسة", en: "Smooth" },
    hint: { ar: "حركة متوسطة السرعة، طبيعية", en: "Medium-speed movement that feels natural" },
    value: { duration: { fast: 150, base: 220, slow: 450 }, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)", reveal: "rise", distance: 12 },
  },
  {
    id: "snappy",
    label: { ar: "سريعة", en: "Snappy" },
    hint: { ar: "استجابة فورية وظهور بالتلاشي فقط", en: "Instant response; content fades in" },
    value: { duration: { fast: 90, base: 140, slow: 240 }, ease: "cubic-bezier(0.2, 0, 0, 1)", reveal: "fade" },
  },
  {
    id: "bouncy",
    label: { ar: "مرنة", en: "Bouncy" },
    hint: { ar: "ترتد قليلاً عند الوصول، مرحة وحيوية", en: "Overshoots a little on arrival; playful and lively" },
    value: { duration: { fast: 180, base: 320, slow: 600 }, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)", reveal: "rise", distance: 24 },
  },
  {
    id: "dramatic",
    label: { ar: "سينمائية", en: "Cinematic" },
    hint: { ar: "حركة طويلة ومسافة كبيرة، دخول درامي", en: "Long, far movement for a dramatic entrance" },
    value: { duration: { fast: 200, base: 400, slow: 900 }, ease: "cubic-bezier(0.16, 1, 0.3, 1)", reveal: "rise", distance: 48 },
  },
  {
    id: "gentle",
    label: { ar: "تلاشٍ ناعم", en: "Gentle fade" },
    hint: { ar: "يظهر المحتوى بالتدريج بدون أن يتحرك من مكانه", en: "Content fades in slowly without moving" },
    value: { duration: { fast: 200, base: 300, slow: 700 }, ease: "ease-out", reveal: "fade" },
  },
  {
    id: "quick",
    label: { ar: "خاطفة", en: "Quick rise" },
    hint: { ar: "صعود قصير وسريع، حيوي بدون إزعاج", en: "A short, fast rise; lively without fuss" },
    value: { duration: { fast: 100, base: 160, slow: 300 }, ease: "cubic-bezier(0.2, 0, 0, 1)", reveal: "rise", distance: 8 },
  },
];

// ----------------------------------------------------------------------------------- templates

export const HEROES: Option<"display" | "split" | "centered" | "statement">[] = [
  {
    id: "display",
    label: { ar: "عرض كامل (تحريري)", en: "Full display (editorial)" },
    hint: { ar: "عنوان ضخم يملأ أول الصفحة مع صورة خلفه", en: "A huge headline filling the top, with an image behind" },
    value: "display",
  },
  {
    id: "split",
    label: { ar: "نص ومجسّم جنباً إلى جنب", en: "Split: copy + figure" },
    hint: { ar: "الكلام في جهة والصورة أو المنتج في الجهة الأخرى", en: "Words on one side, the picture or product on the other" },
    value: "split",
  },
  {
    id: "centered",
    label: { ar: "متمركز فوق المنتج", en: "Centred over product" },
    hint: { ar: "عنوان في المنتصف وصورة المنتج تحته", en: "A centred headline with the product below" },
    value: "centered",
  },
  {
    id: "statement",
    label: { ar: "عبارة كبيرة فقط", en: "Statement only" },
    hint: { ar: "جملة واحدة كبيرة بدون صور، بسيطة وواثقة", en: "One big sentence and no images; simple and confident" },
    value: "statement",
  },
];

/** A page template is an ordered list of [block, variant, tone]. Blocks are rendered once per variant in the preview. */
export type Block = [block: string, variant: string, tone: "base" | "muted" | "inverse" | "brand"];

export const PAGES: Option<Block[]>[] = [
  {
    id: "saas",
    label: { ar: "منتج رقمي (SaaS)", en: "SaaS product" },
    hint: { ar: "عرض المنتج والمزايا والأسعار والأسئلة", en: "Product tour, features, pricing and questions" },
    value: [
      ["logos", "grid", "base"],
      ["showcase", "tabs", "inverse"],
      ["features", "bento", "base"],
      ["steps", "cards", "muted"],
      ["quotes", "grid", "base"],
      ["pricing", "plans", "muted"],
      ["faq", "split", "base"],
      ["close", "band", "brand"],
    ],
  },
  {
    id: "editorial",
    label: { ar: "شركة تحريرية فاخرة", en: "Editorial company" },
    hint: { ar: "قصة الشركة وطريقة عملها بأسلوب مجلة", en: "The company's story and process, magazine-style" },
    value: [
      ["statement", "start", "base"],
      ["features", "index", "inverse"],
      ["narrative", "rows", "base"],
      ["steps", "timeline", "muted"],
      ["quotes", "featured", "inverse"],
      ["close", "split", "brand"],
    ],
  },
  {
    id: "marketplace",
    label: { ar: "سوق إلكتروني", en: "Marketplace" },
    hint: { ar: "كيف يعمل السوق، والأرقام، وأسئلة المشترين", en: "How the market works, the numbers, buyers' questions" },
    value: [
      ["features", "grid", "muted"],
      ["steps", "cards", "base"],
      ["narrative", "rows", "muted"],
      ["stats", "cards", "base"],
      ["faq", "split", "muted"],
      ["close", "panel", "base"],
    ],
  },
  {
    id: "portfolio",
    label: { ar: "صفحة شخصية / استوديو", en: "Portfolio / studio" },
    hint: { ar: "تعريف بك وبأعمالك ونموذج تواصل", en: "About you, your work, and a contact form" },
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
    hint: { ar: "مزايا وأرقام ومقارنة مع المنافسين وأسعار", en: "Features, numbers, a competitor comparison and pricing" },
    value: [
      ["logos", "row", "base"],
      ["features", "grid", "base"],
      ["stats", "row", "inverse"],
      ["compare", "table", "base"],
      ["pricing", "plans", "muted"],
      ["faq", "stacked", "base"],
      ["close", "band", "brand"],
    ],
  },
  {
    id: "agency",
    label: { ar: "وكالة خدمات", en: "Services agency" },
    hint: { ar: "خدماتك وإنجازاتك وآراء العملاء وطلب عرض سعر", en: "Your services, results, client reviews and a quote request" },
    value: [
      ["statement", "start", "muted"],
      ["features", "grid", "base"],
      ["stats", "row", "brand"],
      ["steps", "timeline", "base"],
      ["quotes", "grid", "muted"],
      ["contact", "form", "base"],
    ],
  },
  {
    id: "app",
    label: { ar: "تطبيق جوال", en: "Mobile app" },
    hint: { ar: "جولة في التطبيق وتقييمات المستخدمين ودعوة للتحميل", en: "An app tour, user ratings and a download call" },
    value: [
      ["logos", "row", "muted"],
      ["showcase", "tabs", "base"],
      ["stats", "cards", "inverse"],
      ["quotes", "featured", "base"],
      ["faq", "stacked", "muted"],
      ["close", "band", "brand"],
    ],
  },
  {
    id: "event",
    label: { ar: "فعالية أو مؤتمر", en: "Event" },
    hint: { ar: "فكرة الفعالية والبرنامج والأسئلة والتسجيل", en: "The idea, the programme, questions and registration" },
    value: [
      ["statement", "start", "inverse"],
      ["steps", "timeline", "base"],
      ["features", "list", "muted"],
      ["faq", "split", "base"],
      ["contact", "form", "muted"],
    ],
  },
];

/** Every section the preview can show, its variants, and the kit component that renders it (for the build brief). */
export const BLOCKS: Record<string, { label: L; component: string; variants: Record<string, L> }> = {
  statement: { label: { ar: "عبارة تعريفية", en: "Statement" }, component: "Statement", variants: { start: { ar: "عادية", en: "Standard" } } },
  logos: {
    label: { ar: "شعارات العملاء", en: "Client logos" },
    component: "LogoCloud",
    variants: { grid: { ar: "شبكة", en: "Grid" }, row: { ar: "صف", en: "Row" } },
  },
  showcase: { label: { ar: "جولة في المنتج", en: "Product tour" }, component: "Showcase", variants: { tabs: { ar: "تبويبات", en: "Tabs" } } },
  features: {
    label: { ar: "المزايا", en: "Features" },
    component: "Features",
    variants: {
      grid: { ar: "شبكة", en: "Grid" },
      list: { ar: "قائمة", en: "List" },
      index: { ar: "فهرس مرقّم", en: "Numbered index" },
      bento: { ar: "بطاقات متنوعة", en: "Bento" },
    },
  },
  narrative: {
    label: { ar: "مزايا بالصور", en: "Features with images" },
    component: "FeatureNarrative",
    variants: { rows: { ar: "صفوف متبادلة", en: "Alternating rows" } },
  },
  steps: {
    label: { ar: "خطوات العمل", en: "How it works" },
    component: "Steps",
    variants: { cards: { ar: "بطاقات", en: "Cards" }, timeline: { ar: "خط زمني", en: "Timeline" } },
  },
  stats: { label: { ar: "أرقام", en: "Numbers" }, component: "Stats", variants: { row: { ar: "صف", en: "Row" }, cards: { ar: "بطاقات", en: "Cards" } } },
  quotes: {
    label: { ar: "آراء العملاء", en: "Testimonials" },
    component: "Testimonials",
    variants: { grid: { ar: "شبكة", en: "Grid" }, featured: { ar: "رأي بارز", en: "Featured" } },
  },
  compare: { label: { ar: "مقارنة", en: "Comparison" }, component: "Comparison", variants: { table: { ar: "جدول", en: "Table" } } },
  pricing: { label: { ar: "الأسعار والباقات", en: "Pricing" }, component: "Pricing", variants: { plans: { ar: "باقات", en: "Plans" } } },
  faq: {
    label: { ar: "الأسئلة الشائعة", en: "FAQ" },
    component: "FAQ",
    variants: { split: { ar: "عمودين", en: "Two columns" }, stacked: { ar: "عمود واحد", en: "Stacked" } },
  },
  contact: { label: { ar: "نموذج تواصل", en: "Contact form" }, component: "Contact + Form", variants: { form: { ar: "نموذج", en: "Form" } } },
  close: {
    label: { ar: "دعوة ختامية", en: "Closing call to action" },
    component: "CTA",
    variants: { band: { ar: "شريط عريض", en: "Band" }, split: { ar: "عمودين", en: "Split" }, panel: { ar: "صندوق", en: "Panel" } },
  },
};

export const TONES: Record<Block[2], L> = {
  base: { ar: "الخلفية الأساسية", en: "Base" },
  muted: { ar: "خلفية هادئة", en: "Muted" },
  inverse: { ar: "خلفية معاكسة", en: "Inverse" },
  brand: { ar: "لون العلامة", en: "Brand colour" },
};

// ----------------------------------------------------------------------------------- selection

export const ELEMENTS = {
  palette: PALETTES.map((p) => ({ id: p.id, label: p.label, hint: p.hint })),
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

/** Each element's name and one plain sentence saying what it changes, for people who don't speak design. */
export const ELEMENT_INFO: Record<ElementKey, { label: L; hint: L }> = {
  palette: {
    label: { ar: "الألوان", en: "Colours" },
    hint: { ar: "ألوان الخلفيات والنصوص والأزرار في الصفحة كلها", en: "The colours of backgrounds, text and buttons across the page" },
  },
  type: {
    label: { ar: "الخطوط", en: "Typography" },
    hint: { ar: "شكل الحروف في العناوين والنصوص، بالعربي والإنجليزي", en: "The letter shapes of headings and text, in Arabic and English" },
  },
  scale: {
    label: { ar: "حجم العناوين", en: "Type scale" },
    hint: { ar: "كم تكبر العناوين مقارنة بالنص العادي", en: "How much bigger headings are than normal text" },
  },
  buttons: {
    label: { ar: "الأزرار", en: "Buttons" },
    hint: { ar: "شكل الأزرار التي يضغطها الزائر: الاستدارة والحجم والسماكة", en: "What visitors click: roundness, size and weight" },
  },
  shape: {
    label: { ar: "الزوايا والحدود", en: "Corners & borders" },
    hint: { ar: "استدارة زوايا البطاقات والصور، وسماكة الخطوط حولها", en: "How round cards and images are, and how thick their outlines" },
  },
  elevation: {
    label: { ar: "الظلال", en: "Shadows" },
    hint: { ar: "هل تبدو البطاقات مرفوعة عن الصفحة أم مسطّحة", en: "Whether cards look lifted off the page or flat" },
  },
  density: {
    label: { ar: "المسافات", en: "Spacing" },
    hint: { ar: "المساحة الفارغة بين الأقسام والعناصر", en: "The empty space between sections and items" },
  },
  motion: {
    label: { ar: "الحركة", en: "Motion" },
    hint: { ar: "كيف تظهر الأقسام عند التمرير وسرعة استجابة الأزرار", en: "How sections appear as you scroll, and how fast buttons react" },
  },
  hero: {
    label: { ar: "قالب الواجهة", en: "Hero template" },
    hint: { ar: "ترتيب أول جزء يراه الزائر أعلى الصفحة", en: "The layout of the first thing visitors see at the top" },
  },
  page: {
    label: { ar: "قالب الصفحة", en: "Page template" },
    hint: { ar: "الأقسام التي تظهر في الصفحة وترتيبها حسب نوع مشروعك", en: "Which sections the page has, and their order, for your kind of project" },
  },
};

// ----------------------------------------------------------------------------------- fine tuning

export type TweakId =
  "accent" | "headingWeight" | "baseSize" | "headline" | "btnRadius" | "btnHeight" | "btnWeight" | "cardRadius" | "border" | "width" | "speed" | "distance";

/** Fine-tuning on top of the chosen options. A missing key means "use the option's own value". */
export type Tweaks = Partial<Record<TweakId, number | string>>;

interface TweakBase {
  id: TweakId;
  group: ElementKey;
  label: L;
  hint: L;
}
export interface RangeTweak extends TweakBase {
  kind: "range";
  min: number;
  max: number;
  step: number;
  /** The value the chosen options give, shown when the slider hasn't been touched. */
  read: (s: Selection) => number;
  format: (v: number, s: Selection, lang: "ar" | "en") => string;
  /** When false the control is disabled (e.g. motion speed with motion turned off). */
  enabled?: (s: Selection) => boolean;
}
export interface ColorTweak extends TweakBase {
  kind: "color";
  read: (s: Selection) => Hex;
}
export type Tweak = RangeTweak | ColorTweak;

/** Button radius slider: its last stop means "fully round". */
const PILL_STOP = 32;
const px = (v: number) => `${v}px`;
const paletteOf = (s: Selection) => PALETTES.find((p) => p.id === s.palette) ?? PALETTES[0]!;
const moving = (s: Selection) => pick(MOTIONS, s.motion).reveal !== "none";

export const TWEAKS: Tweak[] = [
  {
    id: "accent",
    group: "palette",
    kind: "color",
    label: { ar: "لون الأزرار والروابط", en: "Button & link colour" },
    hint: {
      ar: "اختر أي لون تحبه، ونعدّل درجته تلقائياً إذا لزم حتى يبقى النص مقروءاً",
      en: "Pick any colour you like; we adjust its shade if needed so text stays readable",
    },
    read: (s) => paletteOf(s).tones.base.accent,
  },
  {
    id: "headingWeight",
    group: "type",
    kind: "range",
    min: 300,
    max: 800,
    step: 50,
    label: { ar: "سماكة العناوين", en: "Heading weight" },
    hint: { ar: "حرّك الشريط من رفيعة جداً إلى عريضة جداً", en: "Slide from very thin to very heavy" },
    read: (s) => pick(TYPOGRAPHY, s.type).display.weight,
    format: (v) => String(v),
  },
  {
    id: "baseSize",
    group: "scale",
    kind: "range",
    min: 16,
    max: 21,
    step: 1,
    label: { ar: "حجم النص العادي", en: "Body text size" },
    hint: { ar: "حجم خط الفقرات على الشاشات الكبيرة", en: "Paragraph size on large screens" },
    read: (s) => pick(SCALES, s.scale).maxBase,
    format: px,
  },
  {
    id: "headline",
    group: "scale",
    kind: "range",
    min: 4,
    max: 7,
    step: 1,
    label: { ar: "حجم عنوان الواجهة", en: "Hero headline size" },
    hint: { ar: "حجم أكبر عنوان في أعلى الصفحة", en: "The size of the biggest headline at the top" },
    read: (s) => pick(SCALES, s.scale).displayStep,
    format: (v, s) => {
      const sc = pick(SCALES, s.scale);
      return px(Math.round(sc.maxBase * sc.maxRatio ** v));
    },
  },
  {
    id: "btnRadius",
    group: "buttons",
    kind: "range",
    min: 0,
    max: PILL_STOP,
    step: 2,
    label: { ar: "استدارة الأزرار", en: "Button roundness" },
    hint: { ar: "0 زوايا حادة، وآخر الشريط كبسولة كاملة", en: "0 is sharp corners; the far end is a full pill" },
    read: (s) => Math.min(pick(BUTTONS, s.buttons).radius, PILL_STOP),
    format: (v, _s, lang) => (v >= PILL_STOP ? (lang === "ar" ? "كبسولة" : "Pill") : px(v)),
  },
  {
    id: "btnHeight",
    group: "buttons",
    kind: "range",
    min: 44,
    max: 60,
    step: 2,
    label: { ar: "ارتفاع الأزرار", en: "Button height" },
    hint: { ar: "أقل شيء 44 بكسل حتى يسهل الضغط بالإصبع", en: "At least 44px so they're easy to tap" },
    read: (s) => pick(BUTTONS, s.buttons).control.height,
    format: px,
  },
  {
    id: "btnWeight",
    group: "buttons",
    kind: "range",
    min: 400,
    max: 800,
    step: 50,
    label: { ar: "سماكة خط الأزرار", en: "Button text weight" },
    hint: { ar: "حرّك الشريط من خط عادي إلى خط عريض", en: "Slide from regular to bold text" },
    read: (s) => pick(BUTTONS, s.buttons).control.weight,
    format: (v) => String(v),
  },
  {
    id: "cardRadius",
    group: "shape",
    kind: "range",
    min: 0,
    max: 40,
    step: 2,
    label: { ar: "استدارة البطاقات والصور", en: "Card & image roundness" },
    hint: { ar: "0 زوايا حادة، وكلما زاد الرقم زادت الاستدارة", en: "0 is sharp; higher numbers are rounder" },
    read: (s) => pick(SHAPES, s.shape).card,
    format: px,
  },
  {
    id: "border",
    group: "shape",
    kind: "range",
    min: 0,
    max: 3,
    step: 1,
    label: { ar: "سماكة الحدود", en: "Border thickness" },
    hint: { ar: "الخط المحيط بالبطاقات، 0 يعني بدون خط", en: "The outline around cards; 0 means none" },
    read: (s) => pick(SHAPES, s.shape).border,
    format: px,
  },
  {
    id: "width",
    group: "density",
    kind: "range",
    min: 960,
    max: 1440,
    step: 40,
    label: { ar: "عرض المحتوى", en: "Content width" },
    hint: { ar: "أقصى عرض للمحتوى على الشاشات الكبيرة", en: "The widest the content gets on big screens" },
    read: () => 1200,
    format: px,
  },
  {
    id: "speed",
    group: "motion",
    kind: "range",
    min: 50,
    max: 200,
    step: 25,
    label: { ar: "سرعة الحركة", en: "Motion speed" },
    hint: { ar: "100% السرعة الأصلية، 200% ضعف السرعة", en: "100% is the original speed; 200% is twice as fast" },
    read: () => 100,
    format: (v) => `${v}%`,
    enabled: moving,
  },
  {
    id: "distance",
    group: "motion",
    kind: "range",
    min: 0,
    max: 48,
    step: 4,
    label: { ar: "مسافة ظهور الأقسام", en: "Reveal distance" },
    hint: { ar: "كم ترتفع الأقسام عند ظهورها، 0 يعني تلاشٍ فقط", en: "How far sections rise as they appear; 0 means fade only" },
    read: (s) => {
      const m = pick(MOTIONS, s.motion);
      return m.reveal === "rise" ? (m.distance ?? 16) : 0;
    },
    format: px,
    enabled: moving,
  },
];

/** Keeps only known tweaks with valid values (ranges clamped to their step grid). */
export function cleanTweaks(raw: Record<string, unknown>): Tweaks {
  const out: Tweaks = {};
  for (const t of TWEAKS) {
    const v = raw[t.id];
    if (v === undefined || v === null || v === "") continue;
    if (t.kind === "color") {
      if (typeof v === "string" && isHex(v)) out[t.id] = v.toLowerCase();
    } else {
      const n = Number(v);
      if (Number.isFinite(n)) out[t.id] = Math.min(t.max, Math.max(t.min, Math.round((n - t.min) / t.step) * t.step + t.min));
    }
  }
  return out;
}

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
      page: "app",
    },
  },
  {
    id: "bloom",
    label: { ar: "زهر", en: "Bloom" },
    description: { ar: "وردي راقٍ لعلامة جمال أو وكالة إبداعية", en: "Refined rose for a beauty brand or creative agency" },
    selection: {
      palette: "rose",
      type: "classic",
      scale: "balanced",
      buttons: "rounded",
      shape: "mixed",
      elevation: "soft",
      density: "airy",
      motion: "gentle",
      hero: "split",
      page: "agency",
    },
  },
  {
    id: "terminal",
    label: { ar: "طرفية", en: "Terminal" },
    description: { ar: "داكن وبرمجي لأداة مطورين أو تطبيق", en: "Dark and code-like for a developer tool or app" },
    selection: {
      palette: "graphite",
      type: "mono",
      scale: "modest",
      buttons: "compact",
      shape: "sharp",
      elevation: "hard-sm",
      density: "compact",
      motion: "quick",
      hero: "display",
      page: "app",
    },
  },
  {
    id: "festival",
    label: { ar: "مهرجان", en: "Festival" },
    description: { ar: "صاخب ومبهج لفعالية أو مؤتمر", en: "Loud and joyful for an event or conference" },
    selection: {
      palette: "sunset",
      type: "expressive",
      scale: "huge",
      buttons: "wide",
      shape: "borderless",
      elevation: "tinted",
      density: "comfortable",
      motion: "bouncy",
      hero: "statement",
      page: "event",
    },
  },
  {
    id: "gallery",
    label: { ar: "معرض", en: "Gallery" },
    description: { ar: "مساحات واسعة وعناوين ضخمة لمعرض أو مصمم", en: "Wide space and huge headlines for a gallery or designer" },
    selection: {
      palette: "ink",
      type: "editorial",
      scale: "huge",
      buttons: "display",
      shape: "sharp",
      elevation: "flat",
      density: "airy",
      motion: "dramatic",
      hero: "display",
      page: "agency",
    },
  },
];

export const DEFAULT_SELECTION: Selection = PRESETS[0]!.selection;

function pick<T>(list: readonly Option<T>[], id: string): T {
  return (list.find((o) => o.id === id) ?? list[0]!).value;
}

/** Returns the preset whose selection matches exactly, if any (fine-tuning makes it custom). */
export const matchPreset = (s: Selection, tweaks: Tweaks = {}) =>
  Object.keys(tweaks).length ? undefined : PRESETS.find((p) => (Object.keys(p.selection) as ElementKey[]).every((k) => p.selection[k] === s[k]));

const num = (v: number | string | undefined) => (typeof v === "number" ? v : undefined);

/** Any selection (plus optional fine-tuning) → a complete Landing Kit brand. */
export function buildBrand(s: Selection, name = "Studio", tweaks: Tweaks = {}): BrandConfig {
  const palette = paletteOf(s);
  const type = pick(TYPOGRAPHY, s.type);
  const scale = pick(SCALES, s.scale);
  const buttons = pick(BUTTONS, s.buttons);
  const shape = pick(SHAPES, s.shape);
  const elevationChoice = pick(ELEVATIONS, s.elevation);
  const motion = pick(MOTIONS, s.motion);
  const generic = type.generic ?? "sans-serif";
  const mono = type.latin.mono ?? "jetbrains";
  const tw = cleanTweaks(tweaks);

  const tones = typeof tw.accent === "string" && isHex(tw.accent) ? withAccent(palette.tones, tw.accent) : palette.tones;
  const elevation: ElevationConfig = elevationChoice === "tinted" ? { style: "soft", tint: tones.base.accent } : elevationChoice;

  const displayWeight = num(tw.headingWeight) ?? type.display.weight;
  const headingWeight = Math.max(300, displayWeight - (type.display.weight - type.heading.weight));

  const btnRadius = num(tw.btnRadius);
  const control = { ...buttons.control, height: num(tw.btnHeight) ?? buttons.control.height, weight: num(tw.btnWeight) ?? buttons.control.weight };

  const card = num(tw.cardRadius);
  const shapeOut = {
    ...shape,
    ...(card === undefined ? {} : { card, media: card, badge: card === 0 ? 0 : shape.badge }),
    border: num(tw.border) ?? shape.border,
    control: btnRadius === undefined ? buttons.radius : btnRadius >= PILL_STOP ? 999 : btnRadius,
  };

  const speed = (num(tw.speed) ?? 100) / 100;
  const distance = num(tw.distance);
  const motionOut: MotionConfig =
    motion.reveal === "none"
      ? motion
      : {
          ...motion,
          duration: {
            fast: Math.round(motion.duration.fast / speed),
            base: Math.round(motion.duration.base / speed),
            slow: Math.round(motion.duration.slow / speed),
          },
          ...(distance === undefined ? {} : distance === 0 ? { reveal: "fade" as const } : { reveal: "rise" as const, distance }),
        };

  return {
    name,
    themeColor: tones.base.bg,
    color: { tones },
    type: {
      families: {
        display: stack([type.latin.display], generic),
        body: stack([type.latin.body]),
        mono: stack([mono], "monospace"),
      },
      scale: { minBase: 16, maxBase: num(tw.baseSize) ?? scale.maxBase, minRatio: scale.minRatio, maxRatio: scale.maxRatio },
      displayStep: (num(tw.headline) as TypeConfig["displayStep"]) ?? scale.displayStep,
      display: { ...type.display, weight: displayWeight },
      heading: { ...type.heading, weight: headingWeight },
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
    shape: shapeOut,
    elevation,
    space: { density: pick(DENSITIES, s.density) },
    motion: motionOut,
    layout: { container: num(tw.width) ?? 1200, gutter: { min: 20, max: 44 }, header: 68 },
    control,
  };
}

/** The fonts a selection uses, for the export's install instructions. */
export function fontsFor(s: Selection) {
  const t = pick(TYPOGRAPHY, s.type);
  const ids = new Set([t.latin.display, t.latin.body, t.latin.mono ?? "jetbrains", t.arabic.display, t.arabic.body]);
  return FONT_FAMILIES.filter((f) => ids.has(f.id));
}

/** A ready-to-paste `src/brand.ts` for the current selection. */
export function exportBrand(s: Selection, name = "My Brand", tweaks: Tweaks = {}): string {
  const brand = buildBrand(s, name, tweaks);
  const fonts = fontsFor(s);
  const json = JSON.stringify(brand, null, 2).replace(/"([a-zA-Z]\w*)":/g, "$1:");
  const tw = Object.entries(cleanTweaks(tweaks));
  return `import { defineBrand } from "@landing/kit/brand";

/**
 * Exported from the Landing Kit style studio.
 * Selection: ${(Object.keys(ELEMENTS) as ElementKey[]).map((k) => `${k}=${s[k]}`).join(", ")}${tw.length ? `\n * Fine-tuning: ${tw.map(([k, v]) => `${k}=${v}`).join(", ")}` : ""}
 *
 * Fonts used (install in the site, register in astro.config.mjs with fontProviders.local()):
${fonts.map((f) => ` *   ${f.pkg}  →  cssVariable "${cssVar(f.id)}"${f.script === "arabic" ? "  (Arabic-only: unicodeRange Arabic, fallbacks: [], optimizedFallbacks: false)" : ""}`).join("\n")}
 * See sites/studio/astro.config.ts for a working registration of every family.
 */
export const brand = defineBrand(${json});
`;
}
