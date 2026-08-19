import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { Request } from "express";

import { JwtPayload } from "../types/jwt-payload.type.js";

type RequestWithUser = Request & {
  user?: JwtPayload;
};

export const User = createParamDecorator(
  (param: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) return null;

    return param ? user[param] : user;
  },
);
