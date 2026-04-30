import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() registerUserDto: RegisterUserDto): Promise<any> {
    return this.authService.register(registerUserDto);
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
