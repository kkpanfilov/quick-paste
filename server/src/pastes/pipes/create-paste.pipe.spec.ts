import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import ms from "ms";

import { CreatePastePipe } from "./create-paste.pipe.js";

describe("CreatePastePipe", () => {
  const now = new Date("2026-01-01T12:00:00.000Z");

  const data = {
    title: "Paste Title",
    content: "Paste Content",
    description: "Paste Description",
    category: "Programming",
    language: "TypeScript",
    isBurn: false,
    password: "",
    tags: ["tag1", "tag2"],
  };

  const pipe = new CreatePastePipe();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    ['"public"', "public"],
    ['"unlisted"', "unlisted"],
    ['"protected"', "protected"],
    ['"private"', "private"],
    ['"shared"', "shared"],
  ])("should uppercase exposure if exposure is %s", (_description, value) => {
    const dto = {
      ...data,
      exposure: value,
      expiration: "never",
    };

    const { expiration: _, ...expectedDto } = dto;

    const result = pipe.transform(dto);

    expect(result).toEqual({
      ...expectedDto,
      expiresAt: null,
      exposure: value.toUpperCase(),
    });
  });

  it.each([
    ['"never"', "never"],
    ['"burn"', "burn"],
  ])(
    "should convert expiration to expiresAt: null if expiration is %s",
    (_description, value) => {
      const dto = {
        ...data,
        exposure: "public",
        expiration: value,
      };

      const { expiration: _, ...expectedDto } = dto;

      const result = pipe.transform(dto);

      expect(result).toEqual({
        ...expectedDto,
        expiresAt: null,
        exposure: "PUBLIC",
      });
    },
  );

  it.each([
    ['"10m"', "10m"],
    ['"1h"', "1h"],
    ['"1d"', "1d"],
    ['"3d"', "3d"],
    ['"7d"', "7d"],
    ['"14d"', "14d"],
    ['"30d"', "30d"],
    ['"180d"', "180d"],
    ['"1y"', "1y"],
  ])(
    "should convert expiration to date if expiration is %s",
    (_description, value) => {
      const dto = {
        ...data,
        exposure: "public",
        expiration: value,
      };

      const { expiration, ...expectedDto } = dto;

      const expectedExpiration = new Date(
        now.getTime() + ms(expiration as ms.StringValue),
      );

      const result = pipe.transform(dto);

      expect(result).toEqual({
        ...expectedDto,
        expiresAt: expectedExpiration,
        exposure: "PUBLIC",
      });
    },
  );
});
