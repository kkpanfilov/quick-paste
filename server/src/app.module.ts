import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { NestModule } from "@nestjs/common";

import KeyvRedis from "@keyv/redis";

import { AuthModule } from "./auth/auth.module.js";
import { UserMiddleware } from "./auth/middlewares/user.middleware.js";
import { CommentsModule } from "./comments/comments.module.js";
import { PastesModule } from "./pastes/pastes.module.js";
import { PrismaService } from "./prisma/prisma.service.js";
import { LastActiveMiddleware } from "./users/middlewares/last-active.middleware.js";
import { UsersModule } from "./users/users.module.js";

// TODO: implement configModule
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PastesModule,
    CommentsModule,
    CacheModule.register({
      isGlobal: true,
      stores: [new KeyvRedis(process.env.REDIS_URL as string)],
      ttl: Number(process.env.CACHE_TTL ?? 60) * 1000,
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware, LastActiveMiddleware).forRoutes("*");
  }
}
