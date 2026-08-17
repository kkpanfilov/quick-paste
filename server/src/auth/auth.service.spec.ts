import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";

import { jest } from "@jest/globals";
import type { Request } from "express";

import { User } from "../generated/prisma/client.js";
import { CreateUserDto } from "../users/dto/create-user.dto.js";
import { UsersService } from "../users/users.service.js";
import { type AuthService as IAuthService } from "./auth.service.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
import { JwtPayload } from "./types/jwt-payload.type.js";

jest.unstable_mockModule("argon2", () => ({
  verify: jest.fn<(digest: string, password: string) => Promise<boolean>>(),
  hash: jest.fn<(password: string) => Promise<string>>(),
}));

const argon2 = await import("argon2");
const { AuthService } = await import("./auth.service.js");

describe("AuthService", () => {
  const user: User = {
    id: "1",
    username: "test",
    email: "test@example.com",
    description: "test_description",
    passwordHash: "$hashedPassword",
    role: "USER",
    exposure: "PUBLIC",
    refreshTokenHash: "$hashedRefreshToken",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  };

  const loginUserDto: LoginUserDto = {
    email: "test@example.com",
    password: "password",
    remember: false,
  };

  const registerUserDto: RegisterUserDto = {
    username: "test",
    email: "test@example.com",
    password: "password",
  };

  const payload = {
    id: "1",
    username: "test",
    email: "test@example.com",
    role: "USER",
  } as JwtPayload;

  let authService: IAuthService;

  const usersService = {
    create: jest.fn<(createUserDto: CreateUserDto) => Promise<User>>(),
    _byId: jest.fn<(id: string) => Promise<User | null>>(),
    _byEmail: jest.fn<(email: string) => Promise<User | null>>(),
    _byUsername: jest.fn<(username: string) => Promise<User | null>>(),
    updateRefreshTokenHash:
      jest.fn<
        (userId: string, refreshTokenHash: string | null) => Promise<User>
      >(),
  };

  const jwtService = {
    signAsync:
      jest.fn<
        (payload: object, options: { expiresIn: string }) => Promise<string>
      >(),
    verifyAsync:
      jest.fn<(token: string) => Promise<{ id: string; username: string }>>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  describe("Register", () => {
    it("should throw an error if the user with the same email already exists", async () => {
      usersService._byEmail.mockResolvedValue(user);

      await expect(authService.register(registerUserDto)).rejects.toThrow(
        new ConflictException("User already exists"),
      );

      expect(usersService._byEmail).toHaveBeenCalledWith(registerUserDto.email);
    });

    it("should throw an error if the user with the same username already exists", async () => {
      usersService._byEmail.mockResolvedValue(null);
      usersService._byUsername.mockResolvedValue(user);

      await expect(authService.register(registerUserDto)).rejects.toThrow(
        new ConflictException("User already exists"),
      );

      expect(usersService._byEmail).toHaveBeenCalledWith(registerUserDto.email);
      expect(usersService._byUsername).toHaveBeenCalledWith(
        registerUserDto.username,
      );
    });

    it("should create a new user", async () => {
      usersService._byEmail.mockResolvedValue(null);
      usersService._byUsername.mockResolvedValue(null);

      jest.mocked(argon2.hash).mockResolvedValueOnce("$hashedPassword");
      jest.mocked(argon2.hash).mockResolvedValueOnce("$hashedRefreshToken");

      jwtService.signAsync
        .mockResolvedValueOnce("accessToken")
        .mockResolvedValueOnce("refreshToken");

      usersService.create.mockResolvedValue(user);

      await expect(authService.register(registerUserDto)).resolves.toEqual({
        id: user.id,
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      expect(jest.mocked(argon2.hash)).toHaveBeenNthCalledWith(
        1,
        registerUserDto.password,
      );

      expect(jest.mocked(argon2.hash)).toHaveBeenNthCalledWith(
        2,
        "refreshToken",
      );

      expect(jest.mocked(argon2.hash)).toHaveBeenCalledTimes(2);

      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, payload, {
        expiresIn: "30m",
      });

      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, payload, {
        expiresIn: "30d",
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

      expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
        user.id,
        "$hashedRefreshToken",
      );
    });
  });

  describe("Login", () => {
    it("should throw an error if the user doesn't exist", async () => {
      usersService._byEmail.mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException("Invalid password or email"),
      );

      expect(usersService._byEmail).toHaveBeenCalledWith(loginUserDto.email);
    });

    it("should throw an error if the password is incorrect", async () => {
      usersService._byEmail.mockResolvedValue(user);

      jest.mocked(argon2.verify).mockResolvedValue(false);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException("Invalid password or email"),
      );

      expect(usersService._byEmail).toHaveBeenCalledWith(loginUserDto.email);

      expect(argon2.verify).toHaveBeenCalledWith(
        user.passwordHash,
        loginUserDto.password,
      );
    });

    it.each([
      { remember: false, expectedExpiration: "12h" },
      { remember: true, expectedExpiration: "30d" },
    ])(
      "should return accessToken and refreshToken ($expectedExpiration if remember is $remember)",
      async ({ remember, expectedExpiration }) => {
        usersService._byEmail.mockResolvedValue(user);
        jest.mocked(argon2.verify).mockResolvedValue(true);

        jwtService.signAsync
          .mockResolvedValueOnce("accessToken")
          .mockResolvedValueOnce("refreshToken");

        jest.mocked(argon2.hash).mockResolvedValue("$hashedRefreshToken");

        const result = await authService.login({
          ...loginUserDto,
          remember,
        });

        expect(result).toEqual({
          id: user.id,
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        });

        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };

        expect(usersService._byEmail).toHaveBeenCalledWith(loginUserDto.email);

        expect(argon2.verify).toHaveBeenCalledWith(
          user.passwordHash,
          loginUserDto.password,
        );

        expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, payload, {
          expiresIn: "30m",
        });

        expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, payload, {
          expiresIn: expectedExpiration,
        });

        expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

        expect(argon2.hash).toHaveBeenCalledWith("refreshToken");

        expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
          user.id,
          "$hashedRefreshToken",
        );
      },
    );
  });

  describe("Logout", () => {
    const request = {
      cookies: { refreshToken: "refreshToken" },
    } as unknown as Request;

    beforeEach(() => {
      jwtService.verifyAsync.mockResolvedValue(payload);
    });

    it.each([
      ["null", null],
      ["undefined", undefined],
      ["a number", 1],
      ["a string", "test"],
      ["a boolean", true],
      ["an array", []],
      ["an empty object", {}],
      ["a non-empty but invalid object", { id: "1" }],
    ])("should throw error if the input is %s", async (_description, value) => {
      // @ts-expect-error Testing runtime protection against invalid input
      await expect(authService.logout(value)).rejects.toThrow(
        new UnauthorizedException("Refresh token not found"),
      );
    });

    it("should throw error if the user doesn't exist", async () => {
      usersService._byId.mockResolvedValue(null);

      await expect(authService.logout(request)).rejects.toThrow(
        new UnauthorizedException("User not found"),
      );
    });

    it("should throw error if refreshTokenHash is not found", async () => {
      usersService._byId.mockResolvedValue({ ...user, refreshTokenHash: null });

      await expect(authService.logout(request)).rejects.toThrow(
        new UnauthorizedException("Refresh token not found"),
      );
    });

    it("should throw error if refresh token is invalid", async () => {
      usersService._byId.mockResolvedValue(user);
      jest.mocked(argon2.verify).mockResolvedValue(false);

      await expect(authService.logout(request)).rejects.toThrow(
        new UnauthorizedException("Invalid refresh token"),
      );
    });

    it("should logout the user", async () => {
      usersService._byId.mockResolvedValue(user);
      jest.mocked(argon2.verify).mockResolvedValue(true);

      await expect(authService.logout(request)).resolves.toEqual({
        success: true,
        message: "Logout successful",
      });

      expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
        user.id,
        null,
      );

      expect(usersService._byId).toHaveBeenCalledWith(user.id);
    });
  });

  describe("Refresh", () => {
    const request = {
      cookies: { refreshToken: "refreshToken" },
    } as unknown as Request;

    beforeEach(() => {
      jwtService.verifyAsync.mockResolvedValue(payload);
    });

    it.each([
      ["null", null],
      ["undefined", undefined],
      ["a number", 1],
      ["a string", "test"],
      ["a boolean", true],
      ["an array", []],
      ["an empty object", {}],
      ["a non-empty but invalid object", { id: "1" }],
    ])("should throw error if the input is %s", async (_description, value) => {
      // @ts-expect-error Testing runtime protection against invalid input
      await expect(authService.logout(value)).rejects.toThrow(
        new UnauthorizedException("Refresh token not found"),
      );
    });

    it("should throw error if the user doesn't exist", async () => {
      usersService._byId.mockResolvedValue(null);

      await expect(authService.logout(request)).rejects.toThrow(
        new UnauthorizedException("User not found"),
      );
    });

    it("should throw error if refreshTokenHash is not found", async () => {
      usersService._byId.mockResolvedValue({ ...user, refreshTokenHash: null });

      await expect(authService.logout(request)).rejects.toThrow(
        new UnauthorizedException("Refresh token not found"),
      );
    });

    it("should throw error if refresh token is invalid", async () => {
      usersService._byId.mockResolvedValue(user);
      jest.mocked(argon2.verify).mockResolvedValue(false);

      await expect(authService.logout(request)).rejects.toThrow(
        new UnauthorizedException("Invalid refresh token"),
      );
    });

    it("should refresh the access token", async () => {
      usersService._byId.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValue("accessToken");
      jest.mocked(argon2.verify).mockResolvedValue(true);

      await expect(authService.refresh(request)).resolves.toEqual({
        id: user.id,
        accessToken: "accessToken",
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        expiresIn: "30m",
      });

      expect(usersService._byId).toHaveBeenCalledWith(user.id);
    });
  });
});
