import { Module } from "@nestjs/common";

import { AuthorizedGuard } from "../auth/guards/authorized.guard.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuthorizedGuard],
  exports: [UsersService],
})
export class UsersModule {}
