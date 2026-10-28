import { defineBrand } from "@landing/kit/brand";

/**
 * Qitah (قطعة) — a Saudi multi-vendor marketplace for automotive spare parts.
 * Source of truth: Qitah Brand Guidelines v3.0 as implemented in the Qitah app
 * (`src/theme/tokens.ts`, `docs/brand-integration.md`).
 *
 * Personality: bright, clean, trustworthy, utility-first. Mist and white grounds, Qitah Blue for
 * headings, the one primary action and the brand band; Qitah Orange only as the signal (the logo
 * piece, the selected offer marker, the "current" step) — never as text on light grounds.
 * Rounded and soft: radii 6 badges · 12 controls · 16 cards, flat-to-soft elevation, compact
 * 4px rhythm, quick 150–250ms motion on the brand curve.
 */
const palette = {
  qitahBlue: "#022B74",
  qitahOrange: "#FE680E",
  white: "#FFFFFF",
  blue600: "#0B3A94",
  blue50: "#E8EEF8",
  mist: "#F5F7FA",
  slate: "#566179",
  ink: "#0A1633",
  // PROPOSED UI tints in the app (not in the guidelines)
  line: "#E3E8F0",
  lineStrong: "#CBD3E1",
  onBlueSecondary: "#C8D3E8",
  blueBorder: "#1C4594",
} as const;

/** Shared roles of the light grounds. */
const light = {
  scheme: "light",
  fg: palette.ink,
  // headings in Qitah Blue (guidelines p.11)
  heading: palette.qitahBlue,
  fgMuted: palette.slate,
  line: palette.lineStrong,
  accent: palette.qitahBlue,
  onAccent: palette.white,
  accentHover: palette.blue600,
  accentText: palette.qitahBlue,
  ring: palette.blue600,
  surfaceLine: palette.line,
  // the orange piece as a marker; text on it is Ink (6.1:1), never white (2.9:1)
  highlight: palette.qitahOrange,
  onHighlight: palette.ink,
} as const;

export const brand = defineBrand({
  name: "Qitah",
  themeColor: palette.mist,
  color: {
    tones: {
      /** Mist ground with white cards: the default page. */
      base: { ...light, bg: palette.mist, surface: palette.white },
      /** White band with mist cards. */
      muted: { ...light, bg: palette.white, surface: palette.mist },
      /** Blue 50 band for the product story. */
      tint: { ...light, bg: palette.blue50, surface: palette.white },
      /** Qitah Blue band: white text, on-blue secondary text, white button with blue text. */
      inverse: {
        scheme: "dark",
        bg: palette.qitahBlue,
        fg: palette.white,
        heading: palette.white,
        fgMuted: palette.onBlueSecondary,
        line: palette.blueBorder,
        accent: palette.white,
        onAccent: palette.qitahBlue,
        accentHover: palette.blue50,
        // Orange on Qitah Blue sits at exactly 4.5:1 — too close to the line for text; it stays a marker here too.
        accentText: palette.white,
        ring: palette.white,
        surface: palette.blue600,
        surfaceFg: palette.white,
        surfaceFgMuted: palette.onBlueSecondary,
        surfaceLine: palette.blueBorder,
        highlight: palette.qitahOrange,
        onHighlight: palette.ink,
      },
    },
  },
  type: {
    families: {
      display: "var(--font-plex-sans), system-ui, sans-serif",
      body: "var(--font-plex-sans), system-ui, sans-serif",
      mono: "var(--font-plex-mono), ui-monospace, monospace",
    },
    scale: { minBase: 16, maxBase: 17, minRatio: 1.2, maxRatio: 1.27 },
    displayStep: 5,
    display: { weight: 700, leading: 1.1, tracking: "-0.02em" },
    heading: { weight: 700, leading: 1.2, tracking: "-0.01em" },
    body: { weight: 400, leading: 1.6 },
    label: { weight: 600, leading: 1.3, step: -1 },
    locales: {
      ar: {
        // Arabic face first: its unicode-range is Arabic-only, so digits, prices and Latin model
        // names fall through to IBM Plex Sans (and part numbers to IBM Plex Mono).
        families: {
          display: "var(--font-plex-arabic), var(--font-plex-sans)",
          body: "var(--font-plex-arabic), var(--font-plex-sans)",
          mono: "var(--font-plex-arabic), var(--font-plex-mono)",
        },
        display: { leading: 1.4 },
        heading: { leading: 1.45 },
        body: { leading: 1.8 },
      },
    },
  },
  shape: { control: 12, card: 16, media: 16, badge: 6, border: 1 },
  elevation: { style: "soft", tint: palette.ink },
  space: { density: "compact" },
  motion: { duration: { fast: 150, base: 200, slow: 250 }, ease: "cubic-bezier(0.23, 1, 0.32, 1)", reveal: "rise", distance: 8 },
  layout: { container: 1200, gutter: { min: 16, max: 40 }, header: 68 },
  control: { height: 48, weight: 600 },
});
