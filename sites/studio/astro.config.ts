import { defineConfig, fontProviders } from "astro/config";
import { ARABIC_RANGE, FONT_FAMILIES, cssVar, fontFiles } from "./src/studio/fonts";

export default defineConfig({
  site: "https://studio.example",
  trailingSlash: "always",
  build: { format: "directory" },
  fonts: FONT_FAMILIES.map((f) =>
    f.script === "arabic"
      ? {
          name: f.name,
          cssVariable: cssVar(f.id),
          provider: fontProviders.local(),
          fallbacks: [],
          optimizedFallbacks: false,
          options: {
            variants: fontFiles(f).map((v) => ({ src: [v.src], weight: v.weight, style: "normal" as const, unicodeRange: [ARABIC_RANGE] as [string] })) as [
              never,
              ...never[],
            ],
          },
        }
      : {
          name: f.name,
          cssVariable: cssVar(f.id),
          provider: fontProviders.local(),
          fallbacks: [f.generic ?? "sans-serif"],
          options: { variants: fontFiles(f).map((v) => ({ src: [v.src], weight: v.weight, style: "normal" as const })) as [never, ...never[]] },
        },
  ),
});
