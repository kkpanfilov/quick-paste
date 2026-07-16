import { Global, Logger, Module } from "@nestjs/common";

import { Redis } from "ioredis";

import { REDIS_CLIENT } from "./redis.constants.js";
import { RedisService } from "./redis.service.js";

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const logger = new Logger("Redis");

        const client = new Redis({
          host:
            process.env.NODE_ENV === "production"
              ? process.env.REDIS_HOST || "redis"
              : process.env.REDIS_HOST || "localhost",
          port: Number.parseInt(process.env.REDIS_PORT ?? "6379", 10),
          maxRetriesPerRequest: 3,
          connectTimeout: 5000,
          commandTimeout: 2000,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        client.on("error", (error) => {
          logger.error(`Redis connection error: ${error.message}`, error.stack);
        });

        client.on("ready", () => {
          logger.log("Redis connection ready");
        });

        client.on("reconnecting", (delay: number) => {
          logger.warn(`Redis reconnecting in ${delay}ms`);
        });

        return client;
      },
    },
  ],
  exports: [RedisService, REDIS_CLIENT],
})
export class RedisModule {}
