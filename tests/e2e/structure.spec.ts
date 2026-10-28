/** Document structure, SEO and i18n correctness, responsive overflow, and runtime errors. */
import { expect, test } from "@playwright/test";
import { PAGES, SITES, url } from "./sites";

for (const { site, locale, id } of PAGES) {
  test.describe(id, () => {
    test("lang, dir, canonical and hreflang alternates", async ({ page }) => {
      await page.goto(url(site, locale.path));
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", new RegExp(`^${locale.lang}`));
      await expect(html).toHaveAttribute("dir", locale.dir);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, "self-referencing canonical").toMatch(new RegExp(`${locale.path.replace(/\//g, "\\/")}$`));

      const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) => els.map((e) => e.getAttribute("hreflang")));
      expect(alternates).toContain("x-default");
      expect(alternates.length).toBe(site.locales.length + 1);
    });

    test("one h1, every image has an alt attribute, every section is named", async ({ page }) => {
      await page.goto(url(site, locale.path));
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.locator("img:not([alt])").count()).toBe(0);
      const unnamed = await page
        .locator("main section")
        .evaluateAll((els) => els.filter((s) => !s.getAttribute("aria-labelledby") && !s.getAttribute("aria-label")).map((s) => s.id || s.className));
      expect(unnamed).toEqual([]);
      // every aria-labelledby target exists
      const dangling = await page.locator("[aria-labelledby]").evaluateAll((els) =>
        els.flatMap((e) =>
          e
            .getAttribute("aria-labelledby")!
            .split(" ")
            .filter((ref) => !document.getElementById(ref)),
        ),
      );
      expect(dangling).toEqual([]);
    });

    test("ids are unique", async ({ page }) => {
      await page.goto(url(site, locale.path));
      const dupes = await page.evaluate(() => {
        const seen = new Map<string, number>();
        document.querySelectorAll("[id]").forEach((el) => seen.set(el.id, (seen.get(el.id) ?? 0) + 1));
        return [...seen].filter(([, n]) => n > 1).map(([k]) => k);
      });
      expect(dupes).toEqual([]);
    });

    for (const width of [320, 390, 768, 1024, 1440]) {
      test(`no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url(site, locale.path), { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test("no console errors or failed requests", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("requestfailed", (r) => errors.push(`failed: ${r.url()}`));
      page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()}: ${r.url()}`));
      await page.goto(url(site, locale.path), { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    test("in-page links point at existing targets", async ({ page }) => {
      await page.goto(url(site, locale.path));
      const missing = await page
        .locator('a[href^="#"]')
        .evaluateAll((els) => els.map((a) => a.getAttribute("href")!.slice(1)).filter((id) => id && !document.getElementById(decodeURIComponent(id))));
      expect(missing).toEqual([]);
    });
  });
}

for (const site of SITES) {
  test(`${site.name}: language switch links to the same page in the other locale`, async ({ page }) => {
    const [a, b] = site.locales;
    await page.goto(url(site, a.path));
    const link = page.locator(`header a[hreflang^="${b.lang}"]`).first();
    await expect(link).toHaveAttribute("href", b.path);
    await expect(link).toHaveAttribute("lang", new RegExp(`^${b.lang}`));
  });
}
