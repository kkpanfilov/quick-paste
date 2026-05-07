import { Module } from "@nestjs/common";

import { JwtGuard } from "../auth/guards/jwt.guard.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtGuard],
  exports: [UsersService],
})
export class UsersModule {}
