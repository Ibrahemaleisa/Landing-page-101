// Full-page screenshots of a running site at phone and desktop widths, for visual review.
//   node scripts/screenshot.mjs http://localhost:4323/ docs/reports/screenshots/kitebase-en
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const [url, prefix, ...flags] = process.argv.slice(2);
if (!url || !prefix) {
  console.error("usage: screenshot.mjs <url> <out-prefix> [--viewport-only]");
  process.exit(1);
}
const fullPage = !flags.includes("--viewport-only");
await mkdir(prefix.split("/").slice(0, -1).join("/") || ".", { recursive: true });

const browser = await chromium.launch();
for (const [name, viewport] of [
  ["390", { width: 390, height: 844 }],
  ["1440", { width: 1440, height: 900 }],
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${prefix}-${name}.png`, fullPage });
  await page.close();
}
await browser.close();
console.log(`saved ${prefix}-{390,1440}.png`);
