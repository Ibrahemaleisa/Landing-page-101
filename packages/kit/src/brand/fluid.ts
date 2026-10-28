/**
 * Fluid type and space, using the Utopia method (utopia.fyi): every step interpolates linearly
 * between a size at the smallest viewport and a size at the largest, expressed as a `clamp()` so
 * it respects the user's root font size (rem) and never needs breakpoints.
 */
import type { FluidScale } from "./types";

export const MIN_VIEWPORT = 360;
export const MAX_VIEWPORT = 1280;

const round = (n: number, places = 4) => Number(n.toFixed(places));

/** `clamp()` between two pixel sizes across the viewport range. */
export function fluid(minPx: number, maxPx: number, minVw = MIN_VIEWPORT, maxVw = MAX_VIEWPORT): string {
  if (minPx === maxPx) return `${round(minPx / 16)}rem`;
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  const lo = Math.min(minPx, maxPx);
  const hi = Math.max(minPx, maxPx);
  return `clamp(${round(lo / 16)}rem, ${round(intercept / 16)}rem + ${round(slope * 100)}vw, ${round(hi / 16)}rem)`;
}

/** Pixel sizes of one step of the scale at both ends of the viewport range. */
export function stepSizes(scale: FluidScale, step: number): { min: number; max: number } {
  return {
    min: scale.minBase * scale.minRatio ** step,
    max: scale.maxBase * scale.maxRatio ** step,
  };
}

export const TYPE_STEPS = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7] as const;

/** `--step-N` declarations for the type scale. */
export function typeScale(scale: FluidScale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const step of TYPE_STEPS) {
    const { min, max } = stepSizes(scale, step);
    out[`--step-${step}`] = fluid(min, max);
  }
  return out;
}

/** Space multipliers of the body size (Utopia's t-shirt scale). */
export const SPACE = {
  "3xs": 0.25,
  "2xs": 0.5,
  xs: 0.75,
  s: 1,
  m: 1.5,
  l: 2,
  xl: 3,
  "2xl": 4,
  "3xl": 6,
} as const;

/** Section block padding as a multiple of the body size, at min and max viewport. */
export const DENSITY = {
  compact: [3, 5],
  comfortable: [4, 7],
  airy: [5, 9],
} as const;

export function spaceScale(scale: FluidScale, density: keyof typeof DENSITY): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, mult] of Object.entries(SPACE)) {
    out[`--space-${name}`] = fluid(scale.minBase * mult, scale.maxBase * mult);
  }
  const [lo, hi] = DENSITY[density];
  out["--section-pad"] = fluid(scale.minBase * lo, scale.maxBase * hi);
  out["--section-gap"] = fluid(scale.minBase * (lo * 0.5), scale.maxBase * (hi * 0.45));
  return out;
}
