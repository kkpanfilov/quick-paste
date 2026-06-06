import { IsString } from "class-validator";

export class CreateReplyDto {
  @IsString({ message: "Content must be a string" })
  content!: string;

  @IsString({ message: "Paste ID must be a string" })
  pasteId!: string;

  @IsString({ message: "Parent ID must be a string" })
  parentId!: string;
}
