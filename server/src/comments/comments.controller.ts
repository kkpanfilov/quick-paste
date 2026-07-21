import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { Auth } from "../auth/decorators/auth.decorator.js";
import { User } from "../auth/decorators/user.decorator.js";
import { CommentsService } from "./comments.service.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CreateReplyDto } from "./dto/create-reply.dto.js";
import { extractCursor } from "./utils/extract-cursor.js";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(":paste_id")
  async getPasteComments(
    @Param("paste_id") pasteId: string,
    @Query("cursor") cursorValue?: string,
  ) {
    const cursor = extractCursor(cursorValue);

    return await this.commentsService.getPasteComments(pasteId, cursor);
  }

  @Post(":paste_id")
  @Auth()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param("paste_id") pasteId: string,
    @User("id") authorId: string,
  ) {
    return await this.commentsService.create(
      createCommentDto,
      pasteId,
      authorId,
    );
  }

  @Post(":paste_id/reply")
  @Auth()
  async reply(
    @Body() createCommentDto: CreateReplyDto,
    @Param("paste_id") parentId: string,
    @User("id") authorId: string,
  ) {
    return await this.commentsService.reply(
      createCommentDto,
      parentId,
      authorId,
    );
  }
}
