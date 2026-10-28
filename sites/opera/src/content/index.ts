import type { Locale } from "../site";
import { ar } from "./ar";
import { en } from "./en";
import type { Content } from "./types";

export const content: Record<Locale, Content> = { ar, en };
