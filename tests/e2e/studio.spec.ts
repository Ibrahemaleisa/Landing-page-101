/**
 * The private style studio: choice cards and sliders drive the live preview, presets set every
 * element, and every preset renders accessibly without overflow in both languages.
 */
import AxeBuilder from "@axe-core/playwright";
import { crc32, deflateSync } from "node:zlib";
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
    test(`axe ${path}, every tab`, async ({ page }) => {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      // open every element so its cards and sliders are audited too
      await page.locator("details.opt:not([open]) summary").evaluateAll((els) => els.forEach((e) => (e as HTMLElement).click()));
      expect(await axe(page)).toEqual([]);
      for (const tab of await page.getByRole("tab").all()) {
        await tab.click();
        expect(await axe(page)).toEqual([]);
      }
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

test.describe("studio projects and handoff", () => {
  const png = (r: number, g: number, b: number) => {
    // a 2×2 PNG in one colour
    const raw = Buffer.from([0, r, g, b, r, g, b, 0, r, g, b, r, g, b]);
    const chunk = (type: string, data: Buffer) => {
      const len = Buffer.alloc(4);
      len.writeUInt32BE(data.length);
      const crc = Buffer.alloc(4);
      crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])) >>> 0);
      return Buffer.concat([len, Buffer.from(type), data, crc]);
    };
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(2, 0);
    ihdr.writeUInt32BE(2, 4);
    ihdr.set([8, 2, 0, 0, 0], 8);
    return Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw)),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  };

  test("the business name replaces the placeholder name across the page", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Content" }).click();
    await page.fill("#info-nameEn", "Sunbula");
    await expect(previewFrame(page).locator(".rlogo__name").first()).toHaveText("Sunbula");
    await expect(previewFrame(page).locator("body")).not.toContainText("Rawaq");
    await expect(previewFrame(page).locator(".lk-header a[aria-label]").first()).not.toHaveAttribute("aria-label", /Rawaq/);
  });

  test("logo upload, colour from the logo, and image slots", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Content" }).click();
    await page.setInputFiles('[data-upload="logo"]', { name: "logo.png", mimeType: "image/png", buffer: png(200, 30, 90) });
    await expect(previewFrame(page).locator(".rlogo img.studio-img").first()).toBeVisible();
    await page.click("[data-logo-color]");
    await expect(page.locator("[data-status]")).toContainText("#C81E5A");
    await expect
      .poll(() =>
        previewFrame(page)
          .locator("html")
          .evaluate((h) => getComputedStyle(h).getPropertyValue("--tone-accent").trim()),
      )
      .toBe("#c81e5a");

    const slot = page.locator("[data-slots] li").first();
    await slot.locator("input[type=file]").setInputFiles({ name: "hero.png", mimeType: "image/png", buffer: png(30, 140, 200) });
    await expect(previewFrame(page).locator('[data-block="top"]:not([hidden]) img.studio-img')).toHaveCount(1);
    await slot.getByRole("button", { name: /Remove/ }).click();
    await expect(previewFrame(page).locator('[data-block="top"]:not([hidden]) img.studio-img')).toHaveCount(0);

    await page.setInputFiles('[data-upload="logo"]', { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("x") });
    await expect(page.locator("[data-status]")).toHaveText("That file isn't an image.");
  });

  test("text edited on the page is kept, and Escape cancels", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.click("[data-edit]");
    await expect(page.locator("[data-edit]")).toHaveAttribute("aria-pressed", "true");
    const title = previewFrame(page).locator('[data-block="top"]:not([hidden]) .lk-hero__title [data-k]').first();
    await title.click();
    await page.keyboard.type("Fresh bread daily");
    await page.keyboard.press("Enter");
    await expect(title).toHaveText("Fresh bread daily");
    await expect(page.locator("[data-texts-count]")).toContainText("1");

    const lead = previewFrame(page).locator('[data-block="top"]:not([hidden]) .lk-hero__lead').first();
    const before = await lead.innerText();
    await lead.click();
    await page.keyboard.type("discard me");
    await page.keyboard.press("Escape");
    await expect(lead).toHaveText(before);

    // clicking a link in edit mode edits it instead of following it
    const link = previewFrame(page).locator("footer a[data-k]").first();
    await link.click();
    await expect(link).toHaveAttribute("contenteditable", /.+/);
    expect(page.url()).not.toContain("#");
    await page.keyboard.press("Escape");

    await page.reload({ waitUntil: "networkidle" });
    await expect(previewFrame(page).locator('[data-block="top"]:not([hidden]) .lk-hero__title [data-k]').first()).toHaveText("Fresh bread daily");
  });

  test("sections can be reordered, removed, added and re-toned", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Sections" }).click();
    const names = page.locator("[data-sections] .sec__name");
    const first = await names.first().innerText();
    await page.getByRole("button", { name: `Move down: ${first}` }).click();
    await expect(names.nth(1)).toHaveText(first);
    await expect(page.getByRole("button", { name: `Move down: ${first}` })).toBeFocused();

    await page.getByRole("button", { name: `Remove section: ${first}` }).click();
    await expect(previewFrame(page).locator("#logos")).toHaveCount(0);

    await page.selectOption("[data-add-section]", "contact:form");
    await page.click("[data-add]");
    await expect(previewFrame(page).locator("#contact")).toBeVisible();
    // added before the closing call to action
    await expect(names.last()).toHaveText("Closing call to action");

    const row = page.locator("[data-sections] li").filter({ hasText: "Contact form" });
    await row.locator("[data-sec-tone]").selectOption("inverse");
    await expect(previewFrame(page).locator("#contact section").first()).toHaveAttribute("data-tone", "inverse");
    await expect(page.locator('details[data-group="page"] [data-current]')).toContainText("modified");

    await page.click("[data-sections-reset]");
    await expect(previewFrame(page).locator("#contact")).toHaveCount(0);
  });

  test("projects: new, switch, duplicate, delete, and they persist", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Content" }).click();
    await page.fill("#info-title", "Bakery");
    await page.click("[data-project-new]");
    await expect(page.locator("[data-project] option")).toHaveCount(2);
    // numbering reuses the first free number ("Project 1" was renamed to Bakery)
    await expect(page.locator("#info-title")).toHaveValue("Project 1");
    await page.getByRole("tab", { name: "Style" }).click();
    await page.locator('label.choice:has(> input[name="el-palette"][value="forest"])').click();

    await page.selectOption("[data-project]", { label: "Bakery" });
    await expect(page.locator('input[name="el-palette"][value="ink"]')).toBeChecked();
    await page.click("[data-project-dup]");
    await expect(page.locator("[data-project] option")).toHaveCount(3);
    await expect(page.locator("#info-title")).toHaveValue("Bakery (2)");

    page.once("dialog", (d) => d.accept());
    await page.click("[data-project-del]");
    await expect(page.locator("[data-project] option")).toHaveCount(2);

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("[data-project] option")).toHaveCount(2);
  });

  test("handoff: readiness, brief, project file round trip", async ({ page }) => {
    await page.goto(BASE + "/en/", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Content" }).click();
    await page.fill("#info-nameEn", "Sunbula Kitchen");
    await page.fill("#info-nameAr", "مطعم السنبلة");
    await page.fill("#info-about", "Najdi food in Riyadh");
    await page.setInputFiles('[data-upload="logo"]', { name: "logo.png", mimeType: "image/png", buffer: png(200, 30, 90) });

    await page.getByRole("link", { name: "Build: prepare the order" }).click();
    await expect(page.locator("[data-prompt]")).toContainText("pnpm new-site sunbula-kitchen", { timeout: 20_000 });
    // both languages are captured, the Arabic one from a hidden preview
    await expect(page.locator("[data-prompt]")).toContainText("### العربية (ar)");
    await expect(page.locator("[data-prompt]")).toContainText("### الإنجليزية (en)");
    // no contact detail and no page image yet: both flagged, everything else ready
    await expect(page.locator("[data-checks] li[data-ok=false]")).toHaveText(["At least one contact detail: missing", /^Images: 0 of \d+: missing$/]);

    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-download-file]")]);
    expect(dl.suggestedFilename()).toBe("sunbula-kitchen.landing.json");
    const file = await dl.path();
    await page.keyboard.press("Escape");

    await page.setInputFiles("[data-project-import]", file);
    await expect(page.locator("[data-status]")).toContainText("Opened project");
    await expect(page.locator("[data-project] option")).toHaveCount(2);
    await expect(page.locator("#info-nameEn")).toHaveValue("Sunbula Kitchen");
    await expect(previewFrame(page).locator(".rlogo img.studio-img").first()).toBeVisible();

    // the full preview opens the project with its images
    const href = await page.locator("[data-open]").getAttribute("href");
    await page.goto(BASE + href!, { waitUntil: "networkidle" });
    await expect(page.locator(".rlogo img.studio-img").first()).toBeVisible();
    await expect(page.locator(".rlogo__name").first()).toHaveText("Sunbula Kitchen");
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
