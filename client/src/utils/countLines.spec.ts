import { expect, test } from "vitest";

import { countLines } from "@/utils/countLines.ts";

test("countLines", () => {
  expect(countLines("")).toBe(1);
  expect(countLines("foo")).toBe(1);
  expect(countLines("foo\n")).toBe(2);
  expect(countLines("foo\nbar")).toBe(2);
  expect(countLines("foo\nbar\n")).toBe(3);
  expect(countLines("foo\nbar\nbaz")).toBe(3);
  expect(countLines("foo\nbar\nbaz\n")).toBe(4);
  expect(countLines("foo\nbar\nbaz\nqux")).toBe(4);
  expect(countLines("foo\nbar\nbaz\nqux\n")).toBe(5);
});

test("countLines with CRLF", () => {
  expect(countLines("")).toBe(1);
  expect(countLines("foo")).toBe(1);
  expect(countLines("foo\r\n")).toBe(2);
  expect(countLines("foo\r\nbar")).toBe(2);
  expect(countLines("foo\r\nbar\r\n")).toBe(3);
  expect(countLines("foo\r\nbar\r\nbaz")).toBe(3);
  expect(countLines("foo\r\nbar\r\nbaz\r\n")).toBe(4);
  expect(countLines("foo\r\nbar\r\nbaz\r\nqux")).toBe(4);
  expect(countLines("foo\r\nbar\r\nbaz\r\nqux\r\n")).toBe(5);
});
