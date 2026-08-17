import { describe, expect, it } from "vitest";

import { getCertainLines } from "@/components/screens/home/utils/getCertainLines.ts";

describe("getCertainLines", () => {
  it("should return the specified number of lines (2-4 lines)", () => {
    const text = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
    const result = getCertainLines(text, { start: 2, end: 4 });

    expect(result).toBe("Line 2\nLine 3\nLine 4");
  });
  it("should return the first 4 lines", () => {
    const text = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7";
    const result = getCertainLines(text);

    expect(result).toBe("Line 1\nLine 2\nLine 3\nLine 4");
  });
  it("should return the specified number of lines (1-3 lines)", () => {
    const text = "Line 1\nLine 2\nLine 3\n";
    const result = getCertainLines(text);

    expect(result).toBe("Line 1\nLine 2\nLine 3\n");
  });
  it("should return empty string", () => {
    const text = "";
    const result = getCertainLines(text);

    expect(result).toBe("");
  });
  it("should return empty string if text is null", () => {
    const text = null;

    // @ts-expect-error Testing runtime protection against null input
    const result = getCertainLines(text);

    expect(result).toBe("");
  });
  it("should return empty string if text is undefined", () => {
    const text = undefined;

    // @ts-expect-error Testing runtime protection against undefined input
    const result = getCertainLines(text);

    expect(result).toBe("");
  });
});
