import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { Request } from "express";

import {
  PasteExposure,
  User,
  UserExposure,
} from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isUserExistsEmail = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
      select: {
        id: true,
      },
    });

    if (isUserExistsEmail) {
      throw new ConflictException("User already exists");
    }

    const isUserExistsUsername = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
      select: {
        id: true,
      },
    });

    if (isUserExistsUsername) {
      throw new ConflictException("User already exists");
    }

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        passwordHash: createUserDto.passwordHash,
      },
    });

    return user;
  }

  async _byId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    return user;
  }

  async _byEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    return user;
  }

  async getUser(userId: string, currentUserId: string | undefined) {
    if (userId === currentUserId) {
      return this.getUserPrivateInfo(userId);
    } else {
      return this.getUserPublicInfo(userId);
    }
  }

  private async getUserPrivateInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        description: true,
        exposure: true,
        createdAt: true,
        lastActiveAt: true,
        userTags: {
          select: {
            content: true,
          },
        },
        pastes: {
          select: {
            id: true,
            title: true,
            description: true,
            updatedAt: true,
            language: true,
            exposure: true,
          },
          take: 3,
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    const [languagesStatistics, pasteStatistics] = await Promise.all([
      this.prisma.paste.groupBy({
        by: ["language"],
        where: {
          authorId: userId,
          language: {
            not: null,
          },
        },
        _count: {
          language: true,
        },
        orderBy: {
          _count: {
            language: "desc",
          },
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          _count: {
            select: {
              pastes: true,
              likes: true,
              comments: true,
            },
          },
        },
      }),
    ]);

    const statistics = [
      { label: "pastes", value: pasteStatistics?._count.pastes || 0 },
      { label: "likes", value: pasteStatistics?._count.likes || 0 },
      { label: "comments", value: pasteStatistics?._count.comments || 0 },
      { label: "languages", value: languagesStatistics.length || 0 },
    ];

    const mostUsedLanguages = languagesStatistics
      .map((item) => ({
        language: item.language,
        count: item._count.language,
      }))
      .slice(0, 3);

    const { exposure, ...userInfo } = user;

    return {
      ...userInfo,
      exposure: exposure.toLowerCase(),
      statistics,
      mostUsedLanguages,
    };
  }

  private async getUserPublicInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        description: true,
        exposure: true,
        createdAt: true,
        lastActiveAt: true,
        userTags: {
          select: {
            content: true,
          },
        },
        pastes: {
          where: {
            exposure: PasteExposure.PUBLIC,
          },
          select: {
            id: true,
            title: true,
            description: true,
            updatedAt: true,
            language: true,
            exposure: true,
          },
          take: 3,
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    if (user.exposure === UserExposure.PRIVATE) {
      throw new ForbiddenException("User is private");
    }

    const [languagesStatistics, pasteStatistics] = await Promise.all([
      this.prisma.paste.groupBy({
        by: ["language"],
        where: {
          authorId: userId,
          exposure: PasteExposure.PUBLIC,
          language: {
            not: null,
          },
        },
        _count: {
          language: true,
        },
        orderBy: {
          _count: {
            language: "desc",
          },
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          _count: {
            select: {
              pastes: true,
              likes: true,
              comments: true,
            },
          },
        },
      }),
    ]);

    const statistics = [
      { label: "pastes", value: pasteStatistics?._count.pastes || 0 },
      { label: "likes", value: pasteStatistics?._count.likes || 0 },
      { label: "comments", value: pasteStatistics?._count.comments || 0 },
      { label: "languages", value: languagesStatistics.length || 0 },
    ];

    const mostUsedLanguages = languagesStatistics
      .map((item) => ({
        language: item.language,
        count: item._count.language,
      }))
      .slice(0, 3);

    return {
      ...user,
      exposure: user.exposure.toLowerCase(),
      statistics,
      mostUsedLanguages,
    };
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash,
      },
    });
  }

  async update(id: string, userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.id !== userId) {
      throw new ForbiddenException("You can't update this user");
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
      select: {
        id: true,
        username: true,
        email: true,
        description: true,
        exposure: true,
      },
    });

    return {
      ...updatedUser,
      exposure: updatedUser.exposure.toLowerCase(),
    };
  }

  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.id !== userId) {
      throw new ForbiddenException("You can't remove this user");
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return { success: true, message: "User removed" };
  }

  async touchLastActive(userId: string) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60_000);

    await this.prisma.user.updateMany({
      where: {
        id: userId,
        lastActiveAt: { lt: oneMinuteAgo },
      },
      data: {
        lastActiveAt: now,
      },
    });
  }
}
