/**
 * Selection ⇄ URL query string, so any combination can be bookmarked or opened full-screen.
 * (The hash stays free for in-page anchors such as #pricing.)
 */
import { DEFAULT_SELECTION, ELEMENTS, type ElementKey, type Selection } from "./options";

const KEYS = Object.keys(ELEMENTS) as ElementKey[];

export function encodeSelection(s: Selection): string {
  return "?" + KEYS.map((k) => `${k}=${encodeURIComponent(s[k])}`).join("&");
}

export function decodeSelection(query: string): Selection {
  const params = new URLSearchParams(query.replace(/^[?#]/, ""));
  const out = { ...DEFAULT_SELECTION };
  for (const k of KEYS) {
    const v = params.get(k);
    if (v && ELEMENTS[k].some((o) => o.id === v)) out[k] = v;
  }
  return out;
}

/** True when the query names at least one element. */
export const hasSelection = (query: string) => KEYS.some((k) => new URLSearchParams(query.replace(/^[?#]/, "")).has(k));
