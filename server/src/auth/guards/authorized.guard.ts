import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { Request } from "express";

import { JwtPayload } from "../types/jwt-payload.type.js";

type RequestWithUser = Request & {
  user?: JwtPayload;
};

const UNAUTHORIZED_MESSAGE = "Unauthorized request";

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (request.user) return true;
    else throw new UnauthorizedException(UNAUTHORIZED_MESSAGE);
  }
}
