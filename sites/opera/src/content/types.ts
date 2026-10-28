import type { FeatureItem, StepItem } from "@landing/kit/types";

/** Opera site copy. Both locales must satisfy this shape. */
export interface Content {
  meta: { title: string; description: string };
  ui: { skip: string; nav: string; menu: string; close: string; language: string; home: string; footerNav: string; scroll: string };
  nav: { about: string; capabilities: string; work: string; technologies: string; contact: string; signIn: string };
  hero: { eyebrow: string; line1: string; line2: string; body: string; primary: string; secondary: string };
  about: {
    label: string;
    statement: string;
    body: string;
    buildTitle: string;
    buildBody: string;
    before: { alt: string; caption: string };
    after: { alt: string; caption: string };
    loopTitle: string;
    now: string;
    stages: StepItem[];
  };
  capabilities: { label: string; title: string; intro: string; items: FeatureItem[] };
  work: {
    label: string;
    title: string;
    intro: string;
    onRequest: string;
    ask: string;
    photos: { alt: string; caption: string; label: string }[];
  };
  formula: {
    label: string;
    title: string;
    intro: string;
    hint: string;
    all: string;
    principles: { name: string; body: string }[];
  };
  technologies: {
    label: string;
    title: string;
    body: string;
    proof: string;
    items: string[];
    panel: { title: string; when: string; note: string; rows: { name: string; state: string }[] };
  };
  contact: { label: string; line1: string; line2: string; body: string; cta: string };
  brief: {
    label: string;
    title: string;
    lead: string;
    demoNote: string;
    form: {
      label: string;
      name: string;
      org: string;
      email: string;
      phone: string;
      type: string;
      typeOptions: { value: string; label: string }[];
      message: string;
      messageHint: string;
      submit: string;
      required: string;
      requiredMsg: string;
      emailMsg: string;
      success: string;
      errors: string;
    };
  };
  footer: { promise: string; rights: string; groups: { title: string; links: { label: string; href: string }[] }[] };
}
