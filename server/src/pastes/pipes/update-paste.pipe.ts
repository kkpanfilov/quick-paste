import { BadRequestException, PipeTransform } from "@nestjs/common";

import { PasteExposure } from "../../generated/prisma/enums.js";
import { UpdatePasteDto } from "../dto/update-paste.dto.js";

export class UpdatePastePipe implements PipeTransform {
  transform(dto: UpdatePasteDto): UpdatePasteDto {
    const { exposure, ...pasteDto } = dto;

    if (!exposure) return dto;

    const normalizedExposure =
      typeof exposure === "string" ? exposure.toUpperCase() : exposure;

    if (
      !Object.values(PasteExposure).includes(
        normalizedExposure as PasteExposure,
      )
    ) {
      throw new BadRequestException("Exposure must be a valid exposure");
    }

    const newDto: UpdatePasteDto = {
      ...pasteDto,
      exposure: normalizedExposure as PasteExposure,
    };

    return newDto;
  }
}
