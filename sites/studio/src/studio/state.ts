/**
 * Selection (+ fine-tuning) ⇄ URL query string, so any combination can be bookmarked or opened
 * full-screen. (The hash stays free for in-page anchors such as #pricing.)
 */
import { DEFAULT_SELECTION, ELEMENTS, TWEAKS, cleanTweaks, type ElementKey, type Selection, type Tweaks } from "./options";

const KEYS = Object.keys(ELEMENTS) as ElementKey[];

export interface StudioState {
  selection: Selection;
  tweaks: Tweaks;
}

const params = (query: string) => new URLSearchParams(query.replace(/^[?#]/, ""));

export function encodeSelection(s: Selection, tweaks: Tweaks = {}): string {
  const tw = cleanTweaks(tweaks);
  const parts = [
    ...KEYS.map((k) => `${k}=${encodeURIComponent(s[k])}`),
    ...TWEAKS.filter((t) => t.id in tw).map((t) => `${t.id}=${encodeURIComponent(String(tw[t.id]))}`),
  ];
  return "?" + parts.join("&");
}

export function decodeSelection(query: string): Selection {
  const p = params(query);
  const out = { ...DEFAULT_SELECTION };
  for (const k of KEYS) {
    const v = p.get(k);
    if (v && ELEMENTS[k].some((o) => o.id === v)) out[k] = v;
  }
  return out;
}

export function decodeState(query: string): StudioState {
  const p = params(query);
  return { selection: decodeSelection(query), tweaks: cleanTweaks(Object.fromEntries(TWEAKS.map((t) => [t.id, p.get(t.id) ?? undefined]))) };
}

/** True when the query names at least one element or fine-tuning value. */
export const hasSelection = (query: string) => {
  const p = params(query);
  return [...KEYS, ...TWEAKS.map((t) => t.id)].some((k) => p.has(k));
};
