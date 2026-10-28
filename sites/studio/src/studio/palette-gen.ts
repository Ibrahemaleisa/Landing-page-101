/**
 * Palettes from one brand colour and a ground (paper, cool, warm, tinted, dark, night). The neutral
 * tones are built first, then `withAccent` derives every accent role and the brand band, nudging
 * shades until each required WCAG pair passes — the same guarantee as the hand-made palettes.
 */
import type { Hex, Tone } from "@landing/kit/brand";
import { mix, reach, withAccent } from "./color";
import type { Palette } from "./palettes";

export type Ground = "paper" | "cool" | "warm" | "tint" | "dark" | "night";

const WHITE = "#ffffff" as Hex;
const BLACK = "#000000" as Hex;

function ground(g: Ground, accent: Hex): { bg: Hex; fg: Hex; dark: boolean } {
  switch (g) {
    case "paper":
      return { bg: "#fafaf7", fg: "#16171b", dark: false };
    case "cool":
      return { bg: "#f4f7fa", fg: "#0f1720", dark: false };
    case "warm":
      return { bg: "#fbf6ef", fg: "#201a13", dark: false };
    case "tint":
      return { bg: mix(accent, WHITE, 0.93), fg: mix(accent, BLACK, 0.86), dark: false };
    case "dark":
      return { bg: "#111318", fg: "#eef0f3", dark: true };
    case "night":
      return { bg: mix(accent, BLACK, 0.9), fg: "#f4f1ec", dark: true };
  }
}

function neutral(bg: Hex, fg: Hex, dark: boolean, accent: Hex): Tone {
  const surface = dark ? mix(bg, WHITE, 0.06) : mix(bg, WHITE, 0.7);
  const highlight = dark ? mix(accent, WHITE, 0.55) : mix(accent, WHITE, 0.72);
  return {
    scheme: dark ? "dark" : "light",
    bg,
    fg,
    fgMuted: reach(mix(fg, bg, 0.42), [bg, surface], 4.5, fg),
    line: mix(bg, fg, dark ? 0.16 : 0.13),
    accent: fg,
    onAccent: bg,
    accentHover: mix(fg, bg, 0.15),
    ring: fg,
    surface,
    highlight,
    onHighlight: reach(mix(accent, BLACK, 0.85), [highlight], 4.5, BLACK),
  };
}

export function makePalette(id: string, label: Palette["label"], hint: Palette["hint"], accent: Hex, g: Ground): Palette {
  const { bg, fg, dark } = ground(g, accent);
  const base = neutral(bg, fg, dark, accent);
  const muted = neutral(dark ? mix(bg, WHITE, 0.04) : mix(bg, fg, 0.045), fg, dark, accent);
  // the contrasting band flips the ground
  const inverse = neutral(dark ? "#f4f2ee" : mix(fg, BLACK, 0.1), dark ? "#14151a" : bg, !dark, accent);
  const tones = withAccent({ base, muted, inverse, brand: base }, accent);
  // the inverse band's button fill stays its own text colour
  tones.inverse = { ...tones.inverse, accent: inverse.fg, onAccent: inverse.bg, accentHover: mix(inverse.fg, inverse.bg, 0.15) };
  return { id, label, hint, tones };
}

/** The generated library: [id, Arabic, English, accent, ground]. */
const LIBRARY: [string, string, string, Hex, Ground][] = [
  ["crimson", "قرمزي", "Crimson", "#c62828", "warm"],
  ["coral", "مرجاني", "Coral", "#e4572e", "warm"],
  ["amber", "كهرماني", "Amber", "#d98e04", "paper"],
  ["olive", "زيتوني", "Olive", "#6b7d2b", "warm"],
  ["emerald", "زمردي", "Emerald", "#0e8a5f", "cool"],
  ["teal", "فيروزي", "Teal", "#0f7c86", "cool"],
  ["sky", "سماوي", "Sky", "#1f8fd6", "cool"],
  ["indigo", "نيلي", "Indigo", "#4338ca", "paper"],
  ["violet", "بنفسجي", "Violet", "#7c3aed", "tint"],
  ["plum", "برقوقي", "Plum", "#8e2c6e", "tint"],
  ["blush", "وردي فاتح", "Blush", "#e0457b", "tint"],
  ["cocoa", "كاكاو", "Cocoa", "#7a4a2a", "warm"],
  ["saffron", "زعفراني", "Saffron", "#e0a100", "tint"],
  ["mint", "نعناعي", "Mint", "#17a589", "tint"],
  ["lavender", "خزامى", "Lavender", "#8b7bd8", "tint"],
  ["slate", "رصاصي", "Slate", "#475569", "cool"],
  ["gold-night", "ذهبي ليلي", "Night Gold", "#e2b04a", "night"],
  ["cyan-night", "سماوي ليلي", "Night Cyan", "#22d3ee", "dark"],
  ["lime-night", "ليموني ليلي", "Night Lime", "#a3e635", "dark"],
  ["magenta-night", "فوشي ليلي", "Night Magenta", "#f472b6", "night"],
  ["orange-night", "برتقالي ليلي", "Night Orange", "#fb923c", "dark"],
  ["violet-night", "بنفسجي ليلي", "Night Violet", "#a78bfa", "night"],
  ["emerald-night", "زمردي ليلي", "Night Emerald", "#34d399", "night"],
  ["red-night", "أحمر ليلي", "Night Red", "#f87171", "dark"],
];

const GROUND_HINT: Record<Ground, { ar: string; en: string }> = {
  paper: { ar: "على خلفية ورقية محايدة", en: "on a neutral paper ground" },
  cool: { ar: "على خلفية باردة مائلة للأزرق", en: "on a cool, bluish ground" },
  warm: { ar: "على خلفية دافئة كريمية", en: "on a warm cream ground" },
  tint: { ar: "على خلفية مشبعة بنفس اللون", en: "on a ground tinted with the same colour" },
  dark: { ar: "على خلفية داكنة", en: "on a dark ground" },
  night: { ar: "على خلفية ليلية بنفس اللون", en: "on a night ground of the same hue" },
};

export const GENERATED_PALETTES: Palette[] = LIBRARY.map(([id, ar, en, accent, g]) =>
  makePalette(id, { ar, en }, { ar: `${ar} ${GROUND_HINT[g].ar}`, en: `${en} ${GROUND_HINT[g].en}` }, accent, g),
);
