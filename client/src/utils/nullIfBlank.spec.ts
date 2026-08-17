import { expect, test } from "vitest";

import { nullIfBlank } from "@/utils/nullIfBlank.ts";

test("returns null for blank strings", () => {
  expect(nullIfBlank("")).toBeNull();
  expect(nullIfBlank("   ")).toBeNull();
  expect(nullIfBlank("\t\n")).toBeNull();
});

test("returns nonblank strings unchanged", () => {
  expect(nullIfBlank("text")).toBe("text");
  expect(nullIfBlank("  text  ")).toBe("  text  ");
});
