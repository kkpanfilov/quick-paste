import { Injectable, NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "../../auth/types/jwt-payload.type.js";
import { UsersService } from "../users.service.js";

@Injectable()
export class LastActiveMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next();
    }

    const user: JwtPayload = req.user;

    try {
      await this.usersService.touchLastActive(user.id);
    } catch {
      return next();
    }

    return next();
  }
}
