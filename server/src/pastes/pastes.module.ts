import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { UsersModule } from "../users/users.module.js";
import { PastesController } from "./pastes.controller.js";
import { PastesService } from "./pastes.service.js";

@Module({
  controllers: [PastesController],
  imports: [UsersModule],
  providers: [PastesService, PrismaService],
  exports: [PastesService],
})
export class PastesModule {}
