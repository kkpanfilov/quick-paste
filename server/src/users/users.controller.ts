import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Res,
} from "@nestjs/common";

import type { Response } from "express";

import { Auth } from "../auth/decorators/auth.decorator.js";
import { User } from "../auth/decorators/user.decorator.js";
import { Message } from "../auth/types/message.type.js";
import { TrimPipe } from "../common/pipes/trim.pipe.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async create(
    @Body(new TrimPipe(["username", "email"])) createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Get(":id")
  async getUser(
    @Param("id") userId: string,
    @User("id") currentUserId: string | undefined,
  ) {
    return await this.usersService.getUser(userId, currentUserId);
  }

  @Patch(":id")
  @Auth()
  async update(
    @Param("id") id: string,
    @User("id") userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, userId, updateUserDto);
  }

  @Delete(":id")
  @Auth()
  remove(
    @Param("id") id: string,
    @User("id") userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Message> {
    const message = this.usersService.remove(id, userId);

    response.clearCookie("refreshToken");

    return message;
  }
}
