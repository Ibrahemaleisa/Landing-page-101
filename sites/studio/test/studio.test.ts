import { describe, expect, it } from "vitest";
import { checkBrandContrast, compileBrand } from "@landing/kit/brand";
import { PALETTES } from "../src/studio/palettes";
import { DEFAULT_SELECTION, ELEMENTS, PRESETS, buildBrand, exportBrand, fontsFor, matchPreset, type ElementKey } from "../src/studio/options";
import { FONT_FAMILIES } from "../src/studio/fonts";
import { decodeSelection, encodeSelection } from "../src/studio/state";

describe("studio palettes", () => {
  it("has ten palettes and ten presets", () => {
    expect(PALETTES).toHaveLength(10);
    expect(PRESETS).toHaveLength(10);
  });
  describe.each(PALETTES.map((p) => [p.id, p] as const))("%s", (id, palette) => {
    const checks = checkBrandContrast(buildBrand({ ...DEFAULT_SELECTION, palette: id }));
    it.each(checks.filter((c) => c.level === "required").map((c) => [`${c.tone}: ${c.pair}`, c] as const))("%s ≥ minimum", (_, c) => {
      expect(c.ratio, `${palette.id} ${c.tone} ${c.pair}: ${c.fg} on ${c.bg}`).toBeGreaterThanOrEqual(c.min);
    });
  });
});

describe("studio elements", () => {
  it("every option of every element compiles to CSS", () => {
    for (const key of Object.keys(ELEMENTS) as ElementKey[]) {
      for (const opt of ELEMENTS[key]) {
        const css = compileBrand(buildBrand({ ...DEFAULT_SELECTION, [key]: opt.id }), { locales: ["ar", "en"] });
        expect(css, `${key}=${opt.id}`).toContain("--tone-bg");
      }
    }
  });
  it("presets reference existing options and are distinct", () => {
    const seen = new Set<string>();
    for (const p of PRESETS) {
      for (const key of Object.keys(ELEMENTS) as ElementKey[]) {
        expect(
          ELEMENTS[key].some((o) => o.id === p.selection[key]),
          `${p.id}.${key}=${p.selection[key]}`,
        ).toBe(true);
      }
      const sig = JSON.stringify(p.selection);
      expect(seen.has(sig)).toBe(false);
      seen.add(sig);
      expect(matchPreset(p.selection)?.id).toBe(p.id);
    }
  });
  it("every element offers at least three choices, and palettes and typography ten", () => {
    for (const key of Object.keys(ELEMENTS) as ElementKey[]) expect(ELEMENTS[key].length, key).toBeGreaterThanOrEqual(3);
    expect(ELEMENTS.palette).toHaveLength(10);
    expect(ELEMENTS.type).toHaveLength(10);
  });
  it("typography references registered font families", () => {
    const ids = new Set(FONT_FAMILIES.map((f) => f.id));
    for (const t of ELEMENTS.type) {
      for (const id of [t.value.latin.display, t.value.latin.body, t.value.arabic.display, t.value.arabic.body])
        expect(ids.has(id), `${t.id}: ${id}`).toBe(true);
      expect(FONT_FAMILIES.find((f) => f.id === t.value.arabic.display)?.script).toBe("arabic");
    }
  });
  it("exports a brand.ts with the fonts it needs", () => {
    const sel = PRESETS.find((p) => p.id === "luxe")!.selection;
    const ts = exportBrand(sel, "Test");
    expect(ts).toContain('import { defineBrand } from "@landing/kit/brand";');
    expect(ts).toContain("@fontsource-variable/playfair-display");
    expect(ts).toContain("@fontsource/amiri");
    expect(fontsFor(sel).map((f) => f.id)).toEqual(expect.arrayContaining(["playfair", "manrope", "amiri", "tajawal"]));
  });
});

describe("selection state", () => {
  it("round-trips through the URL query and ignores unknown values", () => {
    const sel = PRESETS[5]!.selection;
    expect(decodeSelection(encodeSelection(sel))).toEqual(sel);
    expect(decodeSelection("?palette=nope&type=tech")).toEqual({ ...DEFAULT_SELECTION, type: "tech" });
    expect(decodeSelection("")).toEqual(DEFAULT_SELECTION);
  });
});
