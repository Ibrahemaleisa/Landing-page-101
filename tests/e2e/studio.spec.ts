/**
 * The private style studio: choice cards and sliders drive the live preview, presets set every
 * element, and every preset renders accessibly without overflow in both languages.
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

/** Waits for time-based entrance animations (slow motion styles fade the hero in) so axe sees final colours. Scroll-driven reveals never finish, so only document-timeline animations are awaited. */
const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.timeline instanceof DocumentTimeline)
        .map((a) => a.finished),
    ),
  );

const previewFrame = (page: Page) => page.frameLocator("[data-frame]");
/** Clicks the choice card for one option (the radio inside is visually hidden). */
const choose = (page: Page, el: string, value: string) => page.locator(`label:has(> input[name="el-${el}"][value="${value}"])`).click();
const radio = (page: Page, el: string, value: string) => page.locator(`input[name="el-${el}"][value="${value}"]`);

test.describe("studio shell", () => {
  for (const path of ["/", "/en/"]) {
    test(`axe ${path}`, async ({ page }) => {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      // open every element so its cards and sliders are audited too
      await page.locator("details.opt:not([open]) summary").evaluateAll((els) => els.forEach((e) => (e as HTMLElement).click()));
      expect(await axe(page)).toEqual([]);
    });
  }

  test("every element and slider explains itself in plain words", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    for (const id of await page.locator("fieldset.choices, .tune input").evaluateAll((els) => els.map((e) => e.getAttribute("aria-describedby")))) {
      expect(id).toBeTruthy();
      await expect(page.locator(`[id="${id}"]`)).not.toBeEmpty();
    }
    await expect(page.locator('details[data-group="palette"] [data-now-text]')).toHaveText("Light and neutral with a clear blue for actions");
  });

  test("changing the palette restyles the preview live", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    const body = previewFrame(page).locator("body");
    const before = await body.evaluate((b) => getComputedStyle(b).backgroundColor);
    await choose(page, "palette", "midnight");
    await expect.poll(() => body.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(before);
    await expect.poll(() => body.evaluate((b) => getComputedStyle(b).backgroundColor)).toBe("rgb(14, 17, 22)");
    // a single change makes the selection custom
    await expect(page.locator("[data-custom]")).toBeVisible();
    await expect(page.locator('input[name="preset"]:checked')).toHaveCount(0);
    await expect(page.locator('details[data-group="palette"] [data-current]')).toHaveText("Midnight Gold");
    await expect.poll(() => page.url()).toContain("palette=midnight");
  });

  test("typography and template choices reach the preview", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.locator('details[data-group="type"] summary').click();
    await choose(page, "type", "luxury");
    await expect
      .poll(() =>
        previewFrame(page)
          .locator("h1")
          .first()
          .evaluate((h) => getComputedStyle(h).fontFamily),
      )
      .toContain("Playfair");
    await page.locator('details[data-group="hero"] summary').click();
    await choose(page, "hero", "split");
    await expect(previewFrame(page).locator('[data-block="top"][data-variant="split"]')).toBeVisible();
    await expect(previewFrame(page).locator('[data-block="top"][data-variant="centered"]')).toBeHidden();
    await page.locator('details[data-group="page"] summary').click();
    await choose(page, "page", "portfolio");
    await expect(previewFrame(page).locator("#contact")).toBeVisible();
    await expect(previewFrame(page).locator("#pricing")).toHaveCount(0);
    // nav items for blocks the template doesn't have are hidden
    await expect(previewFrame(page).locator('.lk-header__nav a[href="#pricing"]')).toBeHidden();
  });

  test("choosing a preset sets every element", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    const neon = PRESETS.find((p) => p.id === "neon")!;
    await page.locator('label.preset:has(input[value="neon"])').click();
    await expect(page.locator('input[name="preset"][value="neon"]')).toBeChecked();
    for (const [k, v] of Object.entries(neon.selection)) await expect(radio(page, k, v)).toBeChecked();
    await expect(page.locator("[data-custom]")).toBeHidden();
  });

  test("sliders fine-tune the chosen option, and reset brings it back", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.locator('details[data-group="buttons"] summary').click();
    const btn = previewFrame(page).locator('[data-block="top"]:not([hidden]) .lk-btn').first();
    await page.locator("#tw-btnRadius").fill("32");
    await expect(page.locator('[data-tweak="btnRadius"] output')).toHaveText("Pill");
    await expect.poll(() => btn.evaluate((b) => parseFloat(getComputedStyle(b).borderTopLeftRadius))).toBeGreaterThan(20);
    await page.locator("#tw-btnHeight").fill("60");
    await expect.poll(() => btn.evaluate((b) => b.getBoundingClientRect().height)).toBeGreaterThanOrEqual(59);
    await expect.poll(() => page.url()).toContain("btnRadius=32");
    await expect(page.locator("[data-custom]")).toBeVisible();

    const reset = page.locator('[data-tune-reset="buttons"]');
    await reset.click();
    await expect(reset).toBeHidden();
    await expect(page.locator("#tw-btnRadius")).toHaveValue("10");
    await expect.poll(() => btn.evaluate((b) => parseFloat(getComputedStyle(b).borderTopLeftRadius))).toBeLessThan(20);
    await expect(page.locator('input[name="preset"][value="studio"]')).toBeChecked();
  });

  test("a new option drops that element's fine-tuning", async ({ page }) => {
    await page.goto(BASE + "/en/?buttons=soft&btnHeight=58", { waitUntil: "networkidle" });
    await expect(page.locator("#tw-btnHeight")).toHaveValue("58");
    await page.locator('details[data-group="buttons"] summary').click();
    await choose(page, "buttons", "bold");
    await expect(page.locator("#tw-btnHeight")).toHaveValue("56");
    await expect.poll(() => page.url()).not.toContain("btnHeight");
  });

  test("the colour picker repaints the accent and keeps it readable", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.locator("#tw-accent").evaluate((el: HTMLInputElement) => {
      el.value = "#ffcc00";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const root = previewFrame(page).locator("html");
    await expect.poll(() => root.evaluate((h) => getComputedStyle(h).getPropertyValue("--tone-accent").trim())).toBe("#ffcc00");
    // yellow is too light for text on paper: the link colour is darkened
    await expect.poll(() => root.evaluate((h) => getComputedStyle(h).getPropertyValue("--tone-accent-text").trim())).not.toBe("#ffcc00");
    await expect(page.locator("[data-contrast]")).toHaveAttribute("data-state", "ok");
  });

  test("motion sliders are disabled while motion is off", async ({ page }) => {
    await page.goto(BASE + "/en/?motion=none", { waitUntil: "networkidle" });
    await expect(page.locator("#tw-speed")).toBeDisabled();
    await expect(page.locator('[data-tweak="speed"] [data-note]')).not.toBeEmpty();
    await page.locator('details[data-group="motion"] summary').click();
    await choose(page, "motion", "bouncy");
    await expect(page.locator("#tw-speed")).toBeEnabled();
  });

  test("device sizes and preview language", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.locator('label[for="d-mobile"]').click();
    await expect.poll(() => page.locator("[data-frame]").evaluate((f) => f.getBoundingClientRect().width)).toBeLessThanOrEqual(391);
    await page.locator('label[for="pl-ar"]').click();
    await expect(previewFrame(page).locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("export produces a brand.ts with the fine-tuning", async ({ page }) => {
    await page.goto(BASE + "/en/?border=3", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Export style" }).click();
    await expect(page.locator("#export")).toBeVisible();
    await expect(page.locator("[data-export]")).toContainText("defineBrand(");
    await expect(page.locator("[data-export]")).toContainText("Fine-tuning: border=3");
    await page.keyboard.press("Escape");
    await expect(page.locator("#export")).toBeHidden();
  });

  test("selection survives a reload", async ({ page }) => {
    await page.goto(BASE + "/en/" + q({ palette: "forest", buttons: "pill", cardRadius: "24" }), { waitUntil: "networkidle" });
    await expect(radio(page, "palette", "forest")).toBeChecked();
    await expect(radio(page, "buttons", "pill")).toBeChecked();
    await expect(page.locator("#tw-cardRadius")).toHaveValue("24");
  });

  test("no horizontal overflow on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.locator("details.opt:not([open]) summary").evaluateAll((els) => els.forEach((e) => (e as HTMLElement).click()));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
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
        await settle(page);
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
