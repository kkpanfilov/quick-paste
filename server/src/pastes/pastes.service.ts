import { Injectable } from "@nestjs/common";

import * as argon2 from "argon2";

import { PrismaService } from "../prisma/prisma.service.js";
import { UpdatePasteDto } from "./dto/update-paste.dto.js";
import { CreatePasteServiceDto } from "./pipes/expiration.pipe.js";

// TODO: implement pastes endpoints
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

  findOne(id: number) {
    return `This action returns a #${id} paste`;
  }

  update(id: number, updatePasteDto: UpdatePasteDto) {
    return `This action updates a #${id} paste`;
  }

  remove(id: number) {
    return `This action removes a #${id} paste`;
  }
}
