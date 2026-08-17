import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";

import { LoginUserDto } from "./login-user.dto.js";

describe("LoginUserDto", () => {
  const validInput = {
    email: "user@example.com",
    password: "Password1!",
    remember: true,
  };

  const requiredFields = ["email", "password", "remember"] as const;

  async function validateDto(
    input: Record<string, unknown>,
  ): Promise<ValidationError[]> {
    const dto = plainToInstance(LoginUserDto, input);

    return validate(dto);
  }

  function getMessages(
    errors: ValidationError[],
    property: keyof LoginUserDto,
  ): string[] {
    const error = errors.find((item) => item.property === property);

    return Object.values(error?.constraints ?? {});
  }

  it.each(requiredFields)("should reject if %s is missing", async (field) => {
    const input: Partial<typeof validInput> = { ...validInput };

    delete input[field];

    const errors = await validateDto(input);

    expect(errors).toHaveLength(1);
    expect(getMessages(errors, field)).not.toHaveLength(0);
  });

  describe("email", () => {
    it("should trim the email", async () => {
      const input = {
        ...validInput,
        email: "  user@example.com  ",
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(0);
    });

    it.each([
      ["null", null],
      ["a number", 1],
      ["a boolean", true],
      ["an array", []],
      ["an object", {}],
    ])("should reject if email is %s", async (_description, value) => {
      const input = {
        ...validInput,
        email: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "email")).not.toHaveLength(0);
    });

    it.each([
      ["less than 6 characters", "t@t.t"],
      [
        "more than 50 characters",
        "testtesttesttesttesttesttesttesttesttesttest@test.com",
      ],
    ])("should reject if email is %s", async (_description, value) => {
      const input = {
        ...validInput,
        email: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "email")).toContain(
        "Email must be at least 6 characters long and no more than 50",
      );
    });

    it.each([
      ["is an empty string", ""],
      ["don't have the @ symbol", "test"],
      ["don't have a domain", "test@"],
      ["don't have a top-level domain", "test@example."],
    ])("should reject if email %s", async (_description, value) => {
      const input = {
        ...validInput,
        email: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "email")).toContain("Email is not valid");
    });
  });

  describe("password", () => {
    it.each([
      ["null", null],
      ["a number", 1],
      ["a boolean", true],
      ["an array", []],
      ["an object", {}],
    ])("should reject if password is %s", async (_description, value) => {
      const input = {
        ...validInput,
        password: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "password")).not.toHaveLength(0);
    });

    it.each([
      ["less than 8 characters", "Pass"],
      [
        "more than 64 characters",
        "PassPassPassPassPassPassPassPassPassPassPassPassPassPassPassPass1",
      ],
    ])("should reject if password is %s", async (_description, value) => {
      const input = {
        ...validInput,
        password: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "password")).toContain(
        "Password must be at least 8 characters long and no more than 64 characters",
      );
    });
  });

  describe("remember", () => {
    it.each([
      ["null", null],
      ["a number", 1],
      ["a string", "string"],
      ["an array", []],
      ["an object", {}],
    ])("should reject if remember is %s", async (_description, value) => {
      const input = {
        ...validInput,
        remember: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "remember")).toEqual([
        "Remember must be a boolean",
      ]);
    });
  });

  it("should be valid", async () => {
    const errors = await validateDto(validInput);

    expect(errors).toHaveLength(0);
  });
});
