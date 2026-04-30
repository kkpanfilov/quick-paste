import { Body, Controller, Post, Res } from "@nestjs/common";

import type { Response } from "express";

import { AuthService } from "./auth.service.js";
import { AuthResponseDto } from "./dto/auth-response.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";

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
  login(@Body() dto: any): any {
    return this.authService.login(dto);
  }

  @Post("logout")
  logout(@Body() dto: any): any {
    return this.authService.logout(dto);
  }
}
