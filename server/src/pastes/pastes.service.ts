import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import * as argon2 from "argon2";

import { PrismaService } from "../prisma/prisma.service.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { CreatePasteServiceDto } from "./pipes/expiration.pipe.js";

@Injectable()
export class PastesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPasteDto: CreatePasteServiceDto & {
      authorId: string;
      passwordHash?: string;
    },
  ) {
    const { password, ...rest } = createPasteDto;

    const data = rest;

    if (password) data.passwordHash = await argon2.hash(password);

    const paste = await this.prisma.paste.create({
      data,
      select: {
        id: true,
      },
    });

    return paste;
  }

  async findPublic() {
    const pastes = await this.prisma.paste.findMany({
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
    });

    return pastes;
  }

  async findOne(id: string, userId: string) {
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
        authorId: true,
        createdAt: true,
      },
    });

    if (!paste) {
      throw new NotFoundException("Paste not found");
    }

    if (paste.exposure === "private" && paste.authorId !== userId) {
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

    return {
      ...paste,
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
}
