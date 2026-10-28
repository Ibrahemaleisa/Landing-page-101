/**
 * Custom accent colour: re-derives a palette's accent roles from any colour the user picks, nudging
 * lightness until every required pair still meets WCAG (4.5:1 text, 3:1 focus ring). The palette's
 * backgrounds and text colours stay as designed; only the accent roles and the `brand` band change.
 */
import { contrast, parseHex, type Hex, type Tone } from "@landing/kit/brand";
import type { Palette } from "./palettes";

const WHITE = "#ffffff" as Hex;
const BLACK = "#000000" as Hex;

export const isHex = (v: string): v is Hex => /^#[0-9a-f]{6}$/i.test(v);

const toHex = (rgb: number[]) =>
  ("#" +
    rgb
      .map((c) =>
        Math.round(Math.min(255, Math.max(0, c)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")) as Hex;

/** Linear sRGB mix: t = 0 → a, t = 1 → b. */
export function mix(a: string, b: string, t: number): Hex {
  const [x, y] = [parseHex(a), parseHex(b)];
  return toHex(x.map((c, i) => c + (y[i]! - c) * t));
}

/** Moves `c` toward `toward` in small steps until it reaches `min` contrast against every colour in `against`. */
function reach(c: Hex, against: string[], min: number, toward: Hex): Hex {
  for (let i = 0; i <= 20; i++) {
    const v = mix(c, toward, i / 20);
    if (against.every((bg) => contrast(v, bg) >= min)) return v;
  }
  return toward;
}

/** Text colour for a fill: whichever of white or near-black reads better. */
const textOn = (fill: string): Hex => (contrast(fill, WHITE) >= contrast(fill, "#111111") ? WHITE : ("#111111" as Hex));

/** A fill that holds 4.5:1 with its own text colour, and that text colour. */
function fillPair(c: Hex): { fill: Hex; on: Hex } {
  const on = textOn(c);
  return { fill: reach(c, [on], 4.5, on === WHITE ? BLACK : WHITE), on };
}

function accentTone(t: Tone, c: Hex): Tone {
  const { fill, on } = fillPair(c);
  const away = on === WHITE ? BLACK : WHITE;
  const hover = reach(mix(fill, away, 0.18), [on], 4.5, away);
  const surfaces = [t.bg, t.surface];
  const dark = t.scheme === "dark";
  const text = reach(c, surfaces, 4.5, dark ? WHITE : BLACK);
  return { ...t, accent: fill, onAccent: on, accentHover: hover, accentText: text, ring: reach(c, surfaces, 3, dark ? WHITE : BLACK) };
}

/** Accent text and focus ring only (the inverse band keeps its own button fill). */
function accentTextTone(t: Tone, c: Hex): Tone {
  const toward = t.scheme === "dark" ? WHITE : BLACK;
  const surfaces = [t.bg, t.surface];
  return { ...t, accentText: reach(c, surfaces, 4.5, toward), ring: reach(c, surfaces, 3, toward) };
}

/** The brand band painted in the custom colour. */
function brandTone(t: Tone, c: Hex): Tone {
  const { fill: bg, on: fg } = fillPair(c);
  const dark = fg === WHITE;
  const away = dark ? BLACK : WHITE;
  const surface = reach(mix(bg, away, 0.16), [fg], 4.5, away);
  const muted = reach(mix(fg, bg, 0.2), [bg, surface], 4.5, fg);
  const onAccent = reach(bg, [fg], 4.5, away);
  return {
    scheme: dark ? "dark" : "light",
    bg,
    fg,
    fgMuted: muted,
    line: mix(bg, fg, 0.28),
    accent: fg,
    onAccent,
    accentHover: reach(mix(fg, bg, 0.1), [onAccent], 4.5, fg),
    accentText: fg,
    ring: fg,
    surface,
    surfaceFgMuted: muted,
    highlight: t.highlight,
    onHighlight: t.onHighlight,
  };
}

/** The palette's tones with every accent role derived from `c`. */
export function withAccent(tones: Palette["tones"], c: Hex): Palette["tones"] {
  return {
    base: accentTone(tones.base, c),
    muted: accentTone(tones.muted, c),
    inverse: accentTextTone(tones.inverse, c),
    brand: brandTone(tones.brand, c),
  };
}
