import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { Auth } from "../auth/decorators/auth.decorator.js";
import { User } from "../auth/decorators/user.decorator.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { PastesService } from "./pastes.service.js";
import type { CreatePasteServiceDto } from "./pipes/expiration.pipe.js";
import { ExpirationPipe } from "./pipes/expiration.pipe.js";

@Controller("pastes")
export class PastesController {
  constructor(private readonly pastesService: PastesService) {}

  @Post()
  @Auth()
  async create(
    @Body(new ExpirationPipe()) createPasteDto: CreatePasteServiceDto,
    @User("id") authorId: string,
  ) {
    return await this.pastesService.create({
      ...createPasteDto,
      authorId,
    });
  }

  @Get("public")
  async findPublic() {
    return await this.pastesService.findPublic();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.pastesService.findOne(id);
  }

  @Patch(":id")
  @Auth()
  async update(
    @Param("id") id: string,
    @User("id") authorId: string,
    @Body() updatePasteDto: UpdatePasteDto,
  ) {
    return await this.pastesService.update(id, authorId, updatePasteDto);
  }

  @Delete(":id")
  @Auth()
  async remove(@Param("id") id: string, @User("id") authorId: string) {
    return await this.pastesService.remove(id, authorId);
  }
}
