/**
 * Keyboard and assistive-technology behaviour of the interactive kit components, exercised on
 * the real reference pages in both reading directions.
 */
import { expect, test } from "@playwright/test";
import { PAGES, SITES, url } from "./sites";

/** Site-specific tests register only when that site is part of the run (E2E_SITES). */
const onlyFor = (name: string) => (SITES.some((s) => s.name === name) ? test : test.skip);

for (const { site, locale, id } of PAGES) {
  test(`${id}: first Tab reaches the skip link, which moves focus to main`, async ({ page }) => {
    await page.goto(url(site, locale.path));
    await page.keyboard.press("Tab");
    const skip = page.locator(".lk-skip");
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test(`${id}: mobile menu is modal — focus stays inside, Escape closes and returns focus`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url(site, locale.path));
    const opener = page.locator("[data-lk-menu-open]");
    await opener.click();
    const dialog = page.locator("#lk-mnav");
    await expect(dialog).toBeVisible();
    await expect(opener).toHaveAttribute("aria-expanded", "true");
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest("#lk-mnav") || document.activeElement === document.body);
      expect(inside, `focus escaped the menu after ${i + 1} Tab presses`).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(opener).toHaveAttribute("aria-expanded", "false");
  });

  test(`${id}: menu links close the menu and navigate`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url(site, locale.path));
    await page.locator("[data-lk-menu-open]").click();
    const link = page.locator("#lk-mnav [data-lk-menu-link]").first();
    const href = await link.getAttribute("href");
    await link.click();
    await expect(page.locator("#lk-mnav")).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    // focus moves to the chosen section, so the next Tab continues from there (WCAG 2.4.3)
    await expect(page.locator(href!)).toBeFocused();
  });

  test(`${id}: accordions open and close from the keyboard`, async ({ page }) => {
    await page.goto(url(site, locale.path));
    const summaries = page.locator(".lk-accordion__summary");
    test.skip((await summaries.count()) === 0, "no accordion on this page");
    const first = summaries.first();
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first.locator("..")).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(first.locator("..")).not.toHaveAttribute("open", "");
  });

  test(`${id}: tabs follow the WAI-ARIA pattern in the reading direction`, async ({ page }) => {
    await page.goto(url(site, locale.path));
    const lists = page.locator('[role="tablist"]');
    test.skip((await lists.count()) === 0, "no tabs on this page");
    const tabs = lists.first().locator('[role="tab"]');
    await tabs.first().focus();
    const forward = locale.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    await page.keyboard.press(forward);
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.first()).toHaveAttribute("tabindex", "-1");
    const panel = page.locator(`#${await tabs.nth(1).getAttribute("aria-controls")}`);
    await expect(panel).toBeVisible();
    await page.keyboard.press("End");
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
  });
}

for (const site of SITES) {
  test(`${site.name}: reduced motion leaves no running animations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(url(site, site.locales[0].path), { waitUntil: "networkidle" });
    const running = await page.evaluate(
      () =>
        document.getAnimations().filter((a) => {
          const t = a.effect?.getComputedTiming();
          return a.playState === "running" && (t?.duration as number) > 1;
        }).length,
    );
    expect(running).toBe(0);
  });
}

onlyFor("kitebase")("kitebase: zero-JS billing switch shows the selected period only", async ({ page }) => {
  const site = SITES.find((s) => s.name === "kitebase")!;
  await page.goto(url(site, "/"));
  const monthly = page.locator('#pricing [data-show="monthly"]').nth(1);
  const yearly = page.locator('#pricing [data-show="yearly"]').nth(1);
  await expect(monthly).toBeVisible();
  await expect(yearly).toBeHidden();
  await page.locator('#pricing label[for="pricing-y"]').click();
  await expect(yearly).toBeVisible();
  await expect(monthly).toBeHidden();
  // keyboard: the radios are a native group
  await page.locator("#pricing-y").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#pricing-m")).toBeChecked();
});

onlyFor("opera")("opera: brief form validates accessibly and focuses the first invalid field", async ({ page }) => {
  const site = SITES.find((s) => s.name === "opera")!;
  await page.goto(url(site, "/en/"));
  const form = page.locator("#brief form");
  // fields start empty: whitespace in a textarea's default value would defeat `required`
  await expect(form.locator("#f-message")).toHaveValue("");
  await form.getByRole("button", { name: "Send the brief" }).click();
  const name = form.locator("#f-name");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(form.locator("#f-name-error")).toHaveText("This field is required.");
  await expect(form.locator("[data-lk-form-summary]")).toBeVisible();

  await name.fill("Sara");
  await form.locator("#f-email").fill("not-an-email");
  await form.locator("#f-message").fill("A conference for 800 guests in March.");
  await form.getByRole("button", { name: "Send the brief" }).click();
  await expect(form.locator("#f-email")).toBeFocused();
  await expect(form.locator("#f-email-error")).toContainText("valid email");

  await form.locator("#f-email").fill("sara@example.com");
  await form.getByRole("button", { name: "Send the brief" }).click();
  await expect(form.locator("[data-lk-form-success]")).toBeVisible();
  await expect(form.locator("[data-lk-form-summary]")).toBeHidden();
});

onlyFor("opera")("opera: formula — hover previews without changing state; activation selects", async ({ page }) => {
  const site = SITES.find((s) => s.name === "opera")!;
  await page.goto(url(site, "/en/"));
  const items = page.locator(".op-formula__item");
  await items.nth(2).hover();
  await expect(items.nth(2)).toHaveAttribute("aria-pressed", "false");
  await items.nth(2).click();
  await expect(items.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-centre-name]")).toHaveText("One Team, One North Star");
  await items.nth(2).press("Enter");
  await expect(items.nth(2)).toHaveAttribute("aria-pressed", "false");
});
