import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { CommentsController } from "./comments.controller.js";
import { CommentsService } from "./comments.service.js";

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}
