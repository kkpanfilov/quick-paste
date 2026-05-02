import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
