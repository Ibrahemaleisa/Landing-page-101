import { defineBrand } from "@landing/kit/brand";

/**
 * Kitebase — a fictional feature-flag and experimentation platform.
 * Personality: engineered, candid, a little loud. Paper and ink with a lime highlighter;
 * square corners, 2px rules and hard offset shadows; monospace labels and controls; snappy
 * motion. Deliberately the opposite of Opera's soft, dark editorial calm.
 */
export const brand = defineBrand({
  name: "Kitebase",
  themeColor: "#f4f0e6",
  color: {
    tones: {
      base: {
        scheme: "light",
        bg: "#f4f0e6",
        fg: "#151412",
        fgMuted: "#57524a",
        line: "#151412",
        accent: "#151412",
        onAccent: "#f4f0e6",
        accentHover: "#34312b",
        accentText: "#151412",
        ring: "#3a2be0",
        surface: "#fffdf7",
        surfaceLine: "#151412",
        highlight: "#d4f53c",
        onHighlight: "#151412",
      },
      inverse: {
        scheme: "dark",
        bg: "#151412",
        fg: "#f4f0e6",
        fgMuted: "#b8b1a2",
        line: "#5c5850",
        accent: "#d4f53c",
        onAccent: "#151412",
        accentHover: "#e4fb7d",
        accentText: "#d4f53c",
        ring: "#d4f53c",
        surface: "#22211e",
        surfaceLine: "#f4f0e6",
        highlight: "#d4f53c",
        onHighlight: "#151412",
      },
      brand: {
        scheme: "light",
        bg: "#d4f53c",
        fg: "#151412",
        fgMuted: "#3b4310",
        line: "#151412",
        accent: "#151412",
        onAccent: "#f4f0e6",
        accentHover: "#34312b",
        accentText: "#151412",
        ring: "#151412",
        surface: "#f4f0e6",
        surfaceLine: "#151412",
        highlight: "#151412",
        onHighlight: "#d4f53c",
      },
    },
  },
  type: {
    families: {
      display: "var(--font-space-grotesk), system-ui, sans-serif",
      body: "var(--font-space-grotesk), system-ui, sans-serif",
      mono: "var(--font-jetbrains), ui-monospace, monospace",
    },
    scale: { minBase: 16, maxBase: 18, minRatio: 1.25, maxRatio: 1.38 },
    displayStep: 5,
    display: { weight: 700, leading: 0.95, tracking: "-0.045em" },
    heading: { weight: 700, leading: 1.05, tracking: "-0.03em" },
    body: { weight: 400, leading: 1.55 },
    label: { weight: 500, leading: 1.3, tracking: "0.06em", transform: "uppercase", family: "mono", step: -2 },
    locales: {
      ar: {
        // Arabic face first: its unicode-range is Arabic-only, so Latin runs fall through to the
        // Latin faces. (Astro's font variables end in a generic family, which would otherwise
        // catch Arabic glyphs before the Arabic face is reached.)
        families: {
          display: "var(--font-readex), var(--font-space-grotesk)",
          body: "var(--font-readex), var(--font-space-grotesk)",
          mono: "var(--font-readex), var(--font-jetbrains)",
        },
        display: { weight: 600, leading: 1.2 },
        heading: { weight: 600, leading: 1.3 },
        body: { leading: 1.8 },
        label: { family: "body", step: -1 },
      },
    },
  },
  shape: { control: 0, card: 0, media: 0, badge: 0, border: 2 },
  elevation: { style: "hard", offset: 4 },
  space: { density: "comfortable" },
  motion: { duration: { fast: 100, base: 160, slow: 280 }, ease: "cubic-bezier(0.2, 0, 0, 1)", reveal: "fade" },
  layout: { container: 1200, gutter: { min: 20, max: 40 }, header: 68 },
  control: { height: 48, weight: 600, transform: "uppercase", tracking: "0.04em", family: "mono" },
});
