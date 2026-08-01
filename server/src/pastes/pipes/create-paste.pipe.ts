import { PipeTransform } from "@nestjs/common";

import ms from "ms";

import { PasteExposure } from "../../generated/prisma/enums.js";
import { CreatePasteDto } from "../dto/create-paste.dto.js";

export type CreatePasteServiceDto = Omit<
  CreatePasteDto,
  "exposure" | "expiration"
> & {
  exposure: PasteExposure;
  expiresAt: Date | null;
};

export class CreatePastePipe implements PipeTransform {
  transform(dto: CreatePasteDto): CreatePasteServiceDto {
    const { exposure, expiration, ...pasteDto } = dto;

    const normalizedExposure =
      typeof exposure === "string" ? exposure.toUpperCase() : exposure;

    const newDto: CreatePasteServiceDto = {
      ...pasteDto,
      expiresAt: null,
      exposure: normalizedExposure as PasteExposure,
    };

    if (expiration === "never" || expiration === "burn") return newDto;

    const durationMs = ms(expiration as ms.StringValue);

    newDto.expiresAt = new Date(Date.now() + durationMs);

    return newDto;
  }
}
