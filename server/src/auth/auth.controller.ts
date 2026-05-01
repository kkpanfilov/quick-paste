import { Body, Controller, Post, Req, Res } from "@nestjs/common";

import type { Request, Response } from "express";

import { AuthService } from "./auth.service.js";
import { AuthResponseDto } from "./dto/auth-response.dto.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
import { Message } from "./types/message.type.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.register(registerUserDto);

    response.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return {
      id: user.id,
      accessToken: user.accessToken,
    };
  }

  @Post("login")
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.login(loginUserDto);

    response.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return {
      id: user.id,
      accessToken: user.accessToken,
    };
  }

  // TODO: implement logout
  @Post("logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Message> {
    const message = await this.authService.logout(request);

    response.clearCookie("refreshToken");

    return message;
  }

  @Post("refresh")
  async refresh(@Req() request: Request): Promise<AuthResponseDto> {
    return this.authService.refresh(request);
  }
}
