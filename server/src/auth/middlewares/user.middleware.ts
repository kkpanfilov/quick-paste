import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "../types/jwt-payload.type.js";

type RequestWithUser = Request & {
  user?: JwtPayload;
};

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

        if (payload) {
          req.user = payload;
        }
      } catch {
        next();
      }
    }

    next();
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer") {
      return undefined;
    }

    return token;
  }
}
