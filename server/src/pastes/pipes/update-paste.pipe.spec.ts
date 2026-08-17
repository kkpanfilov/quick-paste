import { describe, expect, it } from "@jest/globals";

import { UpdatePastePipe } from "./update-paste.pipe.js";

describe("UpdatePastePipe", () => {
  const data = {
    title: "Paste Title",
    content: "Paste Content",
    description: "Paste Description",
    category: "Programming",
    language: "TypeScript",
    password: "",
    tags: ["tag1", "tag2"],
  };

  const pipe = new UpdatePastePipe();

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
    };

    const result = pipe.transform(dto);

    expect(result).toEqual({
      ...dto,
      exposure: value.toUpperCase(),
    });
  });
});
