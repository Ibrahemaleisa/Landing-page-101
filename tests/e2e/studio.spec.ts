/**
 * The private style studio: dropdowns drive the live preview, presets set every element, and
 * every one of the ten presets renders accessibly without overflow in both languages.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { PRESETS } from "../../sites/studio/src/studio/options";

const BASE = "http://localhost:4324";
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const q = (sel: Record<string, string>) => "?" + new URLSearchParams(sel).toString();

async function axe(page: Page) {
  const r = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return r.violations.map(
    (v) =>
      `${v.impact} ${v.id} ×${v.nodes.length}: ${v.nodes
        .slice(0, 3)
        .map((n) => n.target.join(" "))
        .join(" | ")}`,
  );
}

const previewFrame = (page: Page) => page.frameLocator("[data-frame]");

test.describe("studio shell", () => {
  for (const path of ["/", "/en/"]) {
    test(`axe ${path}`, async ({ page }) => {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      expect(await axe(page)).toEqual([]);
    });
  }

  test("changing the palette restyles the preview live", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    const body = previewFrame(page).locator("body");
    const before = await body.evaluate((b) => getComputedStyle(b).backgroundColor);
    await page.selectOption("#s-palette", "midnight");
    await expect.poll(() => body.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(before);
    await expect.poll(() => body.evaluate((b) => getComputedStyle(b).backgroundColor)).toBe("rgb(14, 17, 22)");
    // a single change makes the selection custom
    await expect(page.locator("#s-preset")).toHaveValue("custom");
    expect(page.url()).toContain("palette=midnight");
  });

  test("typography and template choices reach the preview", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.selectOption("#s-type", "luxury");
    await expect
      .poll(() =>
        previewFrame(page)
          .locator("h1")
          .first()
          .evaluate((h) => getComputedStyle(h).fontFamily),
      )
      .toContain("Playfair");
    await page.selectOption("#s-hero", "split");
    await expect(previewFrame(page).locator('[data-block="top"][data-variant="split"]')).toBeVisible();
    await expect(previewFrame(page).locator('[data-block="top"][data-variant="centered"]')).toBeHidden();
    await page.selectOption("#s-page", "portfolio");
    await expect(previewFrame(page).locator("#contact")).toBeVisible();
    await expect(previewFrame(page).locator("#pricing")).toHaveCount(0);
    // nav items for blocks the template doesn't have are hidden
    await expect(previewFrame(page).locator('.lk-header__nav a[href="#pricing"]')).toBeHidden();
  });

  test("choosing a preset sets every element", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    const neon = PRESETS.find((p) => p.id === "neon")!;
    await page.selectOption("#s-preset", "neon");
    for (const [k, v] of Object.entries(neon.selection)) await expect(page.locator(`#s-${k}`)).toHaveValue(v);
  });

  test("device sizes and preview language", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.locator('label[for="d-mobile"]').click();
    await expect.poll(() => page.locator("[data-frame]").evaluate((f) => f.getBoundingClientRect().width)).toBeLessThanOrEqual(391);
    await page.selectOption("#s-plang", "ar");
    await expect(previewFrame(page).locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("export produces a brand.ts", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Export style" }).click();
    await expect(page.locator("#export")).toBeVisible();
    await expect(page.locator("[data-export]")).toContainText("defineBrand(");
    await page.keyboard.press("Escape");
    await expect(page.locator("#export")).toBeHidden();
  });

  test("selection survives a reload", async ({ page }) => {
    await page.goto(BASE + "/en/" + q({ palette: "forest", buttons: "pill" }), { waitUntil: "networkidle" });
    await expect(page.locator("#s-palette")).toHaveValue("forest");
    await expect(page.locator("#s-buttons")).toHaveValue("pill");
  });
});

test.describe("every preset", () => {
  for (const preset of PRESETS) {
    for (const [lang, path] of [
      ["ar", "/preview/"],
      ["en", "/en/preview/"],
    ] as const) {
      test(`${preset.id} ${lang}: axe, no overflow, no errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(BASE + path + q(preset.selection), { waitUntil: "networkidle" });
        expect(await axe(page)).toEqual([]);
        for (const width of [320, 390]) {
          await page.setViewportSize({ width, height: 800 });
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
          expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
        }
        // every visible in-page link resolves
        const dead = await page
          .locator('a[href^="#"]:visible')
          .evaluateAll((els) => els.map((a) => a.getAttribute("href")!.slice(1)).filter((id) => id && !document.getElementById(id)));
        expect(dead).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  }
});
