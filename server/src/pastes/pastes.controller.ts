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
  create(
    @Body(new ExpirationPipe()) createPasteDto: CreatePasteServiceDto,
    @User("id") authorId: string,
  ) {
    return this.pastesService.create({
      ...createPasteDto,
      authorId,
    });
  }

  @Get(":id")
  @Auth()
  findOne(@Param("id") id: string) {
    return this.pastesService.findOne(+id);
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
