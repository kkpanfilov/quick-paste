import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content is required" })
  @MaxLength(1000, { message: "Content must be at most 1000 characters long" })
  content!: string;
}
