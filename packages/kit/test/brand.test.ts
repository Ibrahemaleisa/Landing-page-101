import { describe, expect, it } from "vitest";
import { assertBrandContrast, checkBrandContrast, compileBrand, contrast, defineBrand, fluid, luminance, parseHex, stepSizes, type Tone } from "../src/brand";

const light: Tone = {
  scheme: "light",
  bg: "#ffffff",
  fg: "#111111",
  fgMuted: "#555555",
  line: "#dddddd",
  accent: "#0b57d0",
  onAccent: "#ffffff",
  ring: "#0b57d0",
  surface: "#f5f5f5",
};

const brand = defineBrand({
  name: "Fixture",
  color: {
    tones: {
      base: light,
      inverse: {
        ...light,
        scheme: "dark",
        bg: "#111111",
        fg: "#ffffff",
        fgMuted: "#bbbbbb",
        surface: "#222222",
        accent: "#8ab4f8",
        onAccent: "#111111",
        ring: "#8ab4f8",
      },
    },
  },
  type: {
    families: { display: "Display, sans-serif", body: "Body, sans-serif" },
    scale: { minBase: 16, maxBase: 20, minRatio: 1.2, maxRatio: 1.333 },
    display: { weight: 700, leading: 1, tracking: "-0.03em" },
    heading: { weight: 600, leading: 1.1, tracking: "-0.01em" },
    body: { weight: 400, leading: 1.6 },
    label: { weight: 600, leading: 1.2, tracking: "0.08em", transform: "uppercase" },
    locales: { ar: { families: { body: "Arabic, sans-serif" }, body: { leading: 1.8 } } },
  },
  shape: { control: 8, card: 12, media: 12, badge: 999, border: 1 },
  elevation: { style: "soft" },
  space: { density: "comfortable" },
  motion: { duration: { fast: 150, base: 220, slow: 400 }, ease: "ease-out", reveal: "rise", distance: 16 },
  layout: { container: 1280, gutter: { min: 20, max: 48 }, header: 72 },
  control: { height: 48, weight: 600 },
});

describe("contrast maths", () => {
  it("parses short and long hex", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("#1E0D33")).toEqual([30, 13, 51]);
    expect(() => parseHex("rgb(0,0,0)")).toThrow();
  });
  it("matches WCAG reference values", () => {
    expect(luminance("#ffffff")).toBeCloseTo(1, 5);
    expect(luminance("#000000")).toBeCloseTo(0, 5);
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    // #767676 on white is the well-known 4.54:1 grey
    expect(contrast("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
    // order does not matter
    expect(contrast("#ffffff", "#767676")).toBeCloseTo(contrast("#767676", "#ffffff"), 10);
  });
});

describe("fluid scale", () => {
  it("produces clamp() between the min and max sizes", () => {
    const value = fluid(16, 20);
    const [, lo, intercept, slope, hi] = /^clamp\(([\d.]+)rem, ([\d.-]+)rem \+ ([\d.]+)vw, ([\d.]+)rem\)$/.exec(value)!.map(Number);
    expect([lo, hi]).toEqual([1, 1.25]);
    // the preferred value hits exactly min at 360px and max at 1280px
    const at = (vw: number) => intercept * 16 + (slope / 100) * vw;
    expect(at(360)).toBeCloseTo(16, 1);
    expect(at(1280)).toBeCloseTo(20, 1);
    expect(fluid(18, 18)).toBe("1.125rem");
  });
  it("handles shrinking values (min > max)", () => {
    expect(fluid(24, 16)).toMatch(/^clamp\(1rem, .* 1\.5rem\)$/);
  });
  it("grows each step by the ratio", () => {
    const s = { minBase: 16, maxBase: 20, minRatio: 1.2, maxRatio: 1.333 };
    expect(stepSizes(s, 0)).toEqual({ min: 16, max: 20 });
    expect(stepSizes(s, 2).max).toBeCloseTo(20 * 1.333 ** 2, 6);
    expect(stepSizes(s, -1).min).toBeCloseTo(16 / 1.2, 6);
  });
});

describe("compileBrand", () => {
  const css = compileBrand(brand, { locales: ["en", "ar"] });

  it("wraps everything in the tokens layer", () => {
    expect(css.startsWith("@layer tokens {")).toBe(true);
  });
  it("emits the base tone on :root and other tones as data-tone scopes", () => {
    expect(css).toContain(':root,\n[data-tone="base"]');
    expect(css).toContain('[data-tone="inverse"]');
    expect(css).toMatch(/\[data-tone="inverse"\] \{[^}]*--tone-bg: #111111;/);
  });
  it("applies role defaults", () => {
    // accentText defaults to accent, surfaceFg to fg
    expect(css).toMatch(/--tone-accent-text: #0b57d0;/);
    expect(css).toMatch(/--tone-surface-fg: #111111;/);
  });
  it("emits the fluid type and space scales", () => {
    for (const s of [-2, 0, 6, 7]) expect(css).toContain(`--step-${s}: clamp(`);
    expect(css).toContain("--space-m: clamp(");
    expect(css).toContain("--section-pad: clamp(");
  });
  it("resets tracking and uppercase for Arabic while keeping overrides", () => {
    const ar = css.slice(css.indexOf(":root:lang(ar)"));
    expect(ar).toContain("--font-body: Arabic, sans-serif;");
    expect(ar).toContain("--leading-body: 1.8;");
    expect(ar).toContain("--tracking-label: 0;");
    expect(ar).toContain("--transform-label: none;");
    expect(ar).toContain("--control-transform: none;");
  });
  it("adds no :lang block for English without overrides", () => {
    expect(css).not.toContain(":root:lang(en)");
  });
  it("maps elevation styles", () => {
    expect(css).toContain("--shadow-card: 0 1px 2px");
    const hard = compileBrand({ ...brand, elevation: { style: "hard", offset: 6 } });
    expect(hard).toContain("--shadow-card: 6px 6px 0 0 var(--tone-fg);");
    expect(hard).toContain("--card-border-width: 2px;");
    const flat = compileBrand({ ...brand, elevation: { style: "flat" } });
    expect(flat).toContain("--shadow-card: none;");
  });
  it("disables reveal movement when the brand says none", () => {
    const none = compileBrand({ ...brand, motion: { ...brand.motion, reveal: "none" } });
    expect(none).toContain("--reveal-from-opacity: 1;");
    expect(none).toContain("--reveal-distance: 0px;");
  });
});

describe("brand contrast gate", () => {
  it("passes a compliant brand", () => {
    expect(() => assertBrandContrast(brand)).not.toThrow();
  });
  it("fails a low-contrast muted text colour and names the pair", () => {
    const bad = { ...brand, color: { tones: { base: { ...light, fgMuted: "#aaaaaa" as const } } } };
    expect(() => assertBrandContrast(bad)).toThrow(/base: fgMuted \/ bg/);
  });
  it("treats filled-button edge contrast as advisory", () => {
    const pale = { ...brand, color: { tones: { base: { ...light, accent: "#cfe0ff" as const, onAccent: "#0a0a0a" as const } } } };
    const checks = checkBrandContrast(pale);
    const edge = checks.find((c) => c.pair === "accent / bg")!;
    expect(edge.pass).toBe(false);
    expect(edge.level).toBe("advisory");
  });
});

describe("review regressions", () => {
  it("treats region-tagged caseless locales (ar-SA, zh-Hans) as caseless", () => {
    const css = compileBrand({ ...brand, type: { ...brand.type, locales: {} } }, { locales: ["ar-SA", "zh-Hans", "en-GB"] });
    expect(css).toMatch(/:root:lang\(ar-SA\) \{[^}]*--transform-label: none;/);
    expect(css).toContain(":root:lang(zh-Hans)");
    expect(css).not.toContain(":root:lang(en-GB)");
  });
  it("applies locale label step and family overrides", () => {
    const css = compileBrand({ ...brand, type: { ...brand.type, locales: { ar: { label: { step: 0, family: "display" } } } } }, { locales: ["ar"] });
    const ar = css.slice(css.indexOf(":root:lang(ar)"));
    expect(ar).toContain("--step-label: var(--step-0);");
    expect(ar).toContain("--font-label: var(--font-display);");
  });
  it("rejects malformed colours with the tone and role in the message", () => {
    const bad = { ...brand, color: { tones: { base: { ...light, fg: "#12345" as const } } } };
    expect(() => compileBrand(bad)).toThrow(/tone "base": fg must be a hex colour/);
  });
  it("checks the highlight pair that will actually render when roles are omitted", () => {
    const pair = checkBrandContrast(brand).find((c) => c.tone === "base" && c.pair === "onHighlight / highlight")!;
    expect([pair.fg, pair.bg]).toEqual([light.onAccent, light.accent]);
  });
  it("gates accent text and muted text on surfaces", () => {
    const pairs = checkBrandContrast(brand).map((c) => c.pair);
    expect(pairs).toContain("accentText / surface");
    expect(pairs).toContain("fgMuted / surface");
  });
});
