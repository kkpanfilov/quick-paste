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
  @Auth()
  async findOne(@Param("id") id: string) {
    return await this.pastesService.findOne(id);
  }

  @Patch(":id")
  @Auth()
  update(@Param("id") id: string, @Body() updatePasteDto: UpdatePasteDto) {
    return this.pastesService.update(+id, updatePasteDto);
  }

  @Delete(":id")
  @Auth()
  remove(@Param("id") id: string) {
    return this.pastesService.remove(+id);
  }
}
