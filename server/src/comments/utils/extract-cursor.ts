import { Cursor } from "../types/cursor.type.js";

export function extractCursor(value: string | undefined): Cursor | null {
  try {
    if (!value) return null;

    return JSON.parse(decodeURIComponent(value)) as Cursor;
  } catch (error: unknown) {
    return null;
  }
}
