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
import { CreatePasteDto } from "./dto/create-paste.dto.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { PastesService } from "./pastes.service.js";

@Controller("pastes")
export class PastesController {
  constructor(private readonly pastesService: PastesService) {}

  @Post()
  @Auth()
  create(@Body() createPasteDto: CreatePasteDto) {
    return this.pastesService.create(createPasteDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.pastesService.findAll();
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
