// @ts-check
import { defineConfig, fontProviders } from "astro/config";

/** @param {string} pkg @param {string} file */
const fs = (pkg, file) => `./node_modules/@fontsource-variable/${pkg}/files/${file}`;

export default defineConfig({
  site: "https://kitebase.example",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "auto" },
  fonts: [
    {
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      provider: fontProviders.local(),
      fallbacks: ["sans-serif"],
      options: { variants: [{ src: [fs("space-grotesk", "space-grotesk-latin-wght-normal.woff2")], weight: "300 700", style: "normal" }] },
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      provider: fontProviders.local(),
      fallbacks: ["monospace"],
      options: { variants: [{ src: [fs("jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2")], weight: "100 800", style: "normal" }] },
    },
    {
      name: "Readex Pro",
      cssVariable: "--font-readex",
      provider: fontProviders.local(),
      // Arabic-only face that leads a mixed stack: no fallbacks of its own, so Latin glyphs fall
      // through to the next family in the brand's stack instead of a generated Arial fallback.
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            src: [fs("readex-pro", "readex-pro-arabic-wght-normal.woff2")],
            weight: "160 700",
            style: "normal",
            unicodeRange: [
              "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC",
            ],
          },
        ],
      },
    },
  ],
});
