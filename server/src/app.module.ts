import { MiddlewareConsumer, Module } from "@nestjs/common";
import { NestModule } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module.js";
import { UserMiddleware } from "./auth/middlewares/user.middleware.js";
import { CommentsModule } from "./comments/comments.module.js";
import { PastesModule } from "./pastes/pastes.module.js";
import { PrismaService } from "./prisma/prisma.service.js";
import { RedisModule } from "./redis/redis.module.js";
import { LastActiveMiddleware } from "./users/middlewares/last-active.middleware.js";
import { UsersModule } from "./users/users.module.js";

// TODO: implement configModule
// TODO: make docker dev start only redis and postgres
@Module({
  imports: [RedisModule, AuthModule, UsersModule, PastesModule, CommentsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware, LastActiveMiddleware).forRoutes("*");
  }
}
