/**
 * Brand → CSS. The output is one string of custom properties inside `@layer tokens`, injected by
 * BaseLayout. Components never see brand values directly; they read the semantic variables
 * declared here.
 */
import { parseHex, resolveTone } from "./contrast";
import { fluid, spaceScale, typeScale } from "./fluid";
import type { BrandConfig, LocaleTypeOverride, TextStyle, Tone, TypeConfig } from "./types";

/** Scripts without letter case, where tracking and uppercasing harm legibility. */
export const CASELESS_LOCALES = [
  "ar",
  "fa",
  "ur",
  "ps",
  "ckb",
  "sd",
  "ug",
  "dv",
  "he",
  "yi",
  "ja",
  "zh",
  "ko",
  "th",
  "lo",
  "km",
  "my",
  "hi",
  "bn",
  "ta",
  "te",
  "ml",
  "kn",
  "gu",
  "pa",
  "mr",
  "ne",
  "si",
  "am",
  "ka",
  "hy",
] as const;

type Decls = Record<string, string | number | undefined>;

/** Matches by primary language subtag, so `ar-SA` and `zh-Hans` count too. */
export const isCaseless = (code: string) => (CASELESS_LOCALES as readonly string[]).includes(code.split("-")[0]!.toLowerCase());

const block = (selector: string, decls: Decls) => {
  const body = Object.entries(decls)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return body ? `${selector} {\n${body}\n}` : "";
};

const px = (n: number) => `${n / 16}rem`;

function toneDecls(tone: Tone): Decls {
  const t = resolveTone(tone);
  return {
    "color-scheme": t.scheme,
    "--tone-bg": t.bg,
    "--tone-bg-image": t.bgImage ?? "none",
    "--tone-fg": t.fg,
    "--tone-fg-muted": t.fgMuted,
    "--tone-heading": t.heading,
    "--tone-line": t.line,
    "--tone-accent": t.accent,
    "--tone-on-accent": t.onAccent,
    "--tone-accent-hover": t.accentHover,
    "--tone-accent-text": t.accentText,
    "--tone-ring": t.ring,
    "--tone-surface": t.surface,
    "--tone-surface-fg": t.surfaceFg,
    "--tone-surface-fg-muted": t.surfaceFgMuted,
    "--tone-surface-line": t.surfaceLine,
    "--tone-highlight": t.highlight ?? t.accent,
    "--tone-on-highlight": t.onHighlight ?? t.onAccent,
  };
}

function textDecls(prefix: string, s: Partial<TextStyle>): Decls {
  return {
    [`--weight-${prefix}`]: s.weight,
    [`--leading-${prefix}`]: s.leading,
    [`--tracking-${prefix}`]: s.tracking,
    [`--transform-${prefix}`]: s.transform,
  };
}

const familyVar = (f: "body" | "display" | "mono" | undefined, fallback: string) => (f ? `var(--font-${f})` : fallback);

function typeDecls(type: TypeConfig): Decls {
  const label = type.label;
  return {
    "--font-display": type.families.display,
    "--font-body": type.families.body,
    "--font-mono": type.families.mono ?? "ui-monospace, SFMono-Regular, Menlo, monospace",
    ...typeScale(type.scale),
    "--step-display": `var(--step-${type.displayStep ?? 6})`,
    ...textDecls("display", { tracking: "0", transform: "none", ...type.display }),
    ...textDecls("heading", { tracking: "0", transform: "none", ...type.heading }),
    ...textDecls("body", { tracking: "0", ...type.body }),
    ...textDecls("label", { tracking: "0", transform: "none", ...label }),
    "--font-label": familyVar(label.family, "var(--font-body)"),
    "--step-label": `var(--step-${label.step ?? -1})`,
  };
}

function localeTypeDecls(code: string, o: LocaleTypeOverride, base: TypeConfig): Decls {
  const caseless = isCaseless(code);
  const decls: Decls = {
    "--font-display": o.families?.display,
    "--font-body": o.families?.body,
    "--font-mono": o.families?.mono,
    ...(o.scale ? typeScale({ ...base.scale, ...o.scale }) : {}),
    ...textDecls("display", o.display ?? {}),
    ...textDecls("heading", o.heading ?? {}),
    ...textDecls("body", o.body ?? {}),
    ...textDecls("label", o.label ?? {}),
    "--font-label": o.label?.family ? `var(--font-${o.label.family})` : undefined,
    "--step-label": o.label?.step !== undefined ? `var(--step-${o.label.step})` : undefined,
  };
  if (caseless) {
    for (const p of ["display", "heading", "body", "label"]) decls[`--tracking-${p}`] = "0";
    for (const p of ["display", "heading", "label"]) decls[`--transform-${p}`] = "none";
  }
  return decls;
}

function shadowDecls(brand: BrandConfig): Decls {
  const { style, offset = 4 } = brand.elevation;
  if (style === "hard") {
    return {
      "--shadow-card": `${offset}px ${offset}px 0 0 var(--tone-fg)`,
      "--shadow-raised": `${offset + 2}px ${offset + 2}px 0 0 var(--tone-fg)`,
      "--shadow-press": `${Math.max(1, offset - 2)}px ${Math.max(1, offset - 2)}px 0 0 var(--tone-fg)`,
      "--card-border-width": `${Math.max(brand.shape.border, 2)}px`,
    };
  }
  if (style === "soft") {
    const c = brand.elevation.tint ? parseHex(brand.elevation.tint).join(" ") : "0 0 0";
    return {
      "--shadow-card": `0 1px 2px rgb(${c} / 0.04), 0 8px 24px -12px rgb(${c} / 0.14)`,
      "--shadow-raised": `0 2px 4px rgb(${c} / 0.05), 0 18px 40px -16px rgb(${c} / 0.22)`,
      "--shadow-press": `0 1px 2px rgb(${c} / 0.08)`,
      "--card-border-width": `${brand.shape.border}px`,
    };
  }
  return { "--shadow-card": "none", "--shadow-raised": "none", "--shadow-press": "none", "--card-border-width": `${brand.shape.border}px` };
}

export interface CompileOptions {
  /** Locale codes the site uses; only these get `:lang()` blocks. Defaults to all overrides. */
  locales?: string[];
}

export function compileBrand(brand: BrandConfig, opts: CompileOptions = {}): string {
  // fail the build on malformed colours instead of emitting broken CSS
  for (const [name, tone] of Object.entries(brand.color.tones)) {
    for (const [role, value] of Object.entries(tone)) {
      if (role !== "scheme" && role !== "bgImage") {
        try {
          parseHex(value as string);
        } catch {
          throw new Error(`Brand "${brand.name}", tone "${name}": ${role} must be a hex colour, got "${value}"`);
        }
      }
    }
  }
  const { type, shape, motion, layout, control, space } = brand;
  const root: Decls = {
    ...typeDecls(type),
    ...spaceScale(type.scale, space.density),
    "--radius-control": px(shape.control),
    "--radius-card": px(shape.card),
    "--radius-media": px(shape.media),
    "--radius-badge": px(shape.badge),
    "--border-width": `${shape.border}px`,
    ...shadowDecls(brand),
    "--motion-fast": `${motion.duration.fast}ms`,
    "--motion-base": `${motion.duration.base}ms`,
    "--motion-slow": `${motion.duration.slow}ms`,
    "--motion-ease": motion.ease,
    "--reveal-distance": motion.reveal === "rise" ? `${motion.distance ?? 16}px` : "0px",
    "--reveal-from-opacity": motion.reveal === "none" ? 1 : 0,
    "--container": px(layout.container),
    "--gutter": fluid(layout.gutter.min, layout.gutter.max),
    "--header-height": px(layout.header),
    "--control-height": px(control.height),
    "--control-weight": control.weight,
    "--control-transform": control.transform ?? "none",
    "--control-tracking": control.tracking ?? "0",
    "--font-control": familyVar(control.family, "var(--font-body)"),
  };

  const parts = [block(":root", root)];

  const { base, ...rest } = brand.color.tones;
  parts.push(block(':root,\n[data-tone="base"]', toneDecls(base)));
  for (const [name, tone] of Object.entries(rest)) {
    parts.push(block(`[data-tone="${name}"]`, toneDecls(tone)));
  }

  const overrides = type.locales ?? {};
  const codes = new Set([...(opts.locales ?? Object.keys(overrides))]);
  for (const code of codes) {
    const caseless = isCaseless(code);
    const o = overrides[code];
    if (!o && !caseless) continue;
    const decls = localeTypeDecls(code, o ?? {}, type);
    // controls also drop uppercase and tracking in caseless scripts
    if (caseless) Object.assign(decls, { "--control-transform": "none", "--control-tracking": "0" });
    parts.push(block(`:root:lang(${code})`, decls));
  }

  return `@layer tokens {\n${parts.filter(Boolean).join("\n\n")}\n}\n`;
}
