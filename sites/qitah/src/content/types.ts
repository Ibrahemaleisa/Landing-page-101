import type { Action, FaqItem, FeatureItem, LinkGroup, StatItem, StepItem } from "@landing/kit/types";
import type { NarrativeItem } from "@landing/kit/sections/FeatureNarrative.astro";

export type Option = { value: string; label: string };
export type OfferBadge = "cheapest" | "fastest" | "topRated";
export type CategoryIcon = "brakes" | "filters" | "oils" | "engine" | "suspension" | "electrical" | "lighting" | "cooling" | "body";

/** Every locale file must satisfy this shape, so a missing translation fails the type check. */
export interface Content {
  meta: { title: string; description: string; siteName: string };
  ui: {
    skip: string;
    nav: string;
    menu: string;
    close: string;
    language: string;
    home: string;
    footerNav: string;
    logo: string;
    /** Currency label shown after the amount, e.g. "ر.س" / "SAR". */
    currency: string;
    sample: string;
  };
  nav: { links: { href: string; label: string }[]; cta: Action };
  hero: { eyebrow: string; title: string[]; lead: string; actions: Action[]; assurances: string[] };
  finder: {
    title: string;
    lead: string;
    make: { label: string; placeholder: string; options: Option[] };
    model: { label: string; placeholder: string; groups: { label: string; options: Option[] }[] };
    year: { label: string; placeholder: string; options: Option[] };
    query: { label: string; placeholder: string; hint: string };
    submit: string;
    popularLabel: string;
    popular: string[];
    fit: { label: string; detail: string };
  };
  categories: { eyebrow: string; title: string; lead: string; items: { id: CategoryIcon; name: string; hint: string }[] };
  steps: { eyebrow: string; title: string; lead: string; items: StepItem[] };
  story: { eyebrow: string; title: string; lead: string; items: [NarrativeItem, NarrativeItem, NarrativeItem] };
  offers: {
    label: string;
    part: string;
    partNumberLabel: string;
    partNumber: string;
    vehicle: string;
    count: string;
    sortLabel: string;
    sort: string;
    badges: Record<OfferBadge, string>;
    selected: string;
    ratingLabel: string;
    reviews: string;
    deliveryLabel: string;
    items: {
      seller: string;
      city: string;
      condition: string;
      price: number;
      delivery: string;
      rating: number;
      reviews: number;
      badges: OfferBadge[];
      selected?: boolean;
    }[];
    vat: string;
  };
  fit: {
    label: string;
    vehicle: string;
    items: { state: "fits" | "confirm"; part: string; partNumber: string; status: string; detail: string }[];
  };
  tracking: {
    label: string;
    order: string;
    destinationLabel: string;
    destination: string;
    stages: { title: string; time: string; state: "done" | "now" | "todo" }[];
    stateLabels: { done: string; now: string; todo: string };
  };
  trust: { eyebrow: string; title: string; lead: string; items: FeatureItem[] };
  stats: { eyebrow: string; title: string; lead: string; items: StatItem[]; note: string };
  merchant: { eyebrow: string; title: [string, string]; lead: string; actions: [Action, ...Action[]]; points: string[] };
  faq: { eyebrow: string; title: string; lead: string; items: FaqItem[] };
  footer: { tagline: string; groups: LinkGroup[]; legal: string };
}
