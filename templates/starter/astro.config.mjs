// @ts-check
import { defineConfig, fontProviders } from "astro/config";

/** @param {string} path */
const nm = (path) => `./node_modules/${path}`;
const ARABIC =
  "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC";

export default defineConfig({
  site: "__URL__",
  trailingSlash: "always",
  build: { format: "directory" },
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.local(),
      fallbacks: ["sans-serif"],
      options: { variants: [{ src: [nm("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")], weight: "100 900", style: "normal" }] },
    },
    {
      // Arabic-only face leading the Arabic stack: no fallbacks of its own (docs/guides/brand-customization.md#fonts)
      name: "IBM Plex Sans Arabic",
      cssVariable: "--font-plex-ar",
      provider: fontProviders.local(),
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            src: [nm("@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2")],
            weight: 400,
            style: "normal",
            unicodeRange: [ARABIC],
          },
          {
            src: [nm("@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2")],
            weight: 600,
            style: "normal",
            unicodeRange: [ARABIC],
          },
        ],
      },
    },
  ],
});
