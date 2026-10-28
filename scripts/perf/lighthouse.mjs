// Lab performance measurement with Lighthouse. Runs each URL several times per form factor and
// reports the median, because single Lighthouse runs vary by 10–20%.
//
//   node scripts/perf/lighthouse.mjs --out docs/reports/perf/opera-baseline.json http://localhost:3100/
//
// These are lab numbers from one machine. They are useful for comparing builds against each
// other; they are not field data (CrUX) and do not include INP, which needs real interactions.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const CHROME = process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? args.splice(outIdx, 2)[1] : null;
const runsIdx = args.indexOf("--runs");
const runs = runsIdx >= 0 ? Number(args.splice(runsIdx, 2)[1]) : 3;
const urls = args;
if (urls.length === 0) {
  console.error("usage: lighthouse.mjs [--out file.json] [--runs 3] <url...>");
  process.exit(1);
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const pick = (lhr) => ({
  score: Math.round(lhr.categories.performance.score * 100),
  a11y: Math.round(lhr.categories.accessibility.score * 100),
  bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
  seo: Math.round(lhr.categories.seo.score * 100),
  fcp: lhr.audits["first-contentful-paint"].numericValue,
  lcp: lhr.audits["largest-contentful-paint"].numericValue,
  cls: lhr.audits["cumulative-layout-shift"].numericValue,
  tbt: lhr.audits["total-blocking-time"].numericValue,
  si: lhr.audits["speed-index"].numericValue,
  bytes: lhr.audits["total-byte-weight"].numericValue,
  jsBytes: lhr.audits["resource-summary"]?.details?.items?.find((i) => i.resourceType === "script")?.transferSize ?? 0,
  requests: lhr.audits["network-requests"]?.details?.items?.length ?? 0,
  lcpElement: lhr.audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? null,
});

const chrome = await chromeLauncher.launch({
  chromePath: CHROME,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const results = [];
try {
  for (const url of urls) {
    for (const formFactor of ["mobile", "desktop"]) {
      const samples = [];
      for (let i = 0; i < runs; i++) {
        const config = formFactor === "desktop" ? desktopConfig : undefined;
        const res = await lighthouse(
          url,
          { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] },
          config,
        );
        samples.push(pick(res.lhr));
      }
      const keys = ["score", "a11y", "bestPractices", "seo", "fcp", "lcp", "cls", "tbt", "si", "bytes", "jsBytes", "requests"];
      const med = Object.fromEntries(keys.map((k) => [k, median(samples.map((s) => s[k]))]));
      const row = { url, formFactor, runs, ...med, lcpElement: samples[0].lcpElement };
      results.push(row);
      console.log(
        `${formFactor.padEnd(7)} ${url}  perf ${row.score}  a11y ${row.a11y}  seo ${row.seo}  LCP ${Math.round(row.lcp)}ms  CLS ${row.cls.toFixed(3)}  TBT ${Math.round(row.tbt)}ms  JS ${Math.round(row.jsBytes / 1024)}KB  total ${Math.round(row.bytes / 1024)}KB`,
      );
    }
  }
} finally {
  await chrome.kill();
}

if (out) {
  await mkdir(dirname(out), { recursive: true });
  await writeFile(
    out,
    JSON.stringify({ measuredAt: new Date().toISOString(), tool: "lighthouse@13.6.0 (lab, simulated throttling)", results }, null, 2) + "\n",
  );
  console.log(`wrote ${out}`);
}
