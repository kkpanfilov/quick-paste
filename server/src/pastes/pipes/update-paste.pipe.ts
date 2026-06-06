import { BadRequestException, PipeTransform } from "@nestjs/common";

import { PasteExposure } from "../../generated/prisma/enums.js";
import { UpdatePasteDto } from "../dto/update-paste.dto.js";

export type UpdatePasteServiceDto = Omit<
  UpdatePasteDto,
  "exposure" | "password"
> & {
  exposure?: PasteExposure;
  password?: string;
};

export class UpdatePastePipe implements PipeTransform {
  transform(dto: UpdatePasteDto): UpdatePasteServiceDto {
    const { exposure, ...pasteDto } = dto;

    const normalizedExposure =
      typeof exposure === "string" ? exposure.toUpperCase() : exposure;

    if (
      !Object.values(PasteExposure).includes(
        normalizedExposure as PasteExposure,
      )
    ) {
      throw new BadRequestException("Exposure must be a valid exposure");
    }

    const newDto: UpdatePasteServiceDto = {
      ...pasteDto,
      exposure: normalizedExposure as PasteExposure,
    };

    return newDto;
  }
}
