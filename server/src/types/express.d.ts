// src/types/express.d.ts
import type { JwtPayload } from "../auth/types/jwt-payload.type.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
