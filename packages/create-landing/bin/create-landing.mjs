#!/usr/bin/env node
/**
 * Scaffolds a new landing page site from templates/starter into sites/<name>.
 *
 *   pnpm new-site acme --title "Acme" --url https://acme.example --locales en,ar --default en
 *
 * Options
 *   --title     Display name (default: the name, capitalised)
 *   --url       Absolute origin, no trailing slash (default: https://<name>.example)
 *   --locales   Comma-separated locale codes from the template: en, ar (default: en,ar)
 *   --default   Default locale served at "/" (default: first of --locales)
 *   --port      Dev/preview port (default: next free one after the existing sites)
 *   --dry-run   Print what would be written
 */
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const TEMPLATE = join(ROOT, "templates/starter");
const KNOWN_LOCALES = {
  en: { label: "English", dir: "ltr", ogLocale: "en_US" },
  ar: { label: "العربية", dir: "rtl", ogLocale: "ar_SA" },
};

export function parse(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      title: { type: "string" },
      url: { type: "string" },
      locales: { type: "string", default: "en,ar" },
      default: { type: "string" },
      port: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  const name = positionals[0];
  if (values.help || !name) return { help: true };
  if (!/^[a-z][a-z0-9-]{1,39}$/.test(name)) throw new Error(`Site name must be lowercase letters, digits and dashes (got "${name}")`);
  const locales = values.locales.split(",").map((l) => l.trim()).filter(Boolean);
  const unknown = locales.filter((l) => !(l in KNOWN_LOCALES));
  if (unknown.length) throw new Error(`Unsupported locale(s) ${unknown.join(", ")}. The starter ships content for: ${Object.keys(KNOWN_LOCALES).join(", ")}`);
  if (locales.length === 0) throw new Error("At least one locale is required");
  const def = values.default ?? locales[0];
  if (!locales.includes(def)) throw new Error(`--default ${def} is not one of --locales ${locales.join(",")}`);
  const url = values.url ?? `https://${name}.example`;
  if (!/^https?:\/\/[^/]+$/.test(url)) throw new Error(`--url must be an absolute origin without a trailing slash (got "${url}")`);
  const title = values.title ?? name.replace(/(^|-)([a-z])/g, (_, s, c) => (s ? " " : "") + c.toUpperCase());
  return { name, title, url, locales, defaultLocale: def, port: values.port ? Number(values.port) : undefined, dryRun: values["dry-run"] };
}

async function nextPort() {
  const sites = await readdir(join(ROOT, "sites")).catch(() => []);
  let max = 4323;
  for (const s of sites) {
    const pkg = await readFile(join(ROOT, "sites", s, "package.json"), "utf8").catch(() => "");
    const m = /--port (\d+)/.exec(pkg);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

/** Placeholder replacements for the template files. */
export function render(opts) {
  const obj = (o) => `{ ${Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")} }`;
  const localeLines = opts.locales.map((l) => `    ${l}: ${obj(KNOWN_LOCALES[l])},`).join("\n");
  return {
    __NAME__: opts.name,
    __TITLE__: opts.title,
    __URL__: opts.url,
    __PORT__: String(opts.port),
    __DEFAULT__: opts.defaultLocale,
    __LOCALES__: localeLines,
    __IMPORTS__: opts.locales.map((l) => `import { ${l} } from "./${l}";`).join("\n"),
    __KEYS__: opts.locales.join(", "),
  };
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function main() {
  const opts = parse(process.argv.slice(2));
  if (opts.help) {
    console.log(await readFile(fileURLToPath(import.meta.url), "utf8").then((s) => s.split("*/")[0].replace(/^#!.*\n\/\*\*\n/, "").replace(/^ \* ?/gm, "")));
    return;
  }
  opts.port ??= await nextPort();
  const target = join(ROOT, "sites", opts.name);
  if (await stat(target).catch(() => null)) throw new Error(`${relative(ROOT, target)} already exists`);

  const vars = render(opts);
  const files = await walk(TEMPLATE);
  const skipped = Object.keys(KNOWN_LOCALES).filter((l) => !opts.locales.includes(l)).map((l) => join(TEMPLATE, "src/content", `${l}.ts`));

  if (opts.dryRun) {
    console.log(`Would create ${relative(ROOT, target)} (port ${opts.port}, locales ${opts.locales.join(",")}, default ${opts.defaultLocale}):`);
    files.filter((f) => !skipped.includes(f)).forEach((f) => console.log("  " + relative(TEMPLATE, f)));
    return;
  }

  await mkdir(target, { recursive: true });
  await cp(TEMPLATE, target, { recursive: true });
  for (const f of skipped) await rm(join(target, relative(TEMPLATE, f)));
  for (const f of await walk(target)) {
    if (!/\.(ts|mjs|json|astro|css|svg|md)$/.test(f)) continue;
    let text = await readFile(f, "utf8");
    const before = text;
    for (const [k, v] of Object.entries(vars)) text = text.split(k).join(v);
    if (text !== before) await writeFile(f, text);
  }

  console.log(`\nCreated ${relative(ROOT, target)}\n`);
  console.log("Next steps:");
  console.log("  pnpm install");
  console.log(`  pnpm --dir sites/${opts.name} dev        # http://localhost:${opts.port}/`);
  console.log(`  edit sites/${opts.name}/src/brand.ts     # make it look like the product`);
  console.log(`  edit sites/${opts.name}/src/content/*.ts # write the copy`);
  console.log(`  pnpm test && pnpm --dir sites/${opts.name} check && pnpm --dir sites/${opts.name} build`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`create-landing: ${e.message}`);
    process.exit(1);
  });
}
