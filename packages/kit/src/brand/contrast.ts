/**
 * WCAG 2.x contrast. Used by tests to gate every brand's tones, and available to sites that
 * want to check their own signature colours.
 */
import type { BrandConfig, Hex, Tone } from "./types";

export function parseHex(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Expected a hex colour like #1e0d33, got "${hex}"`);
  let h = m[1];
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** Relative luminance per WCAG 2.2 §1.4.3 definition. */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export interface ContrastCheck {
  tone: string;
  pair: string;
  fg: Hex;
  bg: Hex;
  ratio: number;
  min: number;
  /** `required` failures break the build; `advisory` ones are reported. */
  level: "required" | "advisory";
  pass: boolean;
}

/** Resolved roles with defaults applied. */
export function resolveTone(t: Tone) {
  return {
    ...t,
    heading: t.heading ?? t.fg,
    accentText: t.accentText ?? t.accent,
    accentHover: t.accentHover ?? t.accent,
    surfaceFg: t.surfaceFg ?? t.fg,
    surfaceFgMuted: t.surfaceFgMuted ?? t.fgMuted,
    surfaceLine: t.surfaceLine ?? t.line,
  };
}

export function checkTone(name: string, tone: Tone): ContrastCheck[] {
  const t = resolveTone(tone);
  const pairs: [string, Hex, Hex, number, ContrastCheck["level"]][] = [
    ["fg / bg", t.fg, t.bg, 4.5, "required"],
    ["fgMuted / bg", t.fgMuted, t.bg, 4.5, "required"],
    ["heading / bg", t.heading, t.bg, 4.5, "required"],
    ["heading / surface", t.heading, t.surface, 4.5, "required"],
    ["accentText / bg", t.accentText, t.bg, 4.5, "required"],
    ["onAccent / accent", t.onAccent, t.accent, 4.5, "required"],
    ["onAccent / accentHover", t.onAccent, t.accentHover, 4.5, "required"],
    ["surfaceFg / surface", t.surfaceFg, t.surface, 4.5, "required"],
    ["surfaceFgMuted / surface", t.surfaceFgMuted, t.surface, 4.5, "required"],
    // focus indicators: WCAG 2.4.13 / 1.4.11 non-text contrast
    ["ring / bg", t.ring, t.bg, 3, "required"],
    ["ring / surface", t.ring, t.surface, 3, "required"],
    // a filled button is identified by its label, so its edge is advisory (Understanding 1.4.11)
    ["accent / bg", t.accent, t.bg, 3, "advisory"],
    ["line / bg", t.line, t.bg, 1.5, "advisory"],
  ];
  if (t.highlight && t.onHighlight) pairs.push(["onHighlight / highlight", t.onHighlight, t.highlight, 4.5, "required"]);
  return pairs.map(([pair, fg, bg, min, level]) => {
    const ratio = contrast(fg, bg);
    return { tone: name, pair, fg, bg, ratio: Number(ratio.toFixed(2)), min, level, pass: ratio >= min };
  });
}

export function checkBrandContrast(brand: BrandConfig): ContrastCheck[] {
  return Object.entries(brand.color.tones).flatMap(([name, tone]) => checkTone(name, tone));
}

/** Throws with a readable table if any required pair fails. */
export function assertBrandContrast(brand: BrandConfig): void {
  const failures = checkBrandContrast(brand).filter((c) => c.level === "required" && !c.pass);
  if (failures.length) {
    const lines = failures.map((f) => `  ${f.tone}: ${f.pair} = ${f.ratio}:1 (needs ${f.min}:1) ${f.fg} on ${f.bg}`);
    throw new Error(`Brand "${brand.name}" fails contrast:\n${lines.join("\n")}`);
  }
}
