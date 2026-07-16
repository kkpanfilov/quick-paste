import { Global, Module } from "@nestjs/common";

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
        return new Redis({
          host:
            process.env.NODE_ENV === "production"
              ? process.env.REDIS_HOST || "redis"
              : process.env.REDIS_HOST || "localhost",
          port: Number.parseInt(process.env.REDIS_PORT ?? "6379", 10),
        });
      },
    },
  ],
  exports: [RedisService, REDIS_CLIENT],
})
export class RedisModule {}
