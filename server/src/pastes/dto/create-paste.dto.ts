import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreatePasteDto {
  @IsString({ message: "Title must be a string" })
  @MaxLength(50, { message: "Title must be at most 50 characters long" })
  title!: string;

  @IsString({ message: "Content must be a string" })
  @MaxLength(100000, {
    message: "Content must be at most 100000 characters long",
  })
  content!: string;

  @IsString({ message: "Language must be a string" })
  language!: string;

  @IsString({ message: "Expiration must be a string" })
  expiration!: string | null;

  @IsBoolean({ message: "IsBurn must be a boolean" })
  isBurn!: boolean;

  @IsString({ message: "Category must be a string" })
  category!: string;

  @IsString({ message: "Exposure must be a string" })
  @IsIn(["public", "unlisted", "private"])
  exposure!: string;

  @IsOptional()
  @IsString({ message: "Password must be a string" })
  @MaxLength(32, { message: "Password must be at most 32 characters long" })
  password?: string;
}
