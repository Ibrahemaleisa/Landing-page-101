import type { Action, FaqItem, FeatureItem, LinkGroup, Testimonial } from "@landing/kit/types";
import type { ComparisonRow } from "@landing/kit/sections/Comparison.astro";
import type { Plan } from "@landing/kit/sections/Pricing.astro";
import type { ShowcaseItem } from "@landing/kit/sections/Showcase.astro";

/** Every locale file must satisfy this shape, so a missing translation fails the type check. */
export interface Content {
  meta: { title: string; description: string; siteName: string };
  ui: { skip: string; nav: string; menu: string; close: string; language: string; home: string; yes: string; no: string; footerNav: string };
  nav: { links: { href: string; label: string }[]; cta: Action; secondary: Action };
  hero: { eyebrow: string; title: [string, string]; lead: string; actions: Action[]; note: string };
  console: {
    label: string;
    env: string;
    search: string;
    flags: { key: string; name: string; on: boolean; rollout: number; segment: string }[];
    rolloutLabel: string;
    onLabel: string;
    offLabel: string;
    footer: string;
  };
  logos: { title: string; note: string; names: string[] };
  showcase: { eyebrow: string; title: string; lead: string; tabsLabel: string; items: (ShowcaseItem & { code: string })[] };
  features: { eyebrow: string; title: string; lead: string; items: FeatureItem[] };
  compare: { eyebrow: string; title: string; lead: string; caption: string; rowHeader: string; columns: string[]; rows: ComparisonRow[] };
  quotes: { eyebrow: string; title: string; items: Testimonial[]; note: string };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    billing: { legend: string; monthly: string; yearly: string; perMonth: string; perYear: string; note: string };
    plans: Plan[];
    footnote: string;
  };
  faq: { eyebrow: string; title: string; lead: string; items: FaqItem[] };
  cta: { title: [string, string]; lead: string; actions: [Action, ...Action[]] };
  footer: { tagline: string; groups: LinkGroup[]; legal: string };
}
