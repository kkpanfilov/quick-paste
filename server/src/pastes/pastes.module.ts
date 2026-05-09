import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { PastesController } from "./pastes.controller.js";
import { PastesService } from "./pastes.service.js";

@Module({
  controllers: [PastesController],
  providers: [PastesService, PrismaService],
})
export class PastesModule {}
