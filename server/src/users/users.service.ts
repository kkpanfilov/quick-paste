import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  PasteExposure,
  User,
  UserExposure,
} from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CacheKeys } from "../redis/redis.keys.js";
import { RedisService } from "../redis/redis.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

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
        exposure: true,
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    if (user.exposure === UserExposure.PRIVATE) {
      throw new ForbiddenException("User is private");
    }

    const cache = await this.redis.getCache(CacheKeys.user.public(userId));

    if (cache) return cache;

    const userInfo = await this.prisma.user.findUnique({
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

    const data = {
      ...userInfo,
      exposure: user.exposure.toLowerCase(),
      statistics,
      mostUsedLanguages,
    };

    await this.redis.setCache(CacheKeys.user.public(userId), data);

    return data;
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
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException("No data provided");
    }

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

    await this.redis.delCache(CacheKeys.user.public(userId));

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

    await this.invalidateUserPublicInfoCache(userId);

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

  async invalidateUserPublicInfoCache(userId: string) {
    await this.redis.delCache(CacheKeys.user.public(userId));
  }
}
