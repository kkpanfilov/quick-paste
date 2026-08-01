import { extractCursor } from "./extract-cursor.js";

describe("extractCursor", () => {
  it.each([
    ["null", null],
    ["a number", 1],
    ["a boolean", true],
    ["an array", []],
    ["an object", {}],
  ])("returns null if the value is %s", (_description, value) => {
    // @ts-expect-error Testing runtime protection against non-string input
    const cursor = extractCursor(value);

    expect(cursor).toBeNull();
  });

  it("returns null if the value is undefined", () => {
    const cursor = extractCursor(undefined);

    expect(cursor).toBeNull();
  });

  it("returns null if the value is JSON", () => {
    const cursor = extractCursor(JSON.stringify({ cursor: "test" }));

    expect(cursor).toBeNull();
  });

  it("returns null if the value is an empty string", () => {
    const cursor = extractCursor("");

    expect(cursor).toBeNull();
  });

  it("returns null if the value is a whitespace-only string", () => {
    const cursor = extractCursor("     ");

    expect(cursor).toBeNull();
  });

  it("extracts a cursor from a string", () => {
    const cursor = extractCursor("  test  ");

    expect(cursor).toBe("test");
  });
});
