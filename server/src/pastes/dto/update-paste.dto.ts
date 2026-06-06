import { PartialType, PickType } from "@nestjs/mapped-types";

import { IsOptional, IsString, MaxLength } from "class-validator";

import { CreatePasteDto } from "./create-paste.dto.js";

export class UpdatePasteDto extends PartialType(
  PickType(CreatePasteDto, [
    "title",
    "content",
    "category",
    "language",
    "exposure",
    "password",
  ] as const),
) {
  @IsOptional()
  @IsString({ message: "Title must be a string" })
  @MaxLength(50, { message: "Title must be at most 50 characters long" })
  title?: string;

  @IsOptional()
  @IsString({ message: "Content must be a string" })
  @MaxLength(100000, {
    message: "Content must be at most 100000 characters long",
  })
  content?: string;

  @IsOptional()
  @IsString({ message: "Language must be a string" })
  language?: string;

  @IsOptional()
  @IsString({ message: "Category must be a string" })
  category?: string;

  @IsOptional()
  @IsString({ message: "Password must be a string" })
  @MaxLength(32, { message: "Password must be at most 32 characters long" })
  password?: string;
}
