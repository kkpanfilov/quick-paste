import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";
import { Request } from "express";

import { PrismaService } from "../prisma/prisma.service.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { CreatePasteServiceDto } from "./pipes/expiration.pipe.js";
import { Password } from "./types/password.type.js";
import { PasteUnlockTokenType } from "./types/paste-unlock-token.type.js";

// TODO: realize trim pipe
@Injectable()
export class PastesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createPasteDto: CreatePasteServiceDto & {
      authorId: string;
      passwordHash?: string;
    },
  ) {
    const { password, ...rest } = createPasteDto;

    const data = rest;

    if (password) {
      if (data.exposure === "public")
        throw new ForbiddenException(
          "You cannot create a public paste with a password",
        );

      data.passwordHash = await argon2.hash(password);
    }

    const paste = await this.prisma.paste.create({
      data,
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
        },
        where: {
          exposure: "public",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.paste.count({
        where: {
          exposure: "public",
        },
      }),
    ]);

    return {
      items: pastes,
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
      items: pastes,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / 10),
        hasNextPage: page < Math.ceil(total / 10),
      },
    };
  }

  // TODO: if paste password protected - content is hidden
  async findOne(
    id: string,
    userId: string,
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
        category: true,
        language: true,
        exposure: true,
        isBurn: true,
        passwordHash: true,
        authorId: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    if (paste.exposure === "private" && paste.authorId !== userId) {
      throw new NotFoundException("Paste not found");
    }

    if (paste.expiresAt && paste.expiresAt < new Date()) {
      await this.burn(id);
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

    const { passwordHash, ...safePaste } = paste;

    if (request) {
      const cookies = request.cookies;

      if (cookies[`paste_access_${id}`]) {
        const token = cookies[`paste_access_${id}`] as string;
        const isTokenValid =
          await this.jwtService.verifyAsync<PasteUnlockTokenType>(token);

        if (isTokenValid) {
          if (paste.isBurn && paste.authorId !== userId) await this.burn(id);
          return {
            ...safePaste,
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

    if (paste.isBurn && paste.authorId !== userId) await this.burn(id);
    return {
      ...safePaste,
      author: user.username,
    };
  }

  async update(id: string, authorId: string, updatePasteDto: UpdatePasteDto) {
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

    const updatedPaste = await this.prisma.paste.update({
      where: {
        id,
      },
      data: {
        ...updatePasteDto,
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        language: true,
        exposure: true,
        authorId: true,
        createdAt: true,
      },
    });

    return {
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
}
