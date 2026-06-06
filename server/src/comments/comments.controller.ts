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
import { UpdateCommentDto } from "./dto/update-comment.dto.js";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getPasteComments(
    @Query("paste_id") pasteId: string,
    @Query("page") page: number,
  ) {
    return await this.commentsService.getPasteComments(pasteId, page);
  }

  @Post(":id")
  @Auth()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param("id") pasteId: string,
    @User("id") authorId: string,
  ) {
    return await this.commentsService.create(
      createCommentDto,
      pasteId,
      authorId,
    );
  }

  @Post(":id/reply")
  @Auth()
  async reply(
    @Body() createCommentDto: CreateReplyDto,
    @Param("id") parentId: string,
    @User("id") authorId: string,
  ) {
    return await this.commentsService.reply(
      createCommentDto,
      parentId,
      authorId,
    );
  }

  @Patch(":id")
  @Auth()
  async update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User("id") userId: string,
  ) {
    return await this.commentsService.update(updateCommentDto, id, userId);
  }

  @Delete(":id")
  @Auth()
  async remove(@Param("id") id: string, @User("id") userId: string) {
    return await this.commentsService.remove(id, userId);
  }
}
