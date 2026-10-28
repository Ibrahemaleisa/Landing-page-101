import type { IconName } from "./primitives/icons";

/** A call to action rendered as a Button. */
export interface Action {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "link";
  icon?: IconName;
  /** Opens in a new tab and says so to assistive technology. */
  external?: boolean;
}

export interface FeatureItem {
  title: string;
  body: string;
  icon?: IconName;
  tags?: string[];
  href?: string;
  /** Short label above the title (e.g. "New"). */
  eyebrow?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  company?: string;
}

export interface StatItem {
  value: string;
  label: string;
  note?: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  /** One string per paragraph. */
  answer: string | string[];
}

export interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
