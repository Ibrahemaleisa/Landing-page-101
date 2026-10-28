import { describe, expect, it } from "vitest";
import { checkBrandContrast } from "@landing/kit/brand";
import { brand } from "../src/brand";

describe(`${brand.name} brand`, () => {
  it.each(
    checkBrandContrast(brand)
      .filter((c) => c.level === "required")
      .map((c) => [`${c.tone}: ${c.pair}`, c] as const),
  )("%s meets WCAG contrast", (_, c) => {
    expect(c.ratio, `${c.fg} on ${c.bg}`).toBeGreaterThanOrEqual(c.min);
  });
});
