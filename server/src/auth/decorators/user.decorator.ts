import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { Request } from "express";

import { JwtPayload } from "../types/jwt-payload.type.js";

type RequestWithUser = Request & {
  user?: JwtPayload;
};

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
