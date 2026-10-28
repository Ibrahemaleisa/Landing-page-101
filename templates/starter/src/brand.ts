import { defineBrand } from "@landing/kit/brand";

/**
 * Your brand. Start here: these values are a deliberately plain, neutral baseline so that nothing
 * in it looks like a finished identity. Change the tones, families, shape, elevation, density and
 * motion until the page feels like the product — see docs/guides/brand-customization.md.
 *
 * `pnpm test` checks every tone against WCAG contrast; it will tell you if a pair fails.
 */
export const brand = defineBrand({
  name: "__TITLE__",
  themeColor: "#f7f7f5",
  color: {
    tones: {
      base: {
        scheme: "light",
        bg: "#f7f7f5",
        fg: "#16191d",
        fgMuted: "#545b66",
        line: "#dcdfe3",
        accent: "#1f3a5f",
        onAccent: "#ffffff",
        accentHover: "#142843",
        accentText: "#1f3a5f",
        ring: "#1f3a5f",
        surface: "#ffffff",
      },
      inverse: {
        scheme: "dark",
        bg: "#16191d",
        fg: "#f7f7f5",
        fgMuted: "#b4bac3",
        line: "#343a42",
        accent: "#f7f7f5",
        onAccent: "#16191d",
        accentHover: "#dcdfe3",
        accentText: "#a9c7ee",
        ring: "#a9c7ee",
        surface: "#22272e",
      },
    },
  },
  type: {
    families: { display: "var(--font-inter), system-ui, sans-serif", body: "var(--font-inter), system-ui, sans-serif" },
    scale: { minBase: 16, maxBase: 18, minRatio: 1.2, maxRatio: 1.25 },
    displayStep: 5,
    display: { weight: 650, leading: 1.05, tracking: "-0.025em" },
    heading: { weight: 600, leading: 1.15, tracking: "-0.015em" },
    body: { weight: 400, leading: 1.6 },
    label: { weight: 600, leading: 1.3, tracking: "0.06em", transform: "uppercase", step: -2 },
    locales: {
      ar: {
        families: { display: "var(--font-plex-ar), var(--font-inter), sans-serif", body: "var(--font-plex-ar), var(--font-inter), sans-serif" },
        display: { weight: 600, leading: 1.3 },
        heading: { leading: 1.35 },
        body: { leading: 1.8 },
      },
    },
  },
  shape: { control: 8, card: 12, media: 12, badge: 999, border: 1 },
  elevation: { style: "soft" },
  space: { density: "comfortable" },
  motion: { duration: { fast: 150, base: 220, slow: 450 }, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)", reveal: "rise", distance: 12 },
  layout: { container: 1200, gutter: { min: 20, max: 40 }, header: 68 },
  control: { height: 48, weight: 600 },
});
