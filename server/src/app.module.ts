import { MiddlewareConsumer, Module } from "@nestjs/common";
import { NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module.js";
import { UserMiddleware } from "./auth/middlewares/user.middleware.js";
import { CommentsModule } from "./comments/comments.module.js";
import { envSchema } from "./config/env-schema.js";
import { PastesModule } from "./pastes/pastes.module.js";
import { PrismaService } from "./prisma/prisma.service.js";
import { RedisModule } from "./redis/redis.module.js";
import { LastActiveMiddleware } from "./users/middlewares/last-active.middleware.js";
import { UsersModule } from "./users/users.module.js";

const isProduction = process.env.NODE_ENV === "production";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProduction ? undefined : "../.env.dev",
      ignoreEnvFile: isProduction,
      validate: (config) => envSchema.parse(config),
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    PastesModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware, LastActiveMiddleware).forRoutes("*");
  }
}
