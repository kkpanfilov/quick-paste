import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { jest } from "@jest/globals";
import argon2 from "argon2";
import { Request } from "express";

import { AuthService } from "../../../src/auth/auth.service.js";
import { PrismaService } from "../../../src/prisma/prisma.service.js";
import { RedisService } from "../../../src/redis/redis.service.js";
import { UsersService } from "../../../src/users/users.service.js";

type Payload = {
  id: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

describe("AuthService integration", () => {
  let moduleRef: TestingModule;
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const RegisterUserDto = {
    username: "test",
    email: "test@example.com",
    password: "password",
  };

  const redisServiceStub = {
    getCache: jest.fn(),
    setCache: jest.fn(),
    delCache: jest.fn(),
    mdelCache: jest.fn(),
    getKeysByPattern: jest.fn(),
  };

  beforeAll(async () => {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("NODE_ENV must be test");
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL must be defined");
    }

    const databaseName = new URL(databaseUrl).pathname.slice(1);

    if (databaseName !== "quick-paste-test") {
      throw new Error("DATABASE_URL must point to the test database");
    }

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>("JWT_SECRET"),
          }),
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        PrismaService,
        {
          provide: RedisService,
          useValue: redisServiceStub,
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();

    await prisma.$disconnect();
    await moduleRef.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it("should register a user", async () => {
    const result = await service.register(RegisterUserDto);

    expect(result).toEqual({
      id: expect.any(String) as string,
      accessToken: expect.any(String) as string,
      refreshToken: expect.any(String) as string,
    });

    expect(await jwtService.verifyAsync(result.accessToken)).toEqual({
      id: result.id,
      username: RegisterUserDto.username,
      email: RegisterUserDto.email,
      role: "USER",
      iat: expect.any(Number) as number,
      exp: expect.any(Number) as number,
    });

    expect(await jwtService.verifyAsync(result.refreshToken)).toEqual({
      id: result.id,
      username: RegisterUserDto.username,
      email: RegisterUserDto.email,
      role: "USER",
      iat: expect.any(Number) as number,
      exp: expect.any(Number) as number,
    });

    const accessPayload = await jwtService.verifyAsync<Payload>(
      result.accessToken,
    );
    const refreshPayload = await jwtService.verifyAsync<Payload>(
      result.refreshToken,
    );

    expect(accessPayload.exp - accessPayload.iat).toBe(30 * 60);
    expect(refreshPayload.exp - refreshPayload.iat).toBe(30 * 24 * 60 * 60);

    const user = await prisma.user.findUnique({
      where: { id: result.id },
    });

    expect(user).not.toBeNull();
    expect(user!.refreshTokenHash).not.toBeNull();

    expect(
      await argon2.verify(user!.refreshTokenHash!, result.refreshToken),
    ).toBe(true);
    expect(
      await argon2.verify(user!.passwordHash, RegisterUserDto.password),
    ).toBe(true);
  });

  it("should login a user", async () => {
    await prisma.user.create({
      data: {
        email: RegisterUserDto.email,
        username: RegisterUserDto.username,
        passwordHash: await argon2.hash(RegisterUserDto.password),
      },
    });

    const result = await service.login({
      email: RegisterUserDto.email,
      password: RegisterUserDto.password,
      remember: true,
    });

    expect(result).toEqual({
      id: expect.any(String) as string,
      accessToken: expect.any(String) as string,
      refreshToken: expect.any(String) as string,
    });

    expect(await jwtService.verifyAsync(result.accessToken)).toEqual({
      id: result.id,
      username: RegisterUserDto.username,
      email: RegisterUserDto.email,
      role: "USER",
      iat: expect.any(Number) as number,
      exp: expect.any(Number) as number,
    });

    expect(await jwtService.verifyAsync(result.refreshToken)).toEqual({
      id: result.id,
      username: RegisterUserDto.username,
      email: RegisterUserDto.email,
      role: "USER",
      iat: expect.any(Number) as number,
      exp: expect.any(Number) as number,
    });

    const accessPayload = await jwtService.verifyAsync<Payload>(
      result.accessToken,
    );
    const refreshPayload = await jwtService.verifyAsync<Payload>(
      result.refreshToken,
    );

    expect(accessPayload.exp - accessPayload.iat).toBe(30 * 60);
    expect(refreshPayload.exp - refreshPayload.iat).toBe(30 * 24 * 60 * 60);

    const user = await prisma.user.findUnique({
      where: { id: result.id },
    });

    expect(user).not.toBeNull();
    expect(user!.refreshTokenHash).not.toBeNull();

    expect(
      await argon2.verify(user!.refreshTokenHash!, result.refreshToken),
    ).toBe(true);
  });

  it("should logout a user", async () => {
    const {
      id: userId,
      accessToken: _accessToken,
      refreshToken,
    } = await service.register(RegisterUserDto);

    const request = {
      cookies: { refreshToken: refreshToken },
    } as unknown as Request;

    const logoutResult = await service.logout(request);

    expect(logoutResult).toEqual({
      success: true,
      message: "Logout successful",
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(user).not.toBeNull();
    expect(user!.refreshTokenHash).toBeNull();
  });

  it("should refresh a user", async () => {
    const {
      id: userId,
      accessToken,
      refreshToken,
    } = await service.register(RegisterUserDto);

    const request = {
      cookies: { refreshToken: refreshToken },
    } as unknown as Request;

    const refreshResult = await service.refresh(request);

    expect(refreshResult).toEqual({
      id: userId,
      accessToken: expect.any(String) as string,
    });

    expect(await jwtService.verifyAsync(refreshResult.accessToken)).toEqual({
      id: userId,
      username: RegisterUserDto.username,
      email: RegisterUserDto.email,
      role: "USER",
      iat: expect.any(Number) as number,
      exp: expect.any(Number) as number,
    });

    const prevAccessTokenPayload =
      await jwtService.verifyAsync<Payload>(accessToken);

    const newAccessTokenPayload = await jwtService.verifyAsync<Payload>(
      refreshResult.accessToken,
    );

    expect(prevAccessTokenPayload.exp - prevAccessTokenPayload.iat).toBe(
      30 * 60,
    );
    expect(newAccessTokenPayload.exp - newAccessTokenPayload.iat).toBe(30 * 60);
  });
});
