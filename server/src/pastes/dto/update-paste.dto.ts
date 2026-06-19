import { PartialType, PickType } from "@nestjs/mapped-types";

import { CreatePasteDto } from "./create-paste.dto.js";

export class UpdatePasteDto extends PartialType(
  PickType(CreatePasteDto, [
    "title",
    "content",
    "description",
    "tags",
    "category",
    "language",
    "exposure",
    "password",
  ] as const),
) {}
