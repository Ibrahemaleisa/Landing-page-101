/**
 * Every reference brand must pass the WCAG contrast gate for every tone. This is the test that
 * stops a brand from shipping light-grey text (Opera audit D6).
 */
import { describe, expect, it } from "vitest";
import { checkBrandContrast, type BrandConfig } from "@landing/kit/brand";
import { brand as kitebase } from "../../sites/kitebase/src/brand";
import { brand as opera } from "../../sites/opera/src/brand";
import { brand as qitah } from "../../sites/qitah/src/brand";

const brands: Record<string, BrandConfig> = { kitebase, opera, qitah };

describe.each(Object.entries(brands))("%s brand", (name, brand) => {
  const checks = checkBrandContrast(brand);
  it("has a base tone", () => {
    expect(brand.color.tones.base).toBeDefined();
  });
  it.each(checks.filter((c) => c.level === "required").map((c) => [`${c.tone}: ${c.pair}`, c] as const))("%s meets its minimum", (_, c) => {
    expect(c.ratio, `${name} ${c.tone} ${c.pair}: ${c.fg} on ${c.bg}`).toBeGreaterThanOrEqual(c.min);
  });
});
