import { Module } from "@nestjs/common";

import { CommentsModule } from "../comments/comments.module.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { UsersModule } from "../users/users.module.js";
import { PastesController } from "./pastes.controller.js";
import { PastesService } from "./pastes.service.js";

@Module({
  controllers: [PastesController],
  imports: [CommentsModule, UsersModule],
  providers: [PastesService, PrismaService],
})
export class PastesModule {}
