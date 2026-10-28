import { defineBrand } from "@landing/kit/brand";

/**
 * Opera — Brand Guidelines v1.2 (2026), as mapped in Opera-OS/BRAND.md.
 * Personality: premium, composed, editorial. Night and Plum grounds with Mist pages between
 * them; Violet reserved for the one primary action and the "now" dot (≈3% of the surface);
 * Jost Medium headings, hairline rules instead of cards, generous rhythm, calm ease-out motion.
 */
const ink = "#170b26";
const mist = "#f5f2f8";
const violet = "#64228a";
const aubergine = "#3c1862";
const lilac = "#c9b3e6";

export const brand = defineBrand({
  name: "Opera",
  themeColor: "#08050e",
  color: {
    tones: {
      // Mist pages: statements, the formula, the brief
      base: {
        scheme: "light",
        bg: mist,
        fg: ink,
        fgMuted: "#5e5470",
        line: "#d6cce3",
        accent: violet,
        onAccent: mist,
        accentHover: aubergine,
        accentText: violet,
        ring: violet,
        surface: "#ffffff",
        surfaceLine: "#e3dbec",
        highlight: lilac,
        onHighlight: ink,
      },
      // Night: hero, work, technologies, the close
      night: {
        scheme: "dark",
        bg: "#08050e",
        bgImage: `radial-gradient(130% 130% at 0% 0%, ${aubergine} 0%, #1e0d33 42%, #08050e 100%)`,
        fg: mist,
        fgMuted: "#b4a8c8",
        line: "#2e2340",
        accent: violet,
        onAccent: mist,
        accentHover: aubergine,
        accentText: lilac,
        ring: lilac,
        surface: "#1e0d33",
        surfaceFgMuted: "#b9abcf",
        surfaceLine: "#33224d",
        highlight: lilac,
        onHighlight: ink,
      },
      // Plum: the capabilities index
      plum: {
        scheme: "dark",
        bg: "#1e0d33",
        fg: mist,
        fgMuted: "#b9abcf",
        line: "#3a2a55",
        accent: violet,
        onAccent: mist,
        accentHover: aubergine,
        accentText: lilac,
        ring: lilac,
        surface: "#2a1845",
        surfaceLine: "#3f2d5c",
        highlight: lilac,
        onHighlight: ink,
      },
    },
  },
  type: {
    families: {
      display: "var(--font-jost), system-ui, sans-serif",
      body: "var(--font-jost), system-ui, sans-serif",
    },
    scale: { minBase: 16, maxBase: 18, minRatio: 1.2, maxRatio: 1.333 },
    displayStep: 6,
    display: { weight: 500, leading: 1.04, tracking: "-0.01em" },
    heading: { weight: 500, leading: 1.1, tracking: "-0.01em" },
    body: { weight: 400, leading: 1.55 },
    label: { weight: 500, leading: 1.4, tracking: "0.08em", transform: "uppercase", step: -2 },
    locales: {
      ar: {
        // Plex Arabic is limited to the Arabic block, so Latin words and digits stay in Jost
        families: { display: "var(--font-plex-ar), var(--font-jost), sans-serif", body: "var(--font-plex-ar), var(--font-jost), sans-serif" },
        // Arabic reads at a larger optical size than Jost; scale it rather than size-adjust
        scale: { minBase: 17, maxBase: 19.5, minRatio: 1.18, maxRatio: 1.3 },
        display: { leading: 1.25 },
        heading: { leading: 1.35 },
        body: { leading: 1.8 },
        label: { step: -1 },
      },
    },
  },
  shape: { control: 8, card: 12, media: 8, badge: 999, border: 1 },
  elevation: { style: "flat" },
  space: { density: "airy" },
  motion: { duration: { fast: 150, base: 250, slow: 600 }, ease: "cubic-bezier(0.23, 1, 0.32, 1)", reveal: "rise", distance: 18 },
  layout: { container: 1224, gutter: { min: 20, max: 48 }, header: 72 },
  control: { height: 48, weight: 500 },
});
