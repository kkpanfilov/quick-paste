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
import { TrimPipe } from "../common/pipes/trim.pipe.js";
import { PastesService } from "./pastes.service.js";
import {
  CreatePastePipe,
  type CreatePasteServiceDto,
} from "./pipes/create-paste.pipe.js";
import {
  UpdatePastePipe,
  type UpdatePasteServiceDto,
} from "./pipes/update-paste.pipe.js";
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
    @Body(new TrimPipe(["title", "password"]), new CreatePastePipe())
    createPasteDto: CreatePasteServiceDto,
    @User("id") authorId: string,
  ) {
    return await this.pastesService.create(createPasteDto, authorId);
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
    @User("id") userId: string | null,
    @Req() request: Request,
  ) {
    return await this.pastesService.findOne(id, userId, request);
  }

  @Post(":id/like")
  @Auth()
  async like(
    @Param("id") id: string,
    @User("id") userId: string,
    @Req() request: Request,
  ) {
    return await this.pastesService.like(id, userId, request);
  }

  @Post(":id/unlike")
  @Auth()
  async unlike(
    @Param("id") id: string,
    @User("id") userId: string,
    @Req() request: Request,
  ) {
    return await this.pastesService.unlike(id, userId, request);
  }

  @Post(":id/unlock")
  async unlockPaste(
    @Param("id") id: string,
    @User("id") userId: string | null,
    @Body("password", new TrimPipe(["password"])) password: Password,
    @Res({ passthrough: true }) res: Response,
  ) {
    const paste = await this.pastesService.findOne(id, userId, null, password);

    const isAuth = userId ? true : false;

    const token = this.jwtService.sign(
      { pasteId: id, userId: isAuth ? userId : null },
      { expiresIn: isAuth ? "7d" : "5m" },
    );

    res.cookie(`paste_access_${id}`, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: isAuth ? 7 * 24 * 60 * 60 * 1000 : 5 * 60 * 1000,
      path: `/api/`,
    });

    return paste;
  }

  @Patch(":id")
  @Auth()
  async update(
    @Param("id") id: string,
    @User("id") authorId: string,
    @Req() request: Request,
    @Body(new UpdatePastePipe())
    updatePasteDto: UpdatePasteServiceDto,
  ) {
    return await this.pastesService.update(
      id,
      authorId,
      request,
      updatePasteDto,
    );
  }

  @Delete(":id")
  @Auth()
  async remove(@Param("id") id: string, @User("id") authorId: string) {
    return await this.pastesService.remove(id, authorId);
  }

  @Get("search/:query")
  async search(@Param("query") query: string, @Query("page") page: number) {
    return await this.pastesService.search(query, page);
  }
}
