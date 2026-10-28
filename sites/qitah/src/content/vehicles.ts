/**
 * SAMPLE DATA — the demonstration vehicle catalog from the Qitah app (`src/data/vehicles.ts`).
 * Not an authoritative fitment database. Both locale files build the finder's options from here
 * so the values stay identical across languages.
 */
type L10n = { ar: string; en: string };

export const MAKES: { id: string; name: L10n; models: { id: string; name: L10n }[] }[] = [
  {
    id: "toyota",
    name: { ar: "تويوتا", en: "Toyota" },
    models: [
      { id: "camry", name: { ar: "كامري", en: "Camry" } },
      { id: "land-cruiser", name: { ar: "لاند كروزر", en: "Land Cruiser" } },
      { id: "hilux", name: { ar: "هايلكس", en: "Hilux" } },
      { id: "corolla", name: { ar: "كورولا", en: "Corolla" } },
    ],
  },
  {
    id: "hyundai",
    name: { ar: "هيونداي", en: "Hyundai" },
    models: [
      { id: "elantra", name: { ar: "إلنترا", en: "Elantra" } },
      { id: "sonata", name: { ar: "سوناتا", en: "Sonata" } },
      { id: "tucson", name: { ar: "توسان", en: "Tucson" } },
      { id: "accent", name: { ar: "أكسنت", en: "Accent" } },
    ],
  },
  {
    id: "nissan",
    name: { ar: "نيسان", en: "Nissan" },
    models: [
      { id: "patrol", name: { ar: "باترول", en: "Patrol" } },
      { id: "altima", name: { ar: "ألتيما", en: "Altima" } },
      { id: "sunny", name: { ar: "صني", en: "Sunny" } },
    ],
  },
  {
    id: "ford",
    name: { ar: "فورد", en: "Ford" },
    models: [
      { id: "taurus", name: { ar: "توروس", en: "Taurus" } },
      { id: "f150", name: { ar: "إف-150", en: "F-150" } },
    ],
  },
  { id: "chevrolet", name: { ar: "شيفروليه", en: "Chevrolet" }, models: [{ id: "tahoe", name: { ar: "تاهو", en: "Tahoe" } }] },
  { id: "gmc", name: { ar: "جي إم سي", en: "GMC" }, models: [{ id: "yukon", name: { ar: "يوكن", en: "Yukon" } }] },
  {
    id: "kia",
    name: { ar: "كيا", en: "Kia" },
    models: [
      { id: "k5", name: { ar: "كي 5", en: "K5" } },
      { id: "sportage", name: { ar: "سبورتاج", en: "Sportage" } },
    ],
  },
  { id: "lexus", name: { ar: "لكزس", en: "Lexus" }, models: [{ id: "lx", name: { ar: "إل إكس", en: "LX" } }] },
];

export const YEARS = Array.from({ length: 10 }, (_, i) => String(2025 - i));

export function finderOptions(lang: keyof L10n) {
  return {
    makes: MAKES.map((m) => ({ value: m.id, label: m.name[lang] })),
    groups: MAKES.map((m) => ({ label: m.name[lang], options: m.models.map((md) => ({ value: md.id, label: md.name[lang] })) })),
    years: YEARS.map((y) => ({ value: y, label: y })),
  };
}
