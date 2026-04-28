import * as argon2 from "argon2";

import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const passwordHash = await argon2.hash(registerUserDto.password);

    const user = await this.usersService.create({
      username: registerUserDto.username,
      email: registerUserDto.email,
      passwordHash: passwordHash,
    });

    return {
      id: user.id,
    };
  }

  login(dto: any): any {
    return { msg: "Hello World!" };
  }

  logout(dto: any): any {
    return { msg: "Hello World!" };
  }
}
