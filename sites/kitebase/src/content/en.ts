import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Kitebase — feature flags and experiments for teams that ship daily",
    description:
      "Kitebase lets product teams release behind flags, roll out gradually, run experiments and switch off a bad change in one click. Fictional product for the Landing Kit reference implementation.",
    siteName: "Kitebase",
  },
  ui: {
    skip: "Skip to content",
    nav: "Main",
    menu: "Menu",
    close: "Close menu",
    language: "Language",
    home: "Kitebase — home",
    yes: "Included",
    no: "Not included",
    footerNav: "Footer",
  },
  nav: {
    links: [
      { href: "#product", label: "Product" },
      { href: "#features", label: "Platform" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { label: "Start free", href: "#pricing", icon: "arrow-right" },
    secondary: { label: "Sign in", href: "#start" },
  },
  hero: {
    eyebrow: "Feature flags · Experiments · Rollouts",
    title: ["Ship on Friday.", "Sleep on Saturday."],
    lead: "Kitebase puts every change behind a flag. Release to 1% first, watch the numbers, then go to everyone. If something breaks, turn it off without a deploy.",
    actions: [
      { label: "Start free", href: "#pricing", icon: "arrow-right" },
      { label: "See how it works", href: "#product", variant: "secondary" },
    ],
    note: "Free for up to 5 seats. No credit card.",
  },
  console: {
    label: "Kitebase flag console (illustration)",
    env: "production",
    search: "Search flags",
    flags: [
      { key: "new-checkout", name: "New checkout flow", on: true, rollout: 25, segment: "EU · web" },
      { key: "smart-search", name: "Smart search ranking", on: true, rollout: 100, segment: "Everyone" },
      { key: "dark-mode", name: "Dark mode", on: true, rollout: 60, segment: "Beta users" },
      { key: "legacy-export", name: "Legacy CSV export", on: false, rollout: 0, segment: "Kill switch" },
    ],
    rolloutLabel: "Rollout",
    onLabel: "On",
    offLabel: "Off",
    footer: "4 flags · last change 2 min ago by Mira",
  },
  logos: {
    title: "Teams shipping with Kitebase",
    note: "Fictional companies for demonstration.",
    names: ["Northpine", "Fieldnote", "Quarry", "Halcyon Labs", "Lumen&Co", "Driftwood"],
  },
  showcase: {
    eyebrow: "How it works",
    title: "One flag. Three ways to use it.",
    lead: "The same primitive covers releases, experiments and emergencies. Your code asks one question; the console decides the answer.",
    tabsLabel: "Use cases",
    items: [
      {
        id: "release",
        label: "Release",
        title: "Progressive delivery",
        body: "Merge to main on day one. Turn the feature on for your team, then 5% of customers, then everyone — on a schedule, or by hand.",
        points: ["Percentage and segment targeting", "Scheduled ramps", "Per-environment state"],
        code: `if (await kite.isOn("new-checkout", user)) {\n  return <NewCheckout />;\n}\nreturn <Checkout />;`,
      },
      {
        id: "experiment",
        label: "Experiment",
        title: "Experiments with guardrails",
        body: "Split traffic between variants and read results against the metrics you already track. Kitebase stops a test that hurts a guardrail metric.",
        points: ["Sequential testing, no peeking penalty", "Guardrail metrics", "Warehouse-native results"],
        code: `const variant = await kite.variant("pricing-page", user);\n// "control" | "annual-first" | "calculator"\ntrack("pricing_viewed", { variant });`,
      },
      {
        id: "kill",
        label: "Kill switch",
        title: "Turn it off in one click",
        body: "Every flag doubles as a kill switch. Flip it in the console or from Slack, and every SDK picks up the change within seconds — no redeploy, no rollback.",
        points: ["Propagates in under 3 seconds", "Audit log for every change", "Slack and CLI control"],
        code: `$ kite flags off legacy-export --env production\n✓ legacy-export is off in production\n  propagated to 214 SDK instances in 1.8s`,
      },
    ],
  },
  features: {
    eyebrow: "Platform",
    title: "Built for the boring parts, too",
    lead: "Flags are easy. Running them across forty services for three years is not.",
    items: [
      {
        title: "Local evaluation",
        body: "SDKs evaluate flags in-process from a streamed ruleset: no network call on the hot path, and flags keep working when we don't.",
        icon: "zap",
        tags: ["12 SDKs", "<1 ms", "Offline-safe"],
      },
      { title: "Audit everything", body: "Who changed what, when and why, with a diff, for every flag in every environment.", icon: "shield" },
      {
        title: "Stale flag cleanup",
        body: "Kitebase finds flags that have been at 100% for 30 days and opens a pull request to remove them.",
        icon: "git-branch",
      },
      { title: "Approvals", body: "Require a second reviewer for production changes, just like code.", icon: "users" },
      { title: "Metrics that matter", body: "Connect your warehouse and read experiment results where your data already lives.", icon: "chart" },
    ],
  },
  compare: {
    eyebrow: "Why not build it?",
    title: "You could. Here's what you'd be signing up for.",
    lead: "Most teams start with a config file. Most teams outgrow it in a year.",
    caption: "Kitebase compared with homegrown flags and config files",
    rowHeader: "Capability",
    columns: ["Kitebase", "Homegrown flags", "Config files"],
    rows: [
      { label: "Change without deploying", values: [true, true, false] },
      { label: "Percentage rollouts", values: [true, "Partial", false] },
      { label: "Experiment analysis", values: [true, false, false] },
      { label: "Audit log and approvals", values: [true, false, "Via git"] },
      { label: "Stale flag detection", values: [true, false, false] },
      { label: "Engineering time to maintain", values: ["None", "Ongoing", "Low"] },
    ],
  },
  quotes: {
    eyebrow: "Customers",
    title: "Fewer late nights, by their own account",
    items: [
      {
        quote: "We used to freeze deploys on Thursdays. Now we ship on Friday afternoon and nobody flinches.",
        name: "Mira Okafor",
        role: "VP Engineering",
        company: "Northpine",
      },
      {
        quote: "The stale-flag pull requests alone paid for it. We deleted 340 dead flags in a month.",
        name: "Tomás Reyes",
        role: "Staff Engineer",
        company: "Quarry",
      },
      {
        quote: "Our PMs run their own experiments now. Engineering just ships the variants.",
        name: "Lena Vogt",
        role: "Head of Product",
        company: "Fieldnote",
      },
    ],
    note: "Fictional people and companies for demonstration.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start free. Pay when it matters.",
    lead: "Every plan includes unlimited flags and environments.",
    billing: { legend: "Billing period", monthly: "Monthly", yearly: "Yearly", perMonth: "/ seat / month", perYear: "/ seat / year", note: "−20%" },
    plans: [
      {
        name: "Free",
        description: "For side projects and small teams getting started with flags.",
        price: { monthly: "$0", yearly: "$0" },
        features: ["Up to 5 seats", "Unlimited flags", "2 environments", "Community support"],
        cta: { label: "Start free", href: "#start" },
      },
      {
        name: "Team",
        description: "For product teams releasing daily and running experiments.",
        price: { monthly: "$24", yearly: "$230" },
        features: ["Unlimited seats", "Experiments and guardrails", "Approvals and audit log", "Stale flag cleanup", "Email support"],
        cta: { label: "Start 14-day trial", href: "#start" },
        featured: true,
        badge: "Most teams",
      },
      {
        name: "Enterprise",
        description: "For organisations with compliance, scale and support needs.",
        price: { custom: "Let's talk" },
        features: ["SSO and SCIM", "Self-hosted relay", "99.99% uptime SLA", "Dedicated engineer"],
        cta: { label: "Contact sales", href: "#start" },
      },
    ],
    footnote: "Prices in US dollars, excluding tax. Fictional pricing for demonstration.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions engineers ask us",
    lead: "Something else? Our support is staffed by the people who build the product.",
    items: [
      {
        question: "Does Kitebase add latency to my requests?",
        answer: "No. SDKs keep the ruleset in memory and evaluate flags locally, typically in under a millisecond. Updates stream in the background.",
      },
      {
        question: "What happens if Kitebase is down?",
        answer: [
          "Your flags keep their last known values. SDKs cache the ruleset and fall back to defaults you set in code, so an outage on our side never takes your product down.",
        ],
      },
      {
        question: "Can we host it ourselves?",
        answer: "The Enterprise plan includes a self-hosted relay that keeps evaluation inside your network. The console stays managed.",
      },
      {
        question: "How do you price experiments?",
        answer: "Experiments are included in the Team plan with no per-event fees. You pay per seat, not per impression.",
      },
      {
        question: "Which languages do you support?",
        answer: "Twelve server and client SDKs, including TypeScript, Go, Python, Java, Swift and Kotlin, plus an OpenFeature provider.",
      },
    ],
  },
  cta: {
    title: ["Put your next release", "behind a flag."],
    lead: "Set up takes about ten minutes. Your first five seats are free forever.",
    actions: [
      { label: "Start free", href: "#start", icon: "arrow-right" },
      { label: "Book a demo", href: "#start", variant: "secondary" },
    ],
  },
  footer: {
    tagline: "Feature flags and experiments for teams that ship daily. A fictional product built to test Landing Kit.",
    groups: [
      {
        title: "Product",
        links: [
          { label: "Flags", href: "#product" },
          { label: "Experiments", href: "#product" },
          { label: "Pricing", href: "#pricing" },
        ],
      },
      {
        title: "Developers",
        links: [
          { label: "Docs", href: "#product" },
          { label: "SDKs", href: "#features" },
          { label: "Status", href: "#faq" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#stories" },
          { label: "Security", href: "#compare" },
          { label: "Contact", href: "#start" },
        ],
      },
    ],
    legal: "© 2026 Kitebase (fictional). All rights reserved.",
  },
};
