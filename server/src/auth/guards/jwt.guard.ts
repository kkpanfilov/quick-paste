import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtPayload } from "../types/jwt-payload.type.js";

type RequestWithUser = Request & {
  user?: JwtPayload;
};

const NO_TOKEN_MESSAGE = "Access token is missing";
const INVALID_TOKEN_MESSAGE = "Access token is invalid";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(NO_TOKEN_MESSAGE);
    }

    try {
      const payload: JwtPayload | null =
        await this.jwtService.verifyAsync(token);

      if (!payload) {
        throw new UnauthorizedException(INVALID_TOKEN_MESSAGE);
      }

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(INVALID_TOKEN_MESSAGE);
    }
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.get("Authorization");

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
