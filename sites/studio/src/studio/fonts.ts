/**
 * Every font family the studio can use, self-hosted from @fontsource packages. Browsers only
 * download a face when text actually uses it, so registering all of them costs nothing until a
 * typography option selects them.
 *
 * Arabic faces are registered with the Arabic block only and no fallbacks of their own, so they can
 * lead a mixed stack and let Latin glyphs fall through (see docs/guides/brand-customization.md#fonts).
 */
export interface FontFamily {
  id: string;
  name: string;
  /** Package folder under node_modules. */
  pkg: string;
  script: "latin" | "arabic";
  /** Variable weight range, or the static weights to register. */
  weights: string | number[];
  /** CSS generic family used as the last fallback for Latin faces. */
  generic?: "sans-serif" | "serif" | "monospace";
}

/** Arabic blocks plus the space characters, so word spaces in Arabic text come from the Arabic face
 * (otherwise a monospace Latin face behind it would supply its wide space). */
export const ARABIC_RANGE =
  "U+0020, U+00A0, U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC";

export const FONT_FAMILIES: FontFamily[] = [
  // Latin
  { id: "inter", name: "Inter", pkg: "@fontsource-variable/inter", script: "latin", weights: "100 900" },
  { id: "space-grotesk", name: "Space Grotesk", pkg: "@fontsource-variable/space-grotesk", script: "latin", weights: "300 700" },
  { id: "jetbrains", name: "JetBrains Mono", pkg: "@fontsource-variable/jetbrains-mono", script: "latin", weights: "100 800", generic: "monospace" },
  { id: "fraunces", name: "Fraunces", pkg: "@fontsource-variable/fraunces", script: "latin", weights: "100 900", generic: "serif" },
  { id: "playfair", name: "Playfair Display", pkg: "@fontsource-variable/playfair-display", script: "latin", weights: "400 900", generic: "serif" },
  { id: "manrope", name: "Manrope", pkg: "@fontsource-variable/manrope", script: "latin", weights: "200 800" },
  { id: "dm-sans", name: "DM Sans", pkg: "@fontsource-variable/dm-sans", script: "latin", weights: "100 1000" },
  { id: "outfit", name: "Outfit", pkg: "@fontsource-variable/outfit", script: "latin", weights: "100 900" },
  { id: "sora", name: "Sora", pkg: "@fontsource-variable/sora", script: "latin", weights: "100 800" },
  { id: "plex-sans", name: "IBM Plex Sans", pkg: "@fontsource-variable/ibm-plex-sans", script: "latin", weights: "100 700" },
  { id: "bricolage", name: "Bricolage Grotesque", pkg: "@fontsource-variable/bricolage-grotesque", script: "latin", weights: "200 800" },
  { id: "baloo-latin", name: "Baloo Bhaijaan 2", pkg: "@fontsource-variable/baloo-bhaijaan-2", script: "latin", weights: "400 800" },
  // Arabic
  { id: "plex-ar", name: "IBM Plex Sans Arabic", pkg: "@fontsource/ibm-plex-sans-arabic", script: "arabic", weights: [300, 400, 500, 600, 700] },
  { id: "readex", name: "Readex Pro", pkg: "@fontsource-variable/readex-pro", script: "arabic", weights: "160 700" },
  { id: "naskh", name: "Noto Naskh Arabic", pkg: "@fontsource-variable/noto-naskh-arabic", script: "arabic", weights: "400 700" },
  { id: "amiri", name: "Amiri", pkg: "@fontsource/amiri", script: "arabic", weights: [400, 700] },
  { id: "tajawal", name: "Tajawal", pkg: "@fontsource/tajawal", script: "arabic", weights: [300, 400, 500, 700, 800] },
  { id: "cairo", name: "Cairo", pkg: "@fontsource-variable/cairo", script: "arabic", weights: "200 1000" },
  { id: "alexandria", name: "Alexandria", pkg: "@fontsource-variable/alexandria", script: "arabic", weights: "100 900" },
  { id: "changa", name: "Changa", pkg: "@fontsource-variable/changa", script: "arabic", weights: "200 800" },
  { id: "kufi", name: "Noto Kufi Arabic", pkg: "@fontsource-variable/noto-kufi-arabic", script: "arabic", weights: "100 900" },
  { id: "messiri", name: "El Messiri", pkg: "@fontsource-variable/el-messiri", script: "arabic", weights: "400 700" },
  { id: "baloo-ar", name: "Baloo Bhaijaan 2 Arabic", pkg: "@fontsource-variable/baloo-bhaijaan-2", script: "arabic", weights: "400 800" },
];

export const cssVar = (id: string) => `--font-${id}`;

/** The woff2 files for one family, by the @fontsource naming scheme. */
export function fontFiles(f: FontFamily): { src: string; weight: string | number }[] {
  const base = f.pkg.split("/")[1]!;
  const subset = f.script;
  const dir = `./node_modules/${f.pkg}/files`;
  if (typeof f.weights === "string") return [{ src: `${dir}/${base}-${subset}-wght-normal.woff2`, weight: f.weights }];
  return f.weights.map((w) => ({ src: `${dir}/${base}-${subset}-${w}-normal.woff2`, weight: w }));
}
