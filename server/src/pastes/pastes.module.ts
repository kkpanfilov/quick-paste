import { Module } from "@nestjs/common";

import { PastesController } from "./pastes.controller.js";
import { PastesService } from "./pastes.service.js";

@Module({
  controllers: [PastesController],
  providers: [PastesService],
})
export class PastesModule {}
