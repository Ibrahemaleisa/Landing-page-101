/**
 * The brand colour of a logo: the most common clearly-coloured pixel group, ignoring transparency,
 * near-white, near-black and greys (logo backgrounds and outlines). Falls back to the darkest common
 * colour for a black-and-white logo.
 */
import type { Hex } from "@landing/kit/brand";

const hex = (r: number, g: number, b: number) => ("#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")) as Hex;

/** `data` is RGBA pixels, as in `ImageData.data`. */
export function dominantColor(data: Uint8ClampedArray | number[]): Hex | null {
  const buckets = new Map<number, { n: number; r: number; g: number; b: number; sat: number }>();
  const greys = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i + 3 < data.length; i += 4) {
    const [r, g, b, a] = [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
    if (a < 128) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    if (max - min < 40 || min > 225 || max < 30) {
      if (min > 225) continue; // white backgrounds never make a brand colour
      const e = greys.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      greys.set(key, { n: e.n + 1, r: e.r + r, g: e.g + g, b: e.b + b });
      continue;
    }
    const e = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0, sat: 0 };
    buckets.set(key, { n: e.n + 1, r: e.r + r, g: e.g + g, b: e.b + b, sat: e.sat + (max - min) });
  }
  // weight by saturation so a small vivid mark beats a large muted area
  let best: { n: number; r: number; g: number; b: number; sat: number } | undefined;
  for (const e of buckets.values()) if (!best || e.n * (e.sat / e.n) > best.n * (best.sat / best.n)) best = e;
  if (best) return hex(best.r / best.n, best.g / best.n, best.b / best.n);
  let grey: { n: number; r: number; g: number; b: number } | undefined;
  for (const e of greys.values()) if (!grey || e.n > grey.n) grey = e;
  return grey ? hex(grey.r / grey.n, grey.g / grey.n, grey.b / grey.n) : null;
}

/** Reads an image file in the browser and returns its brand colour. */
export async function logoColor(file: Blob): Promise<Hex | null> {
  const bitmap = await createImageBitmap(file);
  const size = 64;
  const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return dominantColor(ctx.getImageData(0, 0, w, h).data);
}
