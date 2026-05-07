import { PartialType } from "@nestjs/mapped-types";

import { CreatePasteDto } from "./create-paste.dto.js";

export class UpdatePasteDto extends PartialType(CreatePasteDto) {}
