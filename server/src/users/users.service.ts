import { ConflictException, Injectable } from "@nestjs/common";

import { User } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";

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

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException("User not found");
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
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

  update(id: number, updateUserDto: CreateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
