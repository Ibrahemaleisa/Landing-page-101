import { describe, expect, it } from "vitest";
// @ts-expect-error untyped ESM script
import { parse, render } from "../bin/create-landing.mjs";

describe("create-landing argument parsing", () => {
  it("applies defaults", () => {
    expect(parse(["acme-cloud"])).toMatchObject({
      name: "acme-cloud",
      title: "Acme Cloud",
      url: "https://acme-cloud.example",
      locales: ["en", "ar"],
      defaultLocale: "en",
    });
  });
  it("accepts an Arabic-first configuration", () => {
    expect(parse(["souq", "--locales", "ar,en", "--default", "ar", "--url", "https://souq.sa"])).toMatchObject({
      locales: ["ar", "en"],
      defaultLocale: "ar",
      url: "https://souq.sa",
    });
  });
  it("rejects bad input with a helpful message", () => {
    expect(() => parse(["Bad Name"])).toThrow(/lowercase/);
    expect(() => parse(["ok", "--locales", "fr"])).toThrow(/Unsupported locale/);
    expect(() => parse(["ok", "--locales", "en", "--default", "ar"])).toThrow(/not one of/);
    expect(() => parse(["ok", "--url", "https://x.example/"])).toThrow(/trailing slash/);
  });
  it("shows help without a name", () => {
    expect(parse([])).toEqual({ help: true });
  });
});

describe("template rendering", () => {
  it("generates locale config and content wiring", () => {
    const vars = render({ name: "souq", title: "Souq", url: "https://souq.sa", port: 4400, locales: ["ar"], defaultLocale: "ar" });
    expect(vars.__LOCALES__).toContain('ar: { label: "العربية", dir: "rtl", ogLocale: "ar_SA" },');
    expect(vars.__IMPORTS__).toBe('import { ar } from "./ar";');
    expect(vars.__KEYS__).toBe("ar");
    expect(vars.__PORT__).toBe("4400");
  });
});
