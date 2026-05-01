import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";
import type { Request } from "express";

import { UsersService } from "../users/users.service.js";
import { AuthResponseDto } from "./dto/auth-response.dto.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
import { JwtPayload } from "./types/jwt-payload.type.js";
import { Message } from "./types/message.type.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const passwordHash = await argon2.hash(registerUserDto.password);

    const user = await this.usersService.create({
      username: registerUserDto.username,
      email: registerUserDto.email,
      passwordHash: passwordHash,
    });

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "30m",
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "15d",
    });

    await this.usersService.updateRefreshTokenHash(
      user.id,
      await argon2.hash(refreshToken),
    );

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const UNAUTHORIZED_ERROR_MESSAGE = "Invalid password or email";

    const user = await this.usersService.findOneByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException(UNAUTHORIZED_ERROR_MESSAGE);
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      loginUserDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(UNAUTHORIZED_ERROR_MESSAGE);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "30m",
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "15d",
    });

    await this.usersService.updateRefreshTokenHash(
      user.id,
      await argon2.hash(refreshToken),
    );

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async logout(request: Request): Promise<Message> {
    const refreshToken = this.getRefreshToken(request);
    const payload = await this.getPayload(refreshToken);

    const user = await this.usersService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshTokenHash,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.usersService.updateRefreshTokenHash(user.id, null);

    return {
      success: true,
      message: "Logout successful",
    };
  }

  async refresh(request: Request): Promise<AuthResponseDto> {
    const refreshToken = this.getRefreshToken(request);
    const payload = await this.getPayload(refreshToken);

    const user = await this.usersService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshTokenHash,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "30m",
    });

    return {
      id: user.id,
      accessToken,
    };
  }

  private getRefreshToken(request: Request): string {
    const cookies: unknown = request.cookies;

    if (!cookies || typeof cookies !== "object") {
      throw new UnauthorizedException("Refresh token not found");
    }

    const refreshToken = (cookies as Record<string, unknown>).refreshToken;

    if (typeof refreshToken !== "string") {
      throw new UnauthorizedException("Refresh token not found");
    }

    return refreshToken;
  }

  private async getPayload(refreshToken: string): Promise<JwtPayload> {
    const jwtPayload: JwtPayload | null = await this.jwtService
      .verifyAsync(refreshToken)
      .then((payload) => payload as JwtPayload)
      .catch(() => null);

    if (jwtPayload === null) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const payload: JwtPayload = {
      id: jwtPayload.id,
      username: jwtPayload.username,
      email: jwtPayload.email,
      role: jwtPayload.role,
    };

    return payload;
  }
}
