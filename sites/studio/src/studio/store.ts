/**
 * Projects and their images live in the browser (IndexedDB), on this device only: nothing is
 * uploaded anywhere. If IndexedDB is unavailable (private mode in some browsers) everything still
 * works for the session, in memory.
 */
import { normalizeProject, type Project } from "./project";

const DB = "landing-studio";
const VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | undefined;
const memory = { projects: new Map<string, Project>(), assets: new Map<string, Blob>() };

function open(): Promise<IDBDatabase | null> {
  dbPromise ??= new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB, VERSION);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("projects", { keyPath: "id" });
        req.result.createObjectStore("assets");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function run<T>(store: "projects" | "assets", mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T | undefined> {
  return open().then(
    (db) =>
      new Promise<T | undefined>((resolve) => {
        if (!db) return resolve(undefined);
        try {
          const req = fn(db.transaction(store, mode).objectStore(store));
          req.onsuccess = () => resolve(req.result as T);
          req.onerror = () => resolve(undefined);
        } catch {
          resolve(undefined);
        }
      }),
  );
}

export async function listProjects(): Promise<Project[]> {
  const rows = (await run<Project[]>("projects", "readonly", (s) => s.getAll())) ?? [...memory.projects.values()];
  return rows.map(normalizeProject).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getProject(id: string): Promise<Project | undefined> {
  const row = (await run<Project>("projects", "readonly", (s) => s.get(id))) ?? memory.projects.get(id);
  return row ? normalizeProject(row) : undefined;
}

export async function saveProject(p: Project): Promise<void> {
  // structuredClone drops anything that isn't plain data (and detaches it from the caller's object)
  const copy = structuredClone(p);
  memory.projects.set(p.id, copy);
  await run("projects", "readwrite", (s) => s.put(copy));
}

export async function deleteProject(p: Project): Promise<void> {
  memory.projects.delete(p.id);
  await run("projects", "readwrite", (s) => s.delete(p.id));
  await Promise.all(Object.keys(p.assets).map(deleteAsset));
}

export async function putAsset(id: string, blob: Blob): Promise<void> {
  memory.assets.set(id, blob);
  await run("assets", "readwrite", (s) => s.put(blob, id));
}

export async function getAsset(id: string): Promise<Blob | undefined> {
  return (await run<Blob>("assets", "readonly", (s) => s.get(id))) ?? memory.assets.get(id);
}

export async function deleteAsset(id: string): Promise<void> {
  memory.assets.delete(id);
  await run("assets", "readwrite", (s) => s.delete(id));
}

/** Object URLs for a project's media slots (`slot → blob: URL`). Revoke with `revokeUrls` when done. */
export async function mediaUrls(p: Project): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  await Promise.all(
    Object.entries(p.media).map(async ([slot, id]) => {
      const blob = await getAsset(id);
      if (blob) out[slot] = URL.createObjectURL(blob);
    }),
  );
  return out;
}

export const revokeUrls = (urls: Record<string, string>) => Object.values(urls).forEach((u) => URL.revokeObjectURL(u));

// ------------------------------------------------------------------------------- project files

export const PROJECT_FORMAT = "landing-studio-project";

interface ProjectFile {
  format: typeof PROJECT_FORMAT;
  version: 1;
  project: Project;
  /** Asset id → data URL. */
  files: Record<string, string>;
}

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

/** One self-contained JSON file: the project plus every image, to reopen later or hand to the developer. */
export async function exportProjectFile(p: Project): Promise<Blob> {
  const files: Record<string, string> = {};
  for (const id of Object.keys(p.assets)) {
    const blob = await getAsset(id);
    if (blob) files[id] = await toDataUrl(blob);
  }
  const data: ProjectFile = { format: PROJECT_FORMAT, version: 1, project: p, files };
  return new Blob([JSON.stringify(data)], { type: "application/json" });
}

/** Reads a project file and stores it (with its images) as a new project. */
export async function importProjectFile(file: Blob, newId: string): Promise<Project> {
  const data = JSON.parse(await file.text()) as Partial<ProjectFile>;
  if (data.format !== PROJECT_FORMAT || !data.project) throw new Error("not a studio project file");
  const p = normalizeProject({ ...data.project, id: newId, updatedAt: Date.now() });
  // fresh asset ids, so deleting one copy of a project never removes another copy's images
  const assets: Project["assets"] = {};
  const rename: Record<string, string> = {};
  for (const [id, url] of Object.entries(data.files ?? {})) {
    const ref = p.assets[id];
    if (!ref || !url.startsWith("data:image/")) continue;
    const next = `${newId}-${id}`;
    await putAsset(next, await (await fetch(url)).blob());
    assets[next] = { ...ref, id: next };
    rename[id] = next;
  }
  p.assets = assets;
  p.media = Object.fromEntries(Object.entries(p.media).flatMap(([slot, id]) => (rename[id] ? [[slot, rename[id]]] : [])));
  await saveProject(p);
  return p;
}

/** A full copy of a project, images included, under a new id. */
export async function duplicateProject(p: Project, newId: string, title: string): Promise<Project> {
  const now = Date.now();
  const copy: Project = { ...structuredClone(p), id: newId, title, createdAt: now, updatedAt: now, assets: {}, media: {} };
  const rename: Record<string, string> = {};
  for (const [id, ref] of Object.entries(p.assets)) {
    const blob = await getAsset(id);
    if (!blob) continue;
    const next = `${newId}-${id.split("-").pop()}`;
    await putAsset(next, blob);
    copy.assets[next] = { ...ref, id: next };
    rename[id] = next;
  }
  copy.media = Object.fromEntries(Object.entries(p.media).flatMap(([slot, id]) => (rename[id] ? [[slot, rename[id]]] : [])));
  await saveProject(copy);
  return copy;
}
