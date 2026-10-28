/**
 * The studio panel's behaviour. One active project at a time, autosaved to this device. The preview
 * <iframe> receives the whole design with `studio:apply` and reports edits back (`studio:text`,
 * `studio:media`), the image slots it shows (`studio:slots`), and, on request, a snapshot of every
 * visible text for the build brief (`studio:snapshot`).
 */
import { checkBrandContrast } from "@landing/kit/brand";
import {
  BLOCKS,
  DEFAULT_SELECTION,
  ELEMENTS,
  ELEMENT_INFO,
  PRESETS,
  TWEAKS,
  buildBrand,
  cleanTweaks,
  matchPreset,
  type Block,
  type ElementKey,
  type Selection,
} from "./options";
import { decodeState, encodeSelection, hasSelection } from "./state";
import { langsOf, nameFor, newProject, sectionsOf, sitePayload, slugOf, uid, type Lang, type Project, type ProjectInfo, type SiteOptions } from "./project";
import {
  deleteAsset,
  deleteProject,
  duplicateProject,
  exportProjectFile,
  getAsset,
  importProjectFile,
  listProjects,
  mediaUrls,
  putAsset,
  revokeUrls,
  saveProject,
} from "./store";
import { buildBrief, readiness, type Snapshot } from "./brief";
import { logoColor } from "./logo-color";

type UI = Record<string, string> & {
  blocks: Record<string, { label: string; variants: Record<string, string> }>;
  heroes: Record<string, string>;
  tones: Record<string, string>;
};

const MAX_IMAGE = 10 * 1024 * 1024;
const ACTIVE = "lk-studio-active";
const LEGACY = "lk-studio";

export async function startStudio(root: HTMLElement) {
  const ui = JSON.parse(root.dataset.ui!) as UI;
  const lang: Lang = document.documentElement.lang.startsWith("ar") ? "ar" : "en";
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

  const frame = $<HTMLIFrameElement>("[data-frame]");
  const wrap = $("[data-frame-wrap]");
  const status = $("[data-status]");
  const say = (msg: string) => {
    status.textContent = msg;
  };

  // ------------------------------------------------------------------ project state
  let projects: Project[] = await listProjects();
  let project: Project = await initialProject();
  let urls: Record<string, string> = await mediaUrls(project);
  let slots: string[] = [];
  let editing = false;

  async function initialProject(): Promise<Project> {
    const q = new URLSearchParams(location.search);
    const byId = projects.find((p) => p.id === q.get("project"));
    if (byId) return byId;
    if (hasSelection(location.search)) {
      // a shared link: open it as a new project
      const s = decodeState(location.search);
      return create(newProject(nextTitle(), s.selection, s.tweaks));
    }
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(ACTIVE);
    } catch {
      /* storage unavailable */
    }
    const last = projects.find((p) => p.id === stored) ?? projects[0];
    if (last) return last;
    let legacy: ReturnType<typeof decodeState> | undefined;
    try {
      const raw = localStorage.getItem(LEGACY);
      if (raw) legacy = decodeState(raw);
    } catch {
      /* storage unavailable */
    }
    return create(newProject(nextTitle(), legacy?.selection, legacy?.tweaks));
  }

  async function create(p: Project) {
    await saveProject(p);
    projects = [p, ...projects];
    return p;
  }

  function nextTitle() {
    const used = new Set(projects.map((p) => p.title));
    for (let i = 1; ; i++) if (!used.has(`${ui.untitled} ${i}`)) return `${ui.untitled} ${i}`;
  }

  /** Address bar and "last project" memory follow the active project. */
  function syncUrl() {
    history.replaceState(null, "", `?project=${project.id}&${encodeSelection(project.selection, project.tweaks).slice(1)}`);
    try {
      localStorage.setItem(ACTIVE, project.id);
    } catch {
      /* not remembered */
    }
  }

  // writes are debounced: sliders fire many input events per second
  let saveTimer: number | undefined;
  function saveSoon() {
    project.updatedAt = Date.now();
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      // never resurrect a project deleted while this save was pending
      if (!projects.some((p) => p.id === project.id)) return;
      saveProject(project);
      syncUrl();
    }, 300);
  }

  async function switchTo(p: Project) {
    revokeUrls(urls);
    project = p;
    // immediately: a reload must never land on a project that was just deleted or left
    syncUrl();
    urls = await mediaUrls(p);
    fillContent();
    renderProjects();
    sync();
    saveSoon();
  }

  // ------------------------------------------------------------------ preview messaging
  const previewLang = (): Lang => ($<HTMLInputElement>('input[name="plang"]:checked').value as Lang) ?? lang;
  const previewUrl = (l: Lang) => (l === "ar" ? root.dataset.previewAr : root.dataset.previewEn)!;

  const payload = (l: Lang) => ({
    type: "studio:apply",
    selection: project.selection,
    tweaks: project.tweaks,
    sections: project.sections,
    content: project.content[l],
    name: nameFor(project.info, l),
    media: urls,
    editing,
    site: sitePayload(project),
  });
  const send = () => frame.contentWindow?.postMessage(payload(previewLang()), location.origin);

  const pending = new Map<string, (s: Snapshot) => void>();

  window.addEventListener("message", async (e) => {
    if (e.origin !== location.origin) return;
    const d = e.data ?? {};
    if (d.type === "studio:snapshot") pending.get(d.id)?.(d.snapshot);
    if (e.source !== frame.contentWindow) return;
    if (d.type === "studio:ready") sync();
    else if (d.type === "studio:text") {
      const map = { ...project.content[d.lang as Lang] };
      if (d.value === null) delete map[d.key];
      else map[d.key] = d.value;
      project.content = { ...project.content, [d.lang]: map };
      renderTextCount();
      saveSoon();
    } else if (d.type === "studio:media") await addImage(d.slot, d.file);
    else if (d.type === "studio:slots") {
      slots = d.slots;
      renderSlots();
    }
  });

  function snapshotFrom(win: Window): Promise<Snapshot> {
    return new Promise((resolve, reject) => {
      const id = uid();
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error("preview did not answer"));
      }, 10_000);
      pending.set(id, (s) => {
        clearTimeout(timer);
        pending.delete(id);
        resolve(s);
      });
      win.postMessage({ type: "studio:snapshot", id }, location.origin);
    });
  }

  /** A snapshot in any language: the visible preview, or a hidden one loaded for the purpose. */
  async function snapshot(l: Lang): Promise<Snapshot> {
    if (l === previewLang() && frame.contentWindow) return snapshotFrom(frame.contentWindow);
    const ghost = document.createElement("iframe");
    ghost.className = "studio__ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.tabIndex = -1;
    ghost.title = "";
    const ready = new Promise<void>((resolve) => {
      const on = (e: MessageEvent) => {
        if (e.source === ghost.contentWindow && e.data?.type === "studio:ready") {
          window.removeEventListener("message", on);
          resolve();
        }
      };
      window.addEventListener("message", on);
    });
    ghost.src = previewUrl(l) + encodeSelection(project.selection, project.tweaks);
    document.body.append(ghost);
    try {
      await ready;
      ghost.contentWindow!.postMessage(payload(l), location.origin);
      return await snapshotFrom(ghost.contentWindow!);
    } finally {
      ghost.remove();
    }
  }

  // ------------------------------------------------------------------ style tab
  const groups = $$("details[data-group]");
  const presetRadios = $$<HTMLInputElement>('input[name="preset"]');
  const customNote = $("[data-custom]");
  const contrastEl = $("[data-contrast]");
  const openLink = $<HTMLAnchorElement>("[data-open]");

  function sync() {
    const sel = project.selection;
    const tweaks = project.tweaks;
    const brand = buildBrand(sel, "Studio", tweaks);

    for (const g of groups) {
      const k = g.dataset.group as ElementKey;
      const opt = ELEMENTS[k].find((o) => o.id === sel[k])!;
      g.querySelectorAll<HTMLInputElement>(`input[name="el-${k}"]`).forEach((r) => (r.checked = r.value === sel[k]));
      g.querySelector("[data-current]")!.textContent = opt.label[lang] + (k === "page" && project.sections ? ` (${ui.modified})` : "");
      g.querySelector("[data-now-text]")!.textContent = opt.hint[lang];
      const reset = g.querySelector<HTMLButtonElement>("[data-tune-reset]");
      if (reset) reset.hidden = !TWEAKS.some((tw) => tw.group === k && tw.id in tweaks);
    }

    for (const tw of TWEAKS) {
      const row = $(`[data-tweak="${tw.id}"]`);
      const input = row.querySelector<HTMLInputElement>("input")!;
      const out = row.querySelector<HTMLOutputElement>("[data-out]")!;
      const note = row.querySelector<HTMLElement>("[data-note]")!;
      row.dataset.changed = String(tw.id in tweaks);
      if (tw.kind === "color") {
        const picked = (tweaks.accent as string | undefined) ?? tw.read(sel);
        if (document.activeElement !== input) input.value = picked;
        const used = brand.color.tones.base.accent;
        out.textContent = used.toUpperCase();
        note.textContent = used.toLowerCase() !== picked.toLowerCase() ? input.dataset.adjusted! : "";
      } else {
        const v = (tweaks[tw.id] as number | undefined) ?? tw.read(sel);
        input.value = String(v);
        out.textContent = tw.format(v, sel, lang);
        const on = tw.enabled?.(sel) ?? true;
        input.disabled = !on;
        note.textContent = on ? "" : note.dataset.off!;
      }
    }

    const preset = matchPreset(sel, tweaks);
    presetRadios.forEach((r) => (r.checked = r.value === preset?.id));
    customNote.hidden = !!preset;

    const checks = checkBrandContrast(brand).filter((c) => c.level === "required");
    const failed = checks.filter((c) => !c.pass).length;
    contrastEl.textContent = fmt(failed ? contrastEl.dataset.badTemplate! : contrastEl.dataset.okTemplate!, { n: failed, m: checks.length });
    contrastEl.dataset.state = failed ? "bad" : "ok";

    openLink.href = `${previewUrl(previewLang())}?project=${project.id}`;
    renderSections();
    send();
  }

  /** Choosing a new option for an element drops that element's fine-tuning. */
  function dropTweaks(k: ElementKey) {
    project.tweaks = Object.fromEntries(Object.entries(project.tweaks).filter(([id]) => TWEAKS.find((tw) => tw.id === id)?.group !== k));
  }
  function setStyle(selection: Selection) {
    project.selection = { ...selection };
    project.tweaks = {};
    project.sections = null;
    sync();
    saveSoon();
  }

  root.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    if (input.name === "preset") {
      const p = PRESETS.find((x) => x.id === input.value);
      if (p) setStyle(p.selection);
    } else if (input.name.startsWith("el-")) {
      const k = input.name.slice(3) as ElementKey;
      project.selection = { ...project.selection, [k]: input.value };
      dropTweaks(k);
      if (k === "page") project.sections = null;
      sync();
      saveSoon();
    }
  });

  for (const tw of TWEAKS) {
    const input = $<HTMLInputElement>(`#tw-${tw.id}`);
    input.addEventListener("input", () => {
      const tweaks = cleanTweaks({ ...project.tweaks, [tw.id]: tw.kind === "color" ? input.value : Number(input.value) });
      // back at the option's own value: no longer a tweak
      if (String(tweaks[tw.id]).toLowerCase() === String(tw.read(project.selection)).toLowerCase()) delete tweaks[tw.id];
      project.tweaks = tweaks;
      sync();
      saveSoon();
    });
  }
  $$<HTMLButtonElement>("[data-tune-reset]").forEach((b) =>
    b.addEventListener("click", () => {
      dropTweaks(b.dataset.tuneReset as ElementKey);
      sync();
      saveSoon();
      b.closest(".tune")?.querySelector<HTMLInputElement>("input")?.focus();
    }),
  );

  $("[data-random]").addEventListener("click", () => {
    // a new look, not a new site: header, footer and the other site parts stay as chosen
    const next = { ...project.selection };
    for (const k of Object.keys(ELEMENTS) as ElementKey[]) {
      if (ELEMENT_INFO[k].tab === "site") continue;
      const list = ELEMENTS[k];
      next[k] = list[Math.floor(Math.random() * list.length)]!.id;
    }
    setStyle(next);
  });
  $("[data-reset]").addEventListener("click", () => setStyle(DEFAULT_SELECTION));

  // ------------------------------------------------------------------ sections tab
  const list = $("[data-sections]");
  const addSel = $<HTMLSelectElement>("[data-add-section]");
  const sectionsReset = $<HTMLButtonElement>("[data-sections-reset]");

  const blockLabel = (b: string) => ui.blocks[b]?.label ?? b;
  const variantLabel = (b: string, v: string) => ui.blocks[b]?.variants[v] ?? v;

  function setSections(next: Block[], focus?: string) {
    project.sections = next;
    sync();
    saveSoon();
    if (focus) list.querySelector<HTMLElement>(focus)?.focus();
  }

  function renderSections() {
    $("[data-hero-name]").textContent = ui.heroes[project.selection.hero] ?? project.selection.hero;
    const secs = sectionsOf(project);
    const used = new Set(secs.map(([b, v]) => `${b}:${v}`));
    list.replaceChildren(
      ...secs.map(([b, v, tone], i) => {
        const li = document.createElement("li");
        li.className = "sec";
        li.dataset.i = String(i);
        const name = blockLabel(b);
        const variants = Object.keys(BLOCKS[b]?.variants ?? {});
        li.innerHTML = `
          <div class="sec__head">
            <span class="sec__num">${i + 2}</span>
            <span class="sec__name"></span>
            <span class="sec__moves">
              <button type="button" class="icon-btn" data-move="up" ${i === 0 ? "disabled" : ""}><span aria-hidden="true">↑</span></button>
              <button type="button" class="icon-btn" data-move="down" ${i === secs.length - 1 ? "disabled" : ""}><span aria-hidden="true">↓</span></button>
              <button type="button" class="icon-btn" data-move="remove"><span aria-hidden="true">×</span></button>
            </span>
          </div>
          <div class="sec__opts">
            <label>${ui.variant}<select data-sec-variant></select></label>
            <label>${ui.tone}<select data-sec-tone></select></label>
          </div>`;
        li.querySelector(".sec__name")!.textContent = name;
        const [up, down, rm] = Array.from(li.querySelectorAll("button"));
        up!.setAttribute("aria-label", `${ui.up}: ${name}`);
        down!.setAttribute("aria-label", `${ui.down}: ${name}`);
        rm!.setAttribute("aria-label", `${ui.removeSection}: ${name}`);
        const vSel = li.querySelector<HTMLSelectElement>("[data-sec-variant]")!;
        vSel.append(
          ...variants.map((x) => {
            const o = new Option(variantLabel(b, x), x, false, x === v);
            o.disabled = x !== v && used.has(`${b}:${x}`);
            return o;
          }),
        );
        vSel.disabled = variants.length < 2;
        const tSel = li.querySelector<HTMLSelectElement>("[data-sec-tone]")!;
        tSel.append(...Object.entries(ui.tones).map(([k, l]) => new Option(l, k, false, k === tone)));
        return li;
      }),
    );

    const options = Object.entries(BLOCKS).flatMap(([b, def]) =>
      Object.keys(def.variants)
        .filter((v) => !used.has(`${b}:${v}`))
        .map((v) => new Option(`${blockLabel(b)} · ${variantLabel(b, v)}`, `${b}:${v}`)),
    );
    addSel.replaceChildren(...options);
    $<HTMLButtonElement>("[data-add]").disabled = options.length === 0;
    sectionsReset.hidden = !project.sections;
  }

  list.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-move]");
    if (!btn) return;
    const i = Number(btn.closest<HTMLElement>("[data-i]")!.dataset.i);
    const secs = [...sectionsOf(project)];
    const move = btn.dataset.move;
    if (move === "remove") {
      secs.splice(i, 1);
      const next = Math.min(i, secs.length - 1);
      setSections(secs, next >= 0 ? `[data-i="${next}"] [data-move="remove"]` : undefined);
      if (next < 0) addSel.focus();
      return;
    }
    const j = move === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= secs.length) return;
    [secs[i], secs[j]] = [secs[j]!, secs[i]!];
    const keep = (move === "up" && j === 0) || (move === "down" && j === secs.length - 1) ? (move === "up" ? "down" : "up") : move;
    setSections(secs, `[data-i="${j}"] [data-move="${keep}"]`);
  });
  list.addEventListener("change", (e) => {
    const sel = e.target as HTMLSelectElement;
    const i = Number(sel.closest<HTMLElement>("[data-i]")!.dataset.i);
    const secs = sectionsOf(project).map((s) => [...s] as Block);
    if (sel.matches("[data-sec-variant]")) secs[i]![1] = sel.value;
    else if (sel.matches("[data-sec-tone]")) secs[i]![2] = sel.value as Block[2];
    else return;
    const which = sel.matches("[data-sec-variant]") ? "[data-sec-variant]" : "[data-sec-tone]";
    setSections(secs, `[data-i="${i}"] ${which}`);
  });
  $("[data-add]").addEventListener("click", () => {
    if (!addSel.value) return;
    const [b, v] = addSel.value.split(":") as [string, string];
    const secs = [...sectionsOf(project)];
    // new sections go before the closing call to action, which belongs at the end
    const at = secs.length && secs[secs.length - 1]![0] === "close" ? secs.length - 1 : secs.length;
    secs.splice(at, 0, [b, v, "base"]);
    setSections(secs, `[data-i="${at}"] [data-sec-variant]`);
  });
  sectionsReset.addEventListener("click", () => {
    project.sections = null;
    sync();
    saveSoon();
  });

  // ------------------------------------------------------------------ content tab
  const infoInputs = $$<HTMLInputElement | HTMLTextAreaElement>("[data-info]");
  const titleInput = $<HTMLInputElement>("[data-title]");

  function fillContent() {
    titleInput.value = project.title;
    for (const input of infoInputs) input.value = project.info[input.dataset.info as keyof ProjectInfo] as string;
    for (const name of ["languages", "defaultLang", "domainStatus"] as const)
      $$<HTMLInputElement>(`input[name="info-${name}"]`).forEach((r) => (r.checked = r.value === project.info[name]));
    $("[data-default-lang]").hidden = project.info.languages !== "both";
    for (const input of $$<HTMLInputElement>("[data-site]")) {
      const v = project.site[input.dataset.site as keyof SiteOptions];
      if (input.type === "checkbox") input.checked = !!v;
      else input.value = String(v);
    }
    renderLogo();
    renderSlots();
    renderTextCount();
  }

  titleInput.addEventListener("input", () => {
    project.title = titleInput.value;
    renderProjects();
    saveSoon();
  });
  for (const input of infoInputs) {
    input.addEventListener("input", () => {
      const k = input.dataset.info as keyof ProjectInfo;
      project.info = { ...project.info, [k]: input.value };
      if (k === "nameAr" || k === "nameEn") send();
      saveSoon();
    });
  }
  root.addEventListener("change", (e) => {
    const r = e.target as HTMLInputElement;
    const m = /^info-(languages|defaultLang|domainStatus)$/.exec(r.name);
    if (!m) return;
    project.info = { ...project.info, [m[1]!]: r.value };
    $("[data-default-lang]").hidden = project.info.languages !== "both";
    saveSoon();
  });

  for (const input of $$<HTMLInputElement>("[data-site]")) {
    input.addEventListener(input.type === "checkbox" ? "change" : "input", () => {
      project.site = { ...project.site, [input.dataset.site!]: input.type === "checkbox" ? input.checked : input.value.trim() };
      send();
      saveSoon();
    });
  }
  $("[data-replay]").addEventListener("click", () => frame.contentWindow?.postMessage({ type: "studio:replay" }, location.origin));
  // contact details feed the footer and the WhatsApp button live
  for (const input of infoInputs)
    if (/^(whatsapp|instagram|x|tiktok|snapchat|linkedin)$/.test(input.dataset.info!)) input.addEventListener("input", () => send());

  async function addImage(slot: string, file: File | Blob | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return say(ui.notImage);
    if (file.size > MAX_IMAGE) return say(ui.tooBig);
    const id = uid();
    await putAsset(id, file);
    const old = project.media[slot];
    if (old) {
      const { [old]: _gone, ...rest } = project.assets;
      project.assets = rest;
      if (!Object.entries(project.media).some(([s, a]) => s !== slot && a === old)) await deleteAsset(old);
    }
    if (urls[slot]) URL.revokeObjectURL(urls[slot]);
    project.assets = { ...project.assets, [id]: { id, name: (file as File).name || `${slot.replace("/", "-")}.${file.type.split("/")[1]}`, type: file.type } };
    project.media = { ...project.media, [slot]: id };
    urls = { ...urls, [slot]: URL.createObjectURL(file) };
    renderLogo();
    renderSlots();
    send();
    saveSoon();
  }

  async function removeImage(slot: string) {
    const id = project.media[slot];
    if (!id) return;
    const { [slot]: _m, ...media } = project.media;
    const { [id]: _a, ...assets } = project.assets;
    project.media = media;
    project.assets = assets;
    await deleteAsset(id);
    if (urls[slot]) URL.revokeObjectURL(urls[slot]);
    const { [slot]: _u, ...rest } = urls;
    urls = rest;
    renderLogo();
    renderSlots();
    send();
    saveSoon();
  }

  function thumb(el: HTMLElement, slot: string) {
    el.replaceChildren();
    if (urls[slot]) {
      const img = document.createElement("img");
      img.src = urls[slot];
      img.alt = "";
      el.append(img);
    } else el.textContent = ui.emptySlot;
  }

  function renderLogo() {
    const row = $("[data-slot-row='logo']");
    thumb(row.querySelector<HTMLElement>("[data-thumb]")!, "logo");
    const has = !!project.media.logo;
    row.querySelector<HTMLElement>("[data-upload-label]")!.textContent = has ? ui.replace : ui.upload;
    row.querySelector<HTMLElement>("[data-remove-image]")!.hidden = !has;
    $("[data-logo-color]").hidden = !has;
  }

  function slotLabel(slot: string) {
    const [b, n] = slot.split("/") as [string, string];
    const name = b === "top" ? ui.heroRow : blockLabel(b);
    return `${name} · ${Number(n) + 1}`;
  }

  function renderSlots() {
    const ul = $("[data-slots]");
    ul.replaceChildren(
      ...slots.map((slot) => {
        const li = document.createElement("li");
        li.className = "slot";
        li.innerHTML = `
          <span class="slot__thumb"></span>
          <span class="slot__name"></span>
          <span class="slot__actions">
            <label class="mini mini--primary"><span></span><input type="file" accept="image/*" class="lk-visually-hidden"></label>
            <button type="button" class="mini" ${project.media[slot] ? "" : "hidden"}></button>
          </span>`;
        thumb(li.querySelector(".slot__thumb")!, slot);
        li.querySelector(".slot__name")!.textContent = slotLabel(slot);
        const input = li.querySelector<HTMLInputElement>("input")!;
        input.dataset.upload = slot;
        input.setAttribute("aria-label", `${project.media[slot] ? ui.replace : ui.upload}: ${slotLabel(slot)}`);
        li.querySelector("label span")!.textContent = project.media[slot] ? ui.replace : ui.upload;
        const rm = li.querySelector<HTMLButtonElement>("button")!;
        rm.textContent = ui.removeImage;
        rm.dataset.removeImage = slot;
        rm.setAttribute("aria-label", `${ui.removeImage}: ${slotLabel(slot)}`);
        return li;
      }),
    );
  }

  root.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.dataset.upload) return;
    addImage(input.dataset.upload, input.files?.[0]);
    input.value = "";
  });
  root.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-remove-image]");
    if (b) removeImage(b.dataset.removeImage!);
  });

  $("[data-logo-color]").addEventListener("click", async () => {
    const blob = project.media.logo ? await getAsset(project.media.logo) : undefined;
    const hex = blob ? await logoColor(blob) : null;
    if (!hex) return;
    project.tweaks = cleanTweaks({ ...project.tweaks, accent: hex });
    sync();
    saveSoon();
    say(`${ui.logoColorDone} ${hex.toUpperCase()}`);
  });

  function renderTextCount() {
    const l = previewLang();
    const n = Object.keys(project.content[l]).length;
    $("[data-texts-count]").textContent = fmt(ui.textsCount, { n, lang: l === "ar" ? ui.arabic : ui.english });
    $<HTMLButtonElement>("[data-clear-texts]").disabled = !Object.keys(project.content.ar).length && !Object.keys(project.content.en).length;
  }
  $("[data-clear-texts]").addEventListener("click", () => {
    if (!confirm(ui.confirmClear)) return;
    project.content = { ar: {}, en: {} };
    renderTextCount();
    send();
    saveSoon();
  });

  // ------------------------------------------------------------------ projects
  const projectSel = $<HTMLSelectElement>("[data-project]");
  function renderProjects() {
    projects = [project, ...projects.filter((p) => p.id !== project.id)].sort((a, b) => a.createdAt - b.createdAt);
    projectSel.replaceChildren(...projects.map((p) => new Option(p.title || nameFor(p.info, lang) || ui.untitled, p.id, false, p.id === project.id)));
    $<HTMLButtonElement>("[data-project-del]").disabled = false;
  }
  projectSel.addEventListener("change", () => {
    const p = projects.find((x) => x.id === projectSel.value);
    if (p) switchTo(p);
  });
  $("[data-project-new]").addEventListener("click", async () => switchTo(await create(newProject(nextTitle()))));
  $("[data-project-dup]").addEventListener("click", async () => {
    await saveProject(project);
    const copy = await duplicateProject(project, uid(), `${project.title} (2)`);
    projects.push(copy);
    switchTo(copy);
  });
  $("[data-project-del]").addEventListener("click", async () => {
    if (!confirm(ui.confirmDelete)) return;
    clearTimeout(saveTimer);
    const gone = project;
    projects = projects.filter((p) => p.id !== gone.id);
    await deleteProject(gone);
    switchTo(projects[0] ?? (await create(newProject(nextTitle()))));
  });
  $<HTMLInputElement>("[data-project-import]").addEventListener("change", async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    try {
      const p = await importProjectFile(file, uid());
      projects.push(p);
      await switchTo(p);
      say(`${ui.imported} ${p.title}`);
    } catch {
      say(ui.badFile);
    }
  });

  // ------------------------------------------------------------------ toolbar
  const editBtn = $<HTMLButtonElement>("[data-edit]");
  editBtn.addEventListener("click", () => {
    editing = !editing;
    editBtn.setAttribute("aria-pressed", String(editing));
    $("[data-editbar]").hidden = !editing;
    send();
  });
  $$<HTMLInputElement>('input[name="device"]').forEach((r) =>
    r.addEventListener("change", () => {
      wrap.style.setProperty("--frame-w", r.value === "100%" ? "100%" : `${r.value}px`);
      wrap.dataset.device = r.id;
    }),
  );
  $$<HTMLInputElement>('input[name="plang"]').forEach((r) =>
    r.addEventListener("change", () => {
      frame.src = previewUrl(previewLang()) + encodeSelection(project.selection, project.tweaks);
      renderTextCount();
    }),
  );

  // ------------------------------------------------------------------ handoff
  const promptEl = $("[data-prompt]");
  let brief = "";
  const download = (blob: Blob, name: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  document.querySelector("[data-lk-dialog-open='deliver']")?.addEventListener("click", async () => {
    brief = "";
    promptEl.textContent = ui.preparing;
    $("[data-checks]").replaceChildren();
    await saveProject(project);
    const snaps: Snapshot[] = [];
    for (const l of langsOf(project.info)) snaps.push(await snapshot(l));
    const r = readiness(project, snaps);
    const check = (ok: boolean, text: string) => {
      const li = document.createElement("li");
      li.dataset.ok = String(ok);
      li.textContent = ok ? text : `${text}: ${ui.missing}`;
      return li;
    };
    $("[data-checks]").replaceChildren(
      check(r.name, ui.checkName),
      check(r.about, ui.checkAbout),
      check(r.contact, ui.checkContact),
      check(r.logo, ui.checkLogo),
      check(r.imageSlots === 0 || r.images > 0, fmt(ui.checkImages, { n: r.images, m: r.imageSlots })),
      check(true, r.placeholders ? fmt(ui.checkTexts, { n: r.placeholders }) : ui.checkTextsNone),
    );
    brief = buildBrief(project, snaps, { previewUrl: new URL(`${previewUrl(langsOf(project.info)[0]!)}?project=${project.id}`, location.href).href });
    promptEl.textContent = brief;
  });

  const copyBtn = $<HTMLButtonElement>("[data-copy-prompt]");
  copyBtn.addEventListener("click", async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      const label = copyBtn.querySelector(".lk-btn__label")!;
      const before = label.textContent;
      label.textContent = ui.copied;
      setTimeout(() => (label.textContent = before), 1500);
    } catch {
      getSelection()?.selectAllChildren(promptEl);
    }
  });
  $("[data-download-file]").addEventListener("click", async () => {
    await saveProject(project);
    download(await exportProjectFile(project), `${slugOf(project)}.landing.json`);
  });
  $("[data-download-prompt]").addEventListener("click", () => {
    if (brief) download(new Blob([brief], { type: "text/markdown" }), `${slugOf(project)}-brief.md`);
  });

  // ------------------------------------------------------------------ start
  fillContent();
  renderProjects();
  frame.src = previewUrl(previewLang()) + encodeSelection(project.selection, project.tweaks);
  sync();
  saveSoon();
}
