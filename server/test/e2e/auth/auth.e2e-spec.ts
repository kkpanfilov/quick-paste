import { Server } from "node:http";

import type { INestApplication } from "@nestjs/common";

import argon2 from "argon2";
import type { Redis } from "ioredis";
import request from "supertest";

import { PrismaService } from "../../../src/prisma/prisma.service.js";
import { REDIS_CLIENT } from "../../../src/redis/redis.constants.js";
import { createTestApp } from "../../helpers/create-test-app.js";

describe("Auth API (E2E)", () => {
  let app: INestApplication<Server>;
  let prisma: PrismaService;
  let redis: Redis;

  const user = {
    username: "test",
    email: "test@example.com",
    password: "Password1!",
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

    app = await createTestApp();

    prisma = app.get(PrismaService);
    redis = app.get<Redis>(REDIS_CLIENT);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await redis.flushdb();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await redis.flushdb();

    await prisma.$disconnect();
    await redis.quit();

    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
    expect(redis).toBeDefined();
  });

  describe("POST api/auth/register", () => {
    it("should return 400 if body is not provided", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/register")
        .send()
        .expect(400)
        .expect("Content-Type", /json/);
    });

    it("should return 400 if body has invalid fields", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/register")
        .send({ ...user, "random-field": true })
        .expect(400)
        .expect("Content-Type", /json/);
    });

    it("should register a user", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/auth/register")
        .send(user)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        id: expect.any(String) as string,
        accessToken: expect.any(String) as string,
      });

      expect(response.headers["set-cookie"]?.[0]).toContain("refreshToken=");
      expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
    });
  });

  describe("POST api/auth/login", () => {
    it("should return 400 if body is not provided", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send()
        .expect(400)
        .expect("Content-Type", /json/);
    });

    it("should return 400 if body has invalid fields", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({ ...user, "random-field": true })
        .expect(400)
        .expect("Content-Type", /json/);
    });

    it("should login a user", async () => {
      await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          passwordHash: await argon2.hash(user.password),
        },
      });

      const response = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: user.password,
          remember: true,
        })
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        id: expect.any(String) as string,
        accessToken: expect.any(String) as string,
      });

      expect(response.headers["set-cookie"]?.[0]).toContain("refreshToken=");
      expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
    });
  });

  describe("POST api/auth/logout", () => {
    it("should return 401 if no refresh token is provided", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/logout")
        .send()
        .expect(401)
        .expect("Content-Type", /json/);
    });

    it("should logout a user", async () => {
      await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          passwordHash: await argon2.hash(user.password),
        },
      });

      const loginResponse = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: user.password,
          remember: true,
        })
        .expect(201)
        .expect("Content-Type", /json/);

      const response = await request(app.getHttpServer())
        .post("/api/auth/logout")
        .set("Cookie", loginResponse.headers["set-cookie"])
        .send()
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        success: true,
        message: "Logout successful",
      });

      expect(response.headers["set-cookie"]?.[0]).toContain("refreshToken=;");
    });
  });

  describe("POST api/auth/refresh", () => {
    it("should return 401 if no refresh token is provided", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/refresh")
        .send()
        .expect(401)
        .expect("Content-Type", /json/);
    });

    it("should refresh a user", async () => {
      await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          passwordHash: await argon2.hash(user.password),
        },
      });

      const loginResponse = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: user.password,
          remember: true,
        })
        .expect(201)
        .expect("Content-Type", /json/);

      const response = await request(app.getHttpServer())
        .post("/api/auth/refresh")
        .set("Cookie", loginResponse.headers["set-cookie"])
        .send()
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        id: expect.any(String) as string,
        accessToken: expect.any(String) as string,
      });
    });
  });
});
