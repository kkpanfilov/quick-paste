import { PipeTransform } from "@nestjs/common";

import { PasteExposure } from "../../generated/prisma/enums.js";
import { UpdatePasteDto } from "../dto/update-paste.dto.js";

export type UpdatePasteServiceDto = Omit<UpdatePasteDto, "exposure"> & {
  exposure: PasteExposure | undefined;
};

export class UpdatePastePipe implements PipeTransform {
  transform(dto: UpdatePasteDto): UpdatePasteServiceDto {
    const { exposure, ...pasteDto } = dto;

    if (exposure === undefined) return dto as UpdatePasteServiceDto;

    const normalizedExposure =
      typeof exposure === "string" ? exposure.toUpperCase() : exposure;

    const newDto = {
      ...pasteDto,
      exposure: normalizedExposure as PasteExposure,
    };

    return newDto;
  }
}
