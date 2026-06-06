import { BadRequestException, PipeTransform } from "@nestjs/common";

import ms from "ms";

import { PasteExposure } from "../../generated/prisma/enums.js";
import { CreatePasteDto } from "../dto/create-paste.dto.js";

export type CreatePasteServiceDto = Omit<
  CreatePasteDto,
  "expiration" | "exposure"
> & {
  expiresAt: Date | null;
  exposure: PasteExposure;
};

export class CreatePastePipe implements PipeTransform {
  transform(dto: CreatePasteDto): CreatePasteServiceDto {
    const { exposure, expiration, ...pasteDto } = dto;

    const normalizedExposure =
      typeof exposure === "string" ? exposure.toUpperCase() : exposure;

    if (
      !Object.values(PasteExposure).includes(
        normalizedExposure as PasteExposure,
      )
    ) {
      throw new BadRequestException("Exposure must be a valid exposure");
    }

    const newDto: CreatePasteServiceDto = {
      ...pasteDto,
      expiresAt: null,
      exposure: normalizedExposure as PasteExposure,
    };

    if (expiration === "never" || !expiration) return newDto;

    const durationMs = ms(expiration as ms.StringValue);

    if (typeof durationMs !== "number") {
      throw new BadRequestException("Invalid expiration format");
    }

    newDto.expiresAt = new Date(Date.now() + durationMs);

    console.log(newDto);

    return newDto;
  }
}
