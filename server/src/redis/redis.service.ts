import { Inject, Injectable, Logger } from "@nestjs/common";

import type { Redis } from "ioredis";

import { REDIS_CLIENT } from "./redis.constants.js";

const DEFAULT_TTL_MS = 60_000;

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  private readonly logger = new Logger(RedisService.name);

  async setCache(
    key: string,
    value: string | object,
    ttlMs: number = DEFAULT_TTL_MS,
  ): Promise<string | null> {
    try {
      if (typeof value === "object") value = JSON.stringify(value);

      return await this.redisClient.set(key, value, "PX", ttlMs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(`Redis SET failed for key "${key}": ${message}`);

      return null;
    }
  }

  async getCache<T extends object>(key: string): Promise<T | null> {
    try {
      const result = await this.redisClient.get(key);

      if (result === null) return null;

      const parsed = JSON.parse(result) as unknown;

      if (typeof parsed === "object") return parsed as T;

      return null;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(
        `Redis GET failed for key "${key}"; falling back to database: ${message}`,
      );

      return null;
    }
  }

  async delCache(key: string): Promise<number | null> {
    try {
      const result = await this.redisClient.del(key);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(`Redis DEL failed for key "${key}": ${message}`);

      return null;
    }
  }

  async mdelCache(keys: string[]): Promise<number | null> {
    try {
      if (keys.length === 0) return 0;

      return await this.redisClient.del(...keys);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(
        `Redis DEL failed for keys "${keys.join(",")}": ${message}`,
      );

      return null;
    }
  }

  async getKeysByPattern(pattern: string): Promise<string[] | null> {
    const keys: string[] = [];
    let cursor = "0";

    try {
      do {
        const [nextCursor, batch] = await this.redisClient.scan(
          cursor,
          "MATCH",
          pattern,
        );

        cursor = nextCursor;
        keys.push(...batch);
      } while (cursor !== "0");

      return keys;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(
        `Redis SCAN failed for pattern "${pattern}": ${message}`,
      );

      return null;
    }
  }
}
