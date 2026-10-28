/**
 * Automated WCAG 2.2 A/AA scan with axe-core on every site, locale and two viewports.
 * axe finds roughly a third of WCAG issues; the keyboard and layout specs cover more, and
 * manual review covers the rest (see docs/reports/accessibility.md).
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES, url } from "./sites";

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const { site, locale, id } of PAGES) {
  for (const vp of VIEWPORTS) {
    test(`axe: ${id} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(url(site, locale.path), { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.impact} ${v.id} ×${v.nodes.length}: ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(" "))
            .join(" | ")}`,
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }
}
