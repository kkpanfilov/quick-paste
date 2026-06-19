import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from "class-validator";

import { PasteExposure } from "../../generated/prisma/enums.js";

export const LANGUAGE_VALUES = [
  "plain",
  "markdown",
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "markup",
  "css",
  "scss",
  "sass",
  "less",
  "json",
  "yaml",
  "toml",
  "ini",
  "bash",
  "shell-session",
  "powershell",
  "batch",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "kotlin",
  "swift",
  "dart",
  "sql",
  "graphql",
  "docker",
  "nginx",
  "git",
  "diff",
  "regex",
  "lua",
  "r",
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

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsNotEmpty({ message: "Description must not be empty" })
  @MaxLength(1000, {
    message: "Description must be at most 1000 characters long",
  })
  description?: string | null;

  @IsArray({ message: "Tags must be an array" })
  @IsString({ each: true })
  @Transform(({ value }): unknown => {
    const tags: unknown = value;

    if (!Array.isArray(tags)) {
      return tags;
    }

    return tags.map((tag: unknown) => {
      if (typeof tag === "string") {
        return tag.trim();
      } else {
        return tag;
      }
    });
  })
  @ArrayMaxSize(5, { message: "Tags must be at most 5 items long" })
  @ArrayUnique({ message: "Tags must be unique" })
  @Length(1, 30, {
    each: true,
    message: "Tags must be at least 1 character long and no more than 30",
  })
  tags!: string[];

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
  password!: string;
}
