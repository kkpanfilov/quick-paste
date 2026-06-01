import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import type { Request, Response } from "express";

import { Auth } from "../auth/decorators/auth.decorator.js";
import { User } from "../auth/decorators/user.decorator.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { PastesService } from "./pastes.service.js";
import type { CreatePasteServiceDto } from "./pipes/expiration.pipe.js";
import { ExpirationPipe } from "./pipes/expiration.pipe.js";
import type { Password } from "./types/password.type.js";

@Controller("pastes")
export class PastesController {
  constructor(
    private readonly pastesService: PastesService,
    private readonly jwtService: JwtService,
  ) {}

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
  async findPublic(@Query("page") page: number) {
    return await this.pastesService.findPublic(page);
  }

  @Get("me")
  @Auth()
  async findAuthorPastes(
    @User("id") userId: string,
    @Query("page") page: number,
  ) {
    return await this.pastesService.findAuthorPastes(userId, page);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @User("id") userId: string,
    @Req() request: Request,
    @Body("password") password?: Password,
  ) {
    return await this.pastesService.findOne(id, userId, request, password);
  }

  @Post(":id/unlock")
  async unlockPaste(
    @Param("id") id: string,
    @User("id") userId: string,
    @Body("password") password: Password,
    @Res({ passthrough: true }) res: Response,
  ) {
    const paste = await this.pastesService.findOne(id, userId, null, password);

    const token = this.jwtService.sign(
      { pasteId: id, userId: userId },
      { expiresIn: "7d" },
    );

    res.cookie(`paste_access_${id}`, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: `/api/pastes/${id}`,
    });

    return paste;
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
