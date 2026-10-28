import type { Content } from "./types";

// نص مؤقت. استبدل كل الجمل؛ البنية هي ما تبنيه الصفحة.
export const ar: Content = {
  meta: { title: "__TITLE__ — وعد في سطر واحد", description: "صف المنتج في جملة واحدة لنتائج البحث.", siteName: "__TITLE__" },
  ui: { skip: "تخطَّ إلى المحتوى", nav: "القائمة الرئيسية", menu: "القائمة", close: "إغلاق القائمة", language: "اللغة", home: "__TITLE__ — الصفحة الرئيسية", footerNav: "روابط التذييل" },
  nav: {
    links: [
      { href: "#features", label: "المزايا" },
      { href: "#faq", label: "الأسئلة الشائعة" },
    ],
    cta: { label: "ابدأ الآن", href: "#start" },
  },
  hero: {
    eyebrow: "الفئة · الجمهور",
    title: "قل ما الذي يتغيّر للعميل.",
    lead: "جملة أو جملتان عن طريقة عمل المنتج، بلغة العميل.",
    actions: [
      { label: "ابدأ الآن", href: "#start", icon: "arrow-right" },
      { label: "تعرّف على المزايا", href: "#features", variant: "secondary" },
    ],
  },
  features: {
    eyebrow: "المزايا",
    title: "ثلاثة أسباب لاختياره",
    lead: "ابدأ بالنتيجة، ثم الطريقة.",
    items: [
      { title: "النتيجة الأولى", body: "ما يحصل عليه العميل، والميزة التي تحققه.", icon: "zap" },
      { title: "النتيجة الثانية", body: "فكرة واحدة لكل عنصر.", icon: "shield" },
      { title: "النتيجة الثالثة", body: "الدليل أقوى من الصفات.", icon: "chart" },
    ],
  },
  faq: {
    title: "أسئلة",
    items: [
      { question: "كم التكلفة؟", answer: "أجب بوضوح." },
      { question: "كيف أبدأ؟", answer: "صف الخطوة الأولى." },
    ],
  },
  cta: { title: "جاهزون متى كنت جاهزاً.", lead: "كرّر الوعد والخطوة التالية.", actions: [{ label: "ابدأ الآن", href: "#features", icon: "arrow-right" }] },
  footer: { tagline: "جملة واحدة عن الشركة.", groups: [{ title: "المنتج", links: [{ label: "المزايا", href: "#features" }, { label: "الأسئلة الشائعة", href: "#faq" }] }], legal: "© 2026 __TITLE__. جميع الحقوق محفوظة." },
};
