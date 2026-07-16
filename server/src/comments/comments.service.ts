import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { CacheKeys } from "../redis/redis.keys.js";
import { RedisService } from "../redis/redis.service.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CreateReplyDto } from "./dto/create-reply.dto.js";

// TODO: stop embedding comments with paste
// client should get comments separately
@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getPasteComments(pasteId: string, page: number = 1) {
    const cache = await this.redis.getCache(
      CacheKeys.comments.list(pasteId, page),
    );

    if (cache) return cache;

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

    await this.redis.setCache(
      CacheKeys.comments.list(pasteId, page),
      paste.comments,
    );

    return paste.comments;
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

    await this.invalidateListPasteComments(pasteId);

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

    await this.invalidateListPasteComments(createReplyDto.pasteId);

    return reply;
  }

  async invalidateListPasteComments(pasteId: string) {
    const keys = await this.redis.getKeysByPattern(
      CacheKeys.comments.listAllPages(pasteId),
    );

    if (keys) await this.redis.mdelCache(keys);
  }
}
