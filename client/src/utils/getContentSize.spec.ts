import { expect, test } from "vitest";

import { getContentSize } from "@/utils/getContentSize.ts";

test("getContentSize", () => {
  expect(getContentSize("")).toBe("0 B");
  expect(getContentSize("\n")).toBe("1 B");
  expect(getContentSize("foo")).toBe("3 B");
  expect(getContentSize("foo\n")).toBe("4 B");
  expect(getContentSize("foo\nbar")).toBe("7 B");
});

test("getContentSize with LF", () => {
  expect(getContentSize("\n")).toBe("1 B");
  expect(getContentSize("foo")).toBe("3 B");
  expect(getContentSize("foo\n")).toBe("4 B");
  expect(getContentSize("foo\nbar")).toBe("7 B");
});

test("getContentSize with CRLF", () => {
  expect(getContentSize("\r\n")).toBe("2 B");
  expect(getContentSize("foo")).toBe("3 B");
  expect(getContentSize("foo\r\n")).toBe("5 B");
  expect(getContentSize("foo\r\nbar")).toBe("8 B");
});

test("getContentSize with UTF-8", () => {
  expect(getContentSize("🚀")).toBe("4 B");
  expect(getContentSize("🚀\n")).toBe("5 B");
  expect(getContentSize("🚀\n🚀")).toBe("9 B");
});