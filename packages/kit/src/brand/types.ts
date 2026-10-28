/** A colour in hex notation (`#rgb` or `#rrggbb`). Hex only, so contrast can be checked at build time. */
export type Hex = `#${string}`;

/**
 * A tone is a complete colour scope for a region of the page. Sections pick a tone with
 * `data-tone="name"`; every component inside reads only these roles, so a button in an
 * inverse section is correct without knowing it is in one.
 */
export interface Tone {
  /** `light` or `dark`: sets `color-scheme` so form controls and scrollbars match. */
  scheme: "light" | "dark";
  bg: Hex;
  /** Optional decorative layer painted over `bg` (gradients, grain). Contrast is checked against `bg`. */
  bgImage?: string;
  fg: Hex;
  /** Heading colour (h1–h4, step titles, stat figures). Defaults to `fg`. */
  heading?: Hex;
  /** Secondary text. Must still meet 4.5:1 — never use opacity for text colour. */
  fgMuted: Hex;
  /** Hairlines and dividers (decorative; not contrast-gated). */
  line: Hex;
  /** Fill for the primary action and the "current" mark. */
  accent: Hex;
  /** Text and icons on `accent`. */
  onAccent: Hex;
  /** Hover/pressed fill for the primary action. Must keep 4.5:1 with `onAccent`. Defaults to `accent`. */
  accentHover?: Hex;
  /** Accent used as text on `bg` (links, highlighted words). Defaults to `accent`. */
  accentText?: Hex;
  /** Focus indicator. Must reach 3:1 against `bg` and `surface`. */
  ring: Hex;
  /** Cards and panels inside this tone. */
  surface: Hex;
  /** Text on `surface`. Defaults to `fg`. */
  surfaceFg?: Hex;
  /** Secondary text on `surface`. Defaults to `fgMuted`. */
  surfaceFgMuted?: Hex;
  /** Card borders. Defaults to `line`. */
  surfaceLine?: Hex;
  /** An optional marker colour (highlighter, badge) with its text colour. */
  highlight?: Hex;
  onHighlight?: Hex;
}

export interface FluidScale {
  /** Body size at the smallest viewport (px). */
  minBase: number;
  /** Body size at the largest viewport (px). */
  maxBase: number;
  /** Ratio between steps at the smallest viewport. */
  minRatio: number;
  /** Ratio between steps at the largest viewport. A larger value than `minRatio` gives drama on wide screens. */
  maxRatio: number;
}

export interface TextStyle {
  weight: number;
  /** Line height (unitless). */
  leading: number;
  /** Letter spacing, e.g. `-0.02em`. Forced to 0 for caseless scripts (Arabic, Hebrew, …). */
  tracking?: string;
  transform?: "none" | "uppercase";
}

export interface TypeConfig {
  /** CSS font-family lists. Reference Astro font variables, e.g. `var(--font-jost), sans-serif`. */
  families: { display: string; body: string; mono?: string };
  scale: FluidScale;
  /** Which scale step the hero display headline uses (default 6). */
  displayStep?: 3 | 4 | 5 | 6 | 7;
  display: TextStyle;
  heading: TextStyle;
  body: Omit<TextStyle, "transform">;
  /** Eyebrows, section labels, table headers. */
  label: TextStyle & { family?: "body" | "display" | "mono"; step?: -2 | -1 | 0 };
  /** Per-locale overrides (keyed by locale code). Families, leading and size adjustments for other scripts. */
  locales?: Record<string, LocaleTypeOverride>;
}

export interface LocaleTypeOverride {
  families?: Partial<TypeConfig["families"]>;
  scale?: Partial<FluidScale>;
  display?: Partial<TextStyle>;
  heading?: Partial<TextStyle>;
  body?: Partial<Omit<TextStyle, "transform">>;
  label?: Partial<TypeConfig["label"]>;
}

export interface ShapeConfig {
  /** Buttons and inputs (px). Use a large value (e.g. 999) for pills. */
  control: number;
  /** Cards and panels (px). */
  card: number;
  /** Images and media frames (px). */
  media: number;
  /** Small chips and badges (px). */
  badge: number;
  /** Border width for cards and outlined controls (px). */
  border: number;
}

export interface ElevationConfig {
  /**
   * `flat`: borders separate surfaces, no shadows.
   * `soft`: diffused shadows lift cards.
   * `hard`: solid offset shadows in the tone's foreground colour (neo-brutalist).
   */
  style: "flat" | "soft" | "hard";
  /** Offset for `hard` (px). Default 4. */
  offset?: number;
  /** Shadow colour for `soft` (e.g. the brand's ink or a tinted navy). Default black. */
  tint?: Hex;
}

export interface SpaceConfig {
  /** Section rhythm. `compact` for utility products, `airy` for editorial brands. */
  density: "compact" | "comfortable" | "airy";
}

export interface MotionConfig {
  /** Durations in ms. */
  duration: { fast: number; base: number; slow: number };
  /** CSS easing function. */
  ease: string;
  /** Scroll reveal style. `none` disables reveals for the brand. */
  reveal: "none" | "fade" | "rise";
  /** Distance for `rise` (px). */
  distance?: number;
}

export interface LayoutConfig {
  /** Max content width (px). */
  container: number;
  /** Inline page margin at smallest and largest viewport (px). */
  gutter: { min: number; max: number };
  /** Header height (px). Exposed as `--header-height`; used for scroll padding and overlay heroes. */
  header: number;
}

export interface ControlConfig {
  /** Control height (px). 44+ recommended (WCAG 2.5.8 needs 24; 44 is the comfortable target). */
  height: number;
  weight: number;
  transform?: "none" | "uppercase";
  tracking?: string;
  family?: "body" | "display" | "mono";
}

/**
 * Optional component styles: how buttons, headings, section edges, backgrounds, images, icons and
 * inputs look across the whole site. Each key is applied as a `data-lk-*` attribute on `<html>`
 * and styled by `styles/variants.css`. Leave a key out for the kit's default look.
 */
export interface ComponentsConfig {
  /** Primary button fill. */
  button?: "solid" | "outline" | "soft" | "gradient" | "raised" | "glow";
  /** Button hover effect. */
  hover?: "default" | "lift" | "grow" | "shine" | "arrow" | "none";
  /** Section heading alignment. */
  headingAlign?: "start" | "center";
  /** Eyebrow (small label above headings) style. */
  eyebrow?: "text" | "pill" | "line" | "dot";
  /** Decoration on section titles. */
  titleMark?: "none" | "bar" | "underline" | "accent";
  /** Shape where two sections of different tones meet. */
  divider?: "none" | "line" | "wave" | "slant" | "curve" | "zigzag";
  /** Background pattern. */
  pattern?: "none" | "dots" | "grid" | "lines" | "grain" | "glow" | "rings";
  /** Where the pattern shows. */
  patternScope?: "hero" | "page";
  /** Image treatment. */
  image?: "natural" | "rounded" | "framed" | "offset" | "grayscale" | "duotone";
  /** Feature icon container. */
  icon?: "filled" | "soft" | "circle" | "ring" | "plain";
  /** Form inputs. */
  input?: "outlined" | "filled" | "underline";
}

export interface BrandConfig {
  name: string;
  /** Theme colour for browser UI (usually the base tone background). */
  themeColor?: Hex;
  color: {
    /** Named tones. `base` is required and applies to the whole page by default. */
    tones: { base: Tone } & Record<string, Tone>;
  };
  type: TypeConfig;
  shape: ShapeConfig;
  elevation: ElevationConfig;
  space: SpaceConfig;
  motion: MotionConfig;
  layout: LayoutConfig;
  control: ControlConfig;
  components?: ComponentsConfig;
}

/** Identity function that gives brand files full type checking and inference. */
export function defineBrand<const T extends BrandConfig>(brand: T): T {
  return brand;
}
