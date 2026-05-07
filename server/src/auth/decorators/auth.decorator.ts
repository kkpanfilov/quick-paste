import { UseGuards, applyDecorators } from "@nestjs/common";

import { UserRole } from "../../generated/prisma/enums.js";
import { JwtGuard } from "../guards/jwt.guard.js";

export function Auth(role?: UserRole) {
  switch (role) {
    case UserRole.SUPPORT:
      return applyDecorators(UseGuards(JwtGuard));
    case UserRole.ADMIN:
      return applyDecorators(UseGuards(JwtGuard));
    default:
      return applyDecorators(UseGuards(JwtGuard));
  }
}
