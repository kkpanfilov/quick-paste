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
} from "@nestjs/common";

import type { Request } from "express";

import { Auth } from "../auth/decorators/auth.decorator.js";
import { User } from "../auth/decorators/user.decorator.js";
import { CommentsService } from "./comments.service.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CreateReplyDto } from "./dto/create-reply.dto.js";
import { UpdateCommentDto } from "./dto/update-comment.dto.js";
import { extractCursor } from "./utils/extract-cursor.js";

// TODO: review the endpoints
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(":paste_id")
  async getPasteComments(
    @Param("paste_id") pasteId: string,
    @User("id") userId: string | null,
    @Req() request: Request,
    @Query("cursor") cursorValue?: string,
  ) {
    const cursor = extractCursor(cursorValue);

    return await this.commentsService.getPasteComments(
      pasteId,
      userId,
      request,
      cursor,
    );
  }

  @Get(":paste_id/replies/:comment_id")
  async getCommentsReplies(
    @Param("comment_id") commentId: string,
    @Param("paste_id") pasteId: string,
    @User("id") userId: string | null,
    @Req() request: Request,
    @Query("cursor") cursorValue?: string,
  ) {
    const cursor = extractCursor(cursorValue);

    return await this.commentsService.getCommentsReplies(
      commentId,
      pasteId,
      userId,
      request,
      cursor,
    );
  }

  @Post(":paste_id")
  @Auth()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param("paste_id") pasteId: string,
    @User("id") authorId: string,
    @Req() request: Request,
  ) {
    return await this.commentsService.create(
      createCommentDto,
      pasteId,
      authorId,
      request,
    );
  }

  @Post(":parent_id/replies")
  @Auth()
  async reply(
    @Body() createCommentDto: CreateReplyDto,
    @Param("parent_id") parentId: string,
    @User("id") authorId: string,
    @Req() request: Request,
  ) {
    return await this.commentsService.reply(
      createCommentDto,
      parentId,
      authorId,
      request,
    );
  }

  @Patch(":comment_id")
  @Auth()
  async update(
    @Param("comment_id") commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User("id") authorId: string,
  ) {
    return await this.commentsService.update(
      commentId,
      updateCommentDto,
      authorId,
    );
  }

  @Delete(":comment_id")
  @Auth()
  async delete(
    @Param("comment_id") commentId: string,
    @User("id") authorId: string,
  ) {
    return await this.commentsService.remove(commentId, authorId);
  }
}
