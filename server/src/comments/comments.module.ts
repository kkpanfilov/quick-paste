import { Module } from "@nestjs/common";

import { PastesModule } from "../pastes/pastes.module.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CommentsController } from "./comments.controller.js";
import { CommentsService } from "./comments.service.js";

@Module({
  imports: [PastesModule],
  controllers: [CommentsController],
  exports: [CommentsService],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}
