/**
 * The build brief: everything a developer (or Claude Code) needs to build the client's site without
 * asking a single question. It's assembled deterministically from the project and from a snapshot of
 * the preview as the client left it, so it describes exactly what was seen and approved.
 */
import { BLOCKS, HEROES, ELEMENTS, TONES, exportBrand, fontsFor, type ElementKey } from "./options";
import { PLACEHOLDER_NAME, langsOf, nameFor, sectionsOf, slugOf, type Lang, type Project } from "./project";

/** One text on the page, as rendered. `role` is a tag name or `btn` / `eyebrow`. */
export interface SnapItem {
  role: string;
  text: string;
  /** True when someone typed this text in the studio; false for the preview's placeholder copy. */
  edited: boolean;
}
export interface SnapSection {
  block: string;
  variant: string;
  tone: string;
  items: SnapItem[];
  /** Image slots in this section (`block/index`). */
  slots: string[];
}
export interface Snapshot {
  lang: Lang;
  header: SnapItem[];
  sections: SnapSection[];
  footer: SnapItem[];
}

const ROLE: Record<string, string> = {
  h1: "العنوان الرئيسي",
  h2: "عنوان",
  h3: "عنوان فرعي",
  h4: "عنوان فرعي",
  p: "نص",
  li: "بند",
  a: "رابط",
  btn: "زر",
  button: "زر",
  eyebrow: "عنوان صغير",
  span: "نص قصير",
  strong: "نص بارز",
  dt: "مصطلح",
  dd: "وصف",
  blockquote: "اقتباس",
  figcaption: "تعليق",
  th: "رأس جدول",
  td: "خلية",
  summary: "سؤال",
  caption: "عنوان الجدول",
  label: "حقل",
  legend: "مجموعة",
  small: "ملاحظة",
};

const LANG_NAME: Record<Lang, string> = { ar: "العربية", en: "الإنجليزية" };

function items(list: SnapItem[]): string {
  const seen = new Set<string>();
  return list
    .filter((i) => {
      const k = i.role + i.text;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((i) => `- ${ROLE[i.role] ?? i.role}${i.edited ? "" : " ✱"}: ${i.text}`)
    .join("\n");
}

const blockName = (block: string) => (block === "top" ? "الواجهة (Hero)" : (BLOCKS[block]?.label.ar ?? block));
const variantName = (block: string, variant: string) =>
  block === "top" ? (HEROES.find((h) => h.id === variant)?.label.ar ?? variant) : (BLOCKS[block]?.variants[variant]?.ar ?? variant);
const component = (block: string) => (block === "top" ? "Hero" : (BLOCKS[block]?.component ?? block));

export interface BriefOptions {
  /** Where the full preview can be opened (same browser), for reference. */
  previewUrl?: string;
  date?: Date;
}

/** Readiness checks shown before handing over: what's missing and what the developer will fill in. */
export function readiness(p: Project, snaps: Snapshot[]) {
  // distinct texts: the same button label in the header and the hero is written once
  const placeholders = snaps.reduce(
    (n, s) => n + new Set([...s.header, ...s.sections.flatMap((x) => x.items), ...s.footer].filter((i) => !i.edited).map((i) => i.text)).size,
    0,
  );
  const slots = snaps[0]?.sections.flatMap((s) => s.slots) ?? [];
  const contact = ["whatsapp", "phone", "email", "instagram", "x", "tiktok", "snapchat", "linkedin"] as const;
  return {
    name: !!(p.info.nameAr || p.info.nameEn),
    about: p.info.about.trim().length > 0,
    contact: contact.some((k) => p.info[k].trim()),
    logo: !!p.media.logo,
    images: slots.filter((s) => p.media[s]).length,
    imageSlots: slots.length,
    placeholders,
  };
}

export function buildBrief(p: Project, snaps: Snapshot[], opts: BriefOptions = {}): string {
  const langs = langsOf(p.info);
  const slug = slugOf(p);
  const title = nameFor(p.info, langs[0]!) || p.title || slug;
  const date = (opts.date ?? new Date()).toISOString().slice(0, 10);
  const fonts = fontsFor(p.selection);
  const sections = sectionsOf(p);
  const info = p.info;
  const r = readiness(p, snaps);

  const style = (Object.keys(ELEMENTS) as ElementKey[])
    .map((k) => {
      const o = ELEMENTS[k].find((x) => x.id === p.selection[k]);
      const custom = k === "page" && p.sections ? " — الترتيب معدّل، المعتمد هو «ترتيب الأقسام»" : "";
      return `- ${k}: ${p.selection[k]}${o ? ` (${o.label.ar})` : ""}${custom}`;
    })
    .join("\n");

  const order = [`1. ${blockName("top")} — ${variantName("top", p.selection.hero)} · <${component("top")} variant="${p.selection.hero}"> · خلفية: base`]
    .concat(
      sections.map(([b, v, t], i) => `${i + 2}. ${blockName(b)} — ${variantName(b, v)} · <${component(b)} variant="${v}"> · خلفية: ${t} (${TONES[t].ar})`),
    )
    .join("\n");

  const content = snaps
    .map((s) => {
      const parts = [
        `### ${LANG_NAME[s.lang]} (${s.lang})`,
        s.header.length ? `#### الترويسة والقائمة\n${items(s.header)}` : "",
        ...s.sections.map((sec, i) => `#### ${i + 1}. ${blockName(sec.block)} — ${variantName(sec.block, sec.variant)}\n${items(sec.items)}`),
        s.footer.length ? `#### التذييل\n${items(s.footer)}` : "",
      ];
      return parts.filter(Boolean).join("\n\n");
    })
    .join("\n\n");

  const images = Object.entries(p.media)
    .map(([slot, id]) => {
      const a = p.assets[id];
      const where = slot === "logo" ? "الشعار (الترويسة والتذييل)" : `${blockName(slot.split("/")[0]!)}، الصورة رقم ${Number(slot.split("/")[1]) + 1}`;
      return `- ${where}: \`${a?.name ?? id}\` (asset id: \`${id}\`)`;
    })
    .join("\n");

  const contactLines = (
    [
      ["واتساب", info.whatsapp],
      ["الجوال", info.phone],
      ["البريد", info.email],
      ["إنستغرام", info.instagram],
      ["إكس", info.x],
      ["تيك توك", info.tiktok],
      ["سناب شات", info.snapchat],
      ["لينكدإن", info.linkedin],
      ["العنوان", info.address],
      ["الخريطة", info.maps],
      ["أوقات العمل", info.hours],
    ] as const
  )
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `- ${k}: ${v.trim()}`)
    .join("\n");

  const domain = {
    has: `عند العميل دومين: ${info.domain || "(لم يُذكر)"}`,
    needs: `العميل يحتاج دومين${info.domain ? ` (مقترح: ${info.domain})` : ""}`,
    later: "الدومين لاحقاً: انشر على رابط Vercel",
  }[info.domainStatus];

  return `# طلب تنفيذ صفحة هبوط: ${title}

- المشروع: ${p.title || title}
- التاريخ: ${date}
- الاسم المختصر للموقع (slug): \`${slug}\`
- اللغات: ${langs.map((l) => LANG_NAME[l]).join(" + ")}، الافتراضية: ${LANG_NAME[langs[0]!]}${opts.previewUrl ? `\n- المعاينة (في نفس المتصفح): ${opts.previewUrl}` : ""}

## المطلوب

ابنِ موقعاً جديداً في مستودع Landing-page-101 يطابق التصميم المعتمد أدناه، بدون أسئلة إضافية:

1. \`pnpm new-site ${slug} --title "${title.replace(/"/g, "'")}" --locales ${langs.join(",")} --default ${langs[0]}\`
2. ضع ملف الهوية أدناه في \`sites/${slug}/src/brand.ts\`، وثبّت الخطوط المذكورة وسجّلها في \`astro.config.mjs\` (مثال عامل: \`sites/studio/astro.config.ts\`).
3. ابنِ الصفحة من مكوّنات \`@landing/kit\` بالترتيب والأشكال والخلفيات المذكورة في «ترتيب الأقسام».
4. استخدم النصوص كما هي. النصوص المعلَّمة بـ ✱ نصوص تجريبية لم يكتبها العميل: أعد كتابتها لهذا النشاط بالاعتماد على «عن النشاط»، بنفس الطول تقريباً ونفس الغرض، وبكل لغات الموقع.
5. الصور: موجودة داخل ملف المشروع المرفق (\`${slug}.landing.json\`، الحقل \`files\` بصيغة data URL حسب asset id). استخرجها إلى \`sites/${slug}/src/assets/\` واستخدم \`<Media>\` من الكِت، واكتب لكل صورة نصاً بديلاً (alt) مناسباً. أي مكان صورة بلا صورة مرفوعة: استخدم تكويناً زخرفياً مناسباً من ألوان الهوية بدل صورة وهمية.
6. اربط معلومات التواصل: زر واتساب (\`https://wa.me/<الرقم بدون +>\`) في الترويسة أو الدعوة الختامية إن وُجد رقم، وروابط الحسابات في التذييل، والبريد والهاتف في قسم التواصل.
7. شغّل \`pnpm verify\` (lint، الأنواع، اختبارات التباين، axe، عدم التمدد الأفقي) حتى ينجح كله.
8. انشره على Vercel كمشروع مستقل (root: \`sites/${slug}\`) وأرجع الرابط. ${domain}.
9. لا تلمس \`sites/opera\` ولا أي موقع آخر.

## عن النشاط

- الاسم: ${[info.nameAr, info.nameEn].filter(Boolean).join(" / ") || "(لم يُذكر، استخدم اسم المشروع)"}
- ماذا يقدّم: ${info.about.trim() || "(لم يُذكر)"}
- الجمهور: ${info.audience.trim() || "(لم يُذكر)"}

## التواصل

${contactLines || "(لا توجد معلومات تواصل، اترك قسم التواصل بنموذج فقط)"}

## الدومين

${domain}

## الشكل المختار

${style}${
    Object.keys(p.tweaks).length
      ? `\n\nتعديلات دقيقة: ${Object.entries(p.tweaks)
          .map(([k, v]) => `${k}=${v}`)
          .join("، ")}`
      : ""
  }

الخطوط: ${fonts.map((f) => `${f.name} (\`${f.pkg}\`)`).join("، ")}

## ترتيب الأقسام

${order}

## الصور

${images || "(لم تُرفع صور)"}

## المحتوى

النص المعلَّم بـ ✱ تجريبي (اسم المنتج التجريبي «${PLACEHOLDER_NAME.ar} / ${PLACEHOLDER_NAME.en}» استُبدل باسم النشاط حيث وُجد).

${content}

## ملاحظات العميل

${info.notes.trim() || "(لا توجد)"}

## حالة الطلب عند التسليم

- الاسم: ${r.name ? "✓" : "ناقص"} · نبذة النشاط: ${r.about ? "✓" : "ناقصة"} · التواصل: ${r.contact ? "✓" : "ناقص"} · الشعار: ${r.logo ? "✓" : "غير مرفوع"}
- الصور: ${r.images} من ${r.imageSlots} مكاناً · نصوص تجريبية ستُكتب: ${r.placeholders}

## ملف الهوية (brand.ts)

\`\`\`ts
${exportBrand(p.selection, title, p.tweaks).trim()}
\`\`\`
`;
}
