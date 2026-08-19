import { Cursor } from "../types/cursor.type.js";

function isJson(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function extractCursor(value: string | undefined): Cursor | null {
  try {
    if (!value) return null;
    if (typeof value !== "string") return null;
    if (value.trim() === "") return null;
    if (isJson(value)) return null;

    const trim = value.trim();

    return trim;
  } catch {
    return null;
  }
}
