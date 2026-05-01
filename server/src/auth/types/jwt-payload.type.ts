import type { UserRole } from "../../generated/prisma/client.js";

export type JwtPayload = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
};
