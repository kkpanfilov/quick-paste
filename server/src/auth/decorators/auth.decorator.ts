import { UseGuards, applyDecorators } from "@nestjs/common";

import { UserRole } from "../../generated/prisma/enums.js";
import { AuthorizedGuard } from "../guards/authorized.guard.js";

export function Auth(role?: UserRole) {
  switch (role) {
    case UserRole.SUPPORT:
      return applyDecorators(UseGuards(AuthorizedGuard));
    case UserRole.ADMIN:
      return applyDecorators(UseGuards(AuthorizedGuard));
    default:
      return applyDecorators(UseGuards(AuthorizedGuard));
  }
}
