import { PartialType, PickType } from "@nestjs/mapped-types";

import { CreatePasteDto } from "./create-paste.dto.js";

// TODO:
// refactor(fields & dto): eliminate frontend and backend validation mismatch + DTOs completely reworked
export class UpdatePasteDto extends PartialType(
  PickType(CreatePasteDto, [
    "title",
    "content",
    "category",
    "language",
    "exposure",
    "password",
  ] as const),
) {}
