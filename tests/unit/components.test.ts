import { describe, expect, it } from "vitest";
import { COMPONENT_ATTRS, componentAttrs } from "@landing/kit/brand";

describe("component styles", () => {
  it("maps each configured style to its <html> attribute", () => {
    expect(componentAttrs({ components: { button: "outline", divider: "wave", pattern: "dots", patternScope: "page" } })).toEqual({
      "data-lk-btn": "outline",
      "data-lk-divider": "wave",
      "data-lk-pattern": "dots",
      "data-lk-pattern-scope": "page",
    });
  });
  it("sets nothing for a brand without component styles (existing sites keep their look)", () => {
    expect(componentAttrs({})).toEqual({});
    expect(componentAttrs({ components: {} })).toEqual({});
  });
  it("lists every attribute it can set", () => {
    const all = componentAttrs({
      components: {
        button: "soft",
        hover: "lift",
        headingAlign: "center",
        eyebrow: "pill",
        titleMark: "bar",
        divider: "curve",
        pattern: "grid",
        patternScope: "hero",
        image: "framed",
        icon: "ring",
        input: "filled",
      },
    });
    expect(Object.keys(all).sort()).toEqual([...COMPONENT_ATTRS].sort());
  });
});
