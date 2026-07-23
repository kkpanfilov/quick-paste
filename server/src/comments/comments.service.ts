import { Injectable, NotFoundException } from "@nestjs/common";

import { EXCEPTION_MAP, PastesService } from "../pastes/pastes.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CreateReplyDto } from "./dto/create-reply.dto.js";
import { Cursor } from "./types/cursor.type.js";

// TODO: implement cursor pagination
// TODO: add tests
const DEFAULT_LIMIT_COMMENTS = 10;
const DEFAULT_LIMIT_REPLIES = 5;

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pasteService: PastesService,
  ) {}

  async getPasteComments(
    pasteId: string,
    userId: string | undefined,
    cursor: Cursor | null,
  ) {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id: pasteId,
      },
      select: {
        id: true,
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    const { isAccessible: isPasteAccessible, error } =
      await this.pasteService.isPasteAccessible(pasteId, userId);

    if (!isPasteAccessible && error !== null) {
      throw EXCEPTION_MAP[error];
    }

    const comments = await this.prisma.comment.findMany({
      where: {
        pasteId,
        parentId: null,
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
        _count: {
          select: {
            replies: true,
          },
        },
      },
      ...(cursor && {
        cursor: {
          id: cursor.id,
        },
      }),
      take: DEFAULT_LIMIT_COMMENTS + 1,
      skip: cursor ? 1 : 0,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    const hasNextPage = comments.length > DEFAULT_LIMIT_COMMENTS;
    const items = hasNextPage
      ? comments.slice(0, DEFAULT_LIMIT_COMMENTS)
      : comments;

    const data = {
      items: items.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: comment.author,
        repliesCount: comment._count.replies,
      })),
      nextCursor: hasNextPage
        ? {
            id: items[items.length - 1].id,
            createdAt: items[items.length - 1].createdAt,
          }
        : null,
    };

    return data;
  }

  async getCommentsReplies(
    commentId: string,
    pasteId: string,
    userId: string | undefined,
    cursor: Cursor | null,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
        pasteId,
      },
      select: {
        id: true,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    const { isAccessible: isPasteAccessible, error } =
      await this.pasteService.isPasteAccessible(pasteId, userId);

    if (!isPasteAccessible && error !== null) {
      throw EXCEPTION_MAP[error];
    }

    const replies = await this.prisma.comment.findMany({
      where: {
        parentId: commentId,
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
      ...(cursor && {
        cursor: {
          id: cursor.id,
        },
      }),
      take: DEFAULT_LIMIT_REPLIES + 1,
      skip: cursor ? 1 : 0,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    const hasNextPage = replies.length > DEFAULT_LIMIT_REPLIES;
    const items = hasNextPage
      ? replies.slice(0, DEFAULT_LIMIT_REPLIES)
      : replies;

    const data = {
      items: items.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        author: reply.author,
      })),
      nextCursor: hasNextPage
        ? {
            id: items[items.length - 1].id,
            createdAt: items[items.length - 1].createdAt,
          }
        : null,
    };

    return data;
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

    const { isAccessible: isPasteAccessible, error } =
      await this.pasteService.isPasteAccessible(pasteId, authorId);

    if (!isPasteAccessible && error !== null) {
      throw EXCEPTION_MAP[error];
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
      },
    });

    return { ...comment, repliesCount: 0 };
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

    const { isAccessible: isPasteAccessible, error } =
      await this.pasteService.isPasteAccessible(
        createReplyDto.pasteId,
        authorId,
      );

    if (!isPasteAccessible && error !== null) {
      throw EXCEPTION_MAP[error];
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
}
