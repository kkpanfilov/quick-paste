import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";
import { Request } from "express";

import { CommentsService } from "../comments/comments.service.js";
import { PasteExposure, Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CacheKeys } from "../redis/redis.keys.js";
import { RedisService } from "../redis/redis.service.js";
import { UsersService } from "../users/users.service.js";
import { CreatePasteDto } from "./dto/create-paste.dto.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { CachePaste } from "./types/cache-paste.type.js";
import { IsPasteAccessible } from "./types/is-paste-accessible.type.js";
import { Password } from "./types/password.type.js";
import { PasteUnlockTokenType } from "./types/paste-unlock-token.type.js";
import { ReadPasteOptions } from "./types/read-paste.type.js";

export const EXCEPTION_MAP = {
  "Paste not found": new NotFoundException("Paste not found"),
  "User not found": new NotFoundException("User not found"),
  "Password is incorrect": new UnauthorizedException("Password is incorrect"),
  "Password is required": new BadRequestException("Password is required"),
} as const;

@Injectable()
export class PastesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async create(
    createPasteDto: CreatePasteDto & {
      exposure: PasteExposure;
    },
    authorId: string,
  ) {
    const { password, tags, ...rest } = createPasteDto;

    const data = { ...rest, authorId } as CreatePasteDto & {
      authorId: string;
      exposure: PasteExposure;
      passwordHash?: string;
    };

    if (password) {
      if (data.exposure === PasteExposure.PUBLIC)
        throw new ForbiddenException(
          "You cannot create a public paste with a password",
        );

      data.passwordHash = await argon2.hash(password);
    }

    const paste = await this.prisma.paste.create({
      data: {
        ...data,
        pasteTags: {
          create: tags.map((content) => ({ content })),
        },
      },
      select: {
        id: true,
      },
    });

    const invalidations = [
      this.invalidateListAuthorPastes(authorId),
      this.usersService.invalidateUserPublicInfoCache(authorId),
    ];

    if (data.exposure === PasteExposure.PUBLIC)
      invalidations.push(this.invalidateListPublicPastes());

    await Promise.all(invalidations);

    return paste;
  }

  async findPublic(page: number = 1) {
    const cache = await this.redis.getCache(CacheKeys.paste.publicList(page));

    if (cache) return cache;

    const [pastes, total] = await this.prisma.$transaction([
      this.prisma.paste.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          language: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
          pasteTags: {
            select: {
              content: true,
            },
          },
        },
        where: {
          exposure: PasteExposure.PUBLIC,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.paste.count({
        where: {
          exposure: PasteExposure.PUBLIC,
        },
      }),
    ]);

    const data = {
      items: pastes.map((paste) => ({
        id: paste.id,
        title: paste.title,
        content: paste.content,
        category: paste.category,
        language: paste.language,
        createdAt: paste.createdAt,
        likesCount: paste._count.likes,
        pasteTags: paste.pasteTags.map((tag) => tag.content),
      })),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / 10),
        hasNextPage: page < Math.ceil(total / 10),
      },
    };

    await this.redis.setCache(CacheKeys.paste.publicList(page), data);

    return data;
  }

  async findAuthorPastes(authorId: string, page: number = 1) {
    if (!authorId) {
      throw new NotFoundException("Author not found");
    }

    const author = await this.prisma.user.findUnique({
      where: {
        id: authorId,
      },
      select: {
        id: true,
      },
    });

    if (!author) {
      throw new NotFoundException("Author not found");
    }

    const cache = await this.redis.getCache(
      CacheKeys.paste.authorList(authorId, page),
    );

    if (cache) return cache;

    const [pastes, total] = await this.prisma.$transaction([
      this.prisma.paste.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          language: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
          pasteTags: {
            select: {
              content: true,
            },
          },
        },
        where: {
          authorId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.paste.count({
        where: {
          authorId,
        },
      }),
    ]);

    const data = {
      items: pastes.map((paste) => ({
        id: paste.id,
        title: paste.title,
        content: paste.content,
        category: paste.category,
        language: paste.language,
        createdAt: paste.createdAt,
        likesCount: paste._count.likes,
        pasteTags: paste.pasteTags.map((tag) => tag.content),
      })),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / 10),
        hasNextPage: page < Math.ceil(total / 10),
      },
    };

    await this.redis.setCache(CacheKeys.paste.authorList(authorId, page), data);

    return data;
  }

  async findOne(
    id: string,
    userId: string | undefined,
    request: Request | null,
    password?: Password,
  ) {
    const { isAccessible, error } = await this.isPasteAccessible(
      id,
      userId,
      password,
    );

    if (!isAccessible && error !== null) throw EXCEPTION_MAP[error];

    const cache = await this.redis.getCache<CachePaste>(
      CacheKeys.paste.item(id),
    );

    if (cache) {
      const { id: pasteId } = cache;

      const isLiked = await this.checkIsLiked(pasteId, userId);

      return { ...cache, isLiked };
    }

    const paste = await this.getAccessiblePaste(id, userId, request, password, {
      isAccessGuaranteed: true,
    });

    const { exposure, isLiked, isBurn, ...rest } = paste;

    const data = {
      ...rest,
      exposure: exposure.toLowerCase(),
      likesCount: paste.likesCount,
      author: paste.author,
    } as CachePaste;

    if (isBurn) return { ...data, isLiked };
    else {
      await this.redis.setCache(CacheKeys.paste.item(id), data);

      return { ...data, isLiked };
    }
  }

  async like(id: string, userId: string, request: Request | null) {
    const paste = await this.getAccessiblePaste(id, userId, request, null, {
      burnAfterRead: false,
    });

    try {
      await this.prisma.like.create({
        data: {
          userId,
          pasteId: paste.id,
        },
      });

      const currentLikesCount = await this.prisma.like.count({
        where: {
          pasteId: paste.id,
        },
      });

      await this.invalidatePasteItem(id);

      return {
        id,
        isLiked: true,
        likesCount: currentLikesCount,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(`Paste already liked`);
      }
      throw error;
    }
  }

  async unlike(id: string, userId: string, request: Request | null) {
    const paste = await this.getAccessiblePaste(id, userId, request, null, {
      burnAfterRead: false,
    });

    const unliked = await this.prisma.like.deleteMany({
      where: {
        userId,
        pasteId: paste.id,
      },
    });

    if (unliked.count === 0) {
      throw new BadRequestException(`Paste already unliked`);
    }

    const currentLikesCount = await this.prisma.like.count({
      where: {
        pasteId: paste.id,
      },
    });

    await this.invalidatePasteItem(id);

    return {
      id,
      isLiked: false,
      likesCount: currentLikesCount,
    };
  }

  async update(
    id: string,
    userId: string,
    request: Request | null,
    updatePasteDto: UpdatePasteDto & { password?: string },
  ) {
    if (Object.keys(updatePasteDto).length === 0) {
      throw new BadRequestException("No data provided");
    }

    const paste = await this.getAccessiblePaste(id, userId, request, null, {
      burnAfterRead: false,
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    if (paste.authorId !== userId) {
      throw new ForbiddenException("You are not the author of this paste");
    }

    const { password, tags, ...data } = updatePasteDto as UpdatePasteDto & {
      passwordHash?: string | null;
    };

    if (data.exposure && data.exposure !== PasteExposure.PROTECTED) {
      data.passwordHash = null;
    }

    if (data.exposure === PasteExposure.PROTECTED && password) {
      data.passwordHash = await argon2.hash(password);
    }

    const { exposure, pasteTags, ...updatedPaste } =
      await this.prisma.paste.update({
        where: {
          id,
        },
        data: {
          ...data,
          ...(tags !== undefined && {
            pasteTags: {
              deleteMany: {},
              create: tags.map((content) => ({ content })),
            },
          }),
        },
        select: {
          id: true,
          title: true,
          content: true,
          description: true,
          category: true,
          language: true,
          exposure: true,
          authorId: true,
          createdAt: true,
          pasteTags: {
            select: {
              content: true,
            },
          },
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
            where: {
              parentId: null,
            },
            take: 10,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    const likesCount = await this.prisma.like.count({
      where: {
        pasteId: id,
      },
    });

    const isLikedByUser = userId
      ? await this.prisma.like.count({
          where: {
            userId,
            pasteId: id,
          },
        })
      : false;

    const previousExposure = paste.exposure;
    const currentExposure = exposure;

    const invalidations = [
      this.invalidatePasteItem(id),
      this.invalidateListAuthorPastes(paste.authorId),
      this.usersService.invalidateUserPublicInfoCache(paste.authorId),
    ];

    if (
      previousExposure === PasteExposure.PUBLIC &&
      (currentExposure === PasteExposure.PRIVATE ||
        currentExposure === PasteExposure.PROTECTED ||
        currentExposure === PasteExposure.UNLISTED ||
        currentExposure === PasteExposure.SHARED)
    ) {
      invalidations.push(this.invalidateListPublicPastes());
    }

    if (currentExposure === PasteExposure.PUBLIC) {
      invalidations.push(this.invalidateListPublicPastes());
    }

    await Promise.all(invalidations);

    return {
      ...updatedPaste,
      likesCount,
      pasteTags: pasteTags.map((tag) => tag.content),
      isLiked: isLikedByUser ? true : false,
      author: paste.author,
      exposure: exposure.toLowerCase(),
    };
  }

  async remove(id: string, authorId: string) {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
        exposure: true,
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    if (paste.authorId !== authorId) {
      throw new ForbiddenException("You are not the author of this paste");
    }

    const deletedPaste = await this.prisma.paste.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    const invalidations = [
      this.invalidatePasteItem(id),
      this.invalidateListAuthorPastes(paste.authorId),
      this.usersService.invalidateUserPublicInfoCache(paste.authorId),
      this.commentsService.invalidateListPasteComments(id),
    ];

    if (paste.exposure === PasteExposure.PUBLIC)
      invalidations.push(this.invalidateListPublicPastes());

    await Promise.all(invalidations);

    return deletedPaste;
  }

  async search(query: string, page: number = 1) {
    const [pastes, total] = await this.prisma.$transaction([
      this.prisma.paste.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          language: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
          pasteTags: {
            select: {
              content: true,
            },
          },
        },
        where: {
          title: {
            contains: query,
          },
          exposure: PasteExposure.PUBLIC,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.paste.count({
        where: {
          exposure: PasteExposure.PUBLIC,
        },
      }),
    ]);

    const data = {
      items: pastes.map((paste) => ({
        id: paste.id,
        title: paste.title,
        content: paste.content,
        category: paste.category,
        language: paste.language,
        createdAt: paste.createdAt,
        likesCount: paste._count.likes,
        pasteTags: paste.pasteTags.map((tag) => tag.content),
      })),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / 10),
        hasNextPage: page < Math.ceil(total / 10),
        totalMatches: total,
      },
    };

    return data;
  }

  private async burn(id: string) {
    const deletedPaste = await this.prisma.paste.delete({
      where: {
        id,
      },
      select: {
        authorId: true,
        exposure: true,
      },
    });

    const invalidations = [
      this.invalidatePasteItem(id),
      this.invalidateListAuthorPastes(deletedPaste.authorId),
      this.usersService.invalidateUserPublicInfoCache(deletedPaste.authorId),
      this.commentsService.invalidateListPasteComments(id),
    ];

    if (deletedPaste.exposure === PasteExposure.PUBLIC) {
      invalidations.push(this.invalidateListPublicPastes());
    }

    await Promise.all(invalidations);
  }

  private async isPasteAccessible(
    id: string,
    userId: string | undefined,
    password?: Password,
  ): IsPasteAccessible {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        authorId: true,
        passwordHash: true,
        expiresAt: true,
        exposure: true,
      },
    });

    if (!paste) {
      return { isAccessible: false, error: "Paste not found" };
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: paste.authorId,
      },
      select: {
        username: true,
      },
    });

    if (!user) {
      return { isAccessible: false, error: "User not found" };
    }

    if (paste.exposure === PasteExposure.PRIVATE && paste.authorId !== userId) {
      return { isAccessible: false, error: "Paste not found" };
    }

    if (paste.expiresAt && paste.expiresAt < new Date()) {
      await this.burn(id);
      return { isAccessible: false, error: "Paste not found" };
    }

    if (paste.passwordHash && !password && paste.authorId !== userId) {
      return { isAccessible: false, error: "Password is required" };
    }

    if (paste.passwordHash && password) {
      const isPasswordValid = await argon2.verify(paste.passwordHash, password);

      if (!isPasswordValid) {
        return { isAccessible: false, error: "Password is incorrect" };
      }
    }

    return { isAccessible: true, error: null };
  }

  private async getAccessiblePaste(
    id: string,
    userId: string | undefined,
    request: Request | null,
    password?: Password,
    options: ReadPasteOptions = {},
  ) {
    const isAccessGuaranteed = options.isAccessGuaranteed ?? false;

    if (!isAccessGuaranteed) {
      const { isAccessible, error } = await this.isPasteAccessible(
        id,
        userId,
        password,
      );

      if (!isAccessible && error !== null) throw EXCEPTION_MAP[error];
    }

    const paste = await this.prisma.paste.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        description: true,
        category: true,
        language: true,
        exposure: true,
        isBurn: true,
        authorId: true,
        createdAt: true,
        pasteTags: {
          select: {
            content: true,
          },
        },
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
          where: {
            parentId: null,
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: paste.authorId,
      },
      select: {
        username: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { isBurn, exposure, pasteTags, ...rest } = paste;

    const shouldBurnAfterRead = options.burnAfterRead ?? true;

    const likesCount = await this.prisma.like.count({
      where: {
        pasteId: id,
      },
    });

    const isLikedByUser = await this.checkIsLiked(id, userId);

    const data = {
      ...rest,
      isBurn,
      exposure,
      likesCount,
      pasteTags: pasteTags.map((tag) => tag.content),
      isLiked: isLikedByUser ? true : false,
      author: user.username,
    };

    if (isBurn && paste.authorId !== userId && shouldBurnAfterRead) {
      await this.burn(id);
      return data;
    }

    if (request) {
      const cookies = request.cookies;

      if (cookies[`paste_access_${id}`]) {
        const token = cookies[`paste_access_${id}`] as string;
        const isTokenValid =
          await this.jwtService.verifyAsync<PasteUnlockTokenType>(token);

        if (isTokenValid) {
          return data;
        }
      }
    }

    return data;
  }

  private async checkIsLiked(pasteId: string, userId: string | undefined) {
    return userId
      ? await this.prisma.like.count({
          where: {
            userId,
            pasteId,
          },
        })
      : false;
  }

  private async invalidatePasteItem(pasteId: string) {
    await this.redis.delCache(CacheKeys.paste.item(pasteId));
  }

  private async invalidateListAuthorPastes(authorId: string) {
    const keys = await this.redis.getKeysByPattern(
      CacheKeys.paste.authorListAllPages(authorId),
    );

    if (keys) await this.redis.mdelCache(keys);
  }

  private async invalidateListPublicPastes() {
    const keys = await this.redis.getKeysByPattern(
      CacheKeys.paste.publicListAllPages(),
    );

    if (keys) await this.redis.mdelCache(keys);
  }
}
