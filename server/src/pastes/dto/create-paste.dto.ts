import { IsDate, IsString, MaxLength } from "class-validator";

export class CreatePasteDto {
  @IsString({ message: "Title must be a string" })
  @MaxLength(50, { message: "Title must be at most 50 characters long" })
  title!: string;

  @IsString({ message: "Content must be a string" })
  @MaxLength(10000, {
    message: "Content must be at most 10000 characters long",
  })
  content!: string;

  @IsString({ message: "Language must be a string" })
  language?: string;

  @IsDate({ message: "ExpiresAt must be a date" })
  expiresAt?: Date;
}
