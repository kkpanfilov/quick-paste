import { IsString } from "class-validator";

export class CreateCommentDto {
  @IsString({ message: "Content must be a string" })
  content!: string;
}
