import { describe, expect, it } from "vitest";
import { checkBrandContrast, compileBrand } from "@landing/kit/brand";
import { PALETTES } from "../src/studio/palettes";
import {
  DEFAULT_SELECTION,
  ELEMENTS,
  PRESETS,
  TWEAKS,
  buildBrand,
  cleanTweaks,
  exportBrand,
  fontsFor,
  matchPreset,
  type ElementKey,
} from "../src/studio/options";
import { FONT_FAMILIES } from "../src/studio/fonts";
import { decodeSelection, decodeState, encodeSelection } from "../src/studio/state";

describe("studio palettes", () => {
  it("has 36 palettes (12 hand-made, 24 generated) and 30 presets", () => {
    expect(PALETTES).toHaveLength(36);
    expect(new Set(PALETTES.map((p) => p.id)).size).toBe(36);
    expect(PRESETS).toHaveLength(30);
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
  it("every element offers choices, each with a plain-language hint", () => {
    for (const key of Object.keys(ELEMENTS) as ElementKey[]) {
      expect(ELEMENTS[key].length, key).toBeGreaterThanOrEqual(2);
      for (const o of ELEMENTS[key]) expect(o.hint.ar && o.hint.en, `${key}=${o.id}`).toBeTruthy();
    }
    expect(ELEMENTS.palette).toHaveLength(36);
    expect(ELEMENTS.type).toHaveLength(24);
    expect(ELEMENTS.buttons).toHaveLength(10);
    expect(ELEMENTS.motion).toHaveLength(8);
    expect(ELEMENTS.page).toHaveLength(8);
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
  it("round-trips fine-tuning", () => {
    const tweaks = { accent: "#ff5500", btnRadius: 20, speed: 150 };
    expect(decodeState(encodeSelection(PRESETS[2]!.selection, tweaks))).toEqual({ selection: PRESETS[2]!.selection, tweaks });
    expect(decodeState("?palette=ocean").tweaks).toEqual({});
  });
});

describe("fine-tuning", () => {
  it("every slider's extremes compile and keep contrast", () => {
    for (const t of TWEAKS) {
      if (t.kind !== "range") continue;
      for (const v of [t.min, t.max]) {
        const brand = buildBrand(DEFAULT_SELECTION, "T", { [t.id]: v });
        expect(compileBrand(brand, { locales: ["ar", "en"] }), `${t.id}=${v}`).toContain("--tone-bg");
        expect(checkBrandContrast(brand).filter((c) => c.level === "required" && !c.pass)).toEqual([]);
      }
    }
  });
  it("sliders change the brand they belong to", () => {
    const b = buildBrand(DEFAULT_SELECTION, "T", { btnRadius: 32, btnHeight: 56, cardRadius: 0, border: 3, width: 1440, baseSize: 20, headline: 7 });
    expect(b.shape.control).toBe(999);
    expect(b.control.height).toBe(56);
    expect(b.shape.card).toBe(0);
    expect(b.shape.border).toBe(3);
    expect(b.layout.container).toBe(1440);
    expect(b.type.scale.maxBase).toBe(20);
    expect(b.type.displayStep).toBe(7);
    const fast = buildBrand(DEFAULT_SELECTION, "T", { speed: 200, distance: 0 });
    expect(fast.motion.duration.base).toBe(110);
    expect(fast.motion.reveal).toBe("fade");
    // motion turned off stays off whatever the sliders say
    expect(buildBrand({ ...DEFAULT_SELECTION, motion: "none" }, "T", { distance: 40 }).motion.reveal).toBe("none");
  });
  it("cleans unknown keys and out-of-range values", () => {
    expect(cleanTweaks({ btnRadius: 999, border: -4, nope: 1, accent: "red", width: "1203" })).toEqual({ btnRadius: 32, border: 0, width: 1200 });
    expect(cleanTweaks({ accent: "#ABCDEF" })).toEqual({ accent: "#abcdef" });
  });
  it("fine-tuning makes the selection custom", () => {
    expect(matchPreset(PRESETS[0]!.selection, { border: 2 })).toBeUndefined();
  });

  // any colour the user picks, on any palette, must keep every required pair readable
  const colours = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#808080",
    "#777777",
    "#000000",
    "#ffffff",
    "#ff8800",
    "#00ffff",
    "#ff00ff",
    "#2342d6",
    "#d9b46c",
    "#7f7f7f",
  ];
  for (let i = 0; i < 40; i++) colours.push("#" + ((i * 0x9e3779b1) >>> 8).toString(16).padStart(6, "0").slice(-6));
  it.each(PALETTES.map((p) => [p.id] as const))("custom accent keeps contrast on %s", (id) => {
    for (const accent of colours) {
      const fails = checkBrandContrast(buildBrand({ ...DEFAULT_SELECTION, palette: id }, "T", { accent })).filter((c) => c.level === "required" && !c.pass);
      expect(fails.map((f) => `${accent} ${f.tone} ${f.pair} ${f.ratio}`)).toEqual([]);
    }
  });
});
