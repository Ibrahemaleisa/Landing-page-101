/**
 * Demo copy for the preview: a fictional product, "Rawaq", written generally enough to read well in
 * every page template (product, company, marketplace, portfolio, launch). All names are fictional.
 */
import type { Action, FaqItem, FeatureItem, StatItem, StepItem, Testimonial } from "@landing/kit/types";
import type { ComparisonRow } from "@landing/kit/sections/Comparison.astro";
import type { Plan } from "@landing/kit/sections/Pricing.astro";
import type { ShowcaseItem } from "@landing/kit/sections/Showcase.astro";
import type { NarrativeItem } from "@landing/kit/sections/FeatureNarrative.astro";

export interface PreviewContent {
  meta: { title: string; description: string };
  ui: { skip: string; nav: string; menu: string; close: string; language: string; home: string; footerNav: string; yes: string; no: string; scroll: string };
  nav: { href: string; label: string }[];
  cta: Action;
  hero: { eyebrow: string; title: [string, string]; lead: string; actions: Action[]; note: string; country: string };
  card: { title: string; meta: string; rows: { label: string; value: string }[]; status: string; button: string };
  app: { title: string; tabs: string[]; metrics: { label: string; value: string; delta: string }[]; chart: string };
  logos: { title: string; note: string; names: string[] };
  statement: { eyebrow: string; text: string; lead: string };
  showcase: { eyebrow: string; title: string; lead: string; tabsLabel: string; items: ShowcaseItem[] };
  features: { eyebrow: string; title: string; lead: string; items: FeatureItem[] };
  narrative: { eyebrow: string; title: string; items: NarrativeItem[] };
  steps: { eyebrow: string; title: string; items: StepItem[]; now: string };
  stats: { eyebrow: string; title: string; items: StatItem[]; note: string };
  quotes: { eyebrow: string; title: string; items: Testimonial[]; note: string };
  compare: { eyebrow: string; title: string; caption: string; rowHeader: string; columns: string[]; rows: ComparisonRow[] };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    billing: { legend: string; monthly: string; yearly: string; perMonth: string; perYear: string; note: string };
    plans: Plan[];
    footnote: string;
  };
  faq: { eyebrow: string; title: string; lead: string; items: FaqItem[] };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    form: {
      label: string;
      name: string;
      email: string;
      message: string;
      submit: string;
      required: string;
      requiredMsg: string;
      emailMsg: string;
      success: string;
      errors: string;
      note: string;
    };
  };
  close: { title: [string, string]; lead: string; actions: [Action, ...Action[]] };
  footer: { tagline: string; groups: { title: string; links: { label: string; href: string }[] }[]; legal: string };
}

export const en: PreviewContent = {
  meta: { title: "Rawaq — style preview", description: "Live preview of a Landing Kit style." },
  ui: {
    skip: "Skip to content",
    nav: "Main",
    menu: "Menu",
    close: "Close menu",
    language: "Language",
    home: "Rawaq — home",
    footerNav: "Footer",
    yes: "Included",
    no: "Not included",
    scroll: "Scroll",
  },
  nav: [
    { href: "#features", label: "Features" },
    { href: "#steps", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ],
  cta: { label: "Get started", href: "#close", icon: "arrow-right" },
  hero: {
    eyebrow: "Plan · Build · Launch",
    title: ["Make the complicated", "feel effortless."],
    lead: "Rawaq brings your plans, people and progress into one calm place, so every launch arrives on time and on brand.",
    actions: [
      { label: "Get started", href: "#close", icon: "arrow-right" },
      { label: "See how it works", href: "#steps", variant: "secondary" },
    ],
    note: "Free for small teams · No card needed",
    country: "Riyadh · Remote",
  },
  card: {
    title: "Spring launch",
    meta: "Opens in 12 days",
    rows: [
      { label: "Plan", value: "Approved" },
      { label: "Design", value: "In review" },
      { label: "Content", value: "68%" },
    ],
    status: "On track",
    button: "Open project",
  },
  app: {
    title: "Overview",
    tabs: ["Projects", "Team", "Reports"],
    metrics: [
      { label: "On time", value: "94%", delta: "+6%" },
      { label: "Active projects", value: "18", delta: "+3" },
      { label: "Hours saved", value: "312", delta: "+48" },
    ],
    chart: "Delivery this quarter",
  },
  logos: {
    title: "Trusted by teams at",
    note: "Fictional companies for demonstration.",
    names: ["Northpine", "Wadi Labs", "Sahel & Co", "Fieldnote", "Qamar", "Driftwood"],
  },
  statement: {
    eyebrow: "Who we are",
    text: "We believe the best work happens when everyone can see the same plan and trust it.",
    lead: "Rawaq started as a studio tool for our own projects. Today it helps teams of every size plan clearly, move together and deliver without drama.",
  },
  showcase: {
    eyebrow: "Product",
    title: "One place, three ways to work",
    lead: "Switch views without losing context.",
    tabsLabel: "Ways to work",
    items: [
      {
        id: "plan",
        label: "Plan",
        title: "Plans everyone understands",
        body: "Turn a brief into milestones, owners and dates in minutes.",
        points: ["Templates for common projects", "Dependencies that update themselves"],
      },
      {
        id: "track",
        label: "Track",
        title: "Progress you can trust",
        body: "Every status is live, so nobody has to ask where things stand.",
        points: ["Real-time status", "Gentle reminders, not noise"],
      },
      {
        id: "share",
        label: "Share",
        title: "Clients see what matters",
        body: "Share a clean view with clients and approve work in one click.",
        points: ["Client portal", "One-click approvals"],
      },
    ],
  },
  features: {
    eyebrow: "Features",
    title: "Everything a team needs, nothing it doesn't",
    lead: "Built around how real projects actually run.",
    items: [
      { title: "Clear plans", body: "Milestones, owners and dates that everyone can read at a glance.", icon: "layers", tags: ["Templates", "Timelines"] },
      { title: "Live status", body: "Know what's done, what's late and what's next — without a meeting.", icon: "gauge" },
      { title: "Client approvals", body: "Collect sign-off where the work lives, with a full history.", icon: "badge-check" },
      { title: "Team workload", body: "See who has room before you assign the next task.", icon: "users" },
      { title: "Reports", body: "Weekly summaries written for people, not dashboards.", icon: "chart" },
      { title: "Secure by default", body: "Permissions, audit trail and data stored in the region.", icon: "shield" },
    ],
  },
  narrative: {
    eyebrow: "In practice",
    title: "Built for the moments that matter",
    items: [
      {
        eyebrow: "Before",
        title: "Start with a clear brief",
        body: "Capture the goal, the constraints and the audience before anyone commits.",
        points: ["Guided brief", "Shared assumptions"],
      },
      { eyebrow: "During", title: "Move together, visibly", body: "Every team sees the same plan, the same dates and the same priorities." },
      {
        eyebrow: "After",
        title: "Close the loop",
        body: "Deliver, document and learn — so the next launch is easier than the last.",
        action: { label: "Read a story", href: "#quotes" },
      },
    ],
  },
  steps: {
    eyebrow: "How it works",
    title: "Three steps to a calmer launch",
    now: "Now",
    items: [
      { title: "Brief", body: "Describe the goal; Rawaq drafts the plan." },
      { title: "Plan", body: "Assign owners and dates, together." },
      { title: "Deliver", body: "Track progress live and approve as you go." },
      { title: "Review", body: "Learn what worked for next time." },
    ],
  },
  stats: {
    eyebrow: "In numbers",
    title: "Small changes, big difference",
    items: [
      { value: "94%", label: "Projects delivered on time" },
      { value: "3×", label: "Faster approvals" },
      { value: "12 h", label: "Saved per person, per month" },
      { value: "4.8", label: "Average team rating" },
    ],
    note: "Sample figures for demonstration.",
  },
  quotes: {
    eyebrow: "Stories",
    title: "Teams that stopped chasing updates",
    items: [
      {
        quote: "For the first time, the client and the team were looking at the same plan. The launch felt quiet — in the best way.",
        name: "Nora Al-Harbi",
        role: "Head of Delivery",
        company: "Wadi Labs",
      },
      { quote: "We cut our weekly status meeting. Nobody missed it.", name: "Omar Haddad", role: "Producer", company: "Sahel & Co" },
      { quote: "Approvals that used to take a week now take an afternoon.", name: "Lina Ortiz", role: "Studio Lead", company: "Northpine" },
    ],
    note: "Fictional people and companies for demonstration.",
  },
  compare: {
    eyebrow: "Compare",
    title: "Why teams switch",
    caption: "Rawaq compared with spreadsheets and email",
    rowHeader: "Capability",
    columns: ["Rawaq", "Spreadsheets", "Email"],
    rows: [
      { label: "Live status for everyone", values: [true, false, false] },
      { label: "Client approvals", values: [true, false, "Manual"] },
      { label: "Workload view", values: [true, "Partial", false] },
      { label: "Arabic and English", values: [true, true, true] },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Simple plans that grow with you",
    lead: "Every plan includes unlimited projects.",
    billing: { legend: "Billing period", monthly: "Monthly", yearly: "Yearly", perMonth: "/ month", perYear: "/ year", note: "−20%" },
    plans: [
      {
        name: "Starter",
        description: "For small teams getting organised.",
        price: { monthly: "SAR 0", yearly: "SAR 0" },
        features: ["Up to 5 people", "Unlimited projects", "Templates"],
        cta: { label: "Start free", href: "#close" },
      },
      {
        name: "Team",
        description: "For teams running several projects at once.",
        price: { monthly: "SAR 89", yearly: "SAR 855" },
        features: ["Unlimited people", "Client portal", "Approvals", "Reports"],
        cta: { label: "Try 14 days free", href: "#close" },
        featured: true,
        badge: "Popular",
      },
      {
        name: "Enterprise",
        description: "For organisations with security and scale needs.",
        price: { custom: "Let's talk" },
        features: ["SSO", "Data residency", "Dedicated support"],
        cta: { label: "Contact us", href: "#close" },
      },
    ],
    footnote: "Sample prices for demonstration.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    lead: "Still curious? We're happy to help.",
    items: [
      { question: "Is there a free plan?", answer: "Yes. Small teams can use Rawaq free, with no time limit." },
      {
        question: "Does it work in Arabic?",
        answer: "Fully. The interface, documents and reports work in Arabic and English, right to left and left to right.",
      },
      { question: "Can clients see our work?", answer: "Only what you share with them, through a clean client view." },
      { question: "Where is our data stored?", answer: "In the region, encrypted at rest and in transit." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us about your project",
    lead: "A few lines are enough. We'll reply within a working day.",
    form: {
      label: "Contact form",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send",
      required: "(required)",
      requiredMsg: "This field is required.",
      emailMsg: "Enter a valid email, like name@example.com.",
      success: "Thanks — this is a preview, so nothing was sent.",
      errors: "Please correct the highlighted fields.",
      note: "Preview only: this form doesn't send anything.",
    },
  },
  close: {
    title: ["Ready for a calmer launch?", "Start today."],
    lead: "Set up in minutes. Free for small teams.",
    actions: [
      { label: "Get started", href: "#top", icon: "arrow-right" },
      { label: "Talk to us", href: "#faq", variant: "secondary" },
    ],
  },
  footer: {
    tagline: "Rawaq is a fictional product used to preview Landing Kit styles.",
    groups: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#top" },
          { label: "Contact", href: "#faq" },
        ],
      },
    ],
    legal: "© 2026 Rawaq (fictional).",
  },
};

export const ar: PreviewContent = {
  meta: { title: "رواق — معاينة النمط", description: "معاينة حيّة لنمط من أنماط Landing Kit." },
  ui: {
    skip: "تخطَّ إلى المحتوى",
    nav: "القائمة الرئيسية",
    menu: "القائمة",
    close: "إغلاق القائمة",
    language: "اللغة",
    home: "رواق — الصفحة الرئيسية",
    footerNav: "روابط التذييل",
    yes: "متاح",
    no: "غير متاح",
    scroll: "مرّر",
  },
  nav: [
    { href: "#features", label: "المزايا" },
    { href: "#steps", label: "طريقة العمل" },
    { href: "#pricing", label: "الأسعار" },
    { href: "#faq", label: "الأسئلة الشائعة" },
    { href: "#contact", label: "تواصل" },
  ],
  cta: { label: "ابدأ الآن", href: "#close", icon: "arrow-right" },
  hero: {
    eyebrow: "خطّط · ابنِ · أطلِق",
    title: ["اجعل المعقّد", "يبدو سهلاً."],
    lead: "يجمع رواق خططك وفريقك وتقدّم العمل في مكان واحد هادئ، ليصل كل إطلاق في موعده وبالصورة التي تريدها.",
    actions: [
      { label: "ابدأ الآن", href: "#close", icon: "arrow-right" },
      { label: "تعرّف على طريقة العمل", href: "#steps", variant: "secondary" },
    ],
    note: "مجاني للفرق الصغيرة · دون بطاقة",
    country: "الرياض · عن بُعد",
  },
  card: {
    title: "إطلاق الربيع",
    meta: "الافتتاح بعد 12 يوماً",
    rows: [
      { label: "الخطة", value: "معتمدة" },
      { label: "التصميم", value: "قيد المراجعة" },
      { label: "المحتوى", value: "68٪" },
    ],
    status: "في الموعد",
    button: "افتح المشروع",
  },
  app: {
    title: "نظرة عامة",
    tabs: ["المشاريع", "الفريق", "التقارير"],
    metrics: [
      { label: "في الموعد", value: "94٪", delta: "+6٪" },
      { label: "مشاريع نشطة", value: "18", delta: "+3" },
      { label: "ساعات موفّرة", value: "312", delta: "+48" },
    ],
    chart: "التسليم هذا الربع",
  },
  logos: { title: "تثق به فرق في", note: "شركات افتراضية لأغراض العرض.", names: ["Northpine", "Wadi Labs", "Sahel & Co", "Fieldnote", "Qamar", "Driftwood"] },
  statement: {
    eyebrow: "من نحن",
    text: "نؤمن أن أفضل العمل يحدث حين يرى الجميع الخطة نفسها ويثقون بها.",
    lead: "بدأ رواق أداةً داخلية لمشاريع استوديو صغير. واليوم يساعد فرقاً من كل الأحجام على التخطيط بوضوح، والتحرك معاً، والتسليم دون توتر.",
  },
  showcase: {
    eyebrow: "المنتج",
    title: "مكان واحد، وثلاث طرق للعمل",
    lead: "بدّل العرض دون أن تفقد السياق.",
    tabsLabel: "طرق العمل",
    items: [
      {
        id: "plan",
        label: "خطّط",
        title: "خطط يفهمها الجميع",
        body: "حوّل الطلب إلى مراحل ومسؤولين ومواعيد خلال دقائق.",
        points: ["قوالب للمشاريع الشائعة", "اعتمادات تتحدّث تلقائياً"],
      },
      {
        id: "track",
        label: "تابع",
        title: "تقدّم يمكنك الوثوق به",
        body: "كل حالة مباشرة، فلا يحتاج أحد أن يسأل أين وصل العمل.",
        points: ["حالة لحظية", "تذكيرات لطيفة لا إزعاج"],
      },
      {
        id: "share",
        label: "شارك",
        title: "العميل يرى ما يهمّه",
        body: "شارك عرضاً نظيفاً مع العميل واعتمد العمل بنقرة واحدة.",
        points: ["بوابة للعميل", "اعتماد بنقرة واحدة"],
      },
    ],
  },
  features: {
    eyebrow: "المزايا",
    title: "كل ما يحتاجه الفريق، ولا شيء زائد",
    lead: "مبني حول الطريقة التي تُدار بها المشاريع فعلاً.",
    items: [
      { title: "خطط واضحة", body: "مراحل ومسؤولون ومواعيد يقرؤها الجميع بنظرة واحدة.", icon: "layers", tags: ["قوالب", "جداول زمنية"] },
      { title: "حالة مباشرة", body: "اعرف ما اكتمل وما تأخّر وما التالي — دون اجتماع.", icon: "gauge" },
      { title: "اعتمادات العميل", body: "اجمع الموافقات حيث يعيش العمل، مع سجل كامل.", icon: "badge-check" },
      { title: "حِمل الفريق", body: "اعرف من لديه متّسع قبل أن تسند المهمة التالية.", icon: "users" },
      { title: "تقارير", body: "ملخصات أسبوعية مكتوبة للناس، لا للوحات المؤشرات.", icon: "chart" },
      { title: "آمن افتراضياً", body: "صلاحيات وسجل تدقيق وبيانات محفوظة داخل المنطقة.", icon: "shield" },
    ],
  },
  narrative: {
    eyebrow: "على أرض الواقع",
    title: "مصمَّم للّحظات التي تهمّ",
    items: [
      { eyebrow: "قبل", title: "ابدأ بطلب واضح", body: "اجمع الهدف والقيود والجمهور قبل أي التزام.", points: ["طلب موجَّه", "افتراضات مشتركة"] },
      { eyebrow: "أثناء", title: "تحرّكوا معاً، بوضوح", body: "كل فريق يرى الخطة نفسها والمواعيد نفسها والأولويات نفسها." },
      { eyebrow: "بعد", title: "أكمل الحلقة", body: "سلّم ووثّق وتعلّم — ليكون الإطلاق القادم أسهل من سابقه.", action: { label: "اقرأ قصة", href: "#quotes" } },
    ],
  },
  steps: {
    eyebrow: "طريقة العمل",
    title: "ثلاث خطوات لإطلاق أهدأ",
    now: "الآن",
    items: [
      { title: "الطلب", body: "صف الهدف، ويصيغ رواق الخطة." },
      { title: "التخطيط", body: "حدّدوا المسؤولين والمواعيد معاً." },
      { title: "التسليم", body: "تابع التقدّم مباشرة واعتمد أولاً بأول." },
      { title: "المراجعة", body: "تعلّم ما نجح للمرة القادمة." },
    ],
  },
  stats: {
    eyebrow: "بالأرقام",
    title: "تغييرات صغيرة، وفرق كبير",
    items: [
      { value: "94٪", label: "مشاريع سُلّمت في موعدها" },
      { value: "3×", label: "اعتمادات أسرع" },
      { value: "12 س", label: "موفّرة لكل شخص شهرياً" },
      { value: "4.8", label: "متوسط تقييم الفرق" },
    ],
    note: "أرقام افتراضية لأغراض العرض.",
  },
  quotes: {
    eyebrow: "قصص",
    title: "فرق توقّفت عن ملاحقة التحديثات",
    items: [
      {
        quote: "لأول مرة كان العميل والفريق ينظران إلى الخطة نفسها. مرّ الإطلاق بهدوء — بأفضل معنى للكلمة.",
        name: "نورة الحربي",
        role: "رئيسة التسليم",
        company: "Wadi Labs",
      },
      { quote: "ألغينا اجتماع الحالة الأسبوعي، ولم يفتقده أحد.", name: "عمر حدّاد", role: "منتج", company: "Sahel & Co" },
      { quote: "الاعتمادات التي كانت تستغرق أسبوعاً صارت تنتهي في عصرية.", name: "لينا أورتيز", role: "قائدة الاستوديو", company: "Northpine" },
    ],
    note: "أشخاص وشركات افتراضية لأغراض العرض.",
  },
  compare: {
    eyebrow: "مقارنة",
    title: "لماذا تنتقل الفرق إلينا",
    caption: "مقارنة رواق بجداول البيانات والبريد الإلكتروني",
    rowHeader: "القدرة",
    columns: ["رواق", "جداول البيانات", "البريد"],
    rows: [
      { label: "حالة مباشرة للجميع", values: [true, false, false] },
      { label: "اعتمادات العميل", values: [true, false, "يدوياً"] },
      { label: "عرض حِمل الفريق", values: [true, "جزئياً", false] },
      { label: "العربية والإنجليزية", values: [true, true, true] },
    ],
  },
  pricing: {
    eyebrow: "الأسعار",
    title: "خطط بسيطة تكبر معك",
    lead: "كل الخطط تشمل مشاريع غير محدودة.",
    billing: { legend: "فترة الفوترة", monthly: "شهري", yearly: "سنوي", perMonth: "/ شهرياً", perYear: "/ سنوياً", note: "−20٪" },
    plans: [
      {
        name: "البداية",
        description: "للفرق الصغيرة التي تريد التنظيم.",
        price: { monthly: "0 ر.س", yearly: "0 ر.س" },
        features: ["حتى 5 أشخاص", "مشاريع غير محدودة", "قوالب جاهزة"],
        cta: { label: "ابدأ مجاناً", href: "#close" },
      },
      {
        name: "الفريق",
        description: "للفرق التي تدير عدة مشاريع معاً.",
        price: { monthly: "89 ر.س", yearly: "855 ر.س" },
        features: ["أشخاص بلا حدود", "بوابة العميل", "الاعتمادات", "التقارير"],
        cta: { label: "جرّب 14 يوماً مجاناً", href: "#close" },
        featured: true,
        badge: "الأكثر طلباً",
      },
      {
        name: "المؤسسات",
        description: "للجهات ذات متطلبات الأمان والحجم.",
        price: { custom: "لنتحدث" },
        features: ["دخول موحّد SSO", "إقامة البيانات محلياً", "دعم مخصص"],
        cta: { label: "تواصل معنا", href: "#close" },
      },
    ],
    footnote: "أسعار افتراضية لأغراض العرض.",
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات لأسئلتك",
    lead: "سؤال آخر؟ يسعدنا مساعدتك.",
    items: [
      { question: "هل توجد خطة مجانية؟", answer: "نعم. تستطيع الفرق الصغيرة استخدام رواق مجاناً ودون حدّ زمني." },
      { question: "هل يعمل بالعربية؟", answer: "بالكامل. الواجهة والمستندات والتقارير تعمل بالعربية والإنجليزية، من اليمين ومن اليسار." },
      { question: "هل يرى العميل عملنا؟", answer: "فقط ما تشاركه معه، عبر عرض نظيف مخصص للعميل." },
      { question: "أين تُحفظ بياناتنا؟", answer: "داخل المنطقة، مشفّرة أثناء التخزين والنقل." },
    ],
  },
  contact: {
    eyebrow: "تواصل",
    title: "حدّثنا عن مشروعك",
    lead: "بضعة أسطر تكفي. نرد خلال يوم عمل.",
    form: {
      label: "نموذج التواصل",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      submit: "أرسل",
      required: "(مطلوب)",
      requiredMsg: "هذا الحقل مطلوب.",
      emailMsg: "اكتب بريداً صحيحاً، مثل name@example.com.",
      success: "شكراً — هذه معاينة، لذلك لم يُرسل شيء.",
      errors: "صحّح الحقول المحدّدة من فضلك.",
      note: "معاينة فقط: هذا النموذج لا يرسل شيئاً.",
    },
  },
  close: {
    title: ["جاهز لإطلاق أهدأ؟", "ابدأ اليوم."],
    lead: "الإعداد في دقائق، ومجاني للفرق الصغيرة.",
    actions: [
      { label: "ابدأ الآن", href: "#top", icon: "arrow-right" },
      { label: "تحدّث معنا", href: "#faq", variant: "secondary" },
    ],
  },
  footer: {
    tagline: "رواق منتج افتراضي لمعاينة أنماط Landing Kit.",
    groups: [
      {
        title: "المنتج",
        links: [
          { label: "المزايا", href: "#features" },
          { label: "الأسعار", href: "#pricing" },
        ],
      },
      {
        title: "الشركة",
        links: [
          { label: "من نحن", href: "#top" },
          { label: "تواصل", href: "#faq" },
        ],
      },
    ],
    legal: "© 2026 رواق (منتج افتراضي).",
  },
};

export const previewContent = { ar, en };
