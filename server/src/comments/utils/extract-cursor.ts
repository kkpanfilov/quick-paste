import { Cursor } from "../types/cursor.type.js";

// TODO: add tests and zod validation
// TODO: consider acception just a string like id="" instead of json
export function extractCursor(value: string | undefined): Cursor | null {
  try {
    if (!value) return null;

    return JSON.parse(decodeURIComponent(value)) as Cursor;
  } catch (error: unknown) {
    return null;
  }
}
