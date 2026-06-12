import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import { PasteExposure } from "../../generated/prisma/enums.js";

const LANGUAGE_VALUES = [
  "plain",
  "markdown",
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "c",
  "cpp",
  "csharp",
  "java",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "toml",
  "bash",
] as const;

const EXPIRATION_VALUES = [
  "never",
  "burn",
  "10m",
  "1h",
  "1d",
  "3d",
  "1w",
  "2w",
  "1m",
  "3m",
  "6m",
  "1y",
] as const;

const CATEGORY_VALUES = [
  "none",
  "programming",
  "gaming",
  "art",
  "music",
  "science",
  "math",
  "history",
] as const;

const EXPOSURE_VALUES = [
  "public",
  "unlisted",
  "private",
  "protected",
  "shared",
] as const;

export class CreatePasteDto {
  @IsString({ message: "Title must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsNotEmpty({ message: "Title is required" })
  @MaxLength(50, { message: "Title must be at most 50 characters long" })
  title!: string;

  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content is required" })
  @MaxLength(100000, {
    message: "Content must be at most 100000 characters long",
  })
  content!: string;

  @IsString({ message: "Language must be a string" })
  @IsIn(LANGUAGE_VALUES, {
    message: `Language must be one of [${LANGUAGE_VALUES.join(", ")}]`,
  })
  language!: string;

  @IsString({ message: "Expiration must be a string" })
  @IsIn(EXPIRATION_VALUES, {
    message: `Expiration must be one of [${EXPIRATION_VALUES.join(", ")}]`,
  })
  expiration!: string | null;

  @IsBoolean({ message: "IsBurn must be a boolean" })
  isBurn!: boolean;

  @IsString({ message: "Category must be a string" })
  @IsIn(CATEGORY_VALUES, {
    message: `Category must be one of [${CATEGORY_VALUES.join(", ")}]`,
  })
  category!: string;

  @IsString({ message: "Exposure must be a string" })
  @IsIn(EXPOSURE_VALUES, {
    message: `Exposure must be one of [${EXPOSURE_VALUES.join(", ")}]`,
  })
  exposure!: PasteExposure;

  @IsOptional()
  @IsString({ message: "Password must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @MaxLength(32, { message: "Password must be at most 32 characters long" })
  password?: string;
}
