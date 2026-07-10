import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";
import type { Cache } from "cache-manager";
import { Request } from "express";

import { PasteExposure, Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreatePasteDto } from "./dto/create-paste.dto.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
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
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

    await this.cacheManager.del(`pastes:author:${authorId}`);

    return paste;
  }

  async findPublic(page: number = 1) {
    const cache = await this.cacheManager.get(`pastes:public:${page}`);

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

    await this.cacheManager.set(`pastes:public:${page}`, data);

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

    const cache = await this.cacheManager.get(`pastes:author:${authorId}`);

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

    await this.cacheManager.set(`pastes:author:${authorId}`, data);

    return data;
  }


  async findOne(
    id: string,
    userId: string | undefined,
    request: Request | null,
    password?: Password,
  ) {
    const { isAccessible, error } = await this._isPasteAccessible(
      id,
      userId,
      password,
    );

    if (!isAccessible && error !== null) throw EXCEPTION_MAP[error];

    const cache = await this.cacheManager.get(`pastes:${id}`);

    if (cache) return cache;

    const paste = await this.getAccessiblePaste(id, userId, request, password, {
      isAccessGuaranteed: true,
    });

    const { exposure, ...rest } = paste;

    const data = {
      ...rest,
      exposure: exposure.toLowerCase(),
      likesCount: paste.likesCount,
      isLiked: paste.isLiked ? true : false,
      author: paste.author,
    };

    await this.cacheManager.set(`pastes:${id}`, data);

    return data;
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

    await this.cacheManager.del(`pastes:${id}`);

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
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    if (paste.authorId !== authorId) {
      throw new ForbiddenException("You are not the author of this paste");
    }

    await this.cacheManager.del(`pastes:${id}`);

    return await this.prisma.paste.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
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

    await this.cacheManager.set(`search:pastes:${page}:${query}`, data);

    return data;
  }

  private async burn(id: string) {
    const paste = await this.prisma.paste.findUnique({
      where: {
        id,
      },
    });

    if (!paste) return false;

    return await this.prisma.paste
      .delete({
        where: {
          id,
        },
      })
      .then(() => true)
      .catch(() => false);
  }

  private async _isPasteAccessible(
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
        isBurn: true,
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
      const { isAccessible, error } = await this._isPasteAccessible(
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
        passwordHash: true,
        authorId: true,
        createdAt: true,
        expiresAt: true,
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

    if (isBurn && paste.authorId !== userId && shouldBurnAfterRead) {
      await this.burn(id);
      throw new NotFoundException("Paste not found");
    }

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

    if (request) {
      const cookies = request.cookies;

      if (cookies[`paste_access_${id}`]) {
        const token = cookies[`paste_access_${id}`] as string;
        const isTokenValid =
          await this.jwtService.verifyAsync<PasteUnlockTokenType>(token);

        if (isTokenValid) {
          return {
            ...rest,
            exposure: exposure.toLowerCase(),
            likesCount,
            pasteTags: pasteTags.map((tag) => tag.content),
            isLiked: isLikedByUser ? true : false,
            author: user.username,
          };
        }
      }
    }

    return {
      ...rest,
      exposure: exposure.toLowerCase(),
      likesCount,
      pasteTags: pasteTags.map((tag) => tag.content),
      isLiked: isLikedByUser ? true : false,
      author: user.username,
    };
  }
}
