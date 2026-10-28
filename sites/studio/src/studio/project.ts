/**
 * A studio project: one client's landing page. The style (selection + fine-tuning), the section
 * order, every text edited on the preview, the uploaded images, and the facts a developer needs to
 * build it (contacts, languages, domain). Pure data, so it can be saved, exported and turned into a
 * build brief.
 */
import { DEFAULT_SELECTION, PAGES, cleanTweaks, type Block, type L, type Selection, type Tweaks } from "./options";

export type Lang = "ar" | "en";

export interface AssetRef {
  id: string;
  name: string;
  type: string;
}

export interface Project {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  selection: Selection;
  tweaks: Tweaks;
  /** Custom section order; `null` follows the page template. The hero is always first and isn't listed. */
  sections: Block[] | null;
  /** Text edits, per language, keyed by the original preview text. */
  content: Record<Lang, Record<string, string>>;
  /** Uploaded images by preview slot (`block/index`), plus `logo`. Values are asset ids. */
  media: Record<string, string>;
  assets: Record<string, AssetRef>;
  info: ProjectInfo;
}

export interface ProjectInfo {
  nameAr: string;
  nameEn: string;
  about: string;
  audience: string;
  languages: "ar" | "en" | "both";
  defaultLang: Lang;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  x: string;
  tiktok: string;
  snapchat: string;
  linkedin: string;
  address: string;
  maps: string;
  hours: string;
  domainStatus: "has" | "needs" | "later";
  domain: string;
  notes: string;
}

export const EMPTY_INFO: ProjectInfo = {
  nameAr: "",
  nameEn: "",
  about: "",
  audience: "",
  languages: "both",
  defaultLang: "ar",
  whatsapp: "",
  phone: "",
  email: "",
  instagram: "",
  x: "",
  tiktok: "",
  snapchat: "",
  linkedin: "",
  address: "",
  maps: "",
  hours: "",
  domainStatus: "later",
  domain: "",
  notes: "",
};

/** The fictional name the preview copy uses; the business name replaces it everywhere. */
export const PLACEHOLDER_NAME: Record<Lang, string> = { ar: "رواق", en: "Rawaq" };

type TextField = { [K in keyof ProjectInfo]: ProjectInfo[K] extends string ? K : never }[keyof ProjectInfo];

export interface InfoField {
  id: TextField;
  label: L;
  hint?: L;
  kind: "text" | "textarea" | "tel" | "email" | "url";
  dir?: "ltr";
  placeholder?: string;
}

/** The facts form, grouped. Every field says in plain words why it's asked. */
export const INFO_GROUPS: { title: L; fields: InfoField[] }[] = [
  {
    title: { ar: "النشاط", en: "The business" },
    fields: [
      {
        id: "nameAr",
        kind: "text",
        label: { ar: "الاسم بالعربي", en: "Name in Arabic" },
        hint: { ar: "يتغيّر في الشعار وفي كل نصوص الصفحة فوراً", en: "Changes in the logo and across the page instantly" },
      },
      { id: "nameEn", kind: "text", dir: "ltr", label: { ar: "الاسم بالإنجليزي", en: "Name in English" } },
      {
        id: "about",
        kind: "textarea",
        label: { ar: "وش يقدّم النشاط؟", en: "What does the business offer?" },
        hint: {
          ar: "بكلامك العادي: الخدمة أو المنتج، وما الذي يميّزه. منها نكتب أي نص لم تعدّله",
          en: "In plain words: the service or product and what makes it different. We write any text you didn't edit from this",
        },
      },
      {
        id: "audience",
        kind: "text",
        label: { ar: "لمن؟", en: "Who is it for?" },
        hint: { ar: "مثال: أصحاب المطاعم في الرياض، أمهات، شركات ناشئة…", en: "e.g. restaurant owners in Riyadh, parents, start-ups…" },
      },
    ],
  },
  {
    title: { ar: "التواصل", en: "Contact" },
    fields: [
      { id: "whatsapp", kind: "tel", dir: "ltr", placeholder: "+9665…", label: { ar: "واتساب", en: "WhatsApp" } },
      { id: "phone", kind: "tel", dir: "ltr", label: { ar: "الجوال أو الهاتف", en: "Phone" } },
      { id: "email", kind: "email", dir: "ltr", label: { ar: "البريد الإلكتروني", en: "Email" } },
      { id: "instagram", kind: "text", dir: "ltr", placeholder: "@", label: { ar: "إنستغرام", en: "Instagram" } },
      { id: "x", kind: "text", dir: "ltr", placeholder: "@", label: { ar: "إكس (تويتر)", en: "X (Twitter)" } },
      { id: "tiktok", kind: "text", dir: "ltr", placeholder: "@", label: { ar: "تيك توك", en: "TikTok" } },
      { id: "snapchat", kind: "text", dir: "ltr", placeholder: "@", label: { ar: "سناب شات", en: "Snapchat" } },
      { id: "linkedin", kind: "url", dir: "ltr", label: { ar: "لينكدإن", en: "LinkedIn" } },
      { id: "address", kind: "text", label: { ar: "العنوان", en: "Address" } },
      { id: "maps", kind: "url", dir: "ltr", label: { ar: "رابط الموقع على الخريطة", en: "Map link" } },
      { id: "hours", kind: "text", label: { ar: "أوقات العمل", en: "Opening hours" } },
    ],
  },
  {
    title: { ar: "ملاحظات", en: "Notes" },
    fields: [
      {
        id: "notes",
        kind: "textarea",
        label: { ar: "ملاحظات للتنفيذ", en: "Notes for the build" },
        hint: { ar: "أي طلب خاص: صفحة إضافية، ربط متجر، نموذج حجز…", en: "Anything special: an extra page, a store link, a booking form…" },
      },
    ],
  },
];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function newProject(title: string, selection: Selection = DEFAULT_SELECTION, tweaks: Tweaks = {}): Project {
  const now = Date.now();
  return {
    id: uid(),
    title,
    createdAt: now,
    updatedAt: now,
    selection: { ...selection },
    tweaks: cleanTweaks(tweaks),
    sections: null,
    content: { ar: {}, en: {} },
    media: {},
    assets: {},
    info: { ...EMPTY_INFO },
  };
}

/** The sections the page shows, in order (hero excluded). */
export const sectionsOf = (p: Pick<Project, "sections" | "selection">): Block[] =>
  p.sections ?? (PAGES.find((x) => x.id === p.selection.page) ?? PAGES[0]!).value;

/** A file-system and URL friendly name: Latin name if there is one, else the project id. */
export function slugOf(p: Project): string {
  const s = (p.info.nameEn || p.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || `site-${p.id.slice(-6)}`;
}

/** The business name for a language, falling back to the other language. */
export const nameFor = (info: ProjectInfo, lang: Lang) => (lang === "ar" ? info.nameAr || info.nameEn : info.nameEn || info.nameAr);

export const langsOf = (info: ProjectInfo): Lang[] =>
  info.languages === "both" ? [info.defaultLang, info.defaultLang === "ar" ? "en" : "ar"] : [info.languages];

/** Fills in anything an older or hand-edited project file lacks. */
export function normalizeProject(raw: Partial<Project> & { id: string }): Project {
  const base = newProject(raw.title ?? "");
  return {
    ...base,
    ...raw,
    selection: { ...DEFAULT_SELECTION, ...raw.selection },
    tweaks: cleanTweaks(raw.tweaks ?? {}),
    content: { ar: { ...raw.content?.ar }, en: { ...raw.content?.en } },
    media: { ...raw.media },
    assets: { ...raw.assets },
    info: { ...EMPTY_INFO, ...raw.info },
    sections: Array.isArray(raw.sections) ? raw.sections : null,
  };
}
