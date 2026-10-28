// @ts-check
import { defineConfig, fontProviders } from "astro/config";

/** @param {string} path */
const nm = (path) => `./node_modules/${path}`;
const plexAr = /** @param {number} w */ (w) => nm(`@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`);
const ARABIC =
  "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC";

export default defineConfig({
  site: "https://opera.example",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "auto" },
  image: { layout: "constrained" },
  fonts: [
    {
      // Jost — the brand's Latin face (OFL)
      name: "Jost",
      cssVariable: "--font-jost",
      provider: fontProviders.local(),
      fallbacks: ["sans-serif"],
      options: { variants: [{ src: [nm("@fontsource-variable/jost/files/jost-latin-wght-normal.woff2")], weight: "300 600", style: "normal" }] },
    },
    {
      // IBM Plex Sans Arabic stands in for Thmanyah Sans, whose licence forbids redistribution.
      // Arabic-only face leading a mixed stack: no fallbacks of its own (see ADR 0009).
      name: "IBM Plex Sans Arabic",
      cssVariable: "--font-plex-ar",
      provider: fontProviders.local(),
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          { src: [plexAr(300)], weight: 300, style: "normal", unicodeRange: [ARABIC] },
          { src: [plexAr(400)], weight: 400, style: "normal", unicodeRange: [ARABIC] },
          { src: [plexAr(500)], weight: 500, style: "normal", unicodeRange: [ARABIC] },
          { src: [plexAr(600)], weight: 600, style: "normal", unicodeRange: [ARABIC] },
        ],
      },
    },
  ],
});
