import { ValidationError } from "@nestjs/common";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { RegisterUserDto } from "./register-user.dto.js";

describe("RegisterUserDto", () => {
  const validInput = {
    email: "user@example.com",
    username: "username",
    password: "Password1!",
  };

  const requiredFields = ["email", "username", "password"] as const;

  async function validateDto(
    input: Record<string, unknown>,
  ): Promise<ValidationError[]> {
    const dto = plainToInstance(RegisterUserDto, input);

    return validate(dto);
  }

  function getMessages(
    errors: ValidationError[],
    property: keyof RegisterUserDto,
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

  describe("username", () => {
    it("should trim the username", async () => {
      const input = {
        ...validInput,
        username: "  username  ",
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
    ])("should reject if username is %s", async (_description, value) => {
      const input = {
        ...validInput,
        username: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "username")).not.toHaveLength(0);
    });

    it.each([
      ["less than 4 characters", "abc"],
      ["more than 20 characters", "usernameusernameusername"],
    ])("should reject if username is %s", async (_description, value) => {
      const input = {
        ...validInput,
        username: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "username")).toContain(
        "Username must be at least 4 characters long and no more than 20",
      );
    });
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
      ["less than 8 characters", "Pass1!"],
      [
        "more than 64 characters",
        "PassPassPassPassPassPassPassPassPassPassPassPassPassPassPassPass1!",
      ],
    ])("should reject if password is %s", async (_description, value) => {
      const input = {
        ...validInput,
        password: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "password")).toEqual(
        expect.arrayContaining([
          "Password must be at least 8 characters long and no more than 64 characters",
        ]),
      );
    });

    it.each([
      ["don't have an uppercase letter", "passpasspass1!"],
      ["don't have a lowercase letter", "PASSPASSPASS1!"],
      ["don't have a number", "Password!"],
      ["don't have a special character", "Password1"],
    ])("should reject if password %s", async (_description, value) => {
      const input = {
        ...validInput,
        password: value,
      };

      const errors = await validateDto(input);

      expect(errors).toHaveLength(1);
      expect(getMessages(errors, "password")).toContain(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      );
    });

    it("should be valid", async () => {
      const errors = await validateDto(validInput);

      expect(errors).toHaveLength(0);
    });
  });
});
