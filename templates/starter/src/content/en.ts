import type { Content } from "./types";

// Placeholder copy. Replace every string; the structure is what the page composes.
export const en: Content = {
  meta: { title: "__TITLE__ — one-line promise", description: "Describe the product in one sentence for search results.", siteName: "__TITLE__" },
  ui: { skip: "Skip to content", nav: "Main", menu: "Menu", close: "Close menu", language: "Language", home: "__TITLE__ — home", footerNav: "Footer" },
  nav: {
    links: [
      { href: "#features", label: "Features" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { label: "Get started", href: "#start" },
  },
  hero: {
    eyebrow: "Category · Audience",
    title: "Say what changes for the customer.",
    lead: "One or two sentences on how the product does it, in the customer's words.",
    actions: [
      { label: "Get started", href: "#start", icon: "arrow-right" },
      { label: "See features", href: "#features", variant: "secondary" },
    ],
  },
  features: {
    eyebrow: "Features",
    title: "Three reasons to choose it",
    lead: "Lead with outcomes, follow with how.",
    items: [
      { title: "First outcome", body: "What the customer gets, and the feature that delivers it.", icon: "zap" },
      { title: "Second outcome", body: "Keep each item to one idea.", icon: "shield" },
      { title: "Third outcome", body: "Proof beats adjectives.", icon: "chart" },
    ],
  },
  faq: {
    title: "Questions",
    items: [
      { question: "What does it cost?", answer: "Answer plainly." },
      { question: "How do I start?", answer: "Describe the first step." },
    ],
  },
  cta: { title: "Ready when you are.", lead: "Repeat the promise and the next step.", actions: [{ label: "Get started", href: "#features", icon: "arrow-right" }] },
  footer: { tagline: "One sentence about the company.", groups: [{ title: "Product", links: [{ label: "Features", href: "#features" }, { label: "FAQ", href: "#faq" }] }], legal: "© 2026 __TITLE__." },
};
