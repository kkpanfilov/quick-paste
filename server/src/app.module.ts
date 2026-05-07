import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module.js";
import { PastesModule } from "./pastes/pastes.module.js";
import { PrismaService } from "./prisma/prisma.service.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [AuthModule, UsersModule, PastesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
