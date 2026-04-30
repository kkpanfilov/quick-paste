import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";

import { UsersService } from "../users/users.service.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<any> {
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

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const UNAUTHORIZED_ERROR_MESSAGE = "Invalid password or email";

    const isUserExists = await this.usersService.findOneByEmail(
      loginUserDto.email,
    );

    if (!isUserExists) {
      throw new UnauthorizedException(UNAUTHORIZED_ERROR_MESSAGE);
    }

    const isPasswordValid = await argon2.verify(
      isUserExists.passwordHash,
      loginUserDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(UNAUTHORIZED_ERROR_MESSAGE);
    }

    return {
      id: isUserExists.id,
    };
  }

  logout(dto: any): any {
    return { msg: "Hello World!" };
  }
}
