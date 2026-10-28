import type { Action, FaqItem, FeatureItem, LinkGroup } from "@landing/kit/types";

/** Every locale file must satisfy this shape, so a missing translation fails the type check. */
export interface Content {
  meta: { title: string; description: string; siteName: string };
  ui: { skip: string; nav: string; menu: string; close: string; language: string; home: string; footerNav: string };
  nav: { links: { href: string; label: string }[]; cta: Action };
  hero: { eyebrow: string; title: string; lead: string; actions: Action[] };
  features: { eyebrow: string; title: string; lead: string; items: FeatureItem[] };
  faq: { title: string; items: FaqItem[] };
  cta: { title: string; lead: string; actions: [Action, ...Action[]] };
  footer: { tagline: string; groups: LinkGroup[]; legal: string };
}
