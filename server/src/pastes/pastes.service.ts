import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";
import { Request } from "express";

import { PasteExposure, Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreatePasteDto } from "./dto/create-paste.dto.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { FindOneOptions } from "./types/find-one-paste.type.js";
import { Password } from "./types/password.type.js";
import { PasteUnlockTokenType } from "./types/paste-unlock-token.type.js";

@Injectable()
export class PastesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    return paste;
  }

  async findPublic(page: number = 1) {
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

    return {
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

    return {
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
  }

  async findOne(
    id: string,
    userId: string | undefined,
    request: Request | null,
    password?: Password,
    options: FindOneOptions = {},
  ) {
    const paste = await this.getAccessiblePaste(id, userId, request, password);

    const shouldBurnAfterRead = options.burnAfterRead ?? true;
    const { isBurn, exposure, ...rest } = paste;

    if (isBurn && paste.authorId !== userId && shouldBurnAfterRead)
      await this.burn(id);

    return {
      ...rest,
      exposure: exposure.toLowerCase(),
      isBurn,
      likesCount: paste.likesCount,
      isLiked: paste.isLiked ? true : false,
      author: paste.author,
    };
  }

  async like(id: string, userId: string, request: Request | null) {
    const paste = await this.findOne(id, userId, request, null, {
      burnAfterRead: false,
    });

    if (paste.isBurn) {
      throw new BadRequestException("This paste has been burned");
    }

    try {
      await this.prisma.like.create({
        data: {
          userId,
          pasteId: id,
        },
      });

      const currentLikesCount = await this.prisma.like.count({
        where: {
          pasteId: id,
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
    const paste = await this.findOne(id, userId, request, null, {
      burnAfterRead: false,
    });

    if (paste.isBurn) {
      throw new BadRequestException("This paste has been burned");
    }

    const unliked = await this.prisma.like.deleteMany({
      where: {
        userId,
        pasteId: id,
      },
    });

    if (unliked.count === 0) {
      throw new BadRequestException(`Paste already unliked`);
    }

    const currentLikesCount = await this.prisma.like.count({
      where: {
        pasteId: id,
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
    updatePasteDto: UpdatePasteDto & { password?: string },
  ) {
    if (Object.keys(updatePasteDto).length === 0) {
      throw new BadRequestException("No data provided");
    }

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
          isBurn: true,
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

    return {
      likesCount,
      pasteTags: pasteTags.map((tag) => tag.content),
      isLiked: isLikedByUser ? true : false,
      exposure: exposure.toLowerCase(),
      ...updatedPaste,
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

    return {
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

  private async getAccessiblePaste(
    id: string,
    userId: string | undefined,
    request: Request | null,
    password?: Password,
  ) {
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

    const { passwordHash, isBurn, expiresAt, exposure, pasteTags, ...rest } =
      paste;

    if (exposure === PasteExposure.PRIVATE && paste.authorId !== userId) {
      throw new NotFoundException("Paste not found");
    }

    if (expiresAt && expiresAt < new Date()) {
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
            isBurn,
            likesCount,
            pasteTags: pasteTags.map((tag) => tag.content),
            isLiked: isLikedByUser ? true : false,
            author: user.username,
          };
        }
      }
    }

    if (passwordHash && !password && paste.authorId !== userId) {
      throw new ForbiddenException("Password is required");
    }

    if (passwordHash && password) {
      const isPasswordValid = await argon2.verify(passwordHash, password);

      if (!isPasswordValid) {
        throw new ForbiddenException("Password is incorrect");
      }
    }

    return {
      ...rest,
      expiresAt,
      exposure: exposure.toLowerCase(),
      isBurn,
      likesCount,
      pasteTags: pasteTags.map((tag) => tag.content),
      isLiked: isLikedByUser ? true : false,
      author: user.username,
    };
  }
}
