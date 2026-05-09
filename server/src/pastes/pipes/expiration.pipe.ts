import { BadRequestException, PipeTransform } from "@nestjs/common";

import ms from "ms";

import { CreatePasteDto } from "../dto/create-paste.dto.js";

export type CreatePasteServiceDto = Omit<CreatePasteDto, "expiration"> & {
  expiresAt: Date | null;
};

export class ExpirationPipe implements PipeTransform {
  transform(dto: CreatePasteDto): CreatePasteServiceDto {
    const { expiration, ...pasteDto } = dto;
    const newDto: CreatePasteServiceDto = {
      ...pasteDto,
      expiresAt: null,
    };

    if (expiration === "never" || !expiration) return newDto;

    const durationMs = ms(expiration as ms.StringValue);

    if (typeof durationMs !== "number") {
      throw new BadRequestException("Invalid expiration format");
    }

    newDto.expiresAt = new Date(Date.now() + durationMs);

    return newDto;
  }
}
