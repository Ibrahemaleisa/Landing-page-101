// @ts-check
import { defineConfig, fontProviders } from "astro/config";

/** @param {string} pkg @param {string} file */
const fs = (pkg, file) => `./node_modules/@fontsource/${pkg}/files/${file}`;

/**
 * Static (non-variable) faces: one variant per weight file.
 * @param {string} pkg @param {string} subset @param {[number, ...number[]]} list @param {[string, ...string[]]} [unicodeRange]
 */
const weights = (pkg, subset, [first, ...rest], unicodeRange) => {
  /** @param {number} w */
  const variant = (w) => ({ src: /** @type {[string]} */ ([fs(pkg, `${pkg}-${subset}-${w}-normal.woff2`)]), weight: String(w), style: /** @type {const} */ ("normal"), ...(unicodeRange ? { unicodeRange } : {}) });
  return /** @type {[ReturnType<typeof variant>, ...ReturnType<typeof variant>[]]} */ ([variant(first), ...rest.map(variant)]);
};

/** @type {[string]} */
const ARABIC_RANGE = ["U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC"];

export default defineConfig({
  site: "https://qitah.example",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "auto" },
  fonts: [
    {
      name: "IBM Plex Sans",
      cssVariable: "--font-plex-sans",
      provider: fontProviders.local(),
      fallbacks: ["system-ui", "sans-serif"],
      // 400 body · 600 controls and labels · 700 headings and prices (tabular figures)
      options: { variants: weights("ibm-plex-sans", "latin", [400, 600, 700]) },
    },
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      provider: fontProviders.local(),
      fallbacks: ["monospace"],
      // part numbers and VINs
      options: { variants: weights("ibm-plex-mono", "latin", [400, 500]) },
    },
    {
      name: "IBM Plex Sans Arabic",
      cssVariable: "--font-plex-arabic",
      provider: fontProviders.local(),
      // Arabic-only face that leads a mixed stack: no fallbacks of its own, so Latin glyphs (digits,
      // prices, model names) fall through to IBM Plex Sans instead of a generated Arial fallback.
      fallbacks: [],
      optimizedFallbacks: false,
      options: { variants: weights("ibm-plex-sans-arabic", "arabic", [400, 600, 700], ARABIC_RANGE) },
    },
  ],
});
