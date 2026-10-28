import { describe, expect, it } from "vitest";
import { buildBrief, readiness, type Snapshot } from "../src/studio/brief";
import { dominantColor } from "../src/studio/logo-color";
import { BLOCKS, PAGES, PRESETS } from "../src/studio/options";
import { langsOf, nameFor, newProject, normalizeProject, sectionsOf, slugOf } from "../src/studio/project";

const snap = (lang: "ar" | "en"): Snapshot => ({
  lang,
  header: [{ role: "span", text: lang === "ar" ? "مطعم السنبلة" : "Sunbula", edited: true }],
  sections: [
    {
      block: "top",
      variant: "split",
      tone: "base",
      slots: ["top/0"],
      items: [
        { role: "h1", text: lang === "ar" ? "أشهى الأكلات" : "The best food", edited: true },
        { role: "p", text: "placeholder lead", edited: false },
        { role: "btn", text: "Start", edited: false },
        { role: "btn", text: "Start", edited: false },
      ],
    },
    { block: "faq", variant: "split", tone: "muted", slots: [], items: [{ role: "summary", text: "Q?", edited: false }] },
  ],
  footer: [],
});

function project() {
  const p = newProject("Client A", PRESETS[1]!.selection, { btnRadius: 20 });
  p.info = { ...p.info, nameAr: "مطعم السنبلة", nameEn: "Sunbula Kitchen", about: "Najdi food in Riyadh", whatsapp: "+966500000000" };
  p.sections = [
    ["faq", "split", "muted"],
    ["close", "band", "brand"],
  ];
  p.assets = { a1: { id: "a1", name: "hero.jpg", type: "image/jpeg" } };
  p.media = { "top/0": "a1" };
  return p;
}

describe("project", () => {
  it("page templates only use sections the preview has", () => {
    for (const page of PAGES) for (const [b, v] of page.value) expect(BLOCKS[b]?.variants[v], `${page.id}: ${b}/${v}`).toBeTruthy();
  });
  it("slugs from the Latin name, or a stable fallback", () => {
    const p = project();
    expect(slugOf(p)).toBe("sunbula-kitchen");
    const q = newProject("مطعم");
    expect(slugOf(q)).toMatch(/^site-[a-z0-9]{6}$/);
  });
  it("names and languages", () => {
    const p = project();
    expect(nameFor(p.info, "en")).toBe("Sunbula Kitchen");
    expect(nameFor({ ...p.info, nameEn: "" }, "en")).toBe("مطعم السنبلة");
    expect(langsOf({ ...p.info, languages: "both", defaultLang: "en" })).toEqual(["en", "ar"]);
    expect(langsOf({ ...p.info, languages: "ar" })).toEqual(["ar"]);
  });
  it("sections follow the template until customised", () => {
    const p = newProject("x", PRESETS[0]!.selection);
    expect(sectionsOf(p)).toEqual(PAGES.find((x) => x.id === "saas")!.value);
    p.sections = [["faq", "split", "base"]];
    expect(sectionsOf(p)).toEqual([["faq", "split", "base"]]);
  });
  it("normalises partial or old project files", () => {
    const p = normalizeProject({ id: "x", title: "T", selection: { palette: "ocean" } as never, tweaks: { nope: 1 } as never });
    expect(p.selection.palette).toBe("ocean");
    expect(p.selection.type).toBe("neutral");
    expect(p.tweaks).toEqual({});
    expect(p.content).toEqual({ ar: {}, en: {} });
    expect(p.info.languages).toBe("both");
    expect(p.sections).toBeNull();
  });
});

describe("build brief", () => {
  const p = project();
  const brief = buildBrief(p, [snap("ar"), snap("en")], { date: new Date("2026-10-28") });

  it("tells the developer exactly how to build it", () => {
    expect(brief).toContain('pnpm new-site sunbula-kitchen --title "مطعم السنبلة" --locales ar,en --default ar');
    expect(brief).toContain("sites/sunbula-kitchen/src/brand.ts");
    expect(brief).toContain("pnpm verify");
    expect(brief).toContain("لا تلمس `sites/opera`");
    expect(brief).toContain("2026-10-28");
  });
  it("lists the sections in order with their kit components", () => {
    const order = brief.slice(brief.indexOf("## ترتيب الأقسام"), brief.indexOf("## الصور"));
    expect(order).toContain('1. الواجهة (Hero) — عرض كامل (تحريري) · <Hero variant="display"> · خلفية: base');
    expect(order).toContain('2. الأسئلة الشائعة — عمودين · <FAQ variant="split"> · خلفية: muted');
    expect(order).toContain('3. دعوة ختامية — شريط عريض · <CTA variant="band"> · خلفية: brand');
    expect(brief).toContain("الترتيب معدّل");
  });
  it("marks placeholder copy, keeps edited copy, and dedupes", () => {
    expect(brief).toContain("- العنوان الرئيسي: أشهى الأكلات");
    expect(brief).toContain("- نص ✱: placeholder lead");
    expect(brief.match(/- زر ✱: Start/g)).toHaveLength(2); // once per language
  });
  it("carries business facts, contacts, images, fine-tuning and the brand file", () => {
    expect(brief).toContain("Najdi food in Riyadh");
    expect(brief).toContain("- واتساب: +966500000000");
    expect(brief).toContain("`hero.jpg` (asset id: `a1`)");
    expect(brief).toContain("btnRadius=20");
    expect(brief).toContain("export const brand = defineBrand(");
  });
  it("reports readiness", () => {
    const r = readiness(p, [snap("ar"), snap("en")]);
    expect(r).toMatchObject({ name: true, about: true, contact: true, logo: false, images: 1, imageSlots: 1 });
    // per language: "placeholder lead", "Start", "Q?"
    expect(r.placeholders).toBe(6);
  });
});

describe("logo colour", () => {
  const px = (rgba: number[], n: number) => Array.from({ length: n }, () => rgba).flat();
  it("finds the brand colour on a white background", () => {
    const c = dominantColor([...px([255, 255, 255, 255], 300), ...px([200, 30, 90, 255], 40), ...px([20, 20, 20, 255], 30)]);
    expect(c).toBe("#c81e5a");
  });
  it("prefers a vivid mark over a larger muted area", () => {
    const c = dominantColor([...px([120, 110, 100, 255], 200), ...px([0, 160, 80, 255], 50)]);
    expect(c).toBe("#00a050");
  });
  it("falls back to the darkest common grey for a black logo, and null when empty", () => {
    expect(dominantColor([...px([255, 255, 255, 255], 100), ...px([17, 17, 17, 255], 50)])).toBe("#111111");
    expect(dominantColor(px([200, 30, 90, 0], 50))).toBeNull();
  });
});
