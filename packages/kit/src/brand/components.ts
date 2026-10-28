import type { BrandConfig, ComponentsConfig } from "./types";

const ATTR: Record<keyof ComponentsConfig, string> = {
  button: "data-lk-btn",
  hover: "data-lk-hover",
  headingAlign: "data-lk-heading",
  eyebrow: "data-lk-eyebrow",
  titleMark: "data-lk-mark",
  divider: "data-lk-divider",
  pattern: "data-lk-pattern",
  patternScope: "data-lk-pattern-scope",
  image: "data-lk-image",
  icon: "data-lk-icon",
  input: "data-lk-input",
};

/** The `<html>` attributes that switch on a brand's component styles (see styles/variants.css). */
export function componentAttrs(brand: Pick<BrandConfig, "components">): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(brand.components ?? {})) if (v) out[ATTR[k as keyof ComponentsConfig]] = v;
  return out;
}

/** Every attribute name `componentAttrs` can set, so a live preview can clear the old ones. */
export const COMPONENT_ATTRS = Object.values(ATTR);
