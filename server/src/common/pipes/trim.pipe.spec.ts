import { describe, expect, it } from "@jest/globals";

import { TrimPipe } from "./trim.pipe.js";

describe("TrimPipe", () => {
  it("returns null unchanged", () => {
    const pipe = new TrimPipe();

    expect(pipe.transform(null)).toBeNull();
  });

  it("returns undefined unchanged", () => {
    const pipe = new TrimPipe();

    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it("returns a number unchanged", () => {
    const pipe = new TrimPipe();

    expect(pipe.transform(1)).toBe(1);
  });

  it("trims a string", () => {
    const pipe = new TrimPipe();

    expect(pipe.transform("  hello  ")).toBe("hello");
  });

  it("returns an empty string unchanged", () => {
    const pipe = new TrimPipe();

    expect(pipe.transform("")).toBe("");
  });

  it("returns an object unchanged when no fields are configured", () => {
    const pipe = new TrimPipe();
    const value = { field: "  hello  " };

    expect(pipe.transform(value)).toEqual(value);
  });

  describe("with configured fields", () => {
    it("trims a selected field and preserves unselected fields", () => {
      const pipe = new TrimPipe(["field"]);
      const value = { field: "  hello  ", other: "  world  " };

      expect(pipe.transform(value)).toEqual({
        field: "hello",
        other: "  world  ",
      });
    });

    it("trims multiple selected fields", () => {
      const pipe = new TrimPipe(["field", "other"]);
      const value = { field: "  hello  ", other: "  world  " };

      expect(pipe.transform(value)).toEqual({
        field: "hello",
        other: "world",
      });
    });

    it("trims a whitespace-only field to an empty string", () => {
      const pipe = new TrimPipe(["field"]);

      expect(pipe.transform({ field: "   " })).toEqual({ field: "" });
    });

    it("preserves a non-string selected field", () => {
      const pipe = new TrimPipe(["field"]);

      expect(pipe.transform({ field: 1 })).toEqual({ field: 1 });
    });

    it("does not mutate the input object", () => {
      const pipe = new TrimPipe(["field"]);
      const value = { field: "  hello  " };

      const result = pipe.transform(value);

      expect(value).toEqual({ field: "  hello  " });
      expect(result).toEqual({ field: "hello" });
      expect(result).not.toBe(value);
    });
  });
});
