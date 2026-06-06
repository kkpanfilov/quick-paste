import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CreateReplyDto } from "./dto/create-reply.dto.js";
import { UpdateCommentDto } from "./dto/update-comment.dto.js";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPasteComments(pasteId: string, page: number = 1) {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id: pasteId,
      },
      select: {
        id: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            replies: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
          take: 10,
          skip: (page - 1) * 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }
  }

  async create(
    createCommentDto: CreateCommentDto,
    pasteId: string,
    authorId: string,
  ) {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id: pasteId,
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    const comment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        authorId,
        pasteId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return comment;
  }

  async reply(
    createReplyDto: CreateReplyDto,
    parentId: string,
    authorId: string,
  ) {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id: createReplyDto.pasteId,
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    const parent = await this.prisma.comment.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parent) {
      throw new NotFoundException("Parent comment not found");
    }

    const reply = await this.prisma.comment.create({
      data: {
        ...createReplyDto,
        authorId,
        parentId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return reply;
  }

  async update(updateCommentDto: UpdateCommentDto, id: string, userId: string) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string, userId: string) {
    return `This action removes a #${id} comment`;
  }
}
